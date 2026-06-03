import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto animate-fadeUp">

        {/* 404 */}
        <div className="relative mb-8 select-none">
          <p className="text-[10rem] font-serif font-bold text-amber-100 leading-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-serif text-amber-900 mb-3">
          Page Not Found
        </h1>
        <div
          className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-5"
          style={{ width: '100px' }}
        />
        <p className="text-gray-500 mb-10 leading-relaxed">
          Looks like this page got lost. Let's get you back to something beautiful.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-amber-900 text-white px-7 py-3 rounded-lg hover:bg-amber-800 hover:scale-105 active:scale-95 transition-all font-medium"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border-2 border-amber-900 text-amber-900 px-7 py-3 rounded-lg hover:bg-amber-50 hover:scale-105 active:scale-95 transition-all font-medium"
          >
            Browse Collection
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        .animate-fadeUp { animation: fadeUp 0.7s ease-out forwards; }
        .animate-float  { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}