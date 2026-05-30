'use client';

import Link from 'next/link';
import Carousel from '@/components/Carousel';
import { motion } from 'framer-motion';

// Reusable scroll-reveal wrapper
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const categories = [
    { name: 'Rings', image: '/images/rings.webp', link: '/products?category=rings' },
    { name: 'Necklaces', image: '/images/necklaces.webp', link: '/products?category=necklaces' },
    { name: 'Bracelets', image: '/images/bracelets.webp', link: '/products?category=bracelets' },
    { name: 'Earrings', image: '/images/earrings.webp', link: '/products?category=earrings' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-amber-50 to-white overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #f5deb340 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #d4af3720 0%, transparent 40%)`
          }}
        />

        <div className="max-w-7xl mx-auto px-4 py-20 text-center relative z-10">
          {/* Eyebrow label */}
          <motion.p
            className="text-amber-700 tracking-[0.3em] uppercase text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
          </motion.p>

          {/* Main heading */}
          <motion.h1
            className="text-5xl md:text-6xl font-serif text-amber-900 mb-4 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Welcome to Kim Thao Trang Jewelry
          </motion.h1>

          {/* Animated gold divider */}
          <motion.div
            className="mx-auto my-6 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
            style={{ width: '200px' }}
          />

          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Discover our exclusive collection of rings, necklaces, bracelets & earrings
          </motion.p>

          {/* Shop Now button with shimmer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href="/products"
              className="relative inline-block overflow-hidden bg-amber-900 text-white px-10 py-3.5 rounded-md text-lg font-medium group"
            >
              {/* Shimmer sweep on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative">Shop Now</span>
            </Link>
          </motion.div>
        </div>

        {/* Carousel with fade-in */}
        <motion.div
          className="max-w-6xl mx-auto px-4 pb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
        >
          <Carousel />
        </motion.div>
      </section>

      {/* Shop By Category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeUp className="text-center mb-12">
            <h2 className="text-4xl font-serif text-amber-900 mb-3">Shop By Category</h2>
            <div className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" style={{ width: '120px' }} />
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <FadeUp key={category.name} delay={index * 0.1}>
                <Link href={category.link} className="group block">
                  <motion.div
                    className="relative aspect-square rounded-lg overflow-hidden mb-4 shadow-md"
                    whileHover={{
                      y: -6,
                      boxShadow: '0 12px 40px rgba(180, 120, 30, 0.25)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gold overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Browse label that appears on hover */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span className="text-white text-sm font-medium tracking-widest uppercase border border-white/60 px-4 py-1.5 rounded-full backdrop-blur-sm">
                        Browse
                      </span>
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-serif text-center text-amber-900 mb-1 group-hover:text-amber-700 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-center text-gray-400 text-sm tracking-wider uppercase group-hover:text-amber-600 transition-colors duration-200">
                    Browse Collection
                  </p>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}