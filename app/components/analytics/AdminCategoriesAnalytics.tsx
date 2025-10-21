import React from "react";
import { Wallet } from "lucide-react";

export default function AdminCategoriesAnalytics() {
  return (
    <div className="m-4">
      <div className="flex items-center justify-between m-2">
        <h1 className="text-xl font-bold mb-6 m-3">Categories Management</h1>

        <button className="p-3 rounded-2xl bg-gray-800 text-white">
           Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 m-3">
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">All Categories</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>

          <Wallet className="w-8 h-8 text-gray-700" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">Active Categories</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>

          <Wallet className="w-8 h-8 text-green-400" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">Archive Categories</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>

          <Wallet className="w-8 h-8 text-red-400" />
        </div>
      </div>
    </div>
  );
}
