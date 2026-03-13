'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Loader2, Plus, ArrowRight } from 'lucide-react';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import SpendingTrendChart from '@/components/dashboard/SpendingTrendChart';
import Link from 'next/link';
import { format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [summary, setSummary] = useState({ totalSpent: 0 });
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [sumRes, catRes, trendRes, recentRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/categories'),
        api.get('/analytics/trend'),
        api.get('/analytics/recent?limit=5')
      ]);

      setSummary(sumRes.data);
      setCategories(catRes.data);
      setTrends(trendRes.data);
      setRecentTx(recentRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (!user && isLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const savings = Math.max(0, (user?.monthlyIncome || 0) - summary.totalSpent);

  return (
    <AppLayout>
      <div className="pb-12">
        <main className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Dashboard</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your monthly financial summary and insights.</p>
            </div>
          <button 
            onClick={() => router.push('/expenses')}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Expense
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-bl-full -mr-8 -mt-8 opacity-50 dark:bg-red-900/20 transition-transform group-hover:scale-110"></div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent This Month</h3>
            <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white relative z-10">
              {user?.currency === 'USD' ? '$' : '₹'}{summary.totalSpent.toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -mr-8 -mt-8 opacity-50 dark:bg-blue-900/20 transition-transform group-hover:scale-110"></div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Income</h3>
            <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white relative z-10">
              {user?.currency === 'USD' ? '$' : '₹'}{(user?.monthlyIncome || 0).toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-bl-full -mr-8 -mt-8 opacity-50 dark:bg-green-900/20 transition-transform group-hover:scale-110"></div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Savings</h3>
            <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white relative z-10">
              {user?.currency === 'USD' ? '$' : '₹'}{savings.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Charts & Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-white">Category Distribution</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-72">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <CategoryPieChart data={categories} />
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-white">Spending Trend (Last 7 Days)</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-72">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <SpendingTrendChart data={trends} />
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            <Link href="/expenses" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center group dark:text-blue-400">
              View all 
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {isLoading ? (
             <div className="flex justify-center items-center py-12">
               <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
             </div>
          ) : recentTx.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No recent transactions found. start adding expenses!
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentTx.map((tx: any) => (
                <li key={tx._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex justify-center items-center font-bold text-sm mr-4 dark:bg-blue-900/30 dark:text-blue-400">
                        {tx.category.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(tx.date), 'MMM dd, yyyy')} • {tx.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      -₹{tx.amount.toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
    </AppLayout>
  );
}
