'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Loader2, Download, FileText, Calendar, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [period, setPeriod] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      // Native fetch for blob downloading since axios abstracting files can be tricky
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/reports/monthly?period=${period}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Convert to blob
      const blob = await response.blob();
      
      // Create a temporary link to trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PaisaaLens_Report_${period}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Financial Reports
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Generate and download comprehensive PDF summaries of your monthly transactions and category breakdowns.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 max-w-xl mx-auto">
          
          <div className="space-y-6 flex flex-col items-center">
            
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Statement Month
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400 border-none" />
                </div>
                <input
                  type="month"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div className="w-full pt-4">
              <button
                onClick={handleDownload}
                disabled={isDownloading || !period}
                className="w-full flex justify-center items-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md disabled:opacity-50 transition-all hover:shadow-lg disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <><Loader2 className="w-6 h-6 animate-spin mr-3" /> Compiling PDF...</>
                ) : (
                  <><Download className="w-6 h-6 mr-3" /> Download Monthly Report</>
                )}
              </button>
            </div>

          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Report Includes:</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2"/> Executive financial summary</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2"/> Grouped category spending</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2"/> Detailed line-by-line transactions</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2"/> Ready-to-print format</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
