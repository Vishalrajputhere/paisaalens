'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  monthlyIncome: z.union([z.string(), z.number()]).optional().transform(v => !v ? undefined : Number(v)),
  currency: z.string().default('INR'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      currency: 'INR',
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      const response = await api.post('/auth/register', data);
      login(response.data.token, response.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Start tracking your finances today</p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Akshay Kumar"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

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
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Income (Optional)</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">₹</span>
            </div>
            <input
              type="number"
              {...register('monthlyIncome')}
              className="w-full py-2 pl-8 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="50000"
            />
          </div>
          {errors.monthlyIncome && <p className="mt-1 text-xs text-red-500">{errors.monthlyIncome.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
        </button>
      </form>

      <div className="text-sm text-center text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Sign in
        </Link>
      </div>
    </div>
  );
}
