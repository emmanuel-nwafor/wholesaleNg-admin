"use client"

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 1, transactions: 150 },
  { day: 2, transactions: 250 },
  { day: 3, transactions: 100 },
  { day: 4, transactions: 300 },
  { day: 5, transactions: 200 },
  { day: 6, transactions: 180 },
  { day: 7, transactions: 220 },
  { day: 8, transactions: 120 },
  { day: 9, transactions: 280 },
  { day: 10, transactions: 160 },
  { day: 11, transactions: 240 },
  { day: 12, transactions: 90 },
  { day: 13, transactions: 320 },
  { day: 14, transactions: 190 },
  { day: 15, transactions: 260 },
  { day: 16, transactions: 110 },
  { day: 17, transactions: 290 },
  { day: 18, transactions: 170 },
  { day: 19, transactions: 230 },
  { day: 20, transactions: 140 },
  { day: 21, transactions: 270 },
  { day: 22, transactions: 130 },
  { day: 23, transactions: 310 },
  { day: 24, transactions: 210 },
  { day: 25, transactions: 190 },
  { day: 26, transactions: 250 },
  { day: 27, transactions: 80 },
  { day: 28, transactions: 340 },
  { day: 29, transactions: 200 },
  { day: 30, transactions: 160 },
]

export default function TransactionsBarChart() {
  return (
    <div className="m-4 p-4 bg-white rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Total Transactions</h2>
        <select className="px-3 py-1 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Daily ▼</option>
        </select>
      </div>

      <div className="border border-gray-100 rounded-3xl h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px' }}
              labelStyle={{ fontSize: '12px' }}
            />
            <Bar dataKey="transactions" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}