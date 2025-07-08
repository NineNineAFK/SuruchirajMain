import React, { useState, useEffect } from 'react';
import type { Product, ProductFormData } from '../types/product';
import { addProduct, updateProduct } from '../services/productService';
import toast from 'react-hot-toast';

interface AdminProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyForm: ProductFormData = {
  product_name: '',
  ingredients: [''],
  preservatives: '',
  nutrition_facts_per_100gm_approx: {
    Energy: '',
    Fat: '',
    Protein: '',
    Carbohydrate: '',
    Sugar: '',
  },
  fssai_reg_no: '',
  recipe: [''],
  manufactured_marketed_by: '',
  address: '',
  email: '',
  customer_care_no: '',
  mrp: [0],
  net_wt: [{ value: 0, unit: '' }],
  best_before: '',
  category: [''],
  why_you_will_love_it: [''],
  images: [],
};

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name || '',
        ingredients: product.ingredients || [''],
        preservatives: product.preservatives || '',
        nutrition_facts_per_100gm_approx: product.nutrition_facts_per_100gm_approx || {
          Energy: '', Fat: '', Protein: '', Carbohydrate: '', Sugar: ''
        },
        fssai_reg_no: product.fssai_reg_no || '',
        recipe: product.recipe || [''],
        manufactured_marketed_by: product.manufactured_marketed_by || '',
        address: product.address || '',
        email: product.email || '',
        customer_care_no: product.customer_care_no || '',
        mrp: product.mrp || [0],
        net_wt: product.net_wt || [{ value: 0, unit: '' }],
        best_before: product.best_before || '',
        category: product.category || [''],
        why_you_will_love_it: product.why_you_will_love_it || [''],
        images: product.images || [],
      });
    } else {
      setFormData(emptyForm);
    }
  }, [product]);

  // Generic input handler for simple fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Array field handlers
  const handleArrayChange = (field: keyof ProductFormData, index: number, value: string | number) => {
    setFormData(prev => {
      const arr = Array.isArray(prev[field]) ? [...(prev[field] as any[])] : [];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };
  const addArrayItem = (field: keyof ProductFormData, defaultValue: any) => {
    setFormData(prev => {
      const arr = Array.isArray(prev[field]) ? [...(prev[field] as any[])] : [];
      arr.push(defaultValue);
      return { ...prev, [field]: arr };
    });
  };
  const removeArrayItem = (field: keyof ProductFormData, index: number) => {
    setFormData(prev => {
      const arr = Array.isArray(prev[field]) ? [...(prev[field] as any[])] : [];
      if (arr.length > 1) arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  // Nutrition facts handler
  const handleNutritionChange = (field: keyof ProductFormData['nutrition_facts_per_100gm_approx'], value: string) => {
    setFormData(prev => ({
      ...prev,
      nutrition_facts_per_100gm_approx: {
        ...prev.nutrition_facts_per_100gm_approx,
        [field]: value,
      },
    }));
  };

  // Net weight handler
  const handleNetWtChange = (index: number, key: 'value' | 'unit', value: string | number) => {
    setFormData(prev => {
      const arr = prev.net_wt ? [...prev.net_wt] : [];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, net_wt: arr };
    });
  };

  // Image handler (simple string URL for now)
  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), imageInput.trim()] }));
      setImageInput('');
    }
  };
  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const arr = prev.images ? [...prev.images] : [];
      arr.splice(index, 1);
      return { ...prev, images: arr };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        await updateProduct(product._id, formData);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(formData);
        toast.success('Product added successfully!');
      }
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Category (array) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          {formData.category && formData.category.map((cat, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={cat}
                onChange={e => handleArrayChange('category', idx, e.target.value)}
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.category && formData.category.length > 1 && (
                <button type="button" onClick={() => removeArrayItem('category', idx)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('category', '')} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Category</button>
        </div>
        {/* MRP (array) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹) *</label>
          {formData.mrp && formData.mrp.map((mrp, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="number"
                value={mrp}
                onChange={e => handleArrayChange('mrp', idx, Number(e.target.value))}
                required
                min="0"
                step="0.01"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.mrp && formData.mrp.length > 1 && (
                <button type="button" onClick={() => removeArrayItem('mrp', idx)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('mrp', 0)} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add MRP</button>
        </div>
        {/* Net Weight (array) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Net Weight *</label>
          {formData.net_wt && formData.net_wt.map((nw, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="number"
                value={nw.value}
                onChange={e => handleNetWtChange(idx, 'value', Number(e.target.value))}
                required
                min="0"
                step="0.01"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Value"
              />
              <input
                type="text"
                value={nw.unit}
                onChange={e => handleNetWtChange(idx, 'unit', e.target.value)}
                required
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Unit (e.g., g, kg)"
              />
              {formData.net_wt && formData.net_wt.length > 1 && (
                <button type="button" onClick={() => removeArrayItem('net_wt', idx)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('net_wt', { value: 0, unit: '' })} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Net Weight</button>
        </div>
        {/* Ingredients (array) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients *</label>
          {formData.ingredients.map((ingredient, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={ingredient}
                onChange={e => handleArrayChange('ingredients', idx, e.target.value)}
                required
                placeholder="Enter ingredient"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.ingredients.length > 1 && (
                <button type="button" onClick={() => removeArrayItem('ingredients', idx)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('ingredients', '')} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Ingredient</button>
        </div>
        {/* Preservatives */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preservatives</label>
          <input
            type="text"
            name="preservatives"
            value={formData.preservatives}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Nutrition Facts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Nutrition Facts (per 100g)</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(['Energy', 'Fat', 'Protein', 'Carbohydrate', 'Sugar'] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs text-gray-600 mb-1">{field}</label>
                <input
                  type="text"
                  value={formData.nutrition_facts_per_100gm_approx[field]}
                  onChange={e => handleNutritionChange(field, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
        {/* FSSAI Reg No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">FSSAI Registration No.</label>
          <input
            type="text"
            name="fssai_reg_no"
            value={formData.fssai_reg_no}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Recipe (array) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipe</label>
          {formData.recipe && formData.recipe.map((step, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={step}
                onChange={e => handleArrayChange('recipe', idx, e.target.value)}
                placeholder="Enter recipe step"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.recipe && formData.recipe.length > 1 && (
                <button type="button" onClick={() => removeArrayItem('recipe', idx)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('recipe', '')} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Recipe Step</button>
        </div>
        {/* Manufactured/Marketed By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Manufactured/Marketed By</label>
          <input
            type="text"
            name="manufactured_marketed_by"
            value={formData.manufactured_marketed_by}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Customer Care No. */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Care No.</label>
          <input
            type="text"
            name="customer_care_no"
            value={formData.customer_care_no}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Best Before */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Best Before</label>
          <input
            type="text"
            name="best_before"
            value={formData.best_before}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Why You Will Love It (array) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Why You Will Love It</label>
          {formData.why_you_will_love_it && formData.why_you_will_love_it.map((reason, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={reason}
                onChange={e => handleArrayChange('why_you_will_love_it', idx, e.target.value)}
                placeholder="Enter reason"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.why_you_will_love_it && formData.why_you_will_love_it.length > 1 && (
                <button type="button" onClick={() => removeArrayItem('why_you_will_love_it', idx)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('why_you_will_love_it', '')} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Reason</button>
        </div>
        {/* Images (array of URLs for now) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images (URLs)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={imageInput}
              onChange={e => setImageInput(e.target.value)}
              placeholder="Paste image URL and click Add"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={handleAddImage} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add</button>
          </div>
          {formData.images && formData.images.length > 0 && (
            <ul className="list-disc pl-6">
              {formData.images.map((img, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="truncate max-w-xs">{img}</span>
                  <button type="button" onClick={() => handleRemoveImage(idx)} className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Form Actions */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm; 