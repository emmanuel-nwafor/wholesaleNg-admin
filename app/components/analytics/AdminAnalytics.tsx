"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Coins,
  AlertTriangleIcon,
  LucidePiggyBank,
} from "lucide-react";

export default function AdminAnalytics() {
  const [data, setData] = useState({
    totalUsers: 0,
    totalCoinsPurchased: 0,
    pendingReports: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const res = await fetch(
          "https://wholesalenaija-backend-production.up.railway.app/api/admin/dashboard"
        );
        if (!res.ok) {
          throw new Error("Failed to fetch admin KPIs");
        }
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, []);

  return (
    <div className="m-4">
      <h1 className="text-xl font-bold mb-6 m-3">Dashboard</h1>

      {loading ? (
        <p className="text-gray-500 m-3">Loading dashboard data...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 m-3">
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900">
                {data.totalUsers}
              </p>
            </div>
            <Users className="w-8 h-8 text-gray-600" />
          </div>

          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">
                Total Coins Purchased
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {data.totalCoinsPurchased}
              </p>
            </div>
            <Coins className="w-8 h-8 text-green-400" />
          </div>

          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Pending Reports</h3>
              <p className="text-2xl font-bold text-gray-900">
                {data.pendingReports}
              </p>
            </div>
            <AlertTriangleIcon fill="#989898" className="w-8 h-8 text-white" />
          </div>

          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">
                ₦{data.totalRevenue.toLocaleString()}
              </p>
            </div>
            <LucidePiggyBank className="w-8 h-8 text-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
}
