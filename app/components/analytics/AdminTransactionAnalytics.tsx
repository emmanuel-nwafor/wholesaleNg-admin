"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, List, AlertCircle } from "lucide-react";
import { fetchWithToken } from "../../utils/fetchWithToken";

interface DashboardResponse {
  totalRevenue: number;
  totalCoinsPurchased: number;
}

interface TransactionsResponse {
  transactions: any[];
}

interface AnalyticsData {
  totalRevenue: number;
  totalCoinsPurchased: number;
  totalTransactions: number;
  failedTransactions: number;
}

export default function AdminTransactionAnalytics() {
  const [data, setData] = useState<AnalyticsData>({ totalRevenue: 0, totalCoinsPurchased: 0, totalTransactions: 0, failedTransactions: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [dashboardRes, transactionsRes] = await Promise.all([
          fetchWithToken<DashboardResponse>("/admin/dashboard"),
          fetchWithToken<TransactionsResponse>("/wallet/transactions")
        ]);
        const totalRevenue = dashboardRes.totalRevenue;
        const totalCoinsPurchased = dashboardRes.totalCoinsPurchased;
        const totalTransactions = transactionsRes.transactions.length;
        const failedTransactions = 0; // No failed in response
        setData({ totalRevenue, totalCoinsPurchased, totalTransactions, failedTransactions });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const LoadingCard = () => (
    <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-center items-center">
      <span className="text-gray-600">Loading...</span>
    </div>
  );

  return (
    <div className="m-6">
      <h1 className="text-xl font-bold mb-6">Transactions</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">{data.totalRevenue}</p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-700" />
          </div>
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Total Coins Purchased</h3>
              <p className="text-2xl font-bold text-gray-900">{data.totalCoinsPurchased}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">All Transactions</h3>
              <p className="text-2xl font-bold text-gray-900">{data.totalTransactions}</p>
            </div>
            <List className="w-8 h-8 text-green-400" />
          </div>
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Failed Transactions</h3>
              <p className="text-2xl font-bold text-gray-900">{data.failedTransactions}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      )}
    </div>
  );
}