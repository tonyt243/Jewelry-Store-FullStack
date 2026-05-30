'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ChevronDown, Heart, Gem, Sparkles, Link2, Star, LayoutGrid, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
};

type SortOption = 'none' | 'asc' | 'desc';

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-amber-100/60" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-amber-100/60 rounded w-3/4" />
        <div className="h-3 bg-amber-100/40 rounded w-full" />
        <div className="h-3 bg-amber-100/40 rounded w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-amber-100/60 rounded w-1/3" />
          <div className="h-8 bg-amber-100/60 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOption>('none');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Product | null>(null);

  const categories = [
    { value: 'all',       label: 'All',       icon: LayoutGrid },
    { value: 'rings',     label: 'Rings',     icon: Sparkles   },
    { value: 'necklaces', label: 'Necklaces', icon: Gem        },
    { value: 'bracelets', label: 'Bracelets', icon: Link2      },
    { value: 'earrings',  label: 'Earrings',  icon: Star       },
  ];
  const sortOptions = [
    { value: 'none', label: 'Default' },
    { value: 'asc', label: 'Lowest Price' },
    { value: 'desc', label: 'Highest Price' },
  ];

  useEffect(() => {
    fetchProducts();
    if (user) fetchFavorites();
  }, [selectedCategory, sortOrder, user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*');
      if (selectedCategory !== 'all') query = query.eq('category', selectedCategory);
      if (sortOrder === 'asc') query = query.order('price', { ascending: true });
      else if (sortOrder === 'desc') query = query.order('price', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('favorites').select('product_id').eq('user_id', user.id);
      if (error) throw error;
      setFavoriteIds(new Set(data?.map(fav => fav.product_id) || []));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) { alert('Please login to add favorites'); return; }
    setTogglingId(productId);
    try {
      if (favoriteIds.has(productId)) {
        const { error } = await supabase.from('favorites').delete()
          .eq('user_id', user.id).eq('product_id', productId);
        if (error) throw error;
        setFavoriteIds(prev => { const s = new Set(prev); s.delete(productId); return s; });
      } else {
        const { error } = await supabase.from('favorites')
          .insert({ user_id: user.id, product_id: productId });
        if (error) throw error;
        setFavoriteIds(prev => new Set([...prev, productId]));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleSortChange = (value: SortOption) => {
    setSortOrder(value);
    setIsDropdownOpen(false);
  };

  const getCurrentSortLabel = () =>
    sortOptions.find(opt => opt.value === sortOrder)?.label || 'Default';

  // Close lightbox on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl font-serif text-amber-900 mb-4">Our Collection</h1>
          <div className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" style={{ width: '140px' }} />
        </motion.div>

        {/* Filter + Sort */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex justify-center gap-3 flex-wrap items-center">
            {categories.map((category) => (
              <motion.button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                style={{ fontFamily: 'var(--font-playfair)' }}
                className={`relative flex flex-col items-center gap-1.5 px-6 py-3 rounded-xl font-semibold text-sm tracking-wide transition-colors duration-300 shadow-sm min-w-[72px] ${
                  selectedCategory === category.value
                    ? 'bg-amber-900 text-white shadow-md'
                    : 'bg-white text-amber-900 border-2 border-amber-900 hover:bg-amber-50'
                }`}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.label}</span>
                {selectedCategory === category.value && (
                  <motion.span
                    className="absolute inset-0 rounded-xl bg-amber-800/20"
                    layoutId="activeCategory"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ fontFamily: 'var(--font-playfair)' }}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-amber-900 text-amber-900 rounded-lg font-semibold text-base hover:bg-amber-50 transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <span>Sort: {getCurrentSortLabel()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute top-full mt-2 w-full bg-white border-2 border-amber-900 rounded-lg shadow-xl overflow-hidden z-50"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value as SortOption)}
                        className={`w-full px-6 py-3 text-left hover:bg-amber-50 transition-colors ${
                          sortOrder === option.value ? 'bg-amber-900 text-white font-semibold' : 'text-amber-900'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-gray-500">No products found in this category.</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(180,120,30,0.15)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden relative group border border-amber-50"
              >
                {/* Favorite Button */}
                <motion.button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  disabled={togglingId === product.id}
                >
                  <motion.div
                    animate={togglingId === product.id ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors duration-200 ${
                        favoriteIds.has(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-300 group-hover:text-gray-400'
                      }`}
                    />
                  </motion.div>
                </motion.button>

                {/* Image */}
                <div
                  className="relative aspect-square overflow-hidden bg-amber-50 cursor-zoom-in"
                  onClick={() => setLightbox(product)}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Zoom hint on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                  {/* Category badge */}
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-white/80 backdrop-blur-sm text-amber-900 text-xs font-medium px-2.5 py-1 rounded-full capitalize tracking-wide">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-lg font-serif text-amber-900 mb-1 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-amber-900">
                      ${product.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/contact?product=${product.id}`}
                      className="relative overflow-hidden bg-amber-900 text-white px-4 py-2 rounded-md text-sm font-medium group/btn inline-block"
                    >
                      <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative">Inquire</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 bg-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full flex flex-col md:flex-row"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <motion.button
                className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md text-gray-600 hover:text-amber-900 transition-colors"
                onClick={() => setLightbox(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Image */}
              <div className="md:w-1/2 aspect-square bg-amber-50 shrink-0">
                <img src={lightbox.image_url} alt={lightbox.name} className="w-full h-full object-cover" />
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <span className="text-xs tracking-widest uppercase text-amber-600 font-medium">
                    {lightbox.category}
                  </span>
                  <h2 className="text-2xl font-serif text-amber-900 mt-2 mb-3">{lightbox.name}</h2>
                  <div className="h-px bg-gradient-to-r from-amber-300 to-transparent mb-4" />
                  <p className="text-gray-500 text-sm leading-relaxed">{lightbox.description}</p>
                </div>
                <div className="mt-6">
                  <p className="text-3xl font-bold text-amber-900 mb-4">${lightbox.price.toLocaleString()}</p>
                  <div className="flex gap-3">
                    <Link
                      href={`/contact?product=${lightbox.id}`}
                      className="relative overflow-hidden flex-1 bg-amber-900 text-white py-3 rounded-lg text-sm font-medium text-center group/btn"
                      onClick={() => setLightbox(null)}
                    >
                      <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative">Inquire Now</span>
                    </Link>
                    <motion.button
                      onClick={() => toggleFavorite(lightbox.id)}
                      className="p-3 border-2 border-amber-200 rounded-lg hover:border-amber-900 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart className={`w-5 h-5 ${favoriteIds.has(lightbox.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}