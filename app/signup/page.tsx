'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SharedLayout from '@/components/Layout/SharedLayout';
import { BackButton } from '@/components/ui/back-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { success, error } = await signUp(email, password, fullName);
      
      if (!success) {
        throw error || new Error('Failed to sign up');
      }
      
      router.push('/');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SharedLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Geometric Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-purple-300/20 to-pink-300/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-300/20 to-green-300/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Left Section - Signup Form */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-1/2 p-8 bg-white/80 backdrop-blur-lg relative"
        >
          <div className="mb-6">
            <BackButton />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-md mx-auto mt-12"
          >
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-wide">
              Create Account
            </h2>
            <p className="text-gray-600 mb-8 font-tomorrow text-lg">
              Start your 7-day free trial. No credit card required.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-white/50 backdrop-blur-sm border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-300 font-tomorrow"
                  required
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/50 backdrop-blur-sm border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-300 font-tomorrow"
                  required
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-white/50 backdrop-blur-sm border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-300 font-tomorrow"
                  required
                />
              </motion.div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded text-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="space-y-6"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] font-medium"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500 font-medium">Or</span>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600 font-tomorrow">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-green-600 hover:text-green-500 font-medium hover:underline transition-all duration-300"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>

        {/* Right Section - Image and Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-1/2 relative bg-[url('/images/auth-bg.jpg')] bg-cover bg-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center text-white max-w-md p-8"
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent tracking-wider leading-tight">
                Join our creative community
              </h2>
              <p className="text-xl font-tomorrow text-gray-200 leading-relaxed">
                Get access to powerful design tools and connect with designers worldwide.
              </p>
            </motion.div>
          </div>

          {/* Animated Geometric Shapes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-[20%] right-[10%] w-64 h-64 border border-white/20 rounded-full"
            />
            <motion.div
              animate={{
                rotate: -360,
                scale: [1.2, 1, 1.2],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-[30%] left-[20%] w-32 h-32 border border-white/10 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </SharedLayout>
  );
} 