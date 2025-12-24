import Link from 'next/link';
import Carousel from '@/components/Carousel';

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
      <section className="relative bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          
          <h1 className="text-5xl md:text-6xl font-serif text-amber-900 mb-6">
            Welcome to Kim Thao Trang Jewelry
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Discover our exclusive collection of rings, necklaces, bracelets & earrings
          </p>
          <Link 
            href="/products"
            className="inline-block bg-amber-900 text-white px-8 py-3 rounded-md hover:bg-amber-800 transition text-lg font-medium"
          >
            Shop Now
          </Link>
        </div>

        {/* Carousel */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <Carousel />
        </div>
      </section>

      {/* Shop By Category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-center text-amber-900 mb-12">
            Shop By Category
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.name}
                href={category.link}
                className="group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <h3 className="text-xl font-serif text-center text-amber-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-center text-gray-600 group-hover:text-amber-900 transition">
                  Browse
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}