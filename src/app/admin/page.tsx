'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Package, MessageSquare, Users, Plus, Edit, Trash2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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

type UserProfile = {
  email: string;
  name: string;
  inquiry_count: number;
};

type Tab = 'overview' | 'products' | 'inquiries' | 'users';

function SkeletonRow() {
  return (
    <tr className="border-b border-amber-50">
      <td className="px-4 py-3"><div className="w-14 h-14 bg-amber-100/60 rounded-lg animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-amber-100/60 rounded w-32 animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-amber-100/40 rounded w-20 animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-amber-100/60 rounded w-16 animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-8 bg-amber-100/40 rounded w-16 animate-pulse" /></td>
    </tr>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingInquiryId, setDeletingInquiryId] = useState<string | null>(null);
  const [clearingResolved, setClearingResolved] = useState(false);

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
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (productsError) throw productsError;
      setProducts(productsData || []);

      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (inquiriesError) throw inquiriesError;
      setInquiries(inquiriesData || []);

      const uniqueUsers = new Map<string, UserProfile>();
      inquiriesData?.forEach((inquiry) => {
        if (inquiry.email) {
          if (uniqueUsers.has(inquiry.email)) {
            const u = uniqueUsers.get(inquiry.email)!;
            u.inquiry_count += 1;
          } else {
            uniqueUsers.set(inquiry.email, {
              email: inquiry.email,
              name: inquiry.name,
              inquiry_count: 1,
            });
          }
        }
      });

      setUsers(Array.from(uniqueUsers.values()));
      setUserCount(uniqueUsers.size);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const updateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      alert('Failed to update status');
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry? This cannot be undone.')) return;
    setDeletingInquiryId(id);
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) throw error;
      setInquiries(prev => prev.filter(inq => inq.id !== id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry');
    } finally {
      setDeletingInquiryId(null);
    }
  };

  const clearResolvedInquiries = async () => {
    const resolvedCount = inquiries.filter(inq => inq.status === 'resolved').length;
    if (resolvedCount === 0) return;
    if (!confirm(`Delete all ${resolvedCount} resolved inquiries? This cannot be undone.`)) return;

    setClearingResolved(true);
    try {
      const { error } = await supabase.from('inquiries').delete().eq('status', 'resolved');
      if (error) throw error;
      setInquiries(prev => prev.filter(inq => inq.status !== 'resolved'));
    } catch (error) {
      console.error('Error clearing resolved inquiries:', error);
      alert('Failed to clear resolved inquiries');
    } finally {
      setClearingResolved(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <motion.div
          className="w-10 h-10 border-3 border-amber-200 border-t-amber-900 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'products', label: 'Products', count: products.length },
    { key: 'inquiries', label: 'Inquiries', count: inquiries.length },
    { key: 'users', label: 'Users', count: users.length },
  ];

  const statCards = [
    { icon: Package, label: 'Total Products', value: products.length },
    { icon: MessageSquare, label: 'Total Inquiries', value: inquiries.length },
    { icon: Users, label: 'Total Contacts', value: userCount },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-serif text-amber-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Manage products, inquiries, and customer contacts</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(180,120,30,0.1)' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <stat.icon className="w-6 h-6 text-amber-900" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-0.5">{stat.label}</p>
                  {loading ? (
                    <div className="h-8 bg-amber-100/60 rounded w-16 animate-pulse" />
                  ) : (
                    <p className="text-3xl font-serif font-bold text-amber-900">{stat.value}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-amber-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-5 py-3 font-medium whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab.key ? 'text-amber-900' : 'text-gray-400 hover:text-amber-700'
              }`}
            >
              {tab.label}{tab.count !== undefined && ` (${tab.count})`}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="adminTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-900 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">
                  <h2 className="text-2xl font-serif text-amber-900 mb-5">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/admin/products/new">
                      <motion.div
                        className="flex items-center gap-3 p-4 border-2 border-amber-900 rounded-xl hover:bg-amber-50 transition-colors"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <Plus className="w-5 h-5 text-amber-900" />
                        </div>
                        <span className="font-semibold text-amber-900">Add New Product</span>
                      </motion.div>
                    </Link>
                    <motion.button
                      onClick={() => setActiveTab('inquiries')}
                      className="flex items-center gap-3 p-4 border-2 border-amber-900 rounded-xl hover:bg-amber-50 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-amber-900" />
                      </div>
                      <span className="font-semibold text-amber-900">View All Inquiries</span>
                    </motion.button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">
                  <h2 className="text-2xl font-serif text-amber-900 mb-4">Recent Inquiries</h2>
                  {inquiries.length === 0 ? (
                    <p className="text-gray-400 text-sm">No inquiries yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.slice(0, 5).map((inq, i) => (
                        <motion.div
                          key={inq.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-amber-50 transition-colors"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{inq.name}</p>
                            <p className="text-gray-400 text-xs">{inq.email}</p>
                          </div>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            inq.status === 'new' ? 'bg-green-100 text-green-700' :
                            inq.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {inq.status.replace('_', ' ')}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif text-amber-900">Manage Products</h2>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/admin/products/new"
                      className="flex items-center gap-2 bg-amber-900 text-white px-5 py-2.5 rounded-lg hover:bg-amber-800 transition font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Product
                    </Link>
                  </motion.div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-amber-50">
                        <th className="px-4 py-3 text-left text-amber-900 font-semibold text-sm rounded-tl-lg">Image</th>
                        <th className="px-4 py-3 text-left text-amber-900 font-semibold text-sm">Name</th>
                        <th className="px-4 py-3 text-left text-amber-900 font-semibold text-sm">Category</th>
                        <th className="px-4 py-3 text-left text-amber-900 font-semibold text-sm">Price</th>
                        <th className="px-4 py-3 text-left text-amber-900 font-semibold text-sm rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {products.map((product) => (
                            <motion.tr
                              key={product.id}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="border-b border-amber-50 hover:bg-amber-50/50 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <img src={product.image_url} alt={product.name} className="w-14 h-14 object-cover rounded-lg" />
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-800 text-sm">{product.name}</td>
                              <td className="px-4 py-3 capitalize text-gray-500 text-sm">{product.category}</td>
                              <td className="px-4 py-3 font-semibold text-amber-900 text-sm">${product.price.toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1">
                                  <motion.button
                                    onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => deleteProduct(product.id)}
                                    disabled={deletingId === product.id}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    {deletingId === product.id ? (
                                      <motion.div
                                        className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                                      />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      )}
                    </tbody>
                  </table>
                  {!loading && products.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm">No products yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* Inquiries */}
            {activeTab === 'inquiries' && (
              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                  <h2 className="text-2xl font-serif text-amber-900">Customer Inquiries</h2>
                  {!loading && inquiries.some(inq => inq.status === 'resolved') && (
                    <motion.button
                      onClick={clearResolvedInquiries}
                      disabled={clearingResolved}
                      className="flex items-center gap-2 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {clearingResolved ? (
                        <motion.div
                          className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Clear All Resolved
                    </motion.button>
                  )}
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="border border-amber-50 rounded-xl p-6 animate-pulse">
                        <div className="h-4 bg-amber-100/60 rounded w-1/4 mb-2" />
                        <div className="h-3 bg-amber-100/40 rounded w-1/3 mb-4" />
                        <div className="h-3 bg-amber-100/40 rounded w-full" />
                      </div>
                    ))}
                  </div>
                ) : inquiries.length === 0 ? (
                  <p className="text-center py-12 text-gray-400 text-sm">No inquiries yet.</p>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {inquiries.map((inquiry, i) => (
                        <motion.div
                          key={inquiry.id}
                          layout
                          className="border border-amber-100 rounded-xl p-6 hover:shadow-sm transition-shadow"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ delay: i * 0.04, duration: 0.4 }}
                        >
                          <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                            <div>
                              <h3 className="font-semibold text-amber-900">{inquiry.name}</h3>
                              <p className="text-gray-400 text-sm">{inquiry.email}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={inquiry.status}
                                onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
                                  inquiry.status === 'new'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : inquiry.status === 'in_progress'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-gray-50 text-gray-600 border-gray-200'
                                }`}
                              >
                                <option value="new">New</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                              </select>

                              <motion.button
                                onClick={() => deleteInquiry(inquiry.id)}
                                disabled={deletingInquiryId === inquiry.id}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Delete inquiry"
                              >
                                {deletingInquiryId === inquiry.id ? (
                                  <motion.div
                                    className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                                  />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </motion.button>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-3 leading-relaxed">{inquiry.message}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">
                <h2 className="text-2xl font-serif text-amber-900 mb-6">Customer Contacts</h2>

                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-12 bg-amber-100/40 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-amber-50">
                          <th className="px-4 py-3 text-left text-amber-900 font-semibold text-sm rounded-tl-lg">Name</th>
                          <th className="px-4 py-3 text-left text-amber-900 font-semibold text-sm">Email</th>
                          <th className="px-4 py-3 text-left text-amber-900 font-semibold text-sm rounded-tr-lg">Inquiries</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, index) => (
                          <motion.tr
                            key={index}
                            className="border-b border-amber-50 hover:bg-amber-50/50 transition-colors"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            <td className="px-4 py-3 font-medium text-gray-800 text-sm">{u.name}</td>
                            <td className="px-4 py-3 text-gray-500 text-sm">{u.email}</td>
                            <td className="px-4 py-3">
                              <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {u.inquiry_count}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                    {users.length === 0 && (
                      <div className="text-center py-12 text-gray-400 text-sm">No customer contacts yet</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}