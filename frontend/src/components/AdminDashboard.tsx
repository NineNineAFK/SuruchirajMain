import React, { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types/product';
import { getAllProducts, deleteProduct, getAllOrders, updateOrderStatus, deleteOrder as deleteOrderApi } from '../services/productService';
import AdminProductForm from './AdminProductForm';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const SIDEBAR_SECTIONS = [
  { key: 'products', label: 'Products' },
  { key: 'orders', label: 'Orders' },
  { key: 'users', label: 'Users' },
  { key: 'team', label: 'Team' },
];

// CSV export helper
function exportOrdersToCSV(orders: any[]) {
  if (!orders.length) return;
  const fields = [
    'Order ID', 'User ID', 'Total Amount', 'Status', 'Payment', 'Created At',
    'Items', 'Delivery Name', 'Delivery Phone', 'Delivery Address', 'Delivery City', 'Delivery State', 'Delivery Pincode'
  ];
  const csvRows = [fields.join(',')];
  for (const order of orders) {
    const items = (order.items || []).map((item: any) => `${item.productName} x${item.quantity} @₹${item.price}`).join('; ');
    const addr = order.deliveryAddress || {};
    csvRows.push([
      order._id,
      order.userId,
      order.totalAmount,
      order.orderStatus,
      order.paymentStatus,
      new Date(order.createdAt).toLocaleString(),
      '"' + items.replace(/"/g, '""') + '"',
      addr.name,
      addr.phone,
      (addr.addressLine1 || '') + ' ' + (addr.addressLine2 || ''),
      addr.city,
      addr.state,
      addr.pincode
    ].map(v => v === undefined ? '' : v).join(','));
  }
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const ImageUpload: React.FC<{ onUpload?: () => void }> = ({ onUpload }) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const formData = new FormData();
    acceptedFiles.forEach(file => formData.append('images', file));
    try {
      const res = await axios.post('/api/admin/upload-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Upload successful: ' + res.data.files.join(', '));
      if (onUpload) onUpload();
    } catch (err) {
      toast.error('Upload failed');
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  return (
    <div {...getRootProps()} style={{
      border: '2px dashed #ccc', padding: 20, textAlign: 'center', marginBottom: 20, background: isDragActive ? '#f0f0f0' : '#fff', cursor: 'pointer'
    }}>
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the images here ...</p> : <p>Drag & drop images here, or click to select files</p>}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const location = useLocation();
  const navigate = useNavigate();
  // Parse section from query param
  const params = new URLSearchParams(location.search);
  const initialSection = params.get('section') || 'products';
  const [selectedSection, setSelectedSection] = useState(initialSection);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
  const [statusUpdateValue, setStatusUpdateValue] = useState<{ [orderId: string]: string }>({});
  const [orderDeleteLoading, setOrderDeleteLoading] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState({
    status: '',
    orderId: '',
    userId: '',
    from: '',
    to: ''
  });
  const [ordersPage, setOrdersPage] = useState(1);
  const ORDERS_PER_PAGE = 10;

  const filteredOrders = orders.filter(order => {
    if (orderFilter.status && order.orderStatus !== orderFilter.status) return false;
    if (orderFilter.orderId && !order._id.includes(orderFilter.orderId)) return false;
    if (orderFilter.userId && (!order.userId || !order.userId.toString().includes(orderFilter.userId))) return false;
    if (orderFilter.from && new Date(order.createdAt) < new Date(orderFilter.from)) return false;
    if (orderFilter.to && new Date(order.createdAt) > new Date(orderFilter.to)) return false;
    return true;
  });

  useEffect(() => { setOrdersPage(1); }, [orderFilter, orders]);

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE) || 1;
  const paginatedOrders = filteredOrders.slice((ordersPage - 1) * ORDERS_PER_PAGE, ordersPage * ORDERS_PER_PAGE);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSection === 'products') {
      fetchProducts();
    } else if (selectedSection === 'orders') {
      setOrdersLoading(true);
      setOrdersError(null);
      getAllOrders()
        .then(setOrders)
        .catch((err) => setOrdersError(err.message || 'Failed to fetch orders'))
        .finally(() => setOrdersLoading(false));
    }
  }, [selectedSection]);

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(undefined);
    fetchProducts();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  // Sidebar layout
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="h-20 flex items-center justify-center border-b">
          <span className="text-2xl font-bold text-blue-700">Admin</span>
        </div>
        <nav className="flex-1 py-4">
          {SIDEBAR_SECTIONS.map((section) => (
            <button
              key={section.key}
              onClick={() => {
                setSelectedSection(section.key);
                setShowForm(false);
                setEditingProduct(undefined);
              }}
              className={`w-full text-left px-6 py-3 text-lg font-medium hover:bg-blue-50 transition-colors ${selectedSection === section.key ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {selectedSection === 'products' && (
          showForm ? (
            <div className="min-h-screen bg-gray-100 py-8">
              <AdminProductForm
                product={editingProduct}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Bulk Image Upload */}
              <ImageUpload onUpload={fetchProducts} />
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <button
                  onClick={handleAddProduct}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Add New Product
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No products found. Add your first product!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{product.product_name}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {product.category && product.category.length > 0 ? product.category[0] : 'N/A'}
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-gray-600">
                            <span className="font-medium">Price:</span> ₹{product.mrp && product.mrp.length > 0 ? product.mrp[0] : 'N/A'}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Weight:</span> {product.net_wt && product.net_wt.length > 0 ? `${product.net_wt[0].value}${product.net_wt[0].unit}` : 'N/A'}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Ingredients:</span> {product.ingredients ? product.ingredients.length : 0} items
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          {/* Visibility Toggle */}
                          <label className="flex items-center cursor-pointer select-none mr-2">
                            <span className="mr-1 text-xs text-gray-600">Visible</span>
                            <input
                              type="checkbox"
                              checked={product.isVisible}
                              onChange={async () => {
                                try {
                                  await import('../services/productService').then(mod => mod.toggleProductVisibility(product._id));
                                  toast.success(`Product is now ${!product.isVisible ? 'visible' : 'hidden'}!`);
                                  fetchProducts();
                                } catch (err) {
                                  toast.error('Failed to toggle visibility');
                                }
                              }}
                              className="form-checkbox h-5 w-5 text-blue-600 transition duration-150"
                            />
                          </label>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
        {selectedSection === 'orders' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Orders</h1>
            <div className="flex justify-end mb-2">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                onClick={() => exportOrdersToCSV(filteredOrders)}
                disabled={filteredOrders.length === 0}
              >
                Export CSV
              </button>
            </div>
            <div className="mb-6 flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Status</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={orderFilter.status}
                  onChange={e => setOrderFilter(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="">All</option>
                  {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Order ID</label>
                <input
                  type="text"
                  className="border rounded px-2 py-1 text-sm"
                  value={orderFilter.orderId}
                  onChange={e => setOrderFilter(f => ({ ...f, orderId: e.target.value }))}
                  placeholder="Order ID"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">User ID</label>
                <input
                  type="text"
                  className="border rounded px-2 py-1 text-sm"
                  value={orderFilter.userId}
                  onChange={e => setOrderFilter(f => ({ ...f, userId: e.target.value }))}
                  placeholder="User ID"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">From</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-sm"
                  value={orderFilter.from}
                  onChange={e => setOrderFilter(f => ({ ...f, from: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">To</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-sm"
                  value={orderFilter.to}
                  onChange={e => setOrderFilter(f => ({ ...f, to: e.target.value }))}
                />
              </div>
              <button
                className="ml-2 px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300"
                onClick={() => setOrderFilter({ status: '', orderId: '', userId: '', from: '', to: '' })}
              >
                Reset
              </button>
            </div>
            {ordersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading orders...</p>
              </div>
            ) : ordersError ? (
              <div className="text-center py-8 text-red-600">{ordersError}</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No orders found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">User ID</th>
                      <th className="px-4 py-2 text-left">Total Amount</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Payment</th>
                      <th className="px-4 py-2 text-left">Created At</th>
                      <th className="px-4 py-2 text-left">Details</th>
                      <th className="px-4 py-2 text-left">Update Status</th>
                      <th className="px-4 py-2 text-left">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <React.Fragment key={order._id}>
                        <tr className="border-t">
                          <td className="px-4 py-2 font-mono text-xs">{order._id}</td>
                          <td className="px-4 py-2">{order.userId}</td>
                          <td className="px-4 py-2">₹{order.totalAmount}</td>
                          <td className="px-4 py-2 capitalize">{order.orderStatus}</td>
                          <td className="px-4 py-2 capitalize">{order.paymentStatus}</td>
                          <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                          <td className="px-4 py-2">
                            <button
                              className="text-blue-600 underline text-sm"
                              onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                            >
                              {expandedOrder === order._id ? 'Hide' : 'Show'}
                            </button>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <select
                                className="border rounded px-2 py-1 text-sm"
                                value={statusUpdateValue[order._id] ?? order.orderStatus}
                                onChange={e => setStatusUpdateValue(v => ({ ...v, [order._id]: e.target.value }))}
                                disabled={statusUpdateLoading === order._id}
                              >
                                {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                ))}
                              </select>
                              <button
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs disabled:opacity-50"
                                disabled={statusUpdateLoading === order._id || (statusUpdateValue[order._id] ?? order.orderStatus) === order.orderStatus}
                                onClick={async () => {
                                  setStatusUpdateLoading(order._id);
                                  try {
                                    const newStatus = statusUpdateValue[order._id] ?? order.orderStatus;
                                    await updateOrderStatus(order._id, newStatus);
                                    setOrders(orders => orders.map(o => o._id === order._id ? { ...o, orderStatus: newStatus } : o));
                                    toast.success('Order status updated!');
                                  } catch (err: any) {
                                    toast.error(err.message || 'Failed to update status');
                                  } finally {
                                    setStatusUpdateLoading(null);
                                  }
                                }}
                              >
                                {statusUpdateLoading === order._id ? 'Updating...' : 'Update'}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <button
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs disabled:opacity-50"
                              disabled={orderDeleteLoading === order._id}
                              onClick={async () => {
                                if (!window.confirm('Are you sure you want to delete this order?')) return;
                                setOrderDeleteLoading(order._id);
                                try {
                                  await deleteOrderApi(order._id);
                                  setOrders(orders => orders.filter(o => o._id !== order._id));
                                  toast.success('Order deleted!');
                                } catch (err: any) {
                                  toast.error(err.message || 'Failed to delete order');
                                } finally {
                                  setOrderDeleteLoading(null);
                                }
                              }}
                            >
                              {orderDeleteLoading === order._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                        {expandedOrder === order._id && (
                          <tr>
                            <td colSpan={7} className="bg-blue-50 px-4 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h3 className="font-semibold mb-2">Order Items</h3>
                                  <ul className="list-disc pl-6 text-sm">
                                    {order.items && order.items.length > 0 ? order.items.map((item: any, idx: number) => (
                                      <li key={idx}>
                                        {item.productName} &times; {item.quantity} @ ₹{item.price} each
                                      </li>
                                    )) : <li>No items</li>}
                                  </ul>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                                  {order.deliveryAddress ? (
                                    <div className="text-sm">
                                      <div><span className="font-medium">Name:</span> {order.deliveryAddress.name}</div>
                                      <div><span className="font-medium">Phone:</span> {order.deliveryAddress.phone}</div>
                                      <div><span className="font-medium">Address:</span> {order.deliveryAddress.addressLine1}, {order.deliveryAddress.addressLine2}</div>
                                      <div><span className="font-medium">City:</span> {order.deliveryAddress.city}</div>
                                      <div><span className="font-medium">State:</span> {order.deliveryAddress.state}</div>
                                      <div><span className="font-medium">Pincode:</span> {order.deliveryAddress.pincode}</div>
                                    </div>
                                  ) : <div className="text-sm">No address info</div>}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Page {ordersPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                      disabled={ordersPage === 1}
                      onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                      disabled={ordersPage === totalPages}
                      onClick={() => setOrdersPage(p => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {selectedSection === 'users' && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Users</h1>
            <div className="bg-white rounded-lg shadow-md p-8 text-gray-600 text-center">
              <p>User management coming soon...</p>
            </div>
          </div>
        )}
        {selectedSection === 'team' && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Team</h1>
            <div className="bg-white rounded-lg shadow-md p-8 text-gray-600 text-center">
              <p>Team management coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard; 