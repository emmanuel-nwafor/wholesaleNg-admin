import React from "react";
import { CircleDollarSign, Coins } from "lucide-react";

export default function AdminTransactionAnalytics() {
  return (
    <div className="m-4">
      <h1 className="text-xl font-bold mb-6 m-3">Transactions</h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 m-3">
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>

          <CircleDollarSign className="w-8 h-8 text-gray-700" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">Total Coins Purchased</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>

          <Coins className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">All Transactions</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>

          <CircleDollarSign className="w-8 h-8 text-green-400" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">Failed Transactions</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>

          <CircleDollarSign className="w-8 h-8 text-red-400" />
        </div>
      </div>
    </div>
  );
}
