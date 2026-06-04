'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const footerLinks = {
  about: [
    { label: 'Our Story', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Our Services', href: '/services' },
    { label: 'View Collection', href: '/products' },
  ],
  service: [
    { label: 'Custom Orders', href: '/contact' },
    { label: 'Product Inquiries', href: '/contact' },
    { label: 'Jewelry Repair', href: '/services' },
    { label: 'Appointments', href: '/contact' },
  ],
  info: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Care Guide', href: '#' },
    { label: 'Visit Us', href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-amber-950 text-amber-200/70">
      {/* Top gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand + Store Info */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-amber-100 text-xl mb-2">Kim Thao Trang</h3>
            <div className="space-y-3 text-sm leading-relaxed">
              <div>
                <p className="text-amber-100 font-medium mb-0.5">Address</p>
                <p>186-188, Đ. Lê Thánh Tôn, P, Quận 1</p>
                <p>Hồ Chí Minh, Vietnam</p>
              </div>
              <div>
                <p className="text-amber-100 font-medium mb-0.5">Hours</p>
                <p>Mon – Sun: 9:00 AM – 6:30 PM</p>
              </div>
              <div>
                <p className="text-amber-100 font-medium mb-0.5">Phone</p>
                <p>+84 0903 743 132</p>
              </div>
              <div>
                <p className="text-amber-100 font-medium mb-0.5">Email</p>
                <p>quochuyta243@gmail.com</p>
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-amber-100 font-semibold text-sm tracking-widest uppercase mb-5">About</h3>
            <ul className="space-y-3 text-sm">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-amber-100 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-amber-100 font-semibold text-sm tracking-widest uppercase mb-5">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              {footerLinks.service.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-amber-100 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-amber-100 font-semibold text-sm tracking-widest uppercase mb-5">Information</h3>
            <ul className="space-y-3 text-sm">
              {footerLinks.info.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-amber-100 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Facebook */}
            <div className="mt-8">
              <p className="text-amber-100 font-semibold text-sm tracking-widest uppercase mb-4">Follow Us</p>
              <motion.a
                href="https://www.facebook.com/profile.php?id=100066898271984"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-amber-800/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-amber-200/40">
          <p>© {new Date().getFullYear()} Kim Thao Trang Jewelry. All rights reserved.</p>
          <p className="tracking-widest uppercase">Hồ Chí Minh City, Vietnam</p>
        </div>
      </div>
    </footer>
  );
}