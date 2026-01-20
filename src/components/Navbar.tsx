'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [currentTime, setCurrentTime] = useState('');

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

          {/* Center: Navigation Links */}
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
              <Link 
                href="/favorites" 
                className="text-gray-800 hover:text-amber-900 transition font-medium text-lg relative group"
              >
                Favorites
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-900 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>

          {/* Right: Auth Section */}
          <div className="flex-1 flex items-center justify-end space-x-4">
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
        </div>
      </div>

      {/* Clock */}
      <div className="absolute top-2 right-4 text-gray-800 font-semibold text-bg font-mono bg-amber-100 px-3 py-1 rounded-md shadow-sm">
        {currentTime}
      </div>
    </nav>
  );
}