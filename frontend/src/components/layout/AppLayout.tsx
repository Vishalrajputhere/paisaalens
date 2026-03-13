'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';
import { 
  BarChart3, 
  CreditCard, 
  Home, 
  LineChart, 
  Menu, 
  PieChart, 
  Settings, 
  Upload, 
  X,
  IndianRupee,
  LogOut,
  Bell
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Expenses', href: '/expenses', icon: CreditCard },
  { name: 'Budgets', href: '/budgets', icon: PieChart },
  { name: 'Invest & EMIs', href: '/emi', icon: IndianRupee },
  { name: 'Subscriptions', href: '/subscriptions', icon: BarChart3 },
  { name: 'Insights', href: '/insights', icon: LineChart },
  { name: 'Import Data', href: '/import', icon: Upload },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col dark:bg-gray-800 dark:border-gray-700 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">₹</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">PaisaaLens</span>
          </Link>
          <button 
            className="p-1 text-gray-500 rounded-lg hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
             <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center px-3 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-shadow">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate dark:text-gray-400">{user?.email || 'user@example.com'}</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:hidden dark:bg-gray-800 dark:border-gray-700">
          <button
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">PaisaaLens</span>
          <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <Bell className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto w-full bg-slate-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
          <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
