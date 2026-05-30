'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-amber-900 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center group"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          whileHover={{ scale: 1.12, backgroundColor: '#78350f' }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          {/* Gold ring pulse on hover */}
          <span className="absolute inset-0 rounded-full border-2 border-amber-400 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
          <ArrowUp className="w-5 h-5 relative" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}