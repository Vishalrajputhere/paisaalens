'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Loader2, Plus, Building2, Trash2, CheckCircle2 } from 'lucide-react';
import EmiForm, { EmiFormData } from '@/components/emi/EmiForm';
import AppLayout from '@/components/layout/AppLayout';

export default function EMIPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [emis, setEmis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      const res = await api.get('/emi');
      setEmis(res.data);
    } catch (error) {
      console.error('Failed to fetch EMIs', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this EMI tracking?')) return;
    try {
      await api.delete(`/emi/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete', error);
      alert('Failed to delete');
    }
  };

  const handlePay = async (id: string) => {
    try {
      await api.post(`/emi/${id}/pay`);
      fetchData(); // refresh to show updated remaining amount constraints
    } catch (error) {
      console.error('Failed to record payment', error);
      alert('Failed to record payment');
    }
  };

  const handleSubmit = async (data: EmiFormData) => {
    try {
      setIsSubmitting(true);
      await api.post('/emi', data);
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

  return (
    <AppLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
              EMI Tracking
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Compute and track your loan amortizations efficiently.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add EMI
          </button>
          </div>
        </div>

        {/* EMI Grid Map */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : emis.length === 0 ? (
          <div className="bg-white rounded-lg shadow px-6 py-16 text-center dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No active EMIs tracked</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Add an EMI to see your payment progress and interest limits.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emis.map((emi) => {
              const progressPct = (emi.paidInstallments / emi.tenureMonths) * 100;

              return (
                <div key={emi._id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col relative dark:bg-gray-800 ${!emi.active ? 'opacity-70 grayscale border-gray-200' : 'border-gray-100 dark:border-gray-700'}`}>
                  {!emi.active && (
                    <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{emi.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Building2 className="w-4 h-4 mr-1" />
                        {emi.bankName}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">Monthly EMI</span>
                      <span className="block text-lg font-bold text-gray-900 dark:text-white">₹{emi.emiAmount.toFixed(0)}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">Balance Left</span>
                      <span className="block text-lg font-bold text-gray-900 dark:text-white">₹{emi.remainingAmount.toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {emi.paidInstallments} / {emi.tenureMonths} Months
                      </span>
                      <span className="font-medium text-gray-500">{progressPct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden mb-4">
                      <div 
                        className={`h-2.5 rounded-full ${emi.active ? 'bg-blue-600' : 'bg-green-500'}`} 
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>

                    <div className="flex space-x-2">
                       {emi.active && (
                         <button 
                           onClick={() => handlePay(emi._id)}
                           className="flex-1 bg-white border border-gray-300 text-gray-700 py-1.5 px-3 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                         >
                           Log Payment
                         </button>
                       )}
                       <button 
                         onClick={() => handleDelete(emi._id)}
                         className={`p-1.5 text-gray-400 hover:text-red-600 transition-colors border border-transparent rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 ${!emi.active && 'flex-1 border-gray-300 hover:border-red-200'}`}
                       >
                         <Trash2 className="w-5 h-5 mx-auto" />
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Write EMI configuration modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block p-6 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-gray-800">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 dark:text-white">
                Register New EMI
              </h3>
              <EmiForm
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
