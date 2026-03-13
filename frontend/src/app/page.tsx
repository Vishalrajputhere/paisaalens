import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, PieChart, TrendingUp, ShieldCheck, Wallet } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-orange-500/30">
      
      {/* Navigation Bar */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">
                ₹
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                PaisaaLens
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-rose-500 rounded-full hover:from-orange-600 hover:to-rose-600 shadow-md shadow-orange-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-lighten"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-8 border border-orange-200 dark:border-orange-800/50">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
              Built for the Indian Middle Class
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
              Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Paisaa.</span><br />
              Secure Your Future.
            </h1>
            
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The all-in-one financial dashboard that understands your EMIs, tracks your UPI spending, and plans your investments with intelligent Indian heuristic models.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 shadow-xl transition-all group">
                Start Tracking Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 sm:ml-4">
                No credit card required.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 dark:bg-gray-900/50 py-24 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Everything you need to grow wealth</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Desi solutions for your daily financial management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6">
                  <PieChart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">50-30-20 Rule Engine</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Automatically classify your income into Needs, Wants, and Savings using our pre-configured Indian heuristic model.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Wallet className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart EMI Tracking</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your home loans, car loans, and consumer durables EMIs in one place. Never miss a payment date.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Actionable Insights</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get daily alerts on spending spikes, subscription renewals, and customized advice to optimize your savings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-900 dark:bg-black"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-rose-600/20"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <ShieldCheck className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Take control of your finances today.
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of Indians building a secure financial future with PaisaaLens.
            </p>
            <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-900 bg-white rounded-full hover:bg-gray-100 shadow-xl transition-transform hover:scale-105">
              Create Free Account
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              PaisaaLens
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} PaisaaLens. Built for India. ❤️
          </div>
        </div>
      </footer>
    </div>
  );
}
