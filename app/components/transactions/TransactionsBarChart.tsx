"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchWithToken } from "../../utils/fetchWithToken";

interface Transaction {
  _id: string;
  amount: number;
  createdAt: string;
}

interface ChartData {
  day: number;
  transactions: number;
}

export default function TransactionsBarChart(): React.JSX.Element {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async (): Promise<void> => {
      try {
        const response = await fetchWithToken<{ transactions: Transaction[] }>(
          "/wallet/transactions"
        );

        const grouped: Record<number, number> = {};

        response.transactions.forEach((tx) => {
          const date = new Date(tx.createdAt);
          const day = date.getDate();
          grouped[day] = (grouped[day] || 0) + tx.amount;
        });

        const chartData = Object.keys(grouped).map((day) => ({
          day: Number(day),
          transactions: grouped[Number(day)],
        }));

        setData(chartData);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    void fetchTransactions();
  }, []);

  return (
    <div className="m-4 p-4 bg-white rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Total Transactions</h2>
        <select className="px-3 py-1 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Daily ▼</option>
        </select>
      </div>

      <div className="border border-gray-100 rounded-3xl h-64 md:h-72">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading transactions...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
                labelStyle={{ fontSize: "12px" }}
              />
              <Bar
                dataKey="transactions"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
