"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

interface User {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  role: string;
  walletBalance: number;
  totalSpent: number;
  totalUnlocks: string;
  status: string;
  dateJoined: string;
  image?: string;
}

export default function UserDetailsPage() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User>({
    fullName: "Esther Howard",
    dateOfBirth: "5-11-2000",
    email: "estherhoward82@gmail.com",
    phone: "+23490148727",
    role: "Buyer",
    walletBalance: 10000,
    totalSpent: 9700,
    totalUnlocks: "+23490148727",
    status: "Active",
    dateJoined: "5-11-2024, 12:20 PM",
    image: "/beach.jpg",
  });

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsed = JSON.parse(data) as Partial<User>;
        setUser(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [searchParams]);

  return (
    <>
      <h1 className="text-xl font-bold m-4 ml-6 sm:ml-12">Users Info</h1>

      <div className="p-6 sm:p-7 border border-gray-200 rounded-3xl sm:rounded-4xl m-4 sm:m-10">
        {/* User Image & Name */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <img
              src={user.image}
              className="w-20 h-20 rounded-full"
              alt={user.fullName}
            />
            <div>
              <p className="text-gray-600 text-sm">Full name</p>
              <span className="font-semibold text-gray-900">{user.fullName}</span>
            </div>
          </div>

          {/* Suspend and delete button */}
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button className="px-4 py-2 border border-gray-200 text-red-500 font-semibold bg-gray-100 rounded-2xl">
              Suspend user
            </button>
            <button className="px-4 py-2 bg-red-400 text-white rounded-2xl">
              Delete user
            </button>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <DetailItem icon={<Calendar1Icon />} label="Date of Birth" value={user.dateOfBirth} />
            <DetailItem icon={<Users2 />} label="Role" value={user.role} />
            <DetailItem icon={<LockKeyholeOpenIcon />} label="Total Unlocks" value={user.totalUnlocks} />
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <DetailItem icon={<LucideMessageSquareText />} label="Email" value={user.email} />
            <DetailItem icon={<Wallet />} label="Wallet Balance(coins)" value={`${user.walletBalance} coins`} />
            <DetailItem
              icon={<CheckCircle className="text-green-500" />}
              label="Status"
              value={
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {user.status}
                </span>
              }
            />
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <DetailItem icon={<Phone />} label="Phone Number" value={user.phone} />
            <DetailItem icon={<BadgeDollarSignIcon />} label="Total Amount Spent(Coins)" value={`${user.totalSpent} coins`} />
            <DetailItem icon={<CalendarArrowDownIcon />} label="Date Joined" value={user.dateJoined} />
          </div>
        </div>
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
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="text-gray-500">{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-gray-900 font-semibold">{value}</p>
      </div>
    </div>
  );
}
