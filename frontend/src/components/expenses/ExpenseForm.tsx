'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const expenseSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  merchant: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  initialData?: ExpenseFormData;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CATEGORIES = [
  'Food', 'Rent', 'Groceries', 'UPI Transfer', 'Electricity',
  'Travel', 'Shopping', 'Medical', 'EMI', 'Entertainment',
  'Subscriptions', 'Education', 'Other'
];

const PAYMENT_METHODS = [
  'UPI', 'Debit Card', 'Credit Card', 'Cash', 'Wallet', 'Net Banking'
];

export default function ExpenseForm({ initialData, onSubmit, onCancel, isLoading }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      category: CATEGORIES[0],
      paymentMethod: PAYMENT_METHODS[0],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            {...register('amount')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            {...register('date')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            {...register('category')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
          <select
            {...register('paymentMethod')}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {PAYMENT_METHODS.map(method => <option key={method} value={method}>{method}</option>)}
          </select>
          {errors.paymentMethod && <p className="mt-1 text-xs text-red-500">{errors.paymentMethod.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Merchant (Optional)</label>
          <input
            type="text"
            {...register('merchant')}
            placeholder="e.g. Swiggy, Amazon"
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <input
            type="text"
            {...register('description')}
            placeholder="Dinner with friends..."
            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
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
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Expense'}
        </button>
      </div>
    </form>
  );
}
