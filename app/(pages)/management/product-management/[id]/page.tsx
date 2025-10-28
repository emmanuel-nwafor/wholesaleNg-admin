"use client";

import React, { useState, useEffect } from "react";
import { use } from "react";
import { motion } from "framer-motion";
import { fetchWithToken } from "../../../../utils/fetchWithToken";
import ApproveModal from "../../../../components/modals/ApproveModal";
import RejectModal from "../../../../components/modals/RejectModal";
import SuccessModal from "../../../../components/modals/SuccessModal";
import { Check, Star, Trash2, X } from "lucide-react";

interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  status: string;
  seller: { fullName: string } | null;
  productId: string;
  categories: string[];
  type: string;
  images: string[];
  description?: string;
  condition?: string;
  isFeatured?: boolean;
  views?: number;
  likes?: number;
  verified?: boolean;
  tags?: string[];
  vendor?: { fullName: string };
  createdAt?: string;
  variants?: any[];
  pricingTiers?: any[];
}

interface ProductResponse {
  product: ApiProduct;
}

interface ProductDetailsProps {
  params: Promise<{ id: string }>;
}

const defaultImage = "https://i.pinimg.com/736x/77/bb/58/77bb584d7313eb31d40afa9a76b3c8d9.jpg";

export default function ProductDetails({ params }: ProductDetailsProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data: ProductResponse = await fetchWithToken(`/admin/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const openSuccessModal = (msg: string) => setSuccessModal({ isOpen: true, message: msg });
  const closeSuccessModal = () => setSuccessModal({ isOpen: false, message: "" });

  const handleStatusChange = async (status: "approved" | "rejected") => {
    if (!product) return;
    try {
      await fetchWithToken(`/admin/products/${product.productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setProduct({ ...product, status });
      openSuccessModal(`Product ${status} successfully`);
      setApproveModal(false);
      setRejectModal(false);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    if (!product) return;
    try {
      await fetchWithToken(`/admin/products/${product.productId}`, { method: "DELETE" });
      openSuccessModal("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-600">Loading product details...</div>
    );

  if (!product)
    return (
      <div className="p-10 text-center text-red-600">Product not found.</div>
    );

  const sellerName = product.seller?.fullName || product.vendor?.fullName || "Unknown Seller";
  const categories = product.categories.length > 0 ? product.categories.join(", ") : "N/A";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white overflow-hidden m-4 sm:m-6 sm:px-4 md:px-10 lg:px-10"
    >
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-8 p-6">
        {/* Left: Product Image */}
        <div className="flex justify-center items-center bg-gray-50 rounded-3xl p-4 flex-1">
          <img
            src={product.images[0] || defaultImage}
            alt={product.name}
            className="w-full max-w-md h-auto object-cover rounded-lg"
          />
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col flex-1">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">
              {product.name}
            </h1>
            <div className="mb-4 space-y-3">
              <p className="flex items-center gap-2 text-sm text-gray-600">
                {sellerName}
                <span className="text-green-600 font-medium flex items-center gap-1">
                  4.5
                  <Star size={16} className="text-yellow-500 fill-current" />
                  (3k+)
                </span>
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-900">Category:</span>
                {categories}
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-900">Product ID:</span>
                {product.productId}
              </p>
            </div>

            <div className="text-sm text-gray-700 p-4 space-y-2 bg-gray-50 rounded-2xl my-6">
              <p className="text-3xl font-medium text-gray-900">
                ₦{product.price.toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm">MOQ: 1 piece</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-4">
            <button
              onClick={() => setRejectModal(true)}
              className="flex-1 px-5 py-4 gap-4 flex items-center justify-center rounded-2xl border border-gray-200 text-red-500 font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X size={26} className="bg-red-500 p-1 rounded-full text-white" /> Reject Product
            </button>
            <button
              onClick={() => setApproveModal(true)}
              className="flex-1 px-5 py-4 gap-4 rounded-2xl flex items-center justify-center bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              <Check size={26} className="bg-white p-1 rounded-full text-black" /> Approve Product
            </button>
          </div>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-500 font-medium mt-8 hover:underline text-sm self-center"
          >
            <Trash2 size={16} /> Delete Product
          </button>
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="border-t border-gray-100 px-6 py-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Product Descriptions
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}

      {/* Modals */}
      <ApproveModal
        isOpen={approveModal}
        onClose={() => setApproveModal(false)}
        onConfirm={() => handleStatusChange("approved")}
        productName={product.name}
      />

      <RejectModal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        onConfirm={() => handleStatusChange("rejected")}
        productName={product.name}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        message={successModal.message}
      />
    </motion.div>
  );
}