'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-serif text-amber-900">
              Kim Thao Trang Jewelry
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-amber-900 transition font-medium relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-amber-900 transition font-medium relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/services" 
              className="text-gray-700 hover:text-amber-900 transition font-medium relative group"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-amber-900 transition font-medium relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-amber-900 transition font-medium relative group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {user && (
              <Link 
                href="/favorites" 
                className="text-gray-700 hover:text-amber-900 transition font-medium relative group"
              >
                Favorites
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>

          {/* Auth section - Far Right */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">
                  Welcome, {user.user_metadata?.name || 'User'}!
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition transform hover:scale-105 active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login"
                className="bg-amber-900 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition transform hover:scale-105 active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}