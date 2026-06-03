'use client';

import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Shield, Gem, Wrench, MapPin, Clock, Phone, Mail } from 'lucide-react';

// Scroll-zoom section wrapper
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

// Slot-machine number scramble
const CHARS = '0123456789';
function ScrambleNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    const targetStr = String(target);
    const duration = 1600;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);

      if (progress < 1) {
        // Scramble: mix random digits with correct digits from left as progress increases
        const revealedCount = Math.floor(eased * targetStr.length);
        const scrambled = targetStr
          .split('')
          .map((char, i) =>
            i < revealedCount
              ? char
              : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join('');
        setDisplay(scrambled);
        requestAnimationFrame(animate);
      } else {
        setDisplay(targetStr);
      }
    };
    requestAnimationFrame(animate);
  }, [inView, target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// Staggered letter reveal
function LetterReveal({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00a0' : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function AboutPage() {
  const stats = [
    { value: 500,  suffix: '+', label: 'Products' },
    { value: 20,   suffix: '+', label: 'Years' },
    { value: 1000, suffix: '+', label: 'Customers' },
    { value: 4,    suffix: '',  label: 'Collections' },
  ];

  const features = [
    { icon: Gem,    title: 'Authentic Gold',      description: 'Certified gold & gemstones — guaranteed real.' },
    { icon: Wrench, title: 'Custom Orders',        description: 'Design your own piece with our artisans.' },
    { icon: Shield, title: 'Expert Craftsmanship', description: '20+ years of fine jewelry tradition.' },
  ];

  const contact = [
    { icon: MapPin, text: '186-188 Đ. Lê Thánh Tôn, Quận 1, Hồ Chí Minh' },
    { icon: Clock,  text: 'Mon – Sun: 9:00 AM – 6:30 PM' },
    { icon: Phone,  text: '+84 903 743 132' },
    { icon: Mail,   text: 'quochuyta243@gmail.com' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white overflow-x-hidden">

      {/* Hero */}
      <ZoomSection>
        <div className="relative bg-amber-950 text-white py-28 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #d4af37 0%, transparent 60%), radial-gradient(circle at 70% 30%, #d4af37 0%, transparent 50%)' }}
          />
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <motion.p
              className="text-amber-400 tracking-[0.4em] uppercase text-xs mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Est. 2002 · Hồ Chí Minh City
            </motion.p>
            <h1 className="text-6xl font-serif mb-4 perspective-[800px]">
              <LetterReveal text="Our Story" />
            </h1>
            <motion.div
              className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6"
              style={{ width: '120px' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
            <motion.p
              className="text-amber-200 text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              Two decades of passion, craft, and family.
            </motion.p>
          </div>
        </div>
      </ZoomSection>

      <div className="max-w-6xl mx-auto px-4 py-20 space-y-24">

        {/* Timeline */}
        <ZoomSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { year: '2002',   text: 'Kim Thao Trang Jewelry opens its doors in Ho Chi Minh City.' },
              { year: '10 yrs', text: 'Our founder trained under her mother, mastering every detail of the craft.' },
              { year: 'Today',  text: 'A trusted name offering exceptional quality at honest prices.' },
            ].map((item, i) => (
              <motion.div
                key={item.year}
                className="bg-white rounded-2xl p-8 border border-amber-100 shadow-sm text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(180,120,30,0.12)' }}
              >
                <p className="text-3xl font-serif text-amber-600 mb-3">{item.year}</p>
                <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent mb-3" />
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </ZoomSection>

        {/* Stats — scramble ticker */}
        <ZoomSection>
          <div className="bg-amber-950 rounded-2xl py-14 px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <p className="text-5xl font-serif font-bold text-amber-300 mb-1 tabular-nums">
                    <ScrambleNumber target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs tracking-widest uppercase text-amber-200/60">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </ZoomSection>

        {/* Why Choose Us */}
        <ZoomSection>
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif text-amber-900 mb-3">
              <LetterReveal text="Why Choose Us" />
            </h2>
            <div className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" style={{ width: '100px' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="bg-white rounded-2xl p-8 text-center border border-amber-100 shadow-sm group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(180,120,30,0.12)' }}
              >
                <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-900 transition-colors duration-300">
                  <f.icon className="w-6 h-6 text-amber-900 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-serif text-amber-900 mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </ZoomSection>

        {/* Visit Us */}
        <ZoomSection>
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-12">
            <h2 className="text-4xl font-serif text-amber-900 text-center mb-2">
              <LetterReveal text="Visit Us" />
            </h2>
            <div className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-10" style={{ width: '100px' }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-10">
              {contact.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <item.icon className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-gray-600 text-lg leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-6 justify-center flex-wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/contact" className="inline-block bg-amber-900 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition font-medium">
                  Contact Us
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/products" className="inline-block border-2 border-amber-900 text-amber-900 px-8 py-3 rounded-lg hover:bg-amber-50 transition font-medium">
                  Browse Collection
                </Link>
              </motion.div>
            </div>
          </div>
        </ZoomSection>

      </div>
    </div>
  );
}