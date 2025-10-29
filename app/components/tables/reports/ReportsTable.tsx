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
import { fetchWithToken } from "@/app/utils/fetchWithToken";

interface Reporter {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

interface TargetUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

interface TargetStore {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

interface ApiReport {
  _id: string;
  reporter: Reporter;
  targetUser?: TargetUser;
  targetStore?: TargetStore;
  type: string;
  description: string;
  status: "Pending" | "Resolved" | "Rejected";
  createdAt: string;
  adminNotes?: string;
  rejectionReason?: string;
}

interface Report {
  id: string;
  reporterName: string;
  reporterType: string;
  reportedName: string;
  reportedType: string;
  reason: string;
  description: string;
  dateSubmitted: string;
  status: "Pending" | "Resolved" | "Rejected";
  targetId: string;
  adminNotes?: string;
  rejectionReason?: string;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Resolved":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string): React.JSX.Element | null => {
  switch (status) {
    case "Pending":
      return <Clock className="w-3 h-3" />;
    case "Resolved":
      return <Check className="w-3 h-3" />;
    case "Rejected":
      return <X className="w-3 h-3" />;
    default:
      return null;
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: i * 0.1,
    },
  }),
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.15 },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export default function ReportsTable() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [actionType, setActionType] = useState<"reject" | "suspend" | "resolve" | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await fetchWithToken<{ reports: ApiReport[] }>("/v1/reports");
        const mappedReports: Report[] = data.reports.map((r) => ({
          id: r._id,
          reporterName: r.reporter.fullName,
          reporterType: r.reporter.role.charAt(0).toUpperCase() + r.reporter.role.slice(1),
          reportedName: r.targetUser ? r.targetUser.fullName : r.targetStore?.fullName || "N/A",
          reportedType: r.targetUser ? (r.targetUser.role.charAt(0).toUpperCase() + r.targetUser.role.slice(1)) : "Store",
          reason: r.type,
          description: r.description,
          dateSubmitted: formatDate(r.createdAt),
          status: r.status,
          targetId: r.targetUser?._id || r.targetStore?._id || "",
          adminNotes: r.adminNotes,
          rejectionReason: r.rejectionReason,
        }));
        setReports(mappedReports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter(
    (report) =>
      report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const refetchReports = async () => {
    try {
      const data = await fetchWithToken<{ reports: ApiReport[] }>("/v1/reports");
      const mappedReports: Report[] = data.reports.map((r) => ({
        id: r._id,
        reporterName: r.reporter.fullName,
        reporterType: r.reporter.role.charAt(0).toUpperCase() + r.reporter.role.slice(1),
        reportedName: r.targetUser ? r.targetUser.fullName : r.targetStore?.fullName || "N/A",
        reportedType: r.targetUser ? (r.targetUser.role.charAt(0).toUpperCase() + r.targetUser.role.slice(1)) : "Store",
        reason: r.type,
        description: r.description,
        dateSubmitted: formatDate(r.createdAt),
        status: r.status,
        targetId: r.targetUser?._id || r.targetStore?._id || "",
        adminNotes: r.adminNotes,
        rejectionReason: r.rejectionReason,
      }));
      setReports(mappedReports);
    } catch (error) {
      console.error("Failed to refetch reports:", error);
    }
  };

  const handleViewDetails = (report: Report, e?: React.MouseEvent, type: "reject" | "suspend" | "resolve" | null = null) => {
    if (e) e.stopPropagation();
    setSelectedReport(report);
    setRejectionReason("");
    setAdminNotes("");
    setActionType(type);
    setOpenModal(true);
    setOpenDropdown(null);
  };

  const handleRejectReport = async () => {
    if (selectedReport?.id && rejectionReason.trim()) {
      try {
        await fetchWithToken(`/v1/reports/${selectedReport.id}/reject`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rejectionReason }),
        });
        await refetchReports();
        alert("Report rejected successfully.");
      } catch (error) {
        console.error("Failed to reject report:", error);
        alert("Failed to reject report.");
      }
    }
    setOpenModal(false);
    setRejectionReason("");
    setActionType(null);
  };

  const handleResolveReport = async () => {
    if (selectedReport?.id && adminNotes.trim()) {
      try {
        await fetchWithToken(`/v1/reports/${selectedReport.id}/resolve`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminNotes }),
        });
        await refetchReports();
        alert("Report resolved successfully.");
      } catch (error) {
        console.error("Failed to resolve report:", error);
        alert("Failed to resolve report.");
      }
    }
    setOpenModal(false);
    setAdminNotes("");
    setActionType(null);
  };

  const handleSuspendVendor = async () => {
    if (
      selectedReport?.targetId &&
      (selectedReport.reportedType === "Seller" || selectedReport.reportedType === "Store") &&
      adminNotes.trim()
    ) {
      try {
        await fetchWithToken(`/v1/users/${selectedReport.targetId}/suspend`, { method: "PUT" });
        await fetchWithToken(`/v1/reports/${selectedReport.id}/resolve`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminNotes }),
        });
        await refetchReports();
        alert("Vendor suspended and report resolved successfully.");
      } catch (error) {
        console.error("Failed to suspend vendor:", error);
        alert("Failed to suspend vendor.");
      }
    }
    setOpenModal(false);
    setAdminNotes("");
    setActionType(null);
  };

  const handleDropdownToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openDropdown && !(e.target as Element)?.closest('.dropdown-menu')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  const getActionHandler = () => {
    switch (actionType) {
      case "reject": return handleRejectReport;
      case "resolve": return handleResolveReport;
      case "suspend": return handleSuspendVendor;
      default: return undefined;
    }
  };

  const getActionText = () => {
    switch (actionType) {
      case "reject": return "Reject Report";
      case "resolve": return "Resolve Report";
      case "suspend": return "Suspend Vendor";
      default: return "";
    }
  };

  const isDisabled = () => {
    if (actionType === "reject") return !rejectionReason.trim();
    return !adminNotes.trim();
  };

  const getLabelText = () => actionType === "reject" ? "Rejection Reason" : "Admin Notes";

  const getPlaceholderText = () => actionType === "reject" ? "Enter reason for rejection..." : "Enter admin notes...";

  const getInputValue = () => actionType === "reject" ? rejectionReason : adminNotes;

  const getInputOnChange = () => actionType === "reject" 
    ? (e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value)
    : (e: React.ChangeEvent<HTMLTextAreaElement>) => setAdminNotes(e.target.value);

  const canPerformActions = (status: string, type?: string) => {
    if (status === "Resolved") return false;
    if (status === "Pending") return true;
    if (status === "Rejected") return type === "resolve";
    return false;
  };

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
                placeholder="Search reports..."
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
                  Report ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  Reporter
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  Reported User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  Reason
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  Date
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
                {paginatedReports.map((report, i) => (
                  <motion.tr
                    key={report.id}
                    className="hover:bg-gray-50"
                    onClick={(e) => handleViewDetails(report, e)}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={rowVariants}
                    custom={i}
                  >
                    <td className="px-6 py-4 text-gray-900">{report.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {report.reporterName}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {report.reporterType}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {report.reportedName}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {report.reportedType}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{report.reason}</td>
                    <td className="px-6 py-4 text-gray-900">{report.dateSubmitted}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {getStatusIcon(report.status)}
                        <span className="ml-1">{report.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={(e) => handleDropdownToggle(report.id, e)}
                        className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      <AnimatePresence>
                        {openDropdown === report.id && (
                          <motion.div
                            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 dropdown-menu"
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={handleActionClick}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                              onClick={(e) => { handleViewDetails(report, e); }}
                            >
                              View Details
                            </button>
                            {report.status !== "Resolved" && (
                              <>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                  onClick={(e) => { handleViewDetails(report, e, "resolve"); }}
                                >
                                  Resolve Report
                                </button>
                                {report.status === "Pending" && (report.reportedType === "Seller" || report.reportedType === "Store") && (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                    onClick={(e) => { handleViewDetails(report, e, "suspend"); }}
                                  >
                                    Suspend Vendor
                                  </button>
                                )}
                                {report.status === "Pending" && (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                                    onClick={(e) => { handleViewDetails(report, e, "reject"); }}
                                  >
                                    Reject Report
                                  </button>
                                )}
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {paginatedReports.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No reports found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 p-4">
          <AnimatePresence>
            {paginatedReports.map((report, i) => (
              <motion.div
                key={report.id}
                className="border border-gray-200 rounded-xl p-4 relative cursor-pointer"
                onClick={(e) => handleViewDetails(report, e)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {report.reporterName} - {report.reporterType}
                    </h3>
                    <p className="text-xs text-gray-500">{report.reason}</p>
                  </div>
                  <button
                    onClick={(e) => handleDropdownToggle(report.id, e)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <AnimatePresence>
                  {openDropdown === report.id && (
                    <motion.div
                      className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 dropdown-menu"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={handleActionClick}
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                        onClick={(e) => { handleViewDetails(report, e); }}
                      >
                        View Details
                      </button>
                      {report.status !== "Resolved" && (
                        <>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                            onClick={(e) => { handleViewDetails(report, e, "resolve"); }}
                          >
                            Resolve Report
                          </button>
                          {report.status === "Pending" && (report.reportedType === "Seller" || report.reportedType === "Store") && (
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                              onClick={(e) => { handleViewDetails(report, e, "suspend"); }}
                            >
                              Suspend Vendor
                            </button>
                          )}
                          {report.status === "Pending" && (
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                              onClick={(e) => { handleViewDetails(report, e, "reject"); }}
                            >
                              Reject Report
                            </button>
                          )}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>
                    <span className="font-medium">Reported:</span> {report.reportedName} - {report.reportedType}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {report.dateSubmitted}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusIcon(report.status)}
                      <span className="ml-1">{report.status}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {paginatedReports.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">No reports found</div>
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
                {Math.min(currentPage * itemsPerPage, filteredReports.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{filteredReports.length}</span>{" "}
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
        {openModal && selectedReport && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setOpenModal(false)}
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={() => setOpenModal(false)}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {actionType 
                      ? (actionType === "reject" ? "Reject Report" 
                         : actionType === "suspend" ? "Suspend Vendor" 
                         : "Resolve Report") 
                      : "Report Details"}
                  </h2>
                  <button onClick={() => setOpenModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Report ID</p>
                    <p className="font-medium text-gray-900">{selectedReport.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        selectedReport.status
                      )}`}
                    >
                      {getStatusIcon(selectedReport.status)}
                      <span className="ml-1">{selectedReport.status}</span>
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reporter</p>
                    <p className="font-medium text-gray-900">{selectedReport.reporterName} - {selectedReport.reporterType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reported User</p>
                    <p className="font-medium text-gray-900">{selectedReport.reportedName} - {selectedReport.reportedType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{selectedReport.dateSubmitted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium text-gray-900">{selectedReport.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-700">{selectedReport.description}</p>
                  </div>
                  {selectedReport.status === "Resolved" && selectedReport.adminNotes && (
                    <div>
                      <p className="text-sm text-gray-500">Admin Notes</p>
                      <p className="text-gray-700">{selectedReport.adminNotes}</p>
                    </div>
                  )}
                  {selectedReport.status === "Rejected" && selectedReport.rejectionReason && (
                    <div>
                      <p className="text-sm text-gray-500">Rejection Reason</p>
                      <p className="text-gray-700">{selectedReport.rejectionReason}</p>
                    </div>
                  )}
                </div>
                {canPerformActions(selectedReport.status) && actionType && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{getLabelText()}</label>
                      <textarea
                        value={getInputValue()}
                        onChange={getInputOnChange()}
                        placeholder={getPlaceholderText()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
                {actionType && (
                  <div className="flex gap-3">
                    <button
                      className={`flex-1 py-4 rounded-2xl text-sm font-medium ${actionType === "reject" 
                        ? "border border-gray-300 hover:bg-red-50 text-red-600" 
                        : actionType === "suspend" 
                        ? "bg-red-600 text-white hover:bg-red-700" 
                        : "bg-green-600 text-white hover:bg-green-700"}`}
                      onClick={getActionHandler()}
                      disabled={isDisabled()}
                    >
                      {getActionText()}
                    </button>
                    <button
                      className="flex-1 py-4 bg-gray-300 text-gray-700 rounded-2xl hover:bg-gray-400 text-sm font-medium"
                      onClick={() => setOpenModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {canPerformActions(selectedReport.status) && !actionType && (
                  <div className="flex gap-3">
                    <button
                      className="flex-1 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 text-sm font-medium"
                      onClick={() => setActionType("resolve")}
                    >
                      Resolve Report
                    </button>
                    {selectedReport.reportedType === "Seller" || selectedReport.reportedType === "Store" ? (
                      <button
                        className="flex-1 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 text-sm font-medium"
                        onClick={() => setActionType("suspend")}
                      >
                        Suspend Vendor
                      </button>
                    ) : null}
                    {selectedReport.status === "Pending" && (
                      <button
                        className="flex-1 py-4 border border-gray-300 rounded-2xl hover:bg-red-50 text-sm font-medium text-red-600"
                        onClick={() => setActionType("reject")}
                      >
                        Reject Report
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}