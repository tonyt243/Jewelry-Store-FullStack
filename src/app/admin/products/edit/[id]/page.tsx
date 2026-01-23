'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
};

export default function EditProductPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'rings',
    image_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
      return;
    }

    if (user && isAdmin) {
      fetchProduct();
    }
  }, [user, isAdmin, authLoading, router, productId]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      setProduct(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        price: data.price.toString(),
        category: data.category,
        image_url: data.image_url,
      });
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image_url: formData.image_url,
        })
        .eq('id', productId);

      if (error) throw error;

      alert('Product updated successfully!');
      router.push('/admin');
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-amber-900 hover:text-amber-800 font-medium mb-4 inline-block"
          >
            ← Back to Admin Dashboard
          </Link>
          <h1 className="text-5xl font-serif text-amber-900 mb-4">
            Edit Product
          </h1>
          <p className="text-xl text-gray-700">
            Update product information
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 text-gray-900"
                placeholder="e.g., Gold Diamond Ring"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 text-gray-900 resize-none"
                placeholder="Product description..."
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 text-gray-900"
                placeholder="0.00"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 text-gray-900"
              >
                <option value="rings">Rings</option>
                <option value="necklaces">Necklaces</option>
                <option value="bracelets">Bracelets</option>
                <option value="earrings">Earrings</option>
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="text"
                id="image_url"
                name="image_url"
                required
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 text-gray-900"
                placeholder="/images/product.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the path to your image (e.g., /images/rings.webp)
              </p>
            </div>

            {/* Image Preview */}
            {formData.image_url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </label>
                <div className="w-48 h-48 border rounded-lg overflow-hidden">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-amber-900 text-white py-3 px-6 rounded-lg hover:bg-amber-800 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
              >
                {submitting ? 'Updating...' : 'Update Product'}
              </button>
              <Link
                href="/admin"
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition font-medium text-lg text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}