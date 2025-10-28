"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { fetchWithToken } from "../../../../utils/fetchWithToken";
import {
  Calendar1Icon,
  Users2,
  LockKeyholeOpenIcon,
  LucideMessageSquareText,
  Wallet,
  BadgeDollarSignIcon,
  Phone,
  CalendarArrowDownIcon,
  CheckCircle,
} from "lucide-react";
import UserTransactionsSwitchTabs from "@/app/components/header/UserTransactionsSwitchTabs";

interface ApiUserProfile {
  user: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    isVerifiedSeller: boolean;
    createdAt: string;
  };
  totalCoins: number;
}

interface User {
  id: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  role: string;
  walletBalance: number;
  totalSpent: number;
  totalUnlocks: number;
  status: string;
  dateJoined: string;
  image?: string;
}

const Avatar: React.FC<{ name: string; size?: 'small' | 'medium' | 'large' }> = ({ name, size = 'medium' }) => {
  const sizeClasses = size === 'small' ? 'h-8 w-8' : size === 'medium' ? 'h-20 w-20' : 'h-14 w-14';
  const textSize = size === 'small' ? 'text-xs' : size === 'medium' ? 'text-base' : 'text-base';

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={`${sizeClasses} rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium ${textSize}`}>
      {initials}
    </div>
  );
};

export default function UserDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [user, setUser] = useState<User>({
    id,
    fullName: "",
    dateOfBirth: "N/A",
    email: "",
    phone: "N/A",
    role: "",
    walletBalance: 0,
    totalSpent: 0,
    totalUnlocks: 0,
    status: "Active",
    dateJoined: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      try {
        const result: ApiUserProfile = await fetchWithToken(`/v1/users/${id}/profile`);
        const { user: apiUser, totalCoins } = result;
        const dateJoined = new Date(apiUser.createdAt).toLocaleString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        const status = apiUser.role === "admin" || apiUser.isVerifiedSeller ? "Active" : "Inactive";
        setUser({
          id: apiUser._id,
          fullName: apiUser.fullName,
          dateOfBirth: "N/A",
          email: apiUser.email,
          phone: "N/A",
          role: apiUser.role === "admin" ? "Admin" : apiUser.role === "seller" ? "Seller" : "Buyer",
          walletBalance: totalCoins,
          totalSpent: 0,
          totalUnlocks: 0,
          status,
          dateJoined,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }

    const data = searchParams.get("data");
    if (data) {
      try {
        const parsed = JSON.parse(data) as Partial<User>;
        setUser(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [id, searchParams]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <>
      <h1 className="text-xl font-bold m-4 ml-6 sm:ml-12">Users Info</h1>

      <div className="p-6 sm:p-7 border border-gray-200 rounded-3xl sm:rounded-4xl m-4 sm:m-10">
        {/* User Image & Name */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Avatar name={user.fullName} size="medium" />
            <div>
              <p className="text-gray-600 text-sm">Full name</p>
              <span className="font-semibold text-gray-900">{user.fullName}</span>
            </div>
          </div>

          {/* Suspend and delete button */}
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button className="px-2 py-2 border border-gray-200 text-red-500 bg-gray-100 rounded-2xl">
              Suspend user
            </button>
            <button className="px-2 py-2 bg-red-500 text-white rounded-2xl">
              Delete user
            </button>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {/* Row 1 */}
          <div className="space-y-6">
            <DetailItem icon={<Calendar1Icon size={20} />} label="Date of Birth" value={user.dateOfBirth} />
            <DetailItem icon={<Users2 size={20} />} label="Role" value={user.role} />
            <DetailItem icon={<LockKeyholeOpenIcon size={20} />} label="Total Unlocks" value={user.totalUnlocks} />
          </div>

          {/* Row 2 */}
          <div className="space-y-8">
            <DetailItem icon={<LucideMessageSquareText size={20} />} label="Email Address" value={user.email} />
            <DetailItem icon={<Wallet size={20} />} label="Wallet Balance (Coins)" value={`${user.walletBalance} Coins`} />
            <DetailItem
              icon={<CheckCircle size={20} className="text-green-500" />}
              label="Status"
              value={
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {user.status}
                </span>
              }
            />
          </div>

          {/* Row 3 */}
          <div className="space-y-8">
            <DetailItem icon={<Phone size={20} />} label="Phone Number" value={user.phone} />
            <DetailItem icon={<BadgeDollarSignIcon size={20} />} label="Total Amount Spent (Coins)" value={`${user.totalSpent} Coins`} />
            <DetailItem icon={<CalendarArrowDownIcon size={20} />} label="Date Joined" value={user.dateJoined} />
          </div>
        </div>
      </div>

      <div className="">
        <UserTransactionsSwitchTabs userId={id} />
      </div>
    </>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-6">
      <div className="text-gray-500 flex-shrink-0 mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-gray-900 text-sm">{value}</p>
      </div>
    </div>
  );
}