'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: submitError } = await supabase
        .from('inquiries')
        .insert({
          user_id: user?.id || null,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          status: 'new',
        });

      if (submitError) throw submitError;

      setSuccess(true);
      // Clear form if not logged in
      if (!user) {
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setFormData({ ...formData, phone: '', message: '' });
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-amber-900 mb-4">
            Contact Us
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-serif text-amber-900 mb-6">
              Send us a message
            </h2>

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                Thank you! Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 text-gray-900 placeholder:text-gray-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 text-gray-900 placeholder:text-gray-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 text-gray-900 placeholder:text-gray-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 text-gray-900 placeholder:text-gray-500 resize-none"
                  placeholder="Tell us about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-900 text-white py-3 px-6 rounded-lg hover:bg-amber-800 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-serif text-amber-900 mb-6">
                Store Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-amber-900 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">
                      186-188, Đ. Lê Thánh Tôn, P, Quận 1<br />
                      Hồ Chí Minh, Vietnam
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-amber-900 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+84 903 743 132</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-amber-900 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">quochuyta243@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-amber-900 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Store Hours</h3>
                    <p className="text-gray-600">
                      Monday - Sunday<br />
                      9:00 AM - 6:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-serif text-amber-900 mb-4">
                    Visit Us
                </h3>
                <div className="aspect-video rounded-lg overflow-hidden">
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
          </div>
        </div>
      </div>
    </div>
  );
}