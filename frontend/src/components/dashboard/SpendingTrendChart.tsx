'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface TrendData {
  date: string;
  amount: number;
}

interface Props {
  data: TrendData[];
}

export default function SpendingTrendChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        No data available for this period.
      </div>
    );
  }

  // Format dates for X-axis
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM dd')
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="formattedDate" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `₹${value}`}
            dx={-10}
          />
          <Tooltip 
            formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Spent']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} 
            activeDot={{ r: 6, strokeWidth: 0 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
