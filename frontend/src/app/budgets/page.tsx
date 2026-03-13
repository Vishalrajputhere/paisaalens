'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Loader2, Plus, AlertTriangle, CheckCircle2, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import BudgetForm, { BudgetFormData } from '@/components/budgets/BudgetForm';
import AppLayout from '@/components/layout/AppLayout';

export default function BudgetsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [budgets, setBudgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchBudgets();
    }
  }, [user, authLoading, router]);

  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/budgets');
      setBudgets(res.data);
    } catch (error) {
      console.error('Failed to fetch budgets', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (budget: any) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this budget?')) return;
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (error) {
      console.error('Failed to delete budget', error);
      alert('Failed to delete budget');
    }
  };

  const handleSubmit = async (data: BudgetFormData) => {
    try {
      setIsSubmitting(true);
      await api.post('/budgets', data);
      setIsModalOpen(false);
      fetchBudgets();
    } catch (error) {
      console.error('Failed to save budget', error);
      alert('Failed to save budget');
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
              Budgets
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Set limits for different categories and stay on track.
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Budget
          </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-white rounded-lg shadow px-6 py-16 text-center dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No budgets configured yet</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">It's highly recommended to set monthly limits for main spending categories.</p>
            <button onClick={handleAddClick} className="mt-4 text-blue-600 hover:text-blue-500 font-medium">Create your first budget</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map(budget => (
              <div key={budget._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700 relative flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {budget.categoryId}
                    </span>
                    <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">₹{budget.spent.toFixed(0)} <span className="text-sm font-normal text-gray-500">of ₹{budget.monthlyLimit.toLocaleString()}</span></h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEditClick(budget)} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(budget._id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {budget.progress.toFixed(0)}% Used
                    </span>
                    {budget.isExceeded ? (
                      <span className="flex items-center text-red-600 font-medium text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Exceeded
                      </span>
                    ) : budget.isAlertTriggered ? (
                      <span className="flex items-center text-amber-500 font-medium text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Warning
                      </span>
                    ) : (
                      <span className="flex items-center text-green-600 font-medium text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        On Track
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full ${budget.isExceeded ? 'bg-red-500' : budget.isAlertTriggered ? 'bg-amber-500' : 'bg-green-500'}`} 
                      style={{ width: `${budget.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
                {editingBudget ? 'Edit Budget' : 'Add New Budget'}
              </h3>
              <BudgetForm
                initialData={editingBudget ? {
                  categoryId: editingBudget.categoryId,
                  monthlyLimit: editingBudget.monthlyLimit,
                  alertsEnabled: editingBudget.alertsEnabled,
                  alertThreshold: editingBudget.alertThreshold
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
