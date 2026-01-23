import Link from 'next/link';
import Image from 'next/image';

export default function ServicesPage() {
  const services = [
    {
      title: 'Daily Care',
      description: 'Keep your jewelry sparkling with regular cleaning and maintenance tips.',
      image: '/images/dailycare.webp',
    },
    {
      title: 'Resizing',
      description: 'Get the perfect fit for your rings or bracelets with our resizing service.',
      image: '/images/resizing.webp',
    },
    {
      title: 'Repairing',
      description: 'Restore broken or damaged jewelry to its original beauty.',
      image: '/images/repair.webp',
    },
    {
      title: 'Personalize',
      description: 'Make it truly yours with engraving and custom design options.',
      image: '/images/personalize.webp',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-amber-900 mb-4">
            Services
          </h1>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group"
            >
              {/* Service Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>

              {/* Service Info */}
              <div className="p-8 text-center">
                <h3 className="text-2xl font-serif text-amber-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-amber-900 text-white px-6 py-3 rounded-md hover:bg-amber-800 transition transform hover:scale-105"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-lg shadow-lg p-12">
          <h2 className="text-3xl font-serif text-amber-900 mb-4">
            Need Help With Your Jewelry?
          </h2>
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
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}