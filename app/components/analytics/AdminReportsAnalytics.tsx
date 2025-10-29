"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { fetchWithToken } from "@/app/utils/fetchWithToken"; // Adjust path as needed

interface ApiResponse {
  reports: any[];
  total: number;
  page: number;
  limit: number;
}

export default function AdminReportsAnalytics() {
  const [allCount, setAllCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data: ApiResponse = await fetchWithToken("/v1/reports");
        setAllCount(data.total);
        const pending = data.reports.filter((r: any) => r.status === "Pending").length;
        const resolved = data.reports.filter((r: any) => r.status === "Resolved").length;
        const rejected = data.reports.filter((r: any) => r.status === "Rejected").length;
        setPendingCount(pending);
        setResolvedCount(resolved);
        setRejectedCount(rejected);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return <div className="m-4">Loading...</div>;
  }

  return (
    <div className="m-4">
      <h1 className="text-xl font-bold mb-6 m-3">Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 m-3">
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-sm text-gray-600 mb-1">All Reports</h3>
            <p className="text-2xl font-bold text-gray-900">{allCount}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-gray-700" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-sm text-gray-600 mb-1">Pending Reports</h3>
            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-sm text-gray-600 mb-1">Resolved Reports</h3>
            <p className="text-2xl font-bold text-gray-900">{resolvedCount}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-green-400" />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-sm text-gray-600 mb-1">Rejected Reports</h3>
            <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
      </div>
    </div>
  );
}