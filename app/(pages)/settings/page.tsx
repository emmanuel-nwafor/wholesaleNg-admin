"use client";

import React from "react";
import { Settings2, Coins, Bell, DollarSign } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-8">Platform Settings</h2>
        <nav className="space-y-6">
          <button className="flex items-center gap-3 text-blue-600 font-medium">
            <Settings2 size={20} />
            <span>General Settings</span>
          </button>

          <button className="flex items-center gap-3 text-gray-500 hover:text-blue-600 transition">
            <Coins size={20} />
            <span>Coin Management</span>
          </button>

          <button className="flex items-center gap-3 text-gray-500 hover:text-blue-600 transition">
            <DollarSign size={20} />
            <span>Transaction Settings</span>
          </button>

          <button className="flex items-center gap-3 text-gray-500 hover:text-blue-600 transition">
            <Bell size={20} />
            <span>Notification Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <h2 className="text-lg font-semibold mb-8">General Settings</h2>

        <form className="max-w-xl space-y-6">
          {/* Platform Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Platform Name
            </label>
            <input
              type="text"
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Default Currency */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Default Currency
            </label>
            <div className="relative">
              <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-gray-300">
                <option>NGN</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Support Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Support Phone Number
            </label>
            <input
              type="text"
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Support Email Address */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Support Email Address
            </label>
            <input
              type="text"
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-[#001F3F] hover:bg-[#012a57] text-white text-sm px-8 py-3 rounded-xl font-medium transition"
            >
              Save CHnages
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
