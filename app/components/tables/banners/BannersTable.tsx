// Updated BannersTable.tsx
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
import { fetchWithToken } from "@/app/utils/fetchWithToken";
import BannerModal from "../../../components/modals/BannerModal"; 
import DeleteBannerModal from "../../../components/modals/DeleteBannerModal"; 
import SuccessModal from "../../../components/modals/SuccessModal"; 

interface ApiBanner {
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

interface Banner {
  id: string;
  title: string;
  type: string;
  device: string;
  startDate: string;
  endDate: string;
  status: string;
  image?: string;
}

interface FormData {
  title: string;
  type: string;
  device: string;
  startDate: string;
  endDate: string;
  image: File | null;
}

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

const parseDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

const formatDisplayDate = (isoDate: string) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

export default function BannersTable() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [modalProps, setModalProps] = useState<{
    isOpen: boolean;
    mode: "view" | "edit" | "add";
    banner?: ApiBanner;
  }>({
    isOpen: false,
    mode: "view",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);
  const [selectedBannerTitle, setSelectedBannerTitle] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await fetchWithToken<{ banners: ApiBanner[] }>("/v1/banners");
        const mappedBanners: Banner[] = data.banners.map((b) => ({
          id: b._id,
          title: b.bannerTitle,
          type: b.type,
          device: b.position,
          startDate: parseDate(b.startDate),
          endDate: parseDate(b.endDate),
          status: b.status ? "Active" : "Expired",
          image: b.image,
        }));
        setBanners(mappedBanners);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

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

  const handleView = async (id: string) => {
    try {
      const data = await fetchWithToken<{ banner: ApiBanner }>("/v1/banners/" + id);
      setModalProps({ isOpen: true, mode: "view", banner: data.banner });
    } catch (error) {
      console.error("Failed to fetch banner:", error);
    }
  };

  const handleEdit = async (id?: string) => {
    if (id) {
      try {
        const data = await fetchWithToken<{ banner: ApiBanner }>("/v1/banners/" + id);
        setModalProps({ isOpen: true, mode: "edit", banner: data.banner });
      } catch (error) {
        console.error("Failed to fetch banner for edit:", error);
      }
    } else {
      setModalProps({ isOpen: true, mode: "add" });
    }
    setOpenDropdown(null);
  };

  const handleAdd = () => handleEdit();

  const handleModalSubmit = async (data: FormData) => {
    const submitData = new FormData();
    submitData.append("bannerTitle", data.title);
    submitData.append("type", data.type);
    submitData.append("position", data.device);
    submitData.append("startDate", data.startDate);
    submitData.append("endDate", data.endDate);
    if (data.image) submitData.append("image", data.image);

    try {
      if (modalProps.banner?._id) {
        await fetchWithToken(`/v1/banners/${modalProps.banner._id}`, { method: "PUT", body: submitData });
      } else {
        await fetchWithToken("/v1/banners", { method: "POST", body: submitData });
      }
      // Refetch banners
      const res = await fetchWithToken<{ banners: ApiBanner[] }>("/v1/banners");
      const mappedBanners: Banner[] = res.banners.map((b) => ({
        id: b._id,
        title: b.bannerTitle,
        type: b.type,
        device: b.position,
        startDate: parseDate(b.startDate),
        endDate: parseDate(b.endDate),
        status: b.status ? "Active" : "Expired",
        image: b.image,
      }));
      setBanners(mappedBanners);
      const message = modalProps.banner?._id ? "Banner updated successfully" : "Banner added successfully";
      setSuccessMessage(message);
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to submit banner:", error);
    }
  };

  const handleDisable = async (id: string) => {
    try {
      await fetchWithToken(`/v1/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: false }),
      });
      // Refetch
      const data = await fetchWithToken<{ banners: ApiBanner[] }>("/v1/banners");
      const mappedBanners: Banner[] = data.banners.map((b) => ({
        id: b._id,
        title: b.bannerTitle,
        type: b.type,
        device: b.position,
        startDate: parseDate(b.startDate),
        endDate: parseDate(b.endDate),
        status: b.status ? "Active" : "Expired",
        image: b.image,
      }));
      setBanners(mappedBanners);
    } catch (error) {
      console.error("Failed to disable banner:", error);
    }
    setOpenDropdown(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBannerId) {
      try {
        await fetchWithToken(`/v1/banners/${selectedBannerId}`, { method: "DELETE" });
        // Refetch
        const data = await fetchWithToken<{ banners: ApiBanner[] }>("/v1/banners");
        const mappedBanners: Banner[] = data.banners.map((b) => ({
          id: b._id,
          title: b.bannerTitle,
          type: b.type,
          device: b.position,
          startDate: parseDate(b.startDate),
          endDate: parseDate(b.endDate),
          status: b.status ? "Active" : "Expired",
          image: b.image,
        }));
        setBanners(mappedBanners);
      } catch (error) {
        console.error("Failed to delete banner:", error);
      }
    }
    setDeleteModalOpen(false);
    setSelectedBannerId(null);
    setSelectedBannerTitle("");
    setOpenDropdown(null);
  };

  const handleDeleteBanner = (id: string, title: string) => {
    setSelectedBannerId(id);
    setSelectedBannerTitle(title);
    setDeleteModalOpen(true);
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
                placeholder="Search banners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <button className="px-6 py-3 rounded-2xl bg-gray-800 text-white text-sm" onClick={handleAdd}>
              Add Banner
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
        <div className="hidden lg:block overflow-x-auto">
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
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">
                  End Date
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
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleView(banner.id)}
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
                    <td className="px-6 py-4 text-gray-900">{formatDisplayDate(banner.startDate)}</td>
                    <td className="px-6 py-4 text-gray-900">{formatDisplayDate(banner.endDate)}</td>
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
                              onClick={() => handleEdit(banner.id)}
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
                              onClick={() => handleDeleteBanner(banner.id, banner.title)}
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
              {paginatedBanners.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">No banners found</td>
                </tr>
              )}
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
                onClick={() => handleView(banner.id)}
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
                        onClick={() => handleEdit(banner.id)}
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
                        onClick={() => handleDeleteBanner(banner.id, banner.title)}
                      >
                        Delete Banner
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="font-medium">ID: {banner.id}</div>
                  <div>Start Date: {formatDisplayDate(banner.startDate)}</div>
                  <div>End Date: {formatDisplayDate(banner.endDate)}</div>
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
          {paginatedBanners.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">No banners found</div>
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
      <BannerModal
        isOpen={modalProps.isOpen}
        onClose={() => setModalProps({ ...modalProps, isOpen: false })}
        mode={modalProps.mode}
        banner={modalProps.banner}
        onSubmit={handleModalSubmit}
      />
      <DeleteBannerModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        bannerTitle={selectedBannerTitle}
      />
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message={successMessage}
      />
    </>
  );
}