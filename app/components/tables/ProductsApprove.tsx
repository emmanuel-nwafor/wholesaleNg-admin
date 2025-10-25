// ProductsApprove.tsx (updated main component)
"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fetchWithToken } from "../../utils/fetchWithToken";
import SuccessModal from "../../components/modals/SuccessModal";
import ApproveModal from "../../components/modals/ApproveModal";
import RejectModal from "../../components/modals/RejectModal";

interface Seller {
  fullName?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  status: string;
  seller?: Seller | null;
  productId?: string;
}

interface ProductsResponse {
  products: Product[];
}

interface UpdateResponse {
  message?: string;
  product?: Product;
}

export default function ProductsApprove(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [approveModal, setApproveModal] = useState<{ isOpen: boolean; productId: string; productName: string }>({ isOpen: false, productId: "", productName: "" });
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; productId: string; productName: string }>({ isOpen: false, productId: "", productName: "" });
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });

  // --- Fetch products ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: ProductsResponse = await fetchWithToken("/admin/products", {
          method: "GET",
        });

        if (data?.products) setProducts(data.products.slice(0, 3));
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- Handle approve modal open ---
  const openApproveModal = (productId: string, productName: string) => {
    setApproveModal({ isOpen: true, productId, productName });
  };

  // --- Handle approve modal close ---
  const closeApproveModal = () => {
    setApproveModal({ isOpen: false, productId: "", productName: "" });
  };

  // --- Handle reject modal open ---
  const openRejectModal = (productId: string, productName: string) => {
    setRejectModal({ isOpen: true, productId, productName });
  };

  // --- Handle reject modal close ---
  const closeRejectModal = () => {
    setRejectModal({ isOpen: false, productId: "", productName: "" });
  };

  // --- Handle success modal open ---
  const openSuccessModal = (message: string) => {
    setSuccessModal({ isOpen: true, message });
  };

  // --- Handle success modal close ---
  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, message: "" });
  };

  // --- Handle product approval/rejection ---
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
              ? { ...p, ...data.product!, seller: p.seller }
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

  // --- Render states ---
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="m-4 bg-white rounded-3xl border border-gray-200 p-6 text-center text-gray-600"
      >
        Loading products...
      </motion.div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="m-4 bg-white rounded-3xl border border-gray-200 p-6 text-center text-gray-600"
      >
        No products found.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="m-4 bg-white rounded-3xl border border-gray-200 overflow-hidden"
    >
      <motion.div
        className="flex justify-between items-center p-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-sm font-bold text-gray-900">Products Approval</h2>
        <button className="flex items-center gap-1 text-blue-600 text-sm hover:underline">
          View All
          <ArrowRight size={16} />
        </button>
      </motion.div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <motion.table
          className="w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Price/MOQ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <motion.tr
                key={product._id}
                className="hover:bg-gray-50"
                variants={itemVariants}
                transition={{ duration: 0.2 }}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-medium">
                        {product.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        by {product.seller?.fullName || "Unknown Seller"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>₦{product.price.toLocaleString()}</div>
                  <div
                    className={`text-xs font-medium ${
                      product.status.toLowerCase() === "approved"
                        ? "text-green-600 bg-green-100 rounded-full text-center"
                        : product.status.toLowerCase() === "pending"
                        ? "text-yellow-600 bg-yellow-100 rounded-full text-center"
                        : "text-red-500 bg-red-100 rounded-full text-center"
                    }`}
                  >
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openRejectModal(product.productId || product._id, product.name)}
                    className="px-2 py-2 bg-gray-100 border border-gray-200 text-red-400 rounded-xl hover:bg-red-200 transition"
                  >
                    Reject
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openApproveModal(product.productId || product._id, product.name)}
                    className="px-2 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-500 transition"
                  >
                    Approve
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      {/* Mobile Grid */}
      <motion.div
        className="md:hidden grid grid-cols-1 gap-4 p-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {products.map((product) => (
          <motion.div
            key={product._id}
            className="bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col gap-2"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {product.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">
                  {product.seller?.fullName || "Unknown Seller"}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-900">
                  ₦{product.price.toLocaleString()}
                </div>
                <div
                  className={`text-xs font-medium ${
                    product.status.toLowerCase() === "approved"
                      ? "text-green-600"
                      : product.status.toLowerCase() === "pending"
                      ? "text-yellow-600"
                      : "text-red-500"
                  }`}
                >
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openRejectModal(product.productId || product._id, product.name)}
                  className="px-2 py-1 bg-gray-100 text-red-400 rounded-xl hover:bg-red-200 transition text-xs"
                >
                  Reject
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openApproveModal(product.productId || product._id, product.name)}
                  className="px-2 py-1 bg-slate-700 text-white rounded-xl hover:bg-slate-500 transition text-xs"
                >
                  Approve
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
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
    </motion.div>
  );
}