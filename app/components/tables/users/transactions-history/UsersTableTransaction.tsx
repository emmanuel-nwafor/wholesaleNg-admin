// Updated UsersTableTransaction.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Filter,
} from "lucide-react";
import { fetchWithToken } from "../../../../utils/fetchWithToken";

interface ApiTransaction {
  _id: string;
  userId: string;
  type: "CREDIT" | "DEBIT";
  reason: string;
  amount: number;
  createdAt: string;
}

interface Transaction {
  id: string;
  amount: string;
  coins: number;
  date: string;
  status: string;
}

interface UsersTableTransactionProps {
  userId: string;
  filterType?: "CREDIT" | "DEBIT";
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function UsersTableTransaction({ userId, filterType }: UsersTableTransactionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [apiTransactions, setApiTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithToken<{ wallet: any; transactions: ApiTransaction[] }>("/wallet/transactions");
        let userTransactions = res.transactions.filter(t => t.userId === userId);
        if (filterType) {
          userTransactions = userTransactions.filter(t => t.type === filterType);
        }
        setApiTransactions(userTransactions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId, filterType]);

  const transactions: Transaction[] = apiTransactions.map(t => ({
    id: `TXN-${t._id.slice(-3)}`,
    amount: `₦${t.amount * 100}`,
    coins: t.amount,
    date: new Date(t.createdAt).toLocaleString("en-US", { 
      month: "2-digit", 
      day: "2-digit", 
      year: "numeric", 
      hour: "2-digit", 
      minute: "2-digit", 
      hour12: true 
    }),
    status: t.type === "CREDIT" ? "Approved" : "Failed",
  }));

  const filteredTransactions = transactions.filter(t =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (dateFilter === "" || t.date.includes(dateFilter)) &&
    (statusFilter === "" || t.status === statusFilter)
  );

  if (loading) return <div className="p-6 text-center text-gray-500">Loading transactions...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden m-4">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-full sm:w-auto sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button className="p-3 rounded-2xl bg-gray-800 text-white">Search</button>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="p-4 bg-gray-100 rounded-xl text-sm flex items-center gap-1">
              <Calendar size={16} />
              Date
            </button>
            <button className="p-4 bg-gray-100 rounded-xl text-sm flex items-center gap-1">
              <Filter size={16} />
              Status
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount (₦)</th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">Coins</th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-gray-900">{t.id}</td>
                  <td className="px-4 py-4 text-gray-900">{t.amount}</td>
                  <td className="px-4 py-4 text-gray-900">{t.coins}</td>
                  <td className="px-4 py-4 text-gray-900">{t.date}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}