'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, signOut, isAdmin } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Set initial time
    setCurrentTime(new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }));

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="bg-[#f5deb3] shadow-md sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-45">
          {/* Left: Logo */}
          <div className="flex-1">
            <Link href="/" className="inline-block">
              <img 
                src="/images/logotest.png" 
                alt="Kim Thao Trang Jewelry" 
                className="h-45 object-contain"
              />
            </Link>
          </div>

          {/*Desktop Navigation Links*/}
          <div className="hidden md:flex space-x-8 items-center">
            <Link 
              href="/" 
              className="text-gray-800 hover:text-amber-900 transition font-medium text-lg relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/products" 
              className="text-gray-800 hover:text-amber-900 transition font-medium text-lg relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/services" 
              className="text-gray-800 hover:text-amber-900 transition font-medium text-lg relative group"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-800 hover:text-amber-900 transition font-medium text-lg relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/about" 
              className="text-gray-800 hover:text-amber-900 transition font-medium text-lg relative group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {user && (
              <>
                <Link 
                  href="/favorites" 
                  className="text-gray-800 hover:text-amber-900 transition font-medium text-lg relative group"
                >
                  Favorites
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
                </Link>
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="text-gray-800 hover:text-amber-900 transition font-medium text-lg relative group"
                  >
                    Admin
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/*Auth Section*/}
          <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
            {user ? (
              <>
                <span className="text-gray-800 font-medium">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {!user && (
              <Link 
                href="/login"
                className="bg-amber-900 text-white px-3 py-2 rounded-md text-sm hover:bg-amber-800 transition"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-800 hover:text-amber-900 transition p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Clock */}
      <div className="absolute top-2 right-4 text-gray-800 font-semibold text-sm font-mono bg-amber-100 px-3 py-1 rounded-md shadow-sm hidden md:block">
        {currentTime}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-800 hover:text-amber-900 hover:bg-amber-50 px-3 py-2 rounded-md transition font-medium"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-800 hover:text-amber-900 hover:bg-amber-50 px-3 py-2 rounded-md transition font-medium"
            >
              Products
            </Link>
            <Link 
              href="/services" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-800 hover:text-amber-900 hover:bg-amber-50 px-3 py-2 rounded-md transition font-medium"
            >
              Services
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-800 hover:text-amber-900 hover:bg-amber-50 px-3 py-2 rounded-md transition font-medium"
            >
              Contact
            </Link>
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-800 hover:text-amber-900 hover:bg-amber-50 px-3 py-2 rounded-md transition font-medium"
            >
              About Us
            </Link>
            {user && (
              <>
                <Link 
                  href="/favorites" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-800 hover:text-amber-900 hover:bg-amber-50 px-3 py-2 rounded-md transition font-medium"
                >
                  Favorites
                </Link>
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-800 hover:text-amber-900 hover:bg-amber-50 px-3 py-2 rounded-md transition font-medium"
                  >
                    Admin
                  </Link>
                )}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <p className="text-gray-600 px-3 py-2 text-sm">
                    Welcome, {user.user_metadata?.name || 'User'}!
                  </p>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition font-medium mt-2"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}