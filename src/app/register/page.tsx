'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, AlertCircle, Check, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('One special character (!@#$%^&*...)');
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const passwordValidationErrors = validatePassword(formData.password);
    if (passwordValidationErrors.length > 0) {
      setError('Please meet all password requirements');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const rateLimitResponse = await fetch('/api/auth/register', {
        method: 'POST',
      });

      if (!rateLimitResponse.ok) {
        const data = await rateLimitResponse.json();
        throw new Error(data.error);
      }

      await signUp(formData.email, formData.password, formData.name);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (): { strength: string; color: string; width: string } => {
    const errors = validatePassword(formData.password);
    const strength = 5 - errors.length;

    if (strength === 0 || formData.password === '') return { strength: 'Weak', color: 'bg-red-500', width: '0%' };
    if (strength <= 2) return { strength: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength <= 3) return { strength: 'Medium', color: 'bg-amber-500', width: '66%' };
    return { strength: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength();

  const requirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(formData.password) },
    { text: 'One lowercase letter (a-z)', met: /[a-z]/.test(formData.password) },
    { text: 'One number (0-9)', met: /[0-9]/.test(formData.password) },
    { text: 'One special character (!@#$...)', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
  ];

  const inputWrapClass = (field: string) =>
    `flex items-center gap-3 px-4 py-3 border rounded-lg transition-all duration-200 ${
      focusedField === field ? 'border-amber-900 ring-2 ring-amber-900/15' : 'border-gray-200'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #f5deb340 0%, transparent 50%), radial-gradient(circle at 80% 70%, #d4af3720 0%, transparent 40%)',
        }}
      />

      <motion.div
        className="max-w-md w-full relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-amber-900 mb-2">Create Account</h1>
          <div className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" style={{ width: '100px' }} />
        </div>

        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2"
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className={inputWrapClass('name')}>
                <User className="w-4 h-4 text-amber-700 shrink-0" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full outline-none text-gray-900 placeholder:text-gray-400 bg-transparent"
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className={inputWrapClass('email')}>
                <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full outline-none text-gray-900 placeholder:text-gray-400 bg-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className={inputWrapClass('password')}>
                <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full outline-none text-gray-900 placeholder:text-gray-400 bg-transparent"
                  placeholder="••••••••"
                />
              </div>

              {/* Strength bar */}
              <AnimatePresence>
                {formData.password && (
                  <motion.div
                    className="mt-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Password Strength:</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength.strength === 'Strong' ? 'text-green-600' :
                        passwordStrength.strength === 'Medium' ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`${passwordStrength.color} h-2 rounded-full`}
                        animate={{ width: passwordStrength.width }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Requirements checklist */}
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-medium text-gray-600">Password must contain:</p>
                {requirements.map((req, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2"
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        req.met ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                      animate={{ scale: req.met ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {req.met && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </motion.div>
                    <span className={`text-xs transition-colors duration-200 ${req.met ? 'text-green-700' : 'text-gray-500'}`}>
                      {req.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className={inputWrapClass('confirmPassword')}>
                <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full outline-none text-gray-900 placeholder:text-gray-400 bg-transparent"
                  placeholder="••••••••"
                />
              </div>
              <AnimatePresence>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <motion.p
                    className="mt-1.5 text-xs text-red-600"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Passwords do not match
                  </motion.p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <motion.p
                    className="mt-1.5 text-xs text-green-600 flex items-center gap-1"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Check className="w-3 h-3" /> Passwords match
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading || passwordErrors.length > 0}
              className="relative overflow-hidden w-full bg-amber-900 text-white py-3.5 rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              whileHover={!loading && passwordErrors.length === 0 ? { scale: 1.01 } : {}}
              whileTap={!loading && passwordErrors.length === 0 ? { scale: 0.98 } : {}}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  <span className="relative">Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 relative" />
                  <span className="relative">Create Account</span>
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-900 hover:text-amber-700 font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}