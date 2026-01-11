'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ChevronDown, Heart } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
};

type SortOption = 'none' | 'asc' | 'desc';

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOption>('none');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const categories = ['all', 'rings', 'necklaces', 'bracelets', 'earrings'];

  const sortOptions = [
    { value: 'none', label: 'Default' },
    { value: 'asc', label: 'Lowest Price' },
    { value: 'desc', label: 'Highest Price' },
  ];

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchFavorites();
    }
  }, [selectedCategory, sortOrder, user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*');
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (sortOrder === 'asc') {
        query = query.order('price', { ascending: true });
      } else if (sortOrder === 'desc') {
        query = query.order('price', { ascending: false });
      }

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
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const ids = new Set(data?.map(fav => fav.product_id) || []);
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    try {
      if (favoriteIds.has(productId)) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;

        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;

        setFavoriteIds(prev => new Set([...prev, productId]));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites');
    }
  };

  const handleSortChange = (value: SortOption) => {
    setSortOrder(value);
    setIsDropdownOpen(false);
  };

  const getCurrentSortLabel = () => {
    return sortOptions.find(opt => opt.value === sortOrder)?.label || 'Default';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-amber-900 mb-4">
            Our Collection
          </h1>
        </div>

        {/* Filter and Sort Controls */}
        <div className="mb-12">
          <div className="flex justify-center gap-4 flex-wrap items-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{ fontFamily: 'var(--font-playfair)' }}
                className={`px-8 py-3 rounded-lg font-semibold text-lg tracking-wide transition-all duration-300 transform hover:scale-105 shadow-md ${
                  selectedCategory === category
                    ? 'bg-amber-900 text-white shadow-lg scale-105'
                    : 'bg-white text-amber-900 border-2 border-amber-900 hover:bg-amber-50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ fontFamily: 'var(--font-playfair)' }}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-amber-900 text-amber-900 rounded-lg font-semibold text-lg hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <span>Sort By: {getCurrentSortLabel()}</span>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border-2 border-amber-900 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value as SortOption)}
                      className={`w-full px-6 py-3 text-left hover:bg-amber-50 transition-colors ${
                        sortOrder === option.value
                          ? 'bg-amber-900 text-white font-semibold'
                          : 'text-amber-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group relative"
              >
                {/* Favorite Heart Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      favoriteIds.has(product.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                </button>

                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-serif text-amber-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-900">
                      ${product.price.toLocaleString()}
                    </span>
                    <Link 
                      href={`/contact?product=${product.id}`}
                      className="bg-amber-900 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition transform hover:scale-105 inline-block text-center"
                    >
                      Inquire
                    </Link>
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