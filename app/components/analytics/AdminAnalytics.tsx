"use client";

import React, { useEffect, useState } from "react";
import { Users, Coins, AlertTriangleIcon, LucidePiggyBank } from "lucide-react";
import { fetchWithToken } from "../../utils/fetchWithToken";

interface DashboardData {
  totalUsers: number;
  totalCoinsPurchased: number;
  pendingReports: number;
  totalRevenue: number;
}

export default function AdminAnalytics(): React.JSX.Element {
  const [data, setData] = useState<DashboardData>({
    totalUsers: 0,
    totalCoinsPurchased: 0,
    pendingReports: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchKpis = async (): Promise<void> => {
      try {
        const result = await fetchWithToken<DashboardData>("/admin/dashboard");
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
        <div className="m-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 m-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-center items-center"
              >
                <span className="text-gray-600">Loading...</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 m-3">
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900">{data.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-gray-600" />
          </div>

          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Total Coins Purchased</h3>
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
