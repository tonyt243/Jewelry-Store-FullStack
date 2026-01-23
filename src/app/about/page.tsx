import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-amber-900 mb-4">
            About Us
          </h1>
          <p className="text-xl text-gray-700">
            A Legacy of Excellence Since 2002
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-lg shadow-lg p-12 mb-12">
          <h2 className="text-4xl font-serif text-amber-900 mb-8 text-center">
            Our Story
          </h2>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed">
              Founded in <strong>2002</strong>, Kim Thao Trang Jewelry represents over two decades of passion, 
              dedication, and expertise in fine jewelry. Our journey began with a young apprentice's dream 
              and has blossomed into a trusted name in Ho Chi Minh City's jewelry industry.
            </p>

            <p className="text-lg leading-relaxed">
              Our founder spent <strong>10 years</strong> learning the intricate art of jewelry from her mother, 
              mastering every aspect of the craft—from selecting the finest materials to understanding what 
              makes each piece truly special. This decade of apprenticeship wasn't just about learning 
              techniques; it was about inheriting a legacy of quality, trust, and genuine care for customers.
            </p>

            <p className="text-lg leading-relaxed">
              With her mentor's blessing and a commitment to excellence, she opened Kim Thao Trang Jewelry, 
              bringing her vision to life: to offer <strong>exceptional quality at affordable prices</strong>. 
              Every piece in our collection reflects this philosophy—carefully selected, expertly crafted, 
              and priced with fairness.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">💎</div>
            <h3 className="text-2xl font-serif text-amber-900 mb-4">
              Quality First
            </h3>
            <p className="text-gray-700">
              We never compromise on quality. Each piece is carefully selected and inspected 
              to meet our rigorous standards of excellence.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-2xl font-serif text-amber-900 mb-4">
              Expert Craftsmanship
            </h3>
            <p className="text-gray-700">
              With over 30 years of combined experience, our critical eye for detail ensures 
              every piece meets the highest standards of craftsmanship.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">❤️</div>
            <h3 className="text-2xl font-serif text-amber-900 mb-4">
              Affordable Luxury
            </h3>
            <p className="text-gray-700">
              Beautiful jewelry shouldn't be out of reach. We believe in fair pricing 
              that makes quality accessible to everyone.
            </p>
          </div>
        </div>

        {/* Our Commitment */}
        <div className="bg-amber-900 text-white rounded-lg shadow-lg p-12 mb-12">
          <h2 className="text-4xl font-serif mb-6 text-center">
            Our Commitment to You
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg leading-relaxed mb-6">
              Every piece of jewelry tells a story, and we're honored to be part of yours. 
              Whether you're celebrating a milestone, expressing love, or simply treating yourself, 
              we ensure that your experience with us is as memorable as the jewelry itself.
            </p>
            <p className="text-lg leading-relaxed">
              From selection to service, we bring the same care and attention that has been passed 
              down through generations. When you choose Kim Thao Trang Jewelry, you're not just 
              buying jewelry—you're becoming part of our family's legacy.
            </p>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-4xl font-serif text-amber-900 mb-6">
            Visit Our Store
          </h2>
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
            <Link
              href="/contact"
              className="bg-amber-900 text-white px-8 py-3 rounded-md hover:bg-amber-800 transition transform hover:scale-105 text-lg font-medium"
            >
              Contact Us
            </Link>
            <Link
              href="/products"
              className="border-2 border-amber-900 text-amber-900 px-8 py-3 rounded-md hover:bg-amber-50 transition transform hover:scale-105 text-lg font-medium"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}