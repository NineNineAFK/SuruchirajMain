import React, { useState, useEffect } from 'react';
import type { Product, ProductFormData, NutritionValue } from '../types/product';
import { addProduct, updateProduct } from '../services/productService';
import toast from 'react-hot-toast';

interface AdminProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: 0,
    weight: '',
    ingredients: [''],
    recipe: '',
    nutritionValue: {
      energy: 0,
      fat: 0,
      protein: 0,
      carbohydrates: 0,
      sugar: 0
    }
  });

  const [loading, setLoading] = useState(false);

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        weight: product.weight,
        ingredients: product.ingredients,
        recipe: product.recipe,
        nutritionValue: product.nutritionValue
      });
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNutritionChange = (field: keyof NutritionValue, value: string) => {
    setFormData(prev => ({
      ...prev,
      nutritionValue: {
        ...prev.nutritionValue,
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
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
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Spices">Spices</option>
              <option value="Masalas">Masalas</option>
              <option value="Herbs">Herbs</option>
              <option value="Seasonings">Seasonings</option>
              <option value="Blends">Blends</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight *
            </label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              required
              placeholder="e.g., 100g, 250g, 1kg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients *
          </label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                required
                placeholder="Enter ingredient"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Ingredient
          </button>
        </div>

        {/* Recipe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipe *
          </label>
          <textarea
            name="recipe"
            value={formData.recipe}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Enter recipe instructions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Nutrition Values */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Nutrition Values (per 100g) *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Energy (kcal)</label>
              <input
                type="number"
                value={formData.nutritionValue.energy}
                onChange={(e) => handleNutritionChange('energy', e.target.value)}
                required
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fat (g)</label>
              <input
                type="number"
                value={formData.nutritionValue.fat}
                onChange={(e) => handleNutritionChange('fat', e.target.value)}
                required
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Protein (g)</label>
              <input
                type="number"
                value={formData.nutritionValue.protein}
                onChange={(e) => handleNutritionChange('protein', e.target.value)}
                required
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Carbohydrates (g)</label>
              <input
                type="number"
                value={formData.nutritionValue.carbohydrates}
                onChange={(e) => handleNutritionChange('carbohydrates', e.target.value)}
                required
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Sugar (g)</label>
              <input
                type="number"
                value={formData.nutritionValue.sugar}
                onChange={(e) => handleNutritionChange('sugar', e.target.value)}
                required
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
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