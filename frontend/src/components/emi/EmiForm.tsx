'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const emiSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  principalAmount: z.coerce.number().positive('Amount must be positive'),
  interestRate: z.coerce.number().min(0, 'Interest rate cannot be negative'),
  tenureMonths: z.coerce.number().int().positive('Tenure must be a positive integer in months'),
  startDate: z.string().min(1, 'Start date is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  autoDeduct: z.boolean().default(false)
});

export type EmiFormData = z.infer<typeof emiSchema>;

interface EmiFormProps {
  onSubmit: (data: EmiFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EmiForm({ onSubmit, onCancel, isLoading }: EmiFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emiSchema),
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      autoDeduct: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loan Name</label>
          <input
            type="text"
            placeholder="e.g. Car Loan"
            {...register('name')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Name</label>
          <input
            type="text"
            placeholder="e.g. HDFC Bank"
            {...register('bankName')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.bankName && <p className="mt-1 text-xs text-red-500">{errors.bankName.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Principal Amount (₹)</label>
          <input
            type="number"
            {...register('principalAmount')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.principalAmount && <p className="mt-1 text-xs text-red-500">{errors.principalAmount.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Annual Interest Rate (%)</label>
          <input
            type="number"
            step="0.01"
            {...register('interestRate')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.interestRate && <p className="mt-1 text-xs text-red-500">{errors.interestRate.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tenure (Months)</label>
          <input
            type="number"
            {...register('tenureMonths')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.tenureMonths && <p className="mt-1 text-xs text-red-500">{errors.tenureMonths.message as string}</p>}
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

        <div className="md:col-span-2">
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="autoDeduct"
              {...register('autoDeduct')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoDeduct" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Auto-Deduct from account
            </label>
          </div>
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
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Calculate & Save EMI'}
        </button>
      </div>
    </form>
  );
}
