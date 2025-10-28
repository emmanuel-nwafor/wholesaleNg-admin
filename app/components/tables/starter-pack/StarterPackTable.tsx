"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fetchWithToken } from "../../../utils/fetchWithToken";
import {
  Search,
  MoreHorizontal,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ApiPack {
  _id: string;
  packName: string;
  vendorIds: any[];
  description: string;
  amount: number;
  status: boolean;
  createdAt: string;
}

interface PacksResponse {
  packs: ApiPack[];
}

interface Pack {
  id: string;
  name: string;
  vendors: number;
  price: string;
  status: "Active" | "Inactive";
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string): React.JSX.Element | null => {
  switch (status) {
    case "Active":
      return <Check className="w-3 h-3" />;
    default:
      return null;
  }
};

export default function StarterPackTable() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const data: PacksResponse = await fetchWithToken("/v1/starter-packs");
        if (data?.packs) {
          const mappedPacks: Pack[] = data.packs.map((p) => ({
            id: p._id,
            name: p.packName,
            vendors: p.vendorIds.length,
            price: `₦${p.amount.toLocaleString()}`,
            status: p.status ? "Active" : "Inactive",
          }));
          setPacks(mappedPacks);
        }
      } catch (err) {
        console.error("Error fetching packs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPacks();
  }, []);

  const filteredPacks = packs.filter(
    (pack) =>
      pack.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPacks = filteredPacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPacks.length / itemsPerPage);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 text-center text-gray-600"
      >
        Loading starter packs...
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <motion.div
        className="p-4 md:p-6 border-b border-gray-200"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full sm:w-auto sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search starter packs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-2xl bg-gray-800 text-white"
          >
            Search
          </motion.button>
        </div>
      </motion.div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <motion.table
          className="w-full text-sm"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Pack ID
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Pack Name
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Vendors Included
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Price
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
            {paginatedPacks.map((pack) => (
              <motion.tr
                key={pack.id}
                className="hover:bg-gray-50"
                variants={itemVariants}
                transition={{ duration: 0.2 }}
              >
                <td className="px-4 py-4 text-gray-900">{pack.id}</td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">
                    {pack.name}
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-900">{pack.vendors}</td>
                <td className="px-4 py-4 text-gray-900">{pack.price}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      pack.status
                    )}`}
                  >
                    {getStatusIcon(pack.status)}
                    <span className="ml-1">{pack.status}</span>
                  </span>
                </td>
                <td className="px-4 py-4 relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === pack.id ? null : pack.id
                      )
                    }
                    className="px-2 py-2 text-gray-400 rounded-xl"
                  >
                    <MoreHorizontal size={16} />
                  </motion.button>

                  {openDropdown === pack.id && (
                    <div className="absolute right-0 mt-2 py-4 m-5 rounded-xl w-40 bg-white border border-gray-200 shadow-lg z-10" ref={dropdownRef}>
                      {["View Pack", "Edit Pack", "Delete Pack"].map(
                        (action) => (
                          <button
                            key={action}
                            className="block w-full text-left px-5 py-2 text-sm rounded-lg hover:bg-gray-50 text-gray-700"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {action}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      {/* Mobile & Tablet Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 p-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {paginatedPacks.map((pack) => (
          <motion.div
            key={pack.id}
            className="border border-gray-200 rounded-xl p-4 relative"
            variants={itemVariants}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {pack.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {pack.id}
                </p>
              </div>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === pack.id ? null : pack.id
                    )
                  }
                  className="p-1 text-gray-400 rounded-xl"
                >
                  <MoreHorizontal size={14} />
                </motion.button>
                {openDropdown === pack.id && (
                  <div className="absolute right-0 p-2 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10" ref={dropdownRef}>
                    {["View Pack", "Edit Pack", "Delete Pack"].map(
                      (action) => (
                        <button
                          key={action}
                          className="block w-full text-left px-4 py-2 text-xs rounded-lg hover:bg-gray-50 text-gray-700"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {action}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <div>
                <span className="font-medium">Vendors Included:</span>{" "}
                {pack.vendors}
              </div>
              <div>
                <span className="font-medium">Price:</span>{" "}
                {pack.price}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    pack.status
                  )}`}
                >
                  {getStatusIcon(pack.status)}
                  <span className="ml-1">{pack.status}</span>
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-4 md:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3"
        >
          <div className="text-sm text-gray-700 text-center sm:text-left">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredPacks.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium">{filteredPacks.length}</span>{" "}
            results
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </motion.button>
            {Array.from({ length: totalPages }, (_, i) => (
              <motion.button
                key={i + 1}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}