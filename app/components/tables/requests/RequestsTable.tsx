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

interface RequestItem {
  id: string;
  storeImage: string;
  storeName: string;
  email: string;
  fullName: string;
  userImage: string;
  nni: string;
  cacNo: string;
  dateSubmitted: string;
  status: "Approved" | "Pending" | "Rejected" | string;
}

const mockRequests: RequestItem[] = [
  {
    id: "VR-001",
    storeImage:
      "https://i.pinimg.com/1200x/cf/08/ff/cf08ff39e65eaab359572c1a07b4a5b6.jpg",
    storeName: "ABSOLUTE Stores",
    email: "estherhoward82@gmail.com",
    fullName: "Esther Howard",
    userImage:
      "https://i.pinimg.com/736x/11/d8/b4/11d8b417be2522a3dd88930fac4b1f6c.jpg",
    nni: "1234567890",
    cacNo: "987654321",
    dateSubmitted: "09-20-2025, 11:00 PM",
    status: "Approved",
  },
  {
    id: "VR-002",
    storeImage:
      "https://i.pinimg.com/736x/33/4d/84/334d8445375f2996cebc78d266ea7ef4.jpg",
    storeName: "ABSOLUTE Stores",
    email: "estherhoward82@gmail.com",
    fullName: "Esther Howard",
    userImage:
      "https://i.pinimg.com/736x/33/4d/84/334d8445375f2996cebc78d266ea7ef4.jpg",
    nni: "1234567890",
    cacNo: "987654321",
    dateSubmitted: "09-20-2025, 11:00 PM",
    status: "Pending",
  },
  {
    id: "VR-003",
    storeImage:
      "https://i.pinimg.com/1200x/cf/08/ff/cf08ff39e65eaab359572c1a07b4a5b6.jpg",
    storeName: "ABSOLUTE Stores",
    email: "estherhoward82@gmail.com",
    fullName: "Esther Howard",
    userImage:
      "https://i.pinimg.com/1200x/cf/08/ff/cf08ff39e65eaab359572c1a07b4a5b6.jpg",
    nni: "1234567890",
    cacNo: "987654321",
    dateSubmitted: "09-20-2025, 11:00 PM",
    status: "Pending",
  },
  {
    id: "VR-004",
    storeImage:
      "https://i.pinimg.com/736x/79/ae/7a/79ae7ad683ac85aac7d0a443db553057.jpg",
    storeName: "ABSOLUTE Stores",
    email: "estherhoward82@gmail.com",
    fullName: "Esther Howard",
    userImage:
      "https://i.pinimg.com/736x/79/ae/7a/79ae7ad683ac85aac7d0a443db553057.jpg",
    nni: "1234567890",
    cacNo: "987654321",
    dateSubmitted: "09-20-2025, 11:00 PM",
    status: "Pending",
  },
  {
    id: "VR-005",
    storeImage:
      "https://i.pinimg.com/736x/36/0b/4f/360b4fa69adc5b1db159cecb4ce467bc.jpg",
    storeName: "ABSOLUTE Stores",
    email: "estherhoward82@gmail.com",
    fullName: "Esther Howard",
    userImage:
      "https://i.pinimg.com/736x/36/0b/4f/360b4fa69adc5b1db159cecb4ce467bc.jpg",
    nni: "1234567890",
    cacNo: "987654321",
    dateSubmitted: "09-20-2025, 11:00 PM",
    status: "Rejected",
  },
];

const getStatusColor = (status: string): string => {
  switch (status) {
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

export default function RequestsTable(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(
    null
  );
  const itemsPerPage = 8;

  const filteredRequests = mockRequests.filter(
    (r) =>
      r.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleApprove = (): void => {
    setOpenModal(false);
  };

  const handleReject = (): void => {
    setOpenModal(false);
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
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    // variants={rowVariants}
                    custom={i}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover mr-4"
                          src={request.storeImage}
                          alt={request.storeName}
                        />
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
                        <span className="ml-1">{request.status}</span>
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
                            // variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={handleActionClick}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                              onClick={(e) => { handleViewDetails(request, e); }}
                            >
                              View Details
                            </button>
                            {request.status === "Pending" && (
                              <>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                  onClick={(e) => { handleActionClick(e); /* Handle approve */ setOpenDropdown(null); }}
                                >
                                  Approve Verification
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                  onClick={(e) => { handleActionClick(e); /* Handle reject */ setOpenDropdown(null); }}
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
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={request.storeImage}
                      alt={request.storeName}
                    />
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
                      // variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={handleActionClick}
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                        onClick={(e) => { handleViewDetails(request, e); }}
                      >
                        View Details
                      </button>
                      {request.status === "Pending" && (
                        <>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                            onClick={(e) => { handleActionClick(e); /* Handle approve */ setOpenDropdown(null); }}
                          >
                            Approve Verification
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                            onClick={(e) => { handleActionClick(e); /* Handle reject */ setOpenDropdown(null); }}
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
                      <span className="ml-1">{request.status}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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

      {/* Modal */}
      <AnimatePresence>
        {openModal && selectedRequest && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
              onClick={() => setOpenModal(false)}
              // variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
            <motion.div 
              className="fixed inset-0 flex items-center justify-center z-50 p-4" 
              onClick={() => setOpenModal(false)}
            //   variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div 
                className="bg-white rounded-2xl p-6 w-full max-w-md" 
                onClick={(e) => e.stopPropagation()}
                // variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Verification Request</h2>
                  <button onClick={() => setOpenModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedRequest.userImage}
                      alt={selectedRequest.fullName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-900">{selectedRequest.fullName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">NNI</p>
                    <p className="font-medium text-gray-900">{selectedRequest.nni}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CAC No.</p>
                    <p className="font-medium text-gray-900">{selectedRequest.cacNo}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
                    onClick={handleReject}
                  >
                    Reject
                  </button>
                  <button
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    onClick={handleApprove}
                  >
                    Approve
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}