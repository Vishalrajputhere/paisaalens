'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  monthlyLimit: z.coerce.number().positive('Limit must be a positive number'),
  alertsEnabled: z.boolean().default(true),
  alertThreshold: z.coerce.number().min(1).max(100).default(80)
});

export type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  initialData?: any;
  onSubmit: (data: BudgetFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CATEGORIES = [
  'Food', 'Rent', 'Groceries', 'UPI Transfer', 'Electricity',
  'Travel', 'Shopping', 'Medical', 'EMI', 'Entertainment',
  'Subscriptions', 'Education', 'Other'
];

export default function BudgetForm({ initialData, onSubmit, onCancel, isLoading }: BudgetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: initialData || {
      categoryId: CATEGORIES[0],
      monthlyLimit: 0,
      alertsEnabled: true,
      alertThreshold: 80
    },
  });

  const alertsEnabled = watch('alertsEnabled');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <select
          {...register('categoryId')}
          className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Limit (₹)</label>
        <input
          type="number"
          step="0.01"
          {...register('monthlyLimit')}
          className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.monthlyLimit && <p className="mt-1 text-xs text-red-500">{errors.monthlyLimit.message as string}</p>}
      </div>

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="alertsEnabled"
          {...register('alertsEnabled')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="alertsEnabled" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          Enable Alerts
        </label>
      </div>

      {alertsEnabled && (
        <div className="pl-6 border-l-2 border-blue-500 mt-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alert Threshold (%)</label>
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="range"
              min="1"
              max="100"
              {...register('alertThreshold')}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
              {watch('alertThreshold')}%
            </span>
          </div>
          {errors.alertThreshold && <p className="mt-1 text-xs text-red-500">{errors.alertThreshold.message as string}</p>}
        </div>
      )}

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
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Budget'}
        </button>
      </div>
    </form>
  );
}
