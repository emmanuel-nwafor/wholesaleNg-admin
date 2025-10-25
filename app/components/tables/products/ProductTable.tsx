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
import { motion } from "framer-motion";
import { fetchWithToken } from "../../../utils/fetchWithToken";
import ApproveModal from "../../../components/modals/ApproveModal";
import RejectModal from "../../../components/modals/RejectModal";
import SuccessModal from "../../../components/modals/SuccessModal";

interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  status: string;
  seller: {
    fullName: string;
  } | null;
  productId: string;
  categories: string[];
  type: string;
  images: string[];
}

interface ProductsResponse {
  products: ApiProduct[];
  total: number;
}

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

interface ProductTableProps {
  filter?: string; // 'all' | 'pending' | 'approved' | 'rejected'
}

interface UpdateResponse {
  message?: string;
  product?: ApiProduct;
}

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

export default function ProductTable({ filter = 'all' }: ProductTableProps): React.JSX.Element {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [approveModal, setApproveModal] = useState<{ isOpen: boolean; productId: string; productName: string }>({ isOpen: false, productId: "", productName: "" });
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; productId: string; productName: string }>({ isOpen: false, productId: "", productName: "" });
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: ProductsResponse = await fetchWithToken("/admin/products", {
          method: "GET",
        });
        if (data?.products) {
          const mappedProducts: Product[] = data.products.map((p) => ({
            id: p._id,
            image: p.images[0] || "https://i.pinimg.com/1200x/96/f2/08/96f20861d123db5f51b2022679be7c1a.jpg",
            name: p.name,
            seller: p.seller ? `by ${p.seller.fullName}` : "Unknown Seller",
            productId: p.productId,
            categories: p.categories.length > 0 ? p.categories.join(', ') : "N/A",
            type: p.type,
            price: `₦${p.price.toLocaleString()}`,
            moq: "1 piece",
            status: p.status.toLowerCase() === "approved" ? "Approved" : p.status.toLowerCase() === "pending" ? "Pending" : "Rejected",
          }));
          setProducts(mappedProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const openApproveModal = (productId: string, productName: string) => {
    setApproveModal({ isOpen: true, productId, productName });
    setOpenDropdown(null);
  };

  const closeApproveModal = () => {
    setApproveModal({ isOpen: false, productId: "", productName: "" });
  };

  const openRejectModal = (productId: string, productName: string) => {
    setRejectModal({ isOpen: true, productId, productName });
    setOpenDropdown(null);
  };

  const closeRejectModal = () => {
    setRejectModal({ isOpen: false, productId: "", productName: "" });
  };

  const openSuccessModal = (message: string) => {
    setSuccessModal({ isOpen: true, message });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, message: "" });
  };

  const handleStatusChange = async (productId: string, action: "approve" | "reject") => {
    const oldProducts = [...products];
    const status = action === "approve" ? "approved" : "rejected";

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, status: action === "approve" ? "Approved" : "Rejected" } : p
      )
    );

    try {
      const data: UpdateResponse = await fetchWithToken(`/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (data?.message && data.product) {
        setProducts((prev) =>
          prev.map((p) =>
            p.productId === data.product!.productId
              ? {
                  ...p,
                  status: data.product!.status.toLowerCase() === "approved" ? "Approved" : data.product!.status.toLowerCase() === "pending" ? "Pending" : "Rejected",
                }
              : p
          )
        );
        openSuccessModal(`${action === "approve" ? "Approved" : "Rejected"} successfully`);
      } else {
        throw new Error("No data returned");
      }
    } catch (err) {
      // Revert on error
      setProducts(oldProducts);
      console.error("Error updating product status:", err);
    }
  };

  const handleViewProduct = (id: string) => {
    router.push(`/management/product-management/${id}`);
  };

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

  const statusFilteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.status.toLowerCase() === filter);

  const filteredProducts = statusFilteredProducts.filter(
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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 text-center text-gray-600"
      >
        Loading products...
      </motion.div>
    );
  }

  return (
    <>
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
                placeholder="Search products..."
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
                <motion.tr
                  key={product.id}
                  className="hover:bg-gray-50"
                  variants={itemVariants}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-lg object-cover mr-4"
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be64de0c3c3358.jpg";
                        }}
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
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === product.id ? null : product.id
                        )
                      }
                      className="px-2 py-2 text-gray-400 rounded-xl"
                    >
                      <MoreHorizontal size={16} />
                    </motion.button>

                    {openDropdown === product.id && (
                      <div className="absolute right-0 mt-2 py-4 m-5 rounded-xl w-40 bg-white border border-gray-200 shadow-lg z-10" ref={dropdownRef}>
                        <button
                          className="block w-full text-left px-5 py-2 text-sm rounded-lg hover:bg-gray-50 text-gray-700"
                          onClick={() => handleViewProduct(product.id)}
                        >
                          View Product
                        </button>
                        <button
                          className="block w-full text-left px-5 py-2 text-sm rounded-lg hover:bg-gray-50 text-gray-700"
                          onClick={() => openApproveModal(product.productId, product.name)}
                        >
                          Approve Product
                        </button>
                        <button
                          className="block w-full text-left px-5 py-2 text-sm rounded-lg hover:bg-gray-50 text-gray-700"
                          onClick={() => openRejectModal(product.productId, product.name)}
                        >
                          Reject Product
                        </button>
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
          {paginatedProducts.map((product) => (
            <motion.div
              key={product.id}
              className="border border-gray-200 rounded-xl p-4 relative"
              variants={itemVariants}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <img
                    className="h-14 w-14 rounded-lg object-cover"
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be64de0c3c3358.jpg";
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500">{product.seller}</p>
                  </div>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === product.id ? null : product.id
                      )
                    }
                    className="p-1 text-gray-400 rounded-xl"
                  >
                    <MoreHorizontal size={14} />
                  </motion.button>
                  {openDropdown === product.id && (
                    <div className="absolute right-0 p-2 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        className="block w-full text-left px-4 py-2 text-xs rounded-lg hover:bg-gray-50 text-gray-700"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        View Product
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-xs rounded-lg hover:bg-gray-50 text-gray-700"
                        onClick={() => openApproveModal(product.productId, product.name)}
                      >
                        Approve Product
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-xs rounded-lg hover:bg-gray-50 text-gray-700"
                        onClick={() => openRejectModal(product.productId, product.name)}
                      >
                        Reject Product
                      </button>
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
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{filteredProducts.length}</span>{" "}
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

      <ApproveModal
        isOpen={approveModal.isOpen}
        onClose={closeApproveModal}
        onConfirm={() => {
          closeApproveModal();
          handleStatusChange(approveModal.productId, "approve");
        }}
        productName={approveModal.productName}
      />

      <RejectModal
        isOpen={rejectModal.isOpen}
        onClose={closeRejectModal}
        onConfirm={() => {
          closeRejectModal();
          handleStatusChange(rejectModal.productId, "reject");
        }}
        productName={rejectModal.productName}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        message={successModal.message}
      />
    </>
  );
}