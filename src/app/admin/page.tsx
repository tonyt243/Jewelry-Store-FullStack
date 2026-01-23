'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Package, MessageSquare, Users, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  created_at: string;
};

type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'inquiries'>('overview');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
      return;
    }

    if (user && isAdmin) {
      fetchDashboardData();
    }
  }, [user, isAdmin, authLoading, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch inquiries
      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (inquiriesError) throw inquiriesError;
      setInquiries(inquiriesData || []);

      // Fetch user count 
      setUserCount(inquiriesData?.length || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const updateInquiryStatus = async (id: string, newStatus: string) => {
  try {
    const { error } = await supabase
      .from('inquiries')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) throw error;

    // Update local state
    setInquiries(inquiries.map(inq => 
      inq.id === id ? { ...inq, status: newStatus } : inq
    ));
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    alert('Failed to update status');
  }
};

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif text-amber-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-700">
            Manage your jewelry store
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4">
              <Package className="w-12 h-12 text-amber-900" />
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-amber-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4">
              <MessageSquare className="w-12 h-12 text-amber-900" />
              <div>
                <p className="text-gray-600 text-sm">Total Inquiries</p>
                <p className="text-3xl font-bold text-amber-900">{inquiries.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4">
              <Users className="w-12 h-12 text-amber-900" />
              <div>
                <p className="text-gray-600 text-sm">Recent Contacts</p>
                <p className="text-3xl font-bold text-amber-900">{userCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'overview'
                ? 'border-b-4 border-amber-900 text-amber-900'
                : 'text-gray-600 hover:text-amber-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'products'
                ? 'border-b-4 border-amber-900 text-amber-900'
                : 'text-gray-600 hover:text-amber-900'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'inquiries'
                ? 'border-b-4 border-amber-900 text-amber-900'
                : 'text-gray-600 hover:text-amber-900'
            }`}
          >
            Inquiries ({inquiries.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-serif text-amber-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/admin/products/new"
                  className="flex items-center gap-3 p-4 border-2 border-amber-900 rounded-lg hover:bg-amber-50 transition"
                >
                  <Plus className="w-6 h-6 text-amber-900" />
                  <span className="font-semibold text-amber-900">Add New Product</span>
                </Link>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="flex items-center gap-3 p-4 border-2 border-amber-900 rounded-lg hover:bg-amber-50 transition"
                >
                  <MessageSquare className="w-6 h-6 text-amber-900" />
                  <span className="font-semibold text-amber-900">View All Inquiries</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-serif text-amber-900 mb-4">
                Recent Activity
              </h2>
              <p className="text-gray-600">
                Last 5 inquiries and recently added products will appear here.
              </p>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-amber-900">
                Manage Products
              </h2>
              <Link
                href="/admin/products/new"
                className="flex items-center gap-2 bg-amber-900 text-white px-6 py-3 rounded-md hover:bg-amber-800 transition"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-amber-900">Image</th>
                    <th className="px-4 py-3 text-left text-amber-900">Name</th>
                    <th className="px-4 py-3 text-left text-amber-900">Category</th>
                    <th className="px-4 py-3 text-left text-amber-900">Price</th>
                    <th className="px-4 py-3 text-left text-amber-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 capitalize text-gray-900">{product.category}</td>
                      <td className="px-4 py-3 text-gray-900">${product.price.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
{activeTab === 'inquiries' && (
  <div className="bg-white rounded-lg shadow-lg p-8">
    <h2 className="text-2xl font-serif text-amber-900 mb-6">
      Customer Inquiries
    </h2>

    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <div key={inquiry.id} className="border rounded-lg p-6 hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg text-amber-900">{inquiry.name}</h3>
              <p className="text-gray-600 text-sm">{inquiry.email}</p>
            </div>
            
            {/* Status Dropdown */}
            <select
              value={inquiry.status}
              onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium border-2 cursor-pointer transition ${
                inquiry.status === 'new' 
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : inquiry.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <p className="text-gray-700 mb-2">{inquiry.message}</p>
          <p className="text-gray-500 text-sm">
            {new Date(inquiry.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
      </div>
    </div>
  );
}