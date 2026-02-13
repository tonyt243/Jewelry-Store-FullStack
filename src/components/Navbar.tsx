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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="bg-[#f5deb3] shadow-md sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-45">
            {/*Logo*/}
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
                className="text-gray-800 hover:text-amber-900 transition p-2 relative z-50"
                aria-label="Toggle menu"
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

        {/*Clock*/}
        <div className="absolute top-2 right-4 text-gray-800 font-semibold text-sm font-mono bg-amber-100 px-3 py-1 rounded-md shadow-sm hidden md:block">
          {currentTime}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-amber-50 to-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="bg-[#f5deb3] px-6 py-6 border-b border-amber-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif text-amber-900">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-800 hover:text-amber-900 transition p-2"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Menu Content */}
        <div className="px-6 py-6 space-y-1 overflow-y-auto h-full pb-32">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-800 hover:text-amber-900 hover:bg-amber-100 px-4 py-3 rounded-lg transition font-medium text-lg transform hover:translate-x-1 duration-200"
          >
             Home
          </Link>
          <Link 
            href="/products" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-800 hover:text-amber-900 hover:bg-amber-100 px-4 py-3 rounded-lg transition font-medium text-lg transform hover:translate-x-1 duration-200"
          >
             Products
          </Link>
          <Link 
            href="/services" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-800 hover:text-amber-900 hover:bg-amber-100 px-4 py-3 rounded-lg transition font-medium text-lg transform hover:translate-x-1 duration-200"
          >
             Services
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-800 hover:text-amber-900 hover:bg-amber-100 px-4 py-3 rounded-lg transition font-medium text-lg transform hover:translate-x-1 duration-200"
          >
             Contact
          </Link>
          <Link 
            href="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-800 hover:text-amber-900 hover:bg-amber-100 px-4 py-3 rounded-lg transition font-medium text-lg transform hover:translate-x-1 duration-200"
          >
             About Us
          </Link>
          
          {user && (
            <>
              <div className="border-t border-amber-200 my-4 pt-4">
                <Link 
                  href="/favorites" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-800 hover:text-amber-900 hover:bg-amber-100 px-4 py-3 rounded-lg transition font-medium text-lg transform hover:translate-x-1 duration-200"
                >
                   Favorites
                </Link>
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-800 hover:text-amber-900 hover:bg-amber-100 px-4 py-3 rounded-lg transition font-medium text-lg transform hover:translate-x-1 duration-200"
                  >
                     Admin
                  </Link>
                )}
              </div>

              {/* User Info Section */}
              <div className="bg-amber-100 rounded-lg p-4 mt-4">
                <p className="text-gray-700 text-sm mb-3">
                  Signed in as
                </p>
                <p className="text-amber-900 font-semibold mb-4">
                  {user.user_metadata?.name || 'User'}
                </p>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition font-medium transform hover:scale-105 active:scale-95"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}