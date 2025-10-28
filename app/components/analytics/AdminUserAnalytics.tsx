"use client";

import React, { useState, useEffect } from "react";
import { UserCircleIcon, Users2 } from "lucide-react";
import { fetchWithToken } from "../../utils/fetchWithToken";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  isVerifiedSeller: boolean;
  blockedUsers?: string[];
}

interface UsersResponse {
  users: User[];
  total: number;
}

interface UserData {
  allUsers: number;
  buyers: number;
  vendors: number;
  suspended: number;
}

export default function AdminUserAnalytics(): React.JSX.Element {
  const [data, setData] = useState<UserData>({ allUsers: 0, buyers: 0, vendors: 0, suspended: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const result: UsersResponse = await fetchWithToken<UsersResponse>("/v1/users");
        const users = result.users;
        const allUsers = result.total;
        const buyers = users.filter(u => u.role === "buyer").length;
        const vendors = users.filter(u => u.role === "seller").length;
        const suspended = users.filter(u => u.blockedUsers && u.blockedUsers.length > 0).length;
        setData({ allUsers, buyers, vendors, suspended });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="m-4">
      <h1 className="text-xl font-bold mb-6 m-3">Users</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 m-3">
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 m-3">
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">All Users</h3>
              <p className="text-2xl font-bold text-gray-900">{data.allUsers}</p>
            </div>
            <Users2 className="w-8 h-8 text-gray-700" />
          </div>
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Buyers</h3>
              <p className="text-2xl font-bold text-gray-900">{data.buyers}</p>
            </div>
            <UserCircleIcon className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Vendors</h3>
              <p className="text-2xl font-bold text-gray-900">{data.vendors}</p>
            </div>
            <UserCircleIcon className="w-8 h-8 text-green-400" />
          </div>
          <div className="bg-white rounded-2xl p-10 border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Suspended Users</h3>
              <p className="text-2xl font-bold text-gray-900">{data.suspended}</p>
            </div>
            <UserCircleIcon className="w-8 h-8 text-red-400" />
          </div>
        </div>
      )}
    </div>
  );
}