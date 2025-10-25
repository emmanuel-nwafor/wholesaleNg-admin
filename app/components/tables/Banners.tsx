"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { fetchWithToken } from "../../utils/fetchWithToken";

interface Banner {
  _id: string;
  bannerTitle: string;
  image: string;
  position: string;
  type: string;
  startDate: string;
  endDate: string;
  status: boolean;
  createdAt: string;
}

interface BannersResponse {
  banners: Banner[];
}

export default function Banners(): React.JSX.Element {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data: BannersResponse = await fetchWithToken("/v1/banners", {
          method: "GET",
        });
        if (data?.banners) {
          const activeBanners = data.banners.filter(b => b.status).slice(0, 3);
          setBanners(activeBanners);
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `End Date - ${date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`;
  };

  if (loading) {
    return (
      <div className="m-4 bg-white rounded-3xl border border-gray-200 p-6 text-center text-gray-600">
        Loading banners...
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="m-4 bg-white rounded-3xl border border-gray-200 p-6 text-center text-gray-600">
        No active banners found.
      </div>
    );
  }

  return (
    <div className="m-4 bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-sm font-bold text-gray-900">Active Banners</h2>
        <button className="flex items-center gap-1 text-blue-600 text-sm hover:underline">
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Banner Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Device
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {banners.map((banner) => (
              <tr key={banner._id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <img
                      src={banner.image || "https://via.placeholder.com/40"}
                      alt="banner"
                      className="h-10 w-10 rounded-lg mr-3 object-cover"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {banner.bannerTitle}
                      </div>
                      <div className="text-[12px] text-gray-500">
                        {formatDate(banner.endDate)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {banner.position}
                </td>
                <td className="px-4 py-4 text-sm font-medium">
                  <span className="text-[10px] px-1 py-1 bg-green-100 text-green-400 rounded-2xl">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden grid grid-cols-1 gap-4 p-4">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="flex flex-col bg-gray-50 p-4 rounded-xl shadow-sm"
          >
            <div className="flex items-center mb-2">
              <img
                src={banner.image || "https://via.placeholder.com/48"}
                alt="banner"
                className="h-12 w-12 rounded-lg mr-3 object-cover"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {banner.bannerTitle}
                </div>
                <div className="text-[12px] text-gray-500">{formatDate(banner.endDate)}</div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-900 mb-2">
              <div>Device: {banner.position}</div>
              <div>
                <span className="text-[10px] px-2 py-1 bg-green-100 text-green-400 rounded-2xl">
                  Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}