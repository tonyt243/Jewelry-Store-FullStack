'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
};

function ContactForm() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');

  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);

      setFormData(prev => ({
        ...prev,
        message: `I'm interested in: ${data.name} ($${data.price.toLocaleString()})\n\n`,
      }));
    } catch (err) {
      console.error('Error fetching product:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id || null,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          product_id: productId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const resetTime = new Date(data.resetTime);
          const minutes = Math.ceil((resetTime.getTime() - Date.now()) / 60000);
          throw new Error(`Too many requests. Please try again in ${minutes} minute(s).`);
        }
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);

      if (!user) {
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setFormData({ ...formData, phone: '', message: '' });
      }
      setProduct(null);

      if (data.remaining !== undefined && data.remaining < 3) {
        console.log(`You have ${data.remaining} submission(s) remaining this hour`);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 ${
      focusedField === field
        ? 'border-amber-900 ring-2 ring-amber-900/15'
        : 'border-gray-200'
    }`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

      {/* Contact Form */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl font-serif text-amber-900 mb-1">Send us a message</h2>
        <p className="text-gray-400 text-sm mb-6">We typically respond within 24 hours.</p>

        <AnimatePresence>
          {product && (
            <motion.div
              className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-gray-600 mb-2">Inquiring about:</p>
              <div className="flex items-center gap-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-amber-900">{product.name}</h3>
                  <p className="text-gray-700">${product.price.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              className={inputClass('name')}
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className={inputClass('email')}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              className={inputClass('phone')}
              placeholder="+84 123 456 789"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              className={`${inputClass('message')} resize-none`}
              placeholder="Tell us about your inquiry..."
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="relative overflow-hidden w-full bg-amber-900 text-white py-3.5 px-6 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed font-medium text-lg flex items-center justify-center gap-2 group"
            whileHover={!loading ? { scale: 1.01 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            {loading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative">Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 relative" />
                <span className="relative">Send Message</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">
          <h2 className="text-3xl font-serif text-amber-900 mb-6">Store Information</h2>

          <div className="space-y-5">
            {[
              { icon: MapPin, title: 'Address', text: '186-188, Đ. Lê Thánh Tôn, P, Quận 1\nHồ Chí Minh, Vietnam' },
              { icon: Phone, title: 'Phone', text: '+84 903 743 132' },
              { icon: Mail, title: 'Email', text: 'quochuyta243@gmail.com' },
              { icon: Clock, title: 'Store Hours', text: 'Monday - Sunday\n9:00 AM - 6:30 PM' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-amber-50 transition-colors duration-200"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-amber-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-0.5">{item.title}</h3>
                  <p className="text-gray-500 text-sm whitespace-pre-line">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Google Map */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">
          <h3 className="text-2xl font-serif text-amber-900 mb-4">Visit Us</h3>
          <div className="aspect-video rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.500106761181!2d106.69439387540832!3d10.772956459257015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f2b4c7449%3A0xfcd9d29863594a0b!2zMTg2IEzDqiBUaMOhbmggVMO0biwgUGjGsOG7nW5nIELhur9uIFRow6BuaCwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCA3MDAwMCwgVmlldG5hbQ!5e0!3m2!1sen!2sus!4v1768109931496!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl font-serif text-amber-900 mb-4">Contact Us</h1>
          <div className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" style={{ width: '140px' }} />
        </motion.div>

        <Suspense fallback={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 animate-pulse">
              <div className="h-8 bg-amber-100/60 rounded w-1/2 mb-6" />
              <div className="space-y-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-amber-100/40 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 animate-pulse">
              <div className="h-8 bg-amber-100/60 rounded w-1/2 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-amber-100/40 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        }>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}