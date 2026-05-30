'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Shield, Gem, Wrench } from 'lucide-react';

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

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function AboutPage() {
  const stats = [
    { value: 500, suffix: '+', label: 'Products' },
    { value: 20, suffix: '+', label: 'Years of Experience' },
    { value: 1000, suffix: '+', label: 'Happy Customers' },
    { value: 4, suffix: '', label: 'Collections' },
  ];

  const features = [
    {
      icon: Gem,
      title: 'Authentic Gold',
      description: 'Every piece is crafted from certified, high-quality gold and gemstones — guaranteed authentic.',
    },
    {
      icon: Wrench,
      title: 'Custom Orders',
      description: 'Work with our artisans to design a one-of-a-kind piece made exactly to your vision.',
    },
    {
      icon: Shield,
      title: 'Expert Craftsmanship',
      description: 'Over 20 years of experience in fine jewelry, combining traditional and modern techniques.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Header */}
        <FadeUp className="text-center mb-16">
          <h1 className="text-5xl font-serif text-amber-900 mb-4">About Us</h1>
          <div className="mx-auto my-4 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" style={{ width: '140px' }} />
          <p className="text-xl text-gray-600">A Legacy of Excellence Since 2002</p>
        </FadeUp>

        {/* Our Story */}
        <FadeUp>
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-12 mb-12">
            <h2 className="text-4xl font-serif text-amber-900 mb-8 text-center">Our Story</h2>
            <div className="max-w-none text-gray-700 space-y-6">
              <p className="text-lg leading-relaxed">
                Founded in <strong>2002</strong>, Kim Thao Trang Jewelry represents over two decades of passion,
                dedication, and expertise in fine jewelry. Our journey began with a young apprentice's dream
                and has blossomed into a trusted name in Ho Chi Minh City's jewelry industry.
              </p>
              <p className="text-lg leading-relaxed">
                Our founder spent <strong>10 years</strong> learning the intricate art of jewelry from her mother,
                mastering every aspect of the craft — from selecting the finest materials to understanding what
                makes each piece truly special. This decade of apprenticeship wasn't just about learning
                techniques; it was about inheriting a legacy of quality, trust, and genuine care for customers.
              </p>
              <p className="text-lg leading-relaxed">
                With her mentor's blessing and a commitment to excellence, she opened Kim Thao Trang Jewelry,
                bringing her vision to life: to offer <strong>exceptional quality at affordable prices</strong>.
                Every piece in our collection reflects this philosophy — carefully selected, expertly crafted,
                and priced with fairness.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Stats Bar */}
        <FadeUp>
          <div className="bg-amber-950 rounded-xl py-12 px-8 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-amber-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <p className="text-4xl md:text-5xl font-serif font-bold text-amber-300 mb-1">
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm tracking-widest uppercase text-amber-200/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Why Choose Us */}
        <FadeUp className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif text-amber-900 mb-3">Why Choose Us</h2>
            <div className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" style={{ width: '120px' }} />
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Trusted by families across Vietnam for over two decades of fine jewelry excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-xl p-8 text-center shadow-sm border border-amber-100 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(180, 120, 30, 0.12)' }}
              >
                <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-900 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-amber-900 group-hover:text-amber-100 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-serif text-amber-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </FadeUp>

        {/* Our Commitment */}
        <FadeUp>
          <div className="bg-amber-900 text-white rounded-xl shadow-sm p-12 mb-12">
            <h2 className="text-4xl font-serif mb-6 text-center">Our Commitment to You</h2>
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <p className="text-lg leading-relaxed text-amber-100">
                Every piece of jewelry tells a story, and we're honored to be part of yours.
                Whether you're celebrating a milestone, expressing love, or simply treating yourself,
                we ensure that your experience with us is as memorable as the jewelry itself.
              </p>
              <p className="text-lg leading-relaxed text-amber-100">
                From selection to service, we bring the same care and attention that has been passed
                down through generations. When you choose Kim Thao Trang Jewelry, you're not just
                buying jewelry — you're becoming part of our family's legacy.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Visit Our Store */}
        <FadeUp>
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-12 text-center">
            <h2 className="text-4xl font-serif text-amber-900 mb-6">Visit Our Store</h2>
            <div className="max-w-2xl mx-auto space-y-4 text-gray-700 text-lg mb-8">
              <p>
                <strong>Address:</strong><br />
                186-188, Đ. Lê Thánh Tôn, P, Quận 1<br />
                Hồ Chí Minh, Vietnam
              </p>
              <p>
                <strong>Store Hours:</strong><br />
                Monday - Sunday: 9:00 AM - 6:30 PM
              </p>
              <p>
                <strong>Phone:</strong> +84 903 743 132<br />
                <strong>Email:</strong> quochuyta243@gmail.com
              </p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/contact"
                  className="inline-block bg-amber-900 text-white px-8 py-3 rounded-md hover:bg-amber-800 transition text-lg font-medium"
                >
                  Contact Us
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/products"
                  className="inline-block border-2 border-amber-900 text-amber-900 px-8 py-3 rounded-md hover:bg-amber-50 transition text-lg font-medium"
                >
                  Browse Collection
                </Link>
              </motion.div>
            </div>
          </div>
        </FadeUp>

      </div>
    </div>
  );
}