"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MoreHorizontal,
  Check,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Define interface for product
interface Product {
  id: string;
  image: string;
  name: string;
  seller: string;
  productId: string;
  categories: string;
  type: string;
  price: string;
  moq: string;
  status: "Approved" | "Pending" | "Rejected" | string;
}

const mockProducts: Product[] = [
  {
    id: "PRD-001",
    image:
      "https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg",
    name: "iPhone 16 Pro Max",
    seller: "by ABSOLUTE stores",
    productId: "PRD-001",
    categories: "Phones & Tablets",
    type: "Simple",
    price: "₦5,000",
    moq: "50 pieces",
    status: "Approved",
  },
  {
    id: "PRD-002",
    image:
      "https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg",
    name: "Premium Cotton T-Shirt",
    seller: "by Fashion Hub",
    productId: "PRD-002",
    categories: "Fashion",
    type: "Variant",
    price: "₦5,000",
    moq: "50 pieces",
    status: "Pending",
  },
  {
    id: "PRD-005",
    image:
      "https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg",
    name: "Premium Cotton T-Shirt",
    seller: "by Fashion Hub",
    productId: "PRD-005",
    categories: "Fashion",
    type: "Simple",
    price: "₦5,000",
    moq: "50 pieces",
    status: "Rejected",
  },
];

// Type for status color helper
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

// Type for status icon helper
const getStatusIcon = (status: string): React.JSX.Element | null => {
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

export default function ProductTable(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8;

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
                Product
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Product ID
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Categories
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Type
              </th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">
                Price/MOQ
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
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-lg object-cover mr-4"
                      src={product.image}
                      alt={product.name}
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {product.seller}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-900">{product.productId}</td>
                <td className="px-4 py-4 text-gray-900">{product.categories}</td>
                <td className="px-4 py-4 text-gray-900">{product.type}</td>
                <td className="px-4 py-4 text-gray-900">
                  <div>{product.price}</div>
                  <div className="text-sm text-gray-500">{product.moq}</div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {getStatusIcon(product.status)}
                    <span className="ml-1">{product.status}</span>
                  </span>
                </td>
                <td className="px-4 py-4 relative">
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === product.id ? null : product.id
                      )
                    }
                    className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {openDropdown === product.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {["View Product", "Reject Product", "Delete Product"].map(
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
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-xl p-4 relative"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <img
                  className="h-14 w-14 rounded-lg object-cover"
                  src={product.image}
                  alt={product.name}
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500">{product.seller}</p>
                </div>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === product.id ? null : product.id
                    )
                  }
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal size={16} />
                </button>
                {openDropdown === product.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {["View Product", "Reject Product", "Delete Product"].map(
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
                <span className="font-medium">Product ID:</span>{" "}
                {product.productId}
              </div>
              <div>
                <span className="font-medium">Category:</span>{" "}
                {product.categories}
              </div>
              <div>
                <span className="font-medium">Type:</span> {product.type}
              </div>
              <div>
                <span className="font-medium">Price:</span> {product.price}
              </div>
              <div>
                <span className="font-medium">MOQ:</span> {product.moq}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    product.status
                  )}`}
                >
                  {getStatusIcon(product.status)}
                  <span className="ml-1">{product.status}</span>
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
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium">{filteredProducts.length}</span>{" "}
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
