'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';

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

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

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
      
      // Type assertion to handle Supabase's response
      setFavorites((data as any) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-serif text-amber-900 mb-4">Please Login</h2>
          <p className="text-xl text-gray-600 mb-6">You need to login to view your favorites</p>
          <Link
            href="/login"
            className="inline-block bg-amber-900 text-white px-6 py-3 rounded-md hover:bg-amber-800 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 fill-red-500 text-red-500" />
            <h1 className="text-5xl font-serif text-amber-900">
              My Favorites
            </h1>
            <Heart className="w-10 h-10 fill-red-500 text-red-500" />
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">No favorites yet!</p>
            <Link
              href="/products"
              className="inline-block bg-amber-900 text-white px-6 py-3 rounded-md hover:bg-amber-800 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group relative"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeFavorite(favorite.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 hover:scale-110 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={favorite.products.image_url}
                    alt={favorite.products.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-serif text-amber-900 mb-2">
                    {favorite.products.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {favorite.products.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-900">
                      ${favorite.products.price.toLocaleString()}
                    </span>
                    <button className="bg-amber-900 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition transform hover:scale-105">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}