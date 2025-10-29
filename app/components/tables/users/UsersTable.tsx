"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MoreHorizontal,
  Check,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchWithToken } from "../../../utils/fetchWithToken";

interface ApiUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  isVerifiedSeller: boolean;
  createdAt: string;
}

interface User {
  id: string;
  image: string;
  name: string;
  userId: string;
  role: string;
  contact: string;
  email: string;
  status: string;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case "Approved":
      return <Check className="w-3 h-3" />;
    case "Pending":
      return <Clock className="w-3 h-3" />;
    case "Rejected":
      return <X className="w-3 h-3" />;
    default:
      return null;
  }
};

const Avatar: React.FC<{ name: string; image: string; size?: 'small' | 'medium' | 'large' }> = ({ name, image, size = 'medium' }) => {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = size === 'small' ? 'h-8 w-8' : size === 'medium' ? 'h-12 w-12' : 'h-14 w-14';
  const textSize = size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-base';

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (imgError) {
    return (
      <div className={`${sizeClasses} rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium ${textSize}`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      className={`${sizeClasses} rounded-full object-cover`}
      src={image}
      alt={name}
      onError={() => setImgError(true)}
    />
  );
};

export default function UsersTable(): React.JSX.Element {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const result = await fetchWithToken<{ users: ApiUser[]; total: number; page: number; limit: number }>("/v1/users");
        const apiUsers = result.users;
        const mappedUsers: User[] = apiUsers.map((u) => ({
          id: u._id,
          image: "https://via.placeholder.com/48x48?text=👤",
          name: u.fullName,
          userId: u._id,
          role: u.role === "admin" ? "Admin" : u.role === "seller" ? "Vendor" : "Buyer",
          contact: "N/A",
          email: u.email,
          status: u.role === "admin" ? "Approved" : u.isVerifiedSeller ? "Approved" : "Pending",
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleViewUser = (user: User): void => {
    const data = encodeURIComponent(JSON.stringify(user));
    router.push(`/management/users-management/${user.id}?data=${data}`);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-full sm:w-auto sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full px-12 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled
              />
            </div>
          </div>
        </div>
        <div className="p-8 text-center text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full sm:w-auto sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-12 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                User
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                User ID
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Role
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Contact
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Email
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Status
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td
                  className="px-4 py-4 cursor-pointer"
                  onClick={() => handleViewUser(user)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Avatar name={user.name} image={user.image} size="medium" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-900">{user.userId}</td>
                <td className="px-4 py-4 text-gray-900">{user.role}</td>
                <td className="px-4 py-4 text-gray-900">{user.contact}</td>
                <td className="px-4 py-4 text-gray-900">{user.email}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {getStatusIcon(user.status)}
                    <span className="ml-1">{user.status}</span>
                  </span>
                </td>
                <td className="px-4 py-4 relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(
                        openDropdown === user.id ? null : user.id
                      );
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {openDropdown === user.id && (
                    <div
                      className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                      ref={dropdownRef}
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                        onClick={() => handleViewUser(user)}
                      >
                        View User
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                        onClick={() => setOpenDropdown(null)}
                      >
                        Delete User
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 p-4">
        {paginatedUsers.map((user) => (
          <div
            key={user.id}
            className="border border-gray-200 rounded-xl p-4 relative"
          >
            <div className="flex justify-between items-start mb-3">
              <div
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => handleViewUser(user)}
              >
                <Avatar name={user.name} image={user.image} size="large" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500 truncate">{user.role}</p>
                </div>
              </div>
              <div className="relative flex-shrink-0" ref={dropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(
                      openDropdown === user.id ? null : user.id
                    );
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal size={16} />
                </button>
                {openDropdown === user.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                      onClick={() => handleViewUser(user)}
                    >
                      View User
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Edit User
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Delete User
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <div>ID: {user.userId}</div>
              <div>Contact: {user.contact}</div>
              <div className="flex items-center">
                Status:{" "}
                <span className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(user.status)}`}>
                  {getStatusIcon(user.status)}
                  <span className="ml-1">{user.status}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 md:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm text-gray-700 text-center sm:text-left">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
            </span>{" "}
            of <span className="font-medium">{filteredUsers.length}</span>{" "}
            results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}