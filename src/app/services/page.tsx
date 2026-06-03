'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, Ruler, Wrench, Pencil, ArrowRight } from 'lucide-react';

function ZoomSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.88, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

export default function ServicesPage() {
  const services = [
    {
      title: 'Daily Care',
      description: 'Keep your jewelry sparkling with expert cleaning and maintenance.',
      image: '/images/dailycare.webp',
      icon: Sparkles,
    },
    {
      title: 'Resizing',
      description: 'Get the perfect fit for your rings or bracelets with our resizing service.',
      image: '/images/resizing.webp',
      icon: Ruler,
    },
    {
      title: 'Repairing',
      description: 'Restore broken or damaged jewelry to its original beauty.',
      image: '/images/repair.webp',
      icon: Wrench,
    },
    {
      title: 'Personalize',
      description: 'Make it truly yours with engraving and custom design options.',
      image: '/images/personalize.webp',
      icon: Pencil,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white overflow-x-hidden">

      {/* Hero */}
      <ZoomSection>
        <div className="relative bg-amber-950 text-white py-24 text-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #d4af37 0%, transparent 60%), radial-gradient(circle at 70% 30%, #d4af37 0%, transparent 50%)' }}
          />
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <motion.p
              className="text-amber-400 tracking-[0.4em] uppercase text-xs mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              What We Offer
            </motion.p>
            <motion.h1
              className="text-6xl font-serif mb-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              Our Services
            </motion.h1>
            <motion.div
              className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-5"
              style={{ width: '120px' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
            <motion.p
              className="text-amber-200 text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              Expert care for every piece, from cleaning to custom design.
            </motion.p>
          </div>
        </div>
      </ZoomSection>

      <div className="max-w-6xl mx-auto px-4 py-20 space-y-8">

        {/* Services — alternating layout */}
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: isEven ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100 group min-h-[320px]`}
                whileHover={{ boxShadow: '0 20px 60px rgba(180,120,30,0.12)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Image */}
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 min-h-[280px]"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="md:w-1/2 p-10 flex flex-col justify-center">
                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-6 group-hover:bg-amber-900 transition-colors duration-300"
                    whileHover={{ rotate: 10 }}
                  >
                    <service.icon className="w-6 h-6 text-amber-900 group-hover:text-white transition-colors duration-300" />
                  </motion.div>

                  <h3 className="text-3xl font-serif text-amber-900 mb-3">{service.title}</h3>
                  <div className="h-px bg-gradient-to-r from-amber-300 to-transparent mb-4" style={{ width: '60px' }} />
                  <p className="text-gray-500 leading-relaxed mb-8">{service.description}</p>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-amber-900 font-medium group/link"
                  >
                    <span className="border-b border-amber-300 group-hover/link:border-amber-900 transition-colors duration-200">
                      Get in Touch
                    </span>
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* CTA */}
        <ZoomSection>
          <div className="bg-amber-950 rounded-2xl p-14 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #d4af37 0%, transparent 60%)' }}
            />
            <div className="relative z-10">
              <h2 className="text-4xl font-serif text-white mb-3">Need Help With Your Jewelry?</h2>
              <div className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-6" style={{ width: '120px' }} />
              <p className="text-amber-200 mb-8 max-w-md mx-auto">
                Our team is ready to help — whether it's a quick clean or a full custom order.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/contact"
                    className="inline-block bg-amber-400 text-amber-950 px-8 py-3 rounded-lg hover:bg-amber-300 transition font-semibold"
                  >
                    Contact Us
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/products"
                    className="inline-block border-2 border-amber-400/50 text-amber-100 px-8 py-3 rounded-lg hover:border-amber-400 hover:text-white transition font-medium"
                  >
                    Browse Products
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </ZoomSection>

      </div>
    </div>
  );
}