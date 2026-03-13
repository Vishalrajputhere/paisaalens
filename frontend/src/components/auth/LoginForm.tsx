'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      const response = await api.post('/auth/login', data);
      login(response.data.token, response.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your PaisaaLens account</p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
        </button>
      </form>

      <div className="text-sm text-center text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Sign up
        </Link>
      </div>
    </div>
  );
}
