'use client';

import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';

export interface Expense {
  _id: string;
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  date: string;
  merchant: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        No expenses found for this period.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Description</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Category</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Payment</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Amount</th>
            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
          {expenses.map((expense) => (
            <tr key={expense._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                <div className="font-medium">{expense.description}</div>
                {expense.merchant && <div className="text-xs text-gray-500 dark:text-gray-500">{expense.merchant}</div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {expense.paymentMethod}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right dark:text-white">
                ₹{expense.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button onClick={() => onEdit(expense)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(expense._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
