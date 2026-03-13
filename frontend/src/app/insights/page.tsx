'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Loader2, LightbulbIcon, AlertTriangle, Info, CheckCircle2, TrendingUp, TrendingDown, Bell } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function InsightsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchInsights();
    }
  }, [user, authLoading, router]);

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/insights');
      setInsights(res.data);
    } catch (error) {
      console.error('Failed to fetch insights', error);
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

  const getIcon = (type: string, title: string) => {
    if (title.toLowerCase().includes('spike')) return <TrendingUp className="w-6 h-6" />;
    if (type === 'warning') return <AlertTriangle className="w-6 h-6" />;
    if (type === 'success') return <CheckCircle2 className="w-6 h-6" />;
    return <Info className="w-6 h-6" />;
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/50 dark:text-amber-500';
      case 'success': return 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:border-green-700/50 dark:text-green-500';
      default: return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700/50 dark:text-blue-500';
    }
  };

  return (
    <AppLayout>
      <div className="py-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-center mb-8">
            <div className="bg-blue-100 p-3 rounded-full mr-4 dark:bg-blue-900/40">
            <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
              Smart Insights
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              AI-driven observations on your spending patterns and financial health.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : insights.length === 0 ? (
          <div className="bg-white rounded-xl shadow px-6 py-16 text-center border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">All Good!</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              No immediate alerts or spending abnormalities detected. Keep up the good habits.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div 
                key={insight.id} 
                className={`rounded-xl shadow-sm border p-6 flex items-start transition-all hover:shadow-md ${getColors(insight.type)}`}
              >
                <div className="flex-shrink-0 mr-4 mt-1">
                  {getIcon(insight.type, insight.title)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">
                    {insight.title}
                  </h3>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">
                    {insight.message}
                  </p>
                  
                  {insight.actionRequired && insight.title.includes('Renewals') && (
                    <button 
                      onClick={() => router.push('/subscriptions')}
                      className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-semibold rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      Manage Subscriptions
                    </button>
                  )}
                  {insight.title.includes('Budget') && (
                    <button 
                      onClick={() => router.push('/budgets')}
                      className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-semibold rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Review Budgets
                    </button>
                  )}
                  {insight.title.includes('Spike') && (
                    <button 
                      onClick={() => router.push('/expenses')}
                      className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-semibold rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      View Expenses
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </AppLayout>
  );
}
