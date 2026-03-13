'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Loader2, Plus, Calendar, Edit2, Trash2 } from 'lucide-react';
import SubscriptionForm, { SubscriptionFormData } from '@/components/subscriptions/SubscriptionForm';
import { format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout';

export default function SubscriptionsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [subsRes, upcomingRes] = await Promise.all([
        api.get('/subscriptions'),
        api.get('/subscriptions/upcoming?days=30')
      ]);
      setSubscriptions(subsRes.data);
      setUpcoming(upcomingRes.data);
    } catch (error) {
      console.error('Failed to fetch subscriptions', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingSub(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (sub: any) => {
    setEditingSub(sub);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this subscription?')) return;
    try {
      await api.delete(`/subscriptions/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete', error);
      alert('Failed to delete');
    }
  };

  const handleSubmit = async (data: SubscriptionFormData) => {
    try {
      setIsSubmitting(true);
      if (editingSub) {
        await api.patch(`/subscriptions/${editingSub._id}`, data);
      } else {
        await api.post('/subscriptions', data);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save', error);
      alert('Failed to save');
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

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const totalMonthly = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => {
      let monthlyRate = s.amount;
      if (s.billingCycle === 'yearly') monthlyRate = s.amount / 12;
      if (s.billingCycle === 'weekly') monthlyRate = s.amount * 4.33;
      return sum + monthlyRate;
    }, 0);

  return (
    <AppLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
              Subscriptions
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage recurring payments to avoid unexpected charges.
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Subscription
          </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Subscriptions</h3>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{activeCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Monthly Cost</h3>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">₹{totalMonthly.toFixed(0)}</p>
          </div>
        </div>

        {/* Upcoming Renewals */}
        {upcoming.length > 0 && (
          <div className="mb-8 bg-amber-50 rounded-xl border border-amber-200 p-6 dark:bg-amber-900/20 dark:border-amber-700/50">
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-500 flex items-center mb-4">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Renewals (Next 30 Days)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((sub: any) => (
                <div key={sub._id} className="bg-white/60 rounded-lg p-4 border border-amber-100 dark:bg-gray-800/60 dark:border-gray-700">
                  <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                    <span>{sub.name}</span>
                    <span>₹{sub.amount}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                    Renews on {format(new Date(sub.nextBillingDate), 'MMM dd, yyyy')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscriptions List */}
        <div className="bg-white rounded-lg shadow overflow-hidden dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : subscriptions.length === 0 ? (
             <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No subscriptions added yet.
            </div>
          ) : (
             <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {subscriptions.map(sub => (
                <li key={sub._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mr-2">{sub.name}</h4>
                      {sub.status === 'active' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Cancelled</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      ₹{sub.amount} / {sub.billingCycle} • Next bill: {format(new Date(sub.nextBillingDate), 'MMM dd, yyyy')}
                    </p>
                    {sub.notes && <p className="mt-1 text-xs text-gray-400 bg-gray-50 p-2 rounded-md dark:bg-gray-700/50">{sub.notes}</p>}
                  </div>
                  <div className="mt-4 sm:mt-0 flex space-x-2">
                    <button onClick={() => handleEditClick(sub)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(sub._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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
                {editingSub ? 'Edit Subscription' : 'Add New Subscription'}
              </h3>
              <SubscriptionForm
                initialData={editingSub ? {
                  name: editingSub.name,
                  amount: editingSub.amount,
                  category: editingSub.category,
                  billingCycle: editingSub.billingCycle,
                  startDate: new Date(editingSub.startDate).toISOString().split('T')[0],
                  status: editingSub.status,
                  autoRenew: editingSub.autoRenew,
                  notes: editingSub.notes
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
