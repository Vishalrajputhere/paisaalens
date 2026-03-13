'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Loader2, UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function ImportPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Upload, 2: Map, 3: Result
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [mapping, setMapping] = useState({
    date: '',
    description: '',
    amount: ''
  });
  
  const [importResult, setImportResult] = useState<{ imported: number, errors: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a valid CSV file.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      await fetchHeaders(selectedFile);
    }
  };

  const fetchHeaders = async (selectedFile: File) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const res = await api.post('/upload/headers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setHeaders(res.data.headers);
      
      // Auto-guess mapping if possible
      const guessMapping = { date: '', description: '', amount: '' };
      res.data.headers.forEach((h: string) => {
        if (h.includes('date') || h.includes('time')) guessMapping.date = h;
        if (h.includes('desc') || h.includes('narration') || h.includes('particulars')) guessMapping.description = h;
        if (h.includes('amount') || h.includes('debit') || h.includes('withdrawal')) guessMapping.amount = h;
      });
      
      setMapping({
        date: guessMapping.date || res.data.headers[0] || '',
        description: guessMapping.description || res.data.headers[1] || '',
        amount: guessMapping.amount || res.data.headers[2] || ''
      });
      
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to read CSV headers.');
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    if (!mapping.date || !mapping.description || !mapping.amount) {
      setError('Please map all required fields.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mappings', JSON.stringify(mapping));
      
      const res = await api.post('/upload/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setImportResult(res.data.result);
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to import transactions.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setHeaders([]);
    setStep(1);
    setImportResult(null);
    setMapping({ date: '', description: '', amount: '' });
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
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Import Bank Statements
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Upload your monthly bank statement CSV to auto-categorize and track expenses.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
             <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>1</div>
             <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
             <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>2</div>
             <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
             <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>3</div>
          </div>
          <div className="flex justify-center space-x-12 mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
             <span className={step >= 1 ? 'text-blue-600' : ''}>Upload</span>
             <span className={step >= 2 ? 'text-blue-600' : ''}>Map Columns</span>
             <span className={step >= 3 ? 'text-blue-600' : ''}>Result</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8">
          
          {error && (
            <div className="mb-6 p-4 rounded-md bg-red-50 text-red-800 flex items-start dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="text-center py-10">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex justify-center mb-4">
                   <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                     <UploadCloud className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                   </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Click to upload CSV</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop your bank statement here</p>
                <p className="text-xs text-gray-400 mt-4">Max file size: 5MB</p>
              </div>

              {isLoading && (
                <div className="mt-6 flex flex-col items-center justify-center text-blue-600">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  <span className="text-sm font-medium">Reading file headers...</span>
                </div>
              )}
            </div>
          )}

          {step === 2 && file && (
            <div>
              <div className="flex items-center mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <FileText className="w-6 h-6 text-gray-400 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button 
                  onClick={() => setStep(1)} 
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Change File
                </button>
              </div>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Map CSV Columns</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Match the required expense fields with the corresponding columns from your bank statement.
              </p>

              <div className="space-y-6">
                {/* Date Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Transaction Date <span className="text-red-500">*</span></label>
                  </div>
                  <div className="md:col-span-2">
                    <select
                      value={mapping.date}
                      onChange={(e) => setMapping({...mapping, date: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="" disabled>Select column...</option>
                      {headers.map(h => <option key={`date-${h}`} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>

                {/* Description Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Description / Narration <span className="text-red-500">*</span></label>
                  </div>
                  <div className="md:col-span-2">
                    <select
                      value={mapping.description}
                      onChange={(e) => setMapping({...mapping, description: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="" disabled>Select column...</option>
                      {headers.map(h => <option key={`desc-${h}`} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>

                {/* Amount Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 pb-2">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Amount / Withdrawal <span className="text-red-500">*</span></label>
                  </div>
                  <div className="md:col-span-2">
                    <select
                      value={mapping.amount}
                      onChange={(e) => setMapping({...mapping, amount: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="" disabled>Select column...</option>
                      {headers.map(h => <option key={`amount-${h}`} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={handleImport}
                  disabled={isLoading || !mapping.date || !mapping.description || !mapping.amount}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Importing...</>
                  ) : (
                    <>Start Import <ArrowRight className="w-5 h-5 ml-2" /></>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && importResult && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                  <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Import Successful!</h3>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 inline-block text-left mb-8 min-w-[300px]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Successfully Imported</span>
                  <span className="text-xl font-bold text-green-600">{importResult.imported}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Skipped/Errors</span>
                  <span className="text-xl font-bold text-red-500">{importResult.errors}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => router.push('/expenses')}
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors"
                >
                  View Expenses
                </button>
                <button
                  onClick={resetImport}
                  className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Import Another File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
