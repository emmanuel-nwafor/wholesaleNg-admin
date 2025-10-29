// AdminVerificationRequestAnalitics.tsx
"use client";

import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { MessageSquareDot } from "lucide-react";

interface ApiVerification {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  storeName: string;
  storeImage: string;
  userImage: string;
  nni: string;
  cacNo: string;
  createdAt: string;
  status: "Approved" | "Pending" | "Rejected";
}

interface ApiResponse {
  verifications: ApiVerification[];
  total: number;
  page: number;
  limit: number;
}

export default function AdminVerificationRequestAnalitics() {
  const [stats, setStats] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        const data: ApiResponse = await fetchWithToken("/admin/seller-verifications");
        const verifications = data.verifications;
        setStats({
          all: data.total,
          pending: verifications.filter(v => v.status === "Pending").length,
          approved: verifications.filter(v => v.status === "Approved").length,
          rejected: verifications.filter(v => v.status === "Rejected").length,
        });
      } catch (error) {
        console.error("Failed to fetch verifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifications();
  }, []);

  if (loading) {
    return <div className="m-4">Loading...</div>;
  }

  return (
    <div className="m-4">
      <h1 className="text-xl font-bold mb-6 m-3">Verification Requests</h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 m-3">
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">All Requests</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.all}</p>
          </div>
          <MessageSquareDot className="w-8 h-8 text-gray-700" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">Pending Requests</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </div>
          <MessageSquareDot className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">Approved Requests</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
          </div>
          <MessageSquareDot className="w-8 h-8 text-green-400" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div className="">
            <h3 className="text-sm text-gray-600 mb-1">Rejected Users</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
          </div>
          <MessageSquareDot className="w-8 h-8 text-red-400" />
        </div>
      </div>
    </div>
  );
}