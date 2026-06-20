'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, AlertCircle, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const rateLimitResponse = await fetch('/api/auth/login', {
        method: 'POST',
      });

      if (!rateLimitResponse.ok) {
        const data = await rateLimitResponse.json();
        throw new Error(data.error);
      }

      await signIn(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const inputWrapClass = (field: string) =>
    `flex items-center gap-3 px-4 py-3 border rounded-lg transition-all duration-200 ${
      focusedField === field ? 'border-amber-900 ring-2 ring-amber-900/15' : 'border-gray-200'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white py-12 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #f5deb340 0%, transparent 50%), radial-gradient(circle at 80% 70%, #d4af3720 0%, transparent 40%)',
        }}
      />

      <motion.div
        className="max-w-md w-full space-y-8 relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <h2 className="text-center text-4xl font-serif text-amber-900">
            Welcome Back
          </h2>
          <div className="mx-auto my-3 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" style={{ width: '100px' }} />
          <p className="text-center text-gray-500">
            Sign in to your account
          </p>
        </div>

        <motion.form
          className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-amber-100"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <AnimatePresence>
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className={inputWrapClass('email')}>
                <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full outline-none text-gray-900 placeholder:text-gray-400 bg-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className={inputWrapClass('password')}>
                <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full outline-none text-gray-900 placeholder:text-gray-400 bg-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="relative overflow-hidden w-full bg-amber-900 text-white py-3.5 rounded-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
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
                <span className="relative">Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 relative" />
                <span className="relative">Sign In</span>
              </>
            )}
          </motion.button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-amber-900 hover:text-amber-700 font-medium transition-colors">
              Create one here
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}