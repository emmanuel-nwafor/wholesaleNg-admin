import React from 'react'
import { Users, Coins, AlertTriangleIcon, DollarSign, LucidePiggyBank } from 'lucide-react'

export default function AdminAnalytics() {
  return (
    <div className="m-4">
      <h1 className="text-xl font-bold mb-6 m-3">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 m-3">
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div className="">
                <h3 className="text-sm text-gray-600 mb-1">Total Users</h3>
                <p className="text-2xl font-bold text-gray-900">0</p>
            </div>

            <Users className="w-8 h-8 text-gray-600" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div className="">
                <h3 className="text-sm text-gray-600 mb-1">Total Coins Purchased</h3>
                <p className="text-2xl font-bold text-gray-900">0</p>
            </div>

            <Coins className="w-8 h-8 text-green-400" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div className="">
                <h3 className="text-sm text-gray-600 mb-1">Pending Reports</h3>
                <p className="text-2xl font-bold text-gray-900">0</p>
            </div>

            <AlertTriangleIcon fill='#989898' className="w-8 h-8 text-white" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div className="">
                <h3 className="text-sm text-gray-600 mb-1">Total Revenue</h3>
                <p className="text-2xl font-bold text-gray-900">0</p>
            </div>

            <LucidePiggyBank className="w-8 h-8 text-gray-900" />
        </div>
      </div>
    </div>
  )
}