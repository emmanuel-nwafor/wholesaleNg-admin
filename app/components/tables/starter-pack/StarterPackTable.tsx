"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MoreHorizontal,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const mockPacks = [
  {
    id: "STP-001",
    name: "Fashion Pack",
    vendors: 10,
    price: "₦1000",
    status: "Active",
  },
  {
    id: "STP-002",
    name: "Fashion Pack",
    vendors: 10,
    price: "₦1000",
    status: "Active",
  },
  {
    id: "STP-003",
    name: "Fashion Pack",
    vendors: 10,
    price: "₦1000",
    status: "Active",
  },
  {
    id: "STP-004",
    name: "Fashion Pack",
    vendors: 10,
    price: "₦1000",
    status: "Active",
  },
  {
    id: "STP-005",
    name: "Fashion Pack",
    vendors: 10,
    price: "₦1000",
    status: "Active",
  },
  {
    id: "STP-006",
    name: "Fashion Pack",
    vendors: 10,
    price: "₦1000",
    status: "Active",
  },
  {
    id: "STP-007",
    name: "Fashion Pack",
    vendors: 10,
    price: "₦1000",
    status: "Active",
  },
  {
    id: "STP-008",
    name: "Fashion Pack",
    vendors: 10,
    price: "₦1000",
    status: "Active",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <Check className="w-3 h-3" />;
    default:
      return null;
  }
};

export default function StarterPackTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8;

  const filteredPacks = mockPacks.filter(
    (pack) =>
      pack.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPacks = filteredPacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPacks.length / itemsPerPage);

  const handlePageChange = (page: number) => {
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

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full sm:w-auto sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search starter packs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-20 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <button className="p-3 rounded-2xl bg-gray-800 text-white">
            Search
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
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
              <tr key={pack.id} className="hover:bg-gray-50">
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
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === pack.id ? null : pack.id
                      )
                    }
                    className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {openDropdown === pack.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {["View Pack", "Edit Pack", "Delete Pack"].map(
                        (action) => (
                          <button
                            key={action}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {action}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 p-4">
        {paginatedPacks.map((pack) => (
          <div
            key={pack.id}
            className="border border-gray-200 rounded-xl p-4 relative"
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
              <div className="relative" ref={openDropdown === pack.id ? dropdownRef : undefined}>
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === pack.id ? null : pack.id
                    )
                  }
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal size={16} />
                </button>
                {openDropdown === pack.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {["View Pack", "Edit Pack", "Delete Pack"].map(
                      (action) => (
                        <button
                          key={action}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
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
              {Math.min(currentPage * itemsPerPage, filteredPacks.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium">{filteredPacks.length}</span>{" "}
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