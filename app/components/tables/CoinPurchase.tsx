"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { fetchWithToken } from "../../utils/fetchWithToken";

interface Transaction {
  _id: string;
  userId: string;
  type: string;
  reason: string;
  amount: number;
  createdAt: string;
}

interface WalletResponse {
  wallet: { balance: number };
  transactions: Transaction[];
}

interface CoinPurchase {
  _id: string;
  name: string;
  email: string;
  price: string;
  amount: string;
  status: string;
}

export default function CoinPurchase(): React.JSX.Element {
  const [data, setData] = useState<CoinPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: WalletResponse = await fetchWithToken("/wallet", { method: "GET" });
        const purchases: CoinPurchase[] = response.transactions.map(t => ({
          _id: t._id,
          name: "Joanna Adeleke", // Dummy for demo
          email: "joannadeleke@gmail.com",
          price: "₦5,000",
          amount: `${t.amount} Coins`,
          status: "Successful",
        }));
        setData(purchases.slice(0, 3));
      } catch (err) {
        console.error("Error fetching wallet:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="m-4 bg-white rounded-3xl border border-gray-200 p-6 text-center text-gray-600">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="m-4 bg-white rounded-3xl border border-gray-200 p-6 text-center text-gray-600">No coin purchases found.</div>;
  }

  return (
    <div className="m-4 bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-sm font-bold text-gray-900">Coin Purchases</h2>
        <button className="flex items-center gap-1 text-blue-600 text-sm hover:underline">
          View All <ArrowRight size={16} />
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Buyer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Amount</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-[12px] text-gray-500">{item.email}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{item.price}</div>
                  <div className="text-gray-500">{item.amount}</div>
                </td>
                <td className="px-1 py-1 whitespace-nowrap text-right text-sm font-medium">
                  <span className="px-1 text-[10px] py-1 bg-green-100 text-green-400 rounded-2xl">{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden grid grid-cols-1 gap-4 p-4">
        {data.map((item) => (
          <div key={item._id} className="flex flex-col bg-gray-50 p-4 rounded-xl shadow-sm">
            <div className="mb-2">
              <div className="text-sm font-medium text-gray-900">{item.name}</div>
              <div className="text-[12px] text-gray-500">{item.email}</div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-900 mb-2">
              <div>
                <div>{item.price}</div>
                <div className="text-gray-500">{item.amount}</div>
              </div>
              <div>
                <span className="px-2 py-1 text-[10px] bg-green-100 text-green-400 rounded-2xl">{item.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}