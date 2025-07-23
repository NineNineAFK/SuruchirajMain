// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
  type AddressFormData
} from '../services/addressService';
import { createOrderAndInitiatePayment } from '../services/paymentService';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const CheckoutPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [form, setForm] = useState<AddressFormData>({
    addressName: '',
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const fetchedAddresses = await getAddresses();
      setAddresses(fetchedAddresses);
      const defaultAddress = fetchedAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      } else if (fetchedAddresses.length > 0) {
        setSelectedAddress(fetchedAddresses[0]._id);
      }
    } catch {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setForm({
      addressName: '',
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      if (editingAddress) {
        await updateAddress(editingAddress._id, form);
        toast.success('Address updated successfully');
      } else {
        await addAddress(form);
        toast.success('Address added successfully');
      }
      resetForm();
      fetchAddresses();
    } catch {
      toast.error(editingAddress ? 'Failed to update address' : 'Failed to add address');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setForm({ ...address, addressLine2: address.addressLine2 || '' });
    setShowAddForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
        toast.success('Address deleted successfully');
        fetchAddresses();
      } catch {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
      toast.success('Default address updated');
      fetchAddresses();
    } catch {
      toast.error('Failed to set default address');
    }
  };

  const handleContinueToPayment = async () => {
    if (!selectedAddress) return toast.error('Please select a delivery address');

    try {
      setPaymentLoading(true);
      toast.loading('Creating order and initiating payment...');
      const paymentResponse = await createOrderAndInitiatePayment(selectedAddress);
      toast.dismiss();
      toast.success('Redirecting to PhonePe payment...');
      window.location.href = paymentResponse.redirectUrl;
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to initiate payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2 dark:border-yellow-500 border-[#4D6A3F] mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-[#4D6A3F] dark:text-yellow-400 font-heading mb-6">Delivery <span className='text-black dark:text-white'>Address</span></h2>

        {/* Saved Addresses */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold font-body text-gray-700 dark:text-gray-300">Saved Addresses</h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 font-button dark:bg-yellow-400 bg-[#4D6A3F] dark:text-black text-white px-4 py-2 rounded dark:hover:bg-yellow-300 hover:bg-[#4D6A3F]/80 transition"
            >
              <FiPlus />
              Add New Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-center py-8 font-body text-gray-500 dark:text-gray-400">No addresses saved yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`rounded-lg p-4 cursor-pointer transition border-2 ${
                    selectedAddress === address._id
                      ? 'dark:border-yellow-400 border-[#4D6A3F]  bg-gray-100 dark:bg-[#1a1a1a]'
                      : 'border-gray-300 dark:border-gray-700 dark:hover:border-yellow-300 hover:border-[#4D6A3F]/80'
                  }`}
                  onClick={() => setSelectedAddress(address._id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg text-[#4D6A3F] dark:text-yellow-400">{address.addressName}</span>
                      {address.isDefault && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 font-body rounded">Default</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(address);
                        }}
                        className="text-black dark:text-white hover:text-[#4D6A3F] dark:hover:text-yellow-400"
                        title="Edit address"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(address._id);
                        }}
                        className="text-red-500 hover:text-red-600"
                        title="Delete address"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm space-y-1 text-black dark:text-gray-100">
                    <p><strong>{address.name}</strong></p>
                    <p>{address.phone}</p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                  </div>

                  {!address.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(address._id);
                      }}
                      className="mt-2 text-sm text-[#4D6A3F] dark:text-yellow-400 font-body hover:underline"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={showAddForm}
          onClose={resetForm}
          title={editingAddress ? 'Edit Address' : 'Add New Address'}
        >
          <div className="bg-white dark:bg-black p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4 text-black dark:text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="addressName"
                  placeholder="Address Name"
                  value={form.addressName}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 text-black dark:text-white p-3 rounded placeholder-gray-400 focus:outline-none dark:focus:border-yellow-400 focus:border-[#4D6A3F]"
                />
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 text-black dark:text-white p-3 rounded placeholder-gray-400 focus:outline-none dark:focus:border-yellow-400 focus:border-[#4D6A3F]"
                />
              </div>

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 text-black dark:text-white p-3 rounded placeholder-gray-400 focus:outline-none dark:focus:border-yellow-400 focus:border-[#4D6A3F]"
              />

              <input
                name="addressLine1"
                placeholder="Address Line 1"
                value={form.addressLine1}
                onChange={handleChange}
                required
                className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 text-black dark:text-white p-3 rounded placeholder-gray-400 focus:outline-none dark:focus:border-yellow-400 focus:border-[#4D6A3F]"
              />

              <input
                name="addressLine2"
                placeholder="Address Line 2 (Optional)"
                value={form.addressLine2}
                onChange={handleChange}
                className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 text-black dark:text-white p-3 rounded placeholder-gray-400 focus:outline-none dark:focus:border-yellow-400 focus:border-[#4D6A3F]"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 text-black dark:text-white p-3 rounded placeholder-gray-400 focus:outline-none dark:focus:border-yellow-400 focus:border-[#4D6A3F]"
                />
                <input
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 text-black dark:text-white p-3 rounded placeholder-gray-400 focus:outline-none dark:focus:border-yellow-400 focus:border-[#4D6A3F]"
                />
              </div>

              <input
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                required
                className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 text-black dark:text-white p-3 rounded placeholder-gray-400 focus:outline-none dark:focus:border-yellow-400 focus:border-[#4D6A3F]"
              />

              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label htmlFor="isDefault" className="text-sm">Set as default address</label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 dark:bg-yellow-400 bg-[#4D6A3F] dark:text-black text-white py-3 rounded dark:hover:bg-yellow-300 hover:bg-[#4D6A3F]/80 font-semibold"
                >
                  {formLoading ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-400 dark:border-gray-600 text-[#4D6A3F]dark:text-yellow-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>


        {/* Continue to Payment Button */}
        {addresses.length > 0 && selectedAddress && (
          <div className="border-t border-gray-400 dark:border-gray-700 pt-6 mt-6">
            <button
              onClick={handleContinueToPayment}
              disabled={paymentLoading}
              className={`w-full py-3 rounded-lg text-xl font-bold font-body transition ${
                paymentLoading
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-[#4D6A3F] dark:bg-yellow-400 dark:text-black text-white dark:hover:bg-yellow-300 hover:bg-[#4D6A3F]/80'
              }`}
            >
              {paymentLoading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
