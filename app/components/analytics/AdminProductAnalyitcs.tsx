"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBagIcon } from "lucide-react";
import { fetchWithToken } from "../../utils/fetchWithToken";

interface ApiProduct {
  status: string;
}

interface ProductsResponse {
  products: ApiProduct[];
  total: number;
}

export default function AdminProductAnalytics() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: ProductsResponse = await fetchWithToken("/admin/products", {
          method: "GET",
        });
        if (data?.products) {
          const total = data.total;
          const pending = data.products.filter(p => p.status.toLowerCase() === "pending").length;
          const approved = data.products.filter(p => p.status.toLowerCase() === "approved").length;
          const rejected = data.products.filter(p => p.status.toLowerCase() === "rejected").length;
          setStats({ total, pending, approved, rejected });
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="m-4">
        <h1 className="text-xl font-bold mb-6 m-3">Product Management</h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 m-3">
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-center items-center">
            <span className="text-gray-600">Loading...</span>
          </div>
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-center items-center">
            <span className="text-gray-600">Loading...</span>
          </div>
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-center items-center">
            <span className="text-gray-600">Loading...</span>
          </div>
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-center items-center">
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-4">
      <div className="flex items-center justify-between m-3">
        <h1 className="text-xl font-bold">Product Management</h1>

        <button className="p-4 bg-blue-400 rounded-2xl text-white hover:bg-blue-300">
          Bulk Approve
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 m-3">
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">Total Products</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <ShoppingBagIcon className="w-8 h-8 text-gray-700" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">Pending Products</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </div>

          <ShoppingBagIcon className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">Approved Products</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
          </div>

          <ShoppingBagIcon className="w-8 h-8 text-green-400" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">Rejected Products</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
          </div>

          <ShoppingBagIcon className="w-8 h-8 text-red-400" />
        </div>
      </div>
    </div>
  );
}