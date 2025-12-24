'use client';

import Link from 'next/link';

export default function Navbar() {
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
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-amber-900 transition font-medium"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-amber-900 transition font-medium"
            >
              Products
            </Link>
            <Link 
              href="/services" 
              className="text-gray-700 hover:text-amber-900 transition font-medium"
            >
              Services
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-amber-900 transition font-medium"
            >
              Contact
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-amber-900 transition font-medium"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}