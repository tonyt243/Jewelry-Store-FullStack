'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Heart, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
};

type Favorite = {
  id: string;
  product_id: string;
  products: Product;
};

// Skeleton card matching products page style
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

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Product | null>(null);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          product_id,
          products (
            id,
            name,
            description,
            price,
            category,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites((data as any) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    setRemovingId(favoriteId);
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite');
    } finally {
      setRemovingId(null);
    }
  };

  // Close lightbox on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Not logged in
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heart className="w-20 h-20 text-amber-200 mx-auto mb-4" />
          <h2 className="text-3xl font-serif text-amber-900 mb-3">Please Login</h2>
          <p className="text-gray-500 mb-6">You need to login to view your favorites</p>
          <motion.div className="inline-block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/login" className="inline-block bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition">
              Go to Login
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

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
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart className="w-9 h-9 fill-red-500 text-red-500" />
            <h1 className="text-5xl font-serif text-amber-900">My Favorites</h1>
            <Heart className="w-9 h-9 fill-red-500 text-red-500" />
          </div>
          <div className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" style={{ width: '140px' }} />
        </motion.div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Heart className="w-20 h-20 text-amber-100 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-6">No favorites yet!</p>
            <motion.div className="inline-block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/products" className="inline-block bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition">
                Browse Products
              </Link>
            </motion.div>
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
            <AnimatePresence>
              {favorites.map((favorite) => (
                <motion.div
                  key={favorite.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                  whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(180,120,30,0.15)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden relative group border border-amber-50"
                >
                  {/* Remove Button */}
                  <motion.button
                    onClick={() => removeFavorite(favorite.id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-red-500 text-white rounded-full shadow-md"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    disabled={removingId === favorite.id}
                  >
                    {removingId === favorite.id ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </motion.button>

                  {/* Image */}
                  <div
                    className="relative aspect-square overflow-hidden bg-amber-50 cursor-zoom-in"
                    onClick={() => setLightbox(favorite.products)}
                  >
                    <img
                      src={favorite.products.image_url}
                      alt={favorite.products.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2">
                      <span className="bg-white/80 backdrop-blur-sm text-amber-900 text-xs font-medium px-2.5 py-1 rounded-full capitalize tracking-wide">
                        {favorite.products.category}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-serif text-amber-900 mb-1 leading-snug">
                      {favorite.products.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {favorite.products.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-amber-900">
                        ${favorite.products.price.toLocaleString()}
                      </span>
                      <motion.button
                        onClick={() => setLightbox(favorite.products)}
                        className="relative overflow-hidden bg-amber-900 text-white px-4 py-2 rounded-md text-sm font-medium group/btn"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <span className="relative">View Details</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
                  <Link
                    href={`/contact?product=${lightbox.id}`}
                    className="relative overflow-hidden block w-full bg-amber-900 text-white py-3 rounded-lg text-sm font-medium text-center group/btn"
                    onClick={() => setLightbox(null)}
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative">Inquire Now</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}