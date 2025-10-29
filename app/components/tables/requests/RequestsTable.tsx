"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Check,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { fetchWithToken } from "../../../utils/fetchWithToken";
import VerificationModal from "@/app/components/modals/VerificationModal";

interface ApiVerification {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    image?: string;
  };
  businessName: string;
  businessImage?: string;
  nin: string;
  cacNumber: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

interface RequestItem {
  id: string;
  storeImage?: string;
  storeName: string;
  email: string;
  fullName: string;
  userImage?: string;
  nni: string;
  cacNo: string;
  dateSubmitted: string;
  status: string;
}

const getStatusColor = (status: string): string => {
  const normalized = status.charAt(0).toUpperCase() + status.slice(1);
  switch (normalized) {
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string): React.ReactNode => {
  const normalized = status.charAt(0).toUpperCase() + status.slice(1);
  switch (normalized) {
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

const Avatar: React.FC<{ name: string; image?: string; size?: 'small' | 'medium' | 'large' }> = ({ name, image, size = 'medium' }) => {
  const sizeClasses = size === 'small' ? 'h-8 w-8' : size === 'medium' ? 'h-12 w-12' : 'h-10 w-10';
  const textSize = size === 'small' ? 'text-xs' : 'text-sm';

  const safeName = name || '';
  const initials = safeName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative">
      {image ? (
        <img className={`${sizeClasses} rounded-full object-cover`} src={image} alt={name} 
          onError={(e) => { 
            const img = e.currentTarget;
            img.style.display = 'none'; 
            const fallback = img.nextSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'flex'; 
          }} 
        />
      ) : null}
      <div className={`${sizeClasses} rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium ${textSize} ${image ? 'absolute inset-0 hidden' : ''}`}>
        {initials}
      </div>
    </div>
  );
};

export default function RequestsTable(): React.JSX.Element {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await fetchWithToken<{ verifications: ApiVerification[] }>("/admin/seller-verifications");
        const mappedRequests: RequestItem[] = data.verifications.map(v => ({
          id: v._id,
          storeImage: v.businessImage,
          storeName: v.businessName || 'Unnamed Store',
          email: v.user.email,
          fullName: v.user.fullName,
          userImage: v.user.image,
          nni: v.nin,
          cacNo: v.cacNumber,
          dateSubmitted: new Date(v.submittedAt).toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          status: v.status,
        }));
        setRequests(mappedRequests);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(
    (r) =>
      (r.storeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleViewDetails = (
    request: RequestItem,
    e?: React.MouseEvent
  ): void => {
    e?.stopPropagation();
    setSelectedRequest(request);
    setOpenModal(true);
    setOpenDropdown(null);
  };

  const handleApprove = async (): Promise<void> => {
    if (!selectedRequest) return;
    try {
      await fetchWithToken(`/admin/seller-verifications/${selectedRequest.id}/approve`, { method: "PATCH" });
      setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: "approved" } : r));
      setOpenModal(false);
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  };

  const handleReject = async (): Promise<void> => {
    if (!selectedRequest) return;
    try {
      await fetchWithToken(`/admin/seller-verifications/${selectedRequest.id}/reject`, { method: "PATCH" });
      setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: "rejected" } : r));
      setOpenModal(false);
    } catch (error) {
      console.error("Failed to reject:", error);
    }
  };

  const handleDropdownToggle = (id: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleActionClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openDropdown &&
        !(e.target as HTMLElement).closest(".dropdown-menu")
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <>
      <motion.div
        className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-full sm:w-auto sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <button className="px-6 py-3 rounded-2xl bg-gray-800 text-white text-sm">
              Search
            </button>
            <div className="flex gap-2 ml-auto">
              <div className="relative">
                <select className="px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white appearance-none">
                  <option>Date</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              <div className="relative">
                <select className="px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white appearance-none">
                  <option>Status</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto cursor-pointer">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  Store Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  Vendor Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  Date Submitted
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {paginatedRequests.map((request, i) => (
                  <motion.tr 
                    key={request.id} 
                    className="hover:bg-gray-50" 
                    onClick={(e) => handleViewDetails(request, e)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Avatar name={request.storeName} image={request.storeImage} size="large" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {request.storeName}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {request.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 cursor-pointer hover:underline">
                      {request.fullName}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{request.dateSubmitted}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        <span className="ml-1">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={(e) => handleDropdownToggle(request.id, e)}
                        className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      <AnimatePresence>
                        {openDropdown === request.id && (
                          <motion.div 
                            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 dropdown-menu"
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.1 }}
                            onClick={handleActionClick}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                              onClick={(e) => { handleViewDetails(request, e); }}
                            >
                              View Details
                            </button>
                            {request.status === "pending" && (
                              <>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                  onClick={(e) => { handleActionClick(e); handleApprove(); setOpenDropdown(null); }}
                                >
                                  Approve Verification
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                  onClick={(e) => { handleActionClick(e); handleReject(); setOpenDropdown(null); }}
                                >
                                  Reject Verification
                                </button>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {paginatedRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {/* Mobile & Tablet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 p-4">
          <AnimatePresence>
            {paginatedRequests.map((request, i) => (
              <motion.div
                key={request.id}
                className="border border-gray-200 rounded-xl p-4 relative cursor-pointer"
                onClick={(e) => handleViewDetails(request, e)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={request.storeName} image={request.storeImage} size="medium" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {request.storeName}
                      </h3>
                      <p className="text-xs text-gray-500">{request.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDropdownToggle(request.id, e)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <AnimatePresence>
                  {openDropdown === request.id && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 dropdown-menu top-full" 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.1 }}
                      onClick={handleActionClick}
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                        onClick={(e) => { handleViewDetails(request, e); }}
                      >
                        View Details
                      </button>
                      {request.status === "pending" && (
                        <>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                            onClick={(e) => { handleActionClick(e); handleApprove(); setOpenDropdown(null); }}
                          >
                            Approve Verification
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                            onClick={(e) => { handleActionClick(e); handleReject(); setOpenDropdown(null); }}
                          >
                            Reject Verification
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-sm text-gray-700 space-y-1">
                  <div className="cursor-pointer hover:underline">
                    <span className="font-medium">Vendor:</span> {request.fullName}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {request.dateSubmitted}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {paginatedRequests.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">No requests found</div>
          )}
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
                {Math.min(currentPage * itemsPerPage, filteredRequests.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{filteredRequests.length}</span>{" "}
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
      </motion.div>

      <VerificationModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        request={selectedRequest || {} as RequestItem}
      />
    </>
  );
}