"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Eye,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const mockBanners = [
  {
    id: "BAN-101",
    title: "Normal",
    type: "Simple",
    device: "Web",
    date: "End Date: 12-09-2025",
    status: "Expired",
  },
  {
    id: "BAN-102",
    title: "Fashion Pack",
    type: "Starter Pack",
    device: "Web",
    date: "End Date: 12-09-2025",
    status: "Active",
  },
  {
    id: "BAN-103",
    title: "Starter Pack",
    type: "Simple",
    device: "Web",
    date: "Preview Banner",
    status: "Active",
  },
  {
    id: "BAN-104",
    title: "Fashion Pack",
    type: "Starter Pack",
    device: "Mobile",
    date: "Delete Banner",
    status: "Active",
  },
  {
    id: "BAN-105",
    title: "Starter Pack",
    type: "Simple",
    device: "Web",
    date: "End Date: 12-09-2025",
    status: "Active",
  },
  {
    id: "BAN-106",
    title: "Starter Pack",
    type: "Simple",
    device: "Web",
    date: "End Date: 12-09-2025",
    status: "Active",
  },
  {
    id: "BAN-107",
    title: "Starter Pack",
    type: "Simple",
    device: "Web",
    date: "End Date: 12-09-2025",
    status: "Active",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Expired":
      return "bg-red-100 text-red-800";
    case "Disabled":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <Eye className="w-3 h-3" />;
    case "Expired":
      return <Trash2 className="w-3 h-3" />;
    case "Disabled":
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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.15 },
  },
};

const parseDate = (dateStr: string) => {
  if (!dateStr) return "";
  const [month, day, year] = dateStr.split("-").map(Number);
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
};

const formatDisplayDate = (isoDate: string) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${month}-${day}-${year}`;
};

export default function BannersTable() {
  const [banners, setBanners] = useState(mockBanners);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    device: "",
    startDate: "",
    endDate: "",
  });
  const [isAdd, setIsAdd] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const itemsPerPage = 8;

  const filteredBanners = banners.filter(
    (banner) =>
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedBanners = filteredBanners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAdd = () => {
    setFormData({ title: "", type: "", device: "", startDate: "", endDate: "" });
    setIsAdd(true);
    setEditingId(null);
    setOpenModal(true);
  };

  const handleEdit = (banner: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let ed = "";
    if (banner.date?.startsWith("End Date:")) {
      const datePart = banner.date.substring(9);
      ed = parseDate(datePart);
    }
    setFormData({
      title: banner.title,
      type: banner.type,
      device: banner.device,
      startDate: "",
      endDate: ed,
    });
    setIsAdd(false);
    setEditingId(banner.id);
    setOpenModal(true);
    setOpenDropdown(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdd) {
      const newBanner = {
        id: `BAN-${Date.now() % 10000 + 101}`,
        title: formData.title,
        type: formData.type,
        device: formData.device,
        date: formData.endDate ? `End Date: ${formatDisplayDate(formData.endDate)}` : "",
        status: "Active",
      };
      setBanners([...banners, newBanner]);
    } else if (editingId) {
      setBanners(
        banners.map((b) =>
          b.id === editingId
            ? {
                ...b,
                title: formData.title,
                type: formData.type,
                device: formData.device,
                date: formData.endDate ? `End Date: ${formatDisplayDate(formData.endDate)}` : b.date,
              }
            : b
        )
      );
    }
    setOpenModal(false);
  };

  const handleDelete = () => {
    if (editingId) {
      setBanners(banners.filter((b) => b.id !== editingId));
    }
    setOpenModal(false);
  };

  const handleDisable = (id: string) => {
    setBanners(
      banners.map((b) => (b.id === id ? { ...b, status: "Disabled" } : b))
    );
    setOpenDropdown(null);
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
    setOpenDropdown(null);
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
      if (openDropdown && !(e.target as Element)?.closest(".dropdown-menu")) {
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
                placeholder="Search banners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <button className="px-6 py-3 rounded-2xl bg-gray-800 text-white text-sm">
              Search
            </button>
            <div className="flex gap-2">
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
                  Banner ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  Device
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
                {paginatedBanners.map((banner, i) => (
                  <motion.tr
                    key={banner.id}
                    className="hover:bg-gray-50"
                    onClick={(e) => handleEdit(banner, e)}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={rowVariants}
                    custom={i}
                  >
                    <td className="px-6 py-4 text-gray-900">{banner.id}</td>
                    <td className="px-6 py-4 text-gray-900">{banner.title}</td>
                    <td className="px-6 py-4 text-gray-900">{banner.type}</td>
                    <td className="px-6 py-4 text-gray-900">{banner.device}</td>
                    <td className="px-6 py-4 text-gray-900">{banner.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          banner.status
                        )}`}
                      >
                        {getStatusIcon(banner.status)}
                        <span className="ml-1">{banner.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={(e) => handleDropdownToggle(banner.id, e)}
                        className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      <AnimatePresence>
                        {openDropdown === banner.id && (
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
                              onClick={(e) => {
                                handleEdit(banner, e);
                              }}
                            >
                              Edit Banner
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                              onClick={() => handleDisable(banner.id)}
                            >
                              Disable Banner
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                              onClick={() => handleDeleteBanner(banner.id)}
                            >
                              Delete Banner
                            </button>
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
            {paginatedBanners.map((banner, i) => (
              <motion.div
                key={banner.id}
                className="border border-gray-200 rounded-xl p-4 relative cursor-pointer"
                onClick={(e) => handleEdit(banner, e)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{banner.title}</h3>
                    <p className="text-xs text-gray-500">{banner.type} - {banner.device}</p>
                  </div>
                  <button
                    onClick={(e) => handleDropdownToggle(banner.id, e)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <AnimatePresence>
                  {openDropdown === banner.id && (
                    <motion.div
                      className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 dropdown-menu top-full"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={handleActionClick}
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                        onClick={(e) => {
                          handleEdit(banner, e);
                        }}
                      >
                        Edit Banner
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                        onClick={() => handleDisable(banner.id)}
                      >
                        Disable Banner
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                        onClick={() => handleDeleteBanner(banner.id)}
                      >
                        Delete Banner
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-sm text-gray-700 space-y-1">
                  <div className="font-medium">ID: {banner.id}</div>
                  <div>Date: {banner.date}</div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Status:</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        banner.status
                      )}`}
                    >
                      {getStatusIcon(banner.status)}
                      <span className="ml-1">{banner.status}</span>
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
                {Math.min(currentPage * itemsPerPage, filteredBanners.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{filteredBanners.length}</span>{" "}
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
        {openModal && (
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
            //   variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setOpenModal(false)}
            >
              <motion.div
                className="bg-white rounded-3xl p-6 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
                // variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {isAdd ? "Add Banner" : "Edit Banner"}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setOpenModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Banner Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="e.g. phone"
                        className="w-full px-3 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Device</label>
                      <select
                        value={formData.device}
                        onChange={(e) =>
                          setFormData({ ...formData, device: e.target.value })
                        }
                        className="w-full px-3 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Device</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Web">Web</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full px-3 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Simple">Simple</option>
                        <option value="Promo">Promo</option>
                      </select>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">Start Date</label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({ ...formData, startDate: e.target.value })
                          }
                          className="w-full px-3 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">End Date</label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({ ...formData, endDate: e.target.value })
                          }
                          className="w-full px-3 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setOpenModal(false)}
                      className="flex-1 py-4 border border-gray-300 text-gray-600 rounded-2xl hover:bg-gray-50 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-slate-700 text-white rounded-2xl hover:bg-slate-900 text-sm font-medium"
                    >
                      {isAdd ? "Add Banner" : "Update Banner"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}