'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import ExpenseList, { Expense } from '@/components/expenses/ExpenseList';
import ExpenseForm, { ExpenseFormData } from '@/components/expenses/ExpenseForm';
import { Loader2, Plus } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function ExpensesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchExpenses();
    }
  }, [user, authLoading, router]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/expenses');
      setExpenses(res.data.items);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error('Failed to delete expense', error);
      alert('Failed to delete expense');
    }
  };

  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      setIsSubmitting(true);
      if (editingExpense) {
        await api.patch(`/expenses/${editingExpense._id}`, data);
      } else {
        await api.post('/expenses', data);
      }
      setIsModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error('Failed to save expense', error);
      alert('Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (!user && isLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
              Expenses
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your daily transactions and spending.
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Expense
          </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow dark:bg-gray-800">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <ExpenseList
              expenses={expenses}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block p-6 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-gray-800">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 dark:text-white">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <ExpenseForm
                initialData={editingExpense ? {
                  amount: editingExpense.amount,
                  category: editingExpense.category,
                  date: new Date(editingExpense.date).toISOString().split('T')[0],
                  description: editingExpense.description,
                  paymentMethod: editingExpense.paymentMethod,
                  merchant: editingExpense.merchant || '',
                } : undefined}
                onSubmit={handleSubmit}
                onCancel={() => setIsModalOpen(false)}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
