"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MoreHorizontal,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const mockCategories = [
  {
    id: "CAT-001",
    name: "Phones & Tablet",
    productCount: 425,
    subcategories: 2,
    brands: 4,
    status: "Active",
  },
  {
    id: "CAT-002",
    name: "Phones & Tablet",
    productCount: 425,
    subcategories: 2,
    brands: 5,
    status: "Archived",
  },
  {
    id: "CAT-003",
    name: "Phones & Tablet",
    productCount: 425,
    subcategories: 2,
    brands: 6,
    status: "Active",
  },
  {
    id: "CAT-004",
    name: "Phones & Tablet",
    productCount: 425,
    subcategories: 2,
    brands: 7,
    status: "Active",
  },
  {
    id: "CAT-005",
    name: "Phones & Tablet",
    productCount: 425,
    subcategories: 2,
    brands: 8,
    status: "Archived",
  },
  {
    id: "CAT-006",
    name: "Fashion",
    productCount: 150,
    subcategories: 3,
    brands: 12,
    status: "Active",
  },
  {
    id: "CAT-007",
    name: "Electronics",
    productCount: 300,
    subcategories: 1,
    brands: 9,
    status: "Archived",
  },
  {
    id: "CAT-008",
    name: "Home & Garden",
    productCount: 200,
    subcategories: 4,
    brands: 15,
    status: "Active",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Archived":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <Check className="w-3 h-3" />;
    case "Archived":
      return <X className="w-3 h-3" />;
    default:
      return null;
  }
};

export default function CategoriesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8;

  const filteredCategories = mockCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

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
              placeholder="Search products..."
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
                Name
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Subcategories
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Brand/Nested Subcategories
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
            {paginatedCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">
                    {category.name}{" "}
                    <span className="text-sm text-gray-500">
                      {category.productCount} Products
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-900">{category.subcategories}</td>
                <td className="px-4 py-4 text-gray-900">{category.brands}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      category.status
                    )}`}
                  >
                    {getStatusIcon(category.status)}
                    <span className="ml-1">{category.status}</span>
                  </span>
                </td>
                <td className="px-4 py-4 relative">
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === category.id ? null : category.id
                      )
                    }
                    className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {openDropdown === category.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {["View Category", "Edit Category", "Delete Category"].map(
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
        {paginatedCategories.map((category) => (
          <div
            key={category.id}
            className="border border-gray-200 rounded-xl p-4 relative"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {category.productCount} Products
                </p>
              </div>
              <div className="relative" ref={openDropdown === category.id ? dropdownRef : undefined}>
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === category.id ? null : category.id
                    )
                  }
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal size={16} />
                </button>
                {openDropdown === category.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {["View Category", "Edit Category", "Delete Category"].map(
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
                <span className="font-medium">Subcategories:</span>{" "}
                {category.subcategories}
              </div>
              <div>
                <span className="font-medium">Brands/Nested:</span>{" "}
                {category.brands}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    category.status
                  )}`}
                >
                  {getStatusIcon(category.status)}
                  <span className="ml-1">{category.status}</span>
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
              {Math.min(currentPage * itemsPerPage, filteredCategories.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium">{filteredCategories.length}</span>{" "}
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