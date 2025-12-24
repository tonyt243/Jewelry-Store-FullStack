import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Store Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Store Info</h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-white">Address:</p>
              <p>186-188, Đ. Lê Thánh Tôn, P, Quận 1</p>
              <p>Hồ Chí Minh, Vietnam</p>
              
              <p className="font-semibold text-white mt-4">Store Hours:</p>
              <p>Monday - Sunday: 9:00 AM - 6:30 PM</p>
              
              <p className="font-semibold text-white mt-4">Phone:</p>
              <p>+84 903 743 132</p>
              
              <p className="font-semibold text-white mt-4">Email:</p>
              <p>quochuyta243@gmail.com</p>
            </div>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition">
                  View Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Custom Orders
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Product Inquiries
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">
                  Jewelry Repair
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Care Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Visit Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Follow Us Section */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-lg mb-4">💛 Follow Us 💛</p>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Kim Thao Trang Jewelry. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}