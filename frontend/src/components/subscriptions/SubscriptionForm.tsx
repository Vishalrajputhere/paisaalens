'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  billingCycle: z.enum(['monthly', 'yearly', 'weekly']),
  startDate: z.string().min(1, 'Start date is required'),
  status: z.enum(['active', 'cancelled']).default('active'),
  autoRenew: z.boolean().default(true),
  notes: z.string().optional()
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  initialData?: any;
  onSubmit: (data: SubscriptionFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CATEGORIES = [
  'Entertainment', 'Software', 'Utilities', 'Gym', 'Education', 'Other'
];

export default function SubscriptionForm({ initialData, onSubmit, onCancel, isLoading }: SubscriptionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: initialData || {
      category: CATEGORIES[0],
      billingCycle: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      autoRenew: true
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            placeholder="e.g. Netflix"
            {...register('name')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            {...register('amount')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            {...register('category')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Billing Cycle</label>
          <select
            {...register('billingCycle')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          {errors.billingCycle && <p className="mt-1 text-xs text-red-500">{errors.billingCycle.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
          <input
            type="date"
            {...register('startDate')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="autoRenew"
              {...register('autoRenew')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoRenew" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Auto Renew Active
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
          <input
            type="text"
            {...register('notes')}
            placeholder="Any details..."
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Subscription'}
        </button>
      </div>
    </form>
  );
}
