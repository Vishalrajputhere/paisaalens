'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Loader2, User, Settings as SettingsIcon, Shield, Bell, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function SettingsPage() {
  const { user, login, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    monthlyIncome: 0,
    currency: 'INR'
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchSettings();
    }
  }, [user, authLoading, router]);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setFormData({
        name: res.data.name,
        email: res.data.email,
        monthlyIncome: res.data.monthlyIncome || 0,
        currency: res.data.currency || 'INR'
      });
    } catch (error) {
      console.error('Failed to fetch settings', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlyIncome' ? Number(value) : value
    }));
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await api.patch('/settings', {
        name: formData.name,
        monthlyIncome: formData.monthlyIncome,
        currency: formData.currency
      });
      // Update global context implicitly if needed, or rely on token refresh
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update settings', error);
      alert('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Account Settings
          </h2>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            Manage your personal profile and application preferences.
          </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-100 dark:bg-gray-800 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700 p-6">
            <nav className="space-y-2">
              <a href="#profile" className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                <User className="w-5 h-5 mr-3" /> Profile
              </a>
              <a href="#notifications" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800 transition-colors font-medium">
                <Bell className="w-5 h-5 mr-3" /> Notifications
              </a>
              <a href="#security" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800 transition-colors font-medium">
                <Shield className="w-5 h-5 mr-3" /> Security
              </a>
            </nav>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-8" id="profile">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h3>
            
            {isSuccess && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-center text-green-800 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
                <p className="font-medium">Settings saved successfully.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 mt-1"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Income (₹)</label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500">Used for savings intelligence heuristics.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="INR">₹ INR - Indian Rupee</option>
                  <option value="USD">$ USD - US Dollar</option>
                  <option value="EUR">€ EUR - Euro</option>
                  <option value="GBP">£ GBP - British Pound</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm disabled:opacity-50 transition-colors"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <SettingsIcon className="w-5 h-5 mr-2" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
