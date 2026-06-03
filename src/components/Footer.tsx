'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, signOut, isAdmin } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    }));
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
    { href: '/about', label: 'About Us' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <motion.nav
        className="sticky top-0 z-50 bg-[#f5deb3] shadow-md"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-45">
            {/* Logo */}
            <div className="flex-1">
              <Link href="/" className="inline-block">
                <motion.img
                  src="/images/logotest.png"
                  alt="Kim Thao Trang Jewelry"
                  className="h-45 object-contain"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative font-medium text-lg transition-colors duration-200 group ${
                      active ? 'text-amber-900' : 'text-gray-800 hover:text-amber-900'
                    }`}
                  >
                    {link.label}
                    {/* Active indicator — persists; hover indicator — appears on hover for inactive */}
                    {active ? (
                      <motion.span
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    ) : (
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-700 group-hover:w-full transition-all duration-300 rounded-full" />
                    )}
                  </Link>
                );
              })}
              {user && (
                <>
                  {[
                    { href: '/favorites', label: 'Favorites' },
                    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
                  ].map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`relative font-medium text-lg transition-colors duration-200 group ${
                          active ? 'text-amber-900' : 'text-gray-800 hover:text-amber-900'
                        }`}
                      >
                        {link.label}
                        {active ? (
                          <motion.span
                            layoutId="navIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 rounded-full"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        ) : (
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-700 group-hover:w-full transition-all duration-300 rounded-full" />
                        )}
                      </Link>
                    );
                  })}
                </>
              )}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
              {user ? (
                <>
                  <span className="text-gray-800 font-medium">
                    Welcome, {user.user_metadata?.name || 'User'}!
                  </span>
                  <motion.button
                    onClick={() => signOut()}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/login"
                    className="bg-amber-900 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition inline-block"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {!user && (
                <Link href="/login" className="bg-amber-900 text-white px-3 py-2 rounded-md text-sm hover:bg-amber-800 transition">
                  Login
                </Link>
              )}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-800 hover:text-amber-900 transition p-2 relative z-50"
                aria-label="Toggle menu"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Clock */}
        <div className="absolute top-2 right-4 text-gray-800 font-semibold text-sm font-mono bg-amber-100 px-3 py-1 rounded-md shadow-sm hidden md:block">
          {currentTime}
        </div>
      </motion.nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-amber-50 to-white shadow-2xl z-50 md:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-[#f5deb3] px-6 py-6 border-b border-amber-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif text-amber-900">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-amber-900 transition p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 space-y-1 overflow-y-auto h-full pb-32">
              {navLinks.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition font-medium text-lg ${
                        active
                          ? 'bg-amber-100 text-amber-900 font-semibold'
                          : 'text-gray-800 hover:text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      {link.label}
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="border-t border-amber-200 my-4 pt-4">
                    {[
                      { href: '/favorites', label: 'Favorites' },
                      ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
                    ].map((link) => {
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg transition font-medium text-lg ${
                            active
                              ? 'bg-amber-100 text-amber-900 font-semibold'
                              : 'text-gray-800 hover:text-amber-900 hover:bg-amber-100'
                          }`}
                        >
                          {link.label}
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="bg-amber-100 rounded-lg p-4 mt-4">
                    <p className="text-gray-700 text-sm mb-1">Signed in as</p>
                    <p className="text-amber-900 font-semibold mb-4">{user.user_metadata?.name || 'User'}</p>
                    <motion.button
                      onClick={() => { signOut(); setMobileMenuOpen(false); }}
                      className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Logout
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}