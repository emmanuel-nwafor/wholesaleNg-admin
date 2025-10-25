"use client";

import React, { useState, useEffect } from "react";
import { use } from "react";
import { motion } from "framer-motion";
import ApproveModal from "../../../../components/modals/ApproveModal";
import RejectModal from "../../../../components/modals/RejectModal";
import SuccessModal from "../../../../components/modals/SuccessModal";
import { Trash2 } from "lucide-react";

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
}

interface ProductDetailsProps {
  params: Promise<{ id: string }>;
}

const mockProduct: ApiProduct = {
  _id: "mock-id-123",
  name: "iPhone 16 Pro Max (Blue, 1TB - 256GB)",
  price: 28000,
  status: "pending",
  seller: { fullName: "ABSOLUTE Stores" },
  productId: "PRD-001",
  categories: ["Phones & Tablet", "Mobile Phones", "Apple"],
  type: "Smartphone",
  images: [
    "https://i.pinimg.com/736x/77/bb/58/77bb584d7313eb31d40afa9a76b3c8d9.jpg",
  ],
  description: `Titanium design with larger 6.3-inch Super Retina XDR display, footnote 1 durable latest-generation Ceramic Shield, Action button, and USB-C with USB 3 speeds footnote 2
The first iPhone designed for Apple Intelligence. 3 Personal, private, powerful.
Camera Control gives you an easier way to quickly access camera tools
A18 Pro chip powers Apple Intelligence footnote 3 and AAA gaming — and helps deliver a huge leap in battery life
4K 120 fps Dolby Vision and 4 studio-quality mics. A Pro studio in your pocket.
Capture magical spatial photos and videos on iPhone 16 Pro, then relive them on Apple Vision Pro.`,
};

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProduct(mockProduct);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const openSuccessModal = (msg: string) => setSuccessModal({ isOpen: true, message: msg });
  const closeSuccessModal = () => setSuccessModal({ isOpen: false, message: "" });

  const handleStatusChange = async (status: "approved" | "rejected") => {
    if (!product) return;
    await new Promise((r) => setTimeout(r, 1000));
    setProduct({ ...product, status });
    openSuccessModal(`Product ${status} successfully`);
    setApproveModal(false);
    setRejectModal(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await new Promise((r) => setTimeout(r, 1000));
    openSuccessModal("Product deleted successfully");
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-600">Loading product details...</div>
    );

  if (!product)
    return (
      <div className="p-10 text-center text-red-600">Product not found.</div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white overflow-hidden m-4 sm:m-6"
    >
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Left: Product Image */}
        <div className="flex justify-center items-center bg-gray-50 rounded-2xl p-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full max-w-md h-auto object-cover rounded-lg"
          />
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
              {product.name}
            </h1>
            <p className="text-gray-600 text-sm mb-4">
              <span className="font-medium">{product.seller?.fullName}</span> •{" "}
              <span className="text-green-600 font-medium">4.5(3k+)</span> ⭐
            </p>

            <div className="text-sm text-gray-700 space-y-2 mb-6">
              <p>
                <span className="font-medium text-gray-900">Category:</span>{" "}
                {product.categories.join(", ")}
              </p>
              <p>
                <span className="font-medium text-gray-900">Product ID:</span>{" "}
                {product.productId}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-3">
                ₦{product.price.toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm">MOQ: 20 bags</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
            <button
              onClick={() => setRejectModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-red-500 text-red-600 font-medium hover:bg-red-50 transition-colors"
            >
              Reject Product
            </button>
            <button
              onClick={() => setApproveModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Approve Product
            </button>
          </div>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 font-medium mt-4 hover:underline text-sm"
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
