"use client";

import React, { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { fetchWithToken } from "../../utils/fetchWithToken";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  status: boolean;
  subcategories: Array<{ name: string; brands: string[] }>;
}

interface CategoriesResponse {
  categories: Category[];
}

interface DashboardData {
  total: number;
  active: number;
  archived: number;
}

export default function AdminCategoriesAnalytics(): React.JSX.Element {
  const [data, setData] = useState<DashboardData>({ total: 0, active: 0, archived: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const result: CategoriesResponse = await fetchWithToken<CategoriesResponse>("/admin/categories");
        const categories = result.categories;
        const total = categories.length;
        const active = categories.filter(c => c.status === true).length;
        const archived = categories.filter(c => c.status === false).length;
        setData({ total, active, archived });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="m-4">
      <div className="flex items-center justify-between m-2">
        <h1 className="text-xl font-bold mb-6 m-3">Categories Management</h1>

        <Link href="/management/category-management/add">
          <button className="p-3 rounded-2xl bg-gray-800 text-white hover:bg-gray-700 transition hover:cursor-pointer">
            Add Category
          </button>
        </Link>
      </div>

      {loading ? (
      <div className="m-4">
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
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 m-3">
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">All Categories</h3>
              <p className="text-2xl font-bold text-gray-900">{data.total}</p>
            </div>
            <Wallet className="w-8 h-8 text-gray-700" />
          </div>
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Active Categories</h3>
              <p className="text-2xl font-bold text-gray-900">{data.active}</p>
            </div>
            <Wallet className="w-8 h-8 text-green-400" />
          </div>
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Archive Categories</h3>
              <p className="text-2xl font-bold text-gray-900">{data.archived}</p>
            </div>
            <Wallet className="w-8 h-8 text-red-400" />
          </div>
        </div>
      )}
    </div>
  );
}