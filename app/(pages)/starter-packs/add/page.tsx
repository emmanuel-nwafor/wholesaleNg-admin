"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import SuccessModal from "../../../components/modals/SuccessModal";
import StarterPackVendors from "../../../components/modals/StarterPackVendorsModal";
import { fetchWithToken } from "../../../utils/fetchWithToken";

interface Vendor {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
}

export default function AddStarterPacks() {
  const router = useRouter();
  const [packName, setPackName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState(true);
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });

  const removeVendor = (id: string) => {
    setSelectedVendors(selectedVendors.filter((v) => v.id !== id));
  };

  const addVendor = (vendors: Vendor[]) => {
    vendors.forEach((vendor) => {
      if (!selectedVendors.some((v) => v.id === vendor.id)) {
        setSelectedVendors((prev) => [...prev, vendor]);
      }
    });
    setVendorModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packName.trim() || !description.trim() || amount <= 0 || selectedVendors.length === 0) {
      return alert("All fields are required.");
    }

    const body = {
      packName,
      description,
      amount: amount.toString(),
      status: status.toString(),
      vendorIds: selectedVendors.map(v => v.id),
    };

    try {
      await fetchWithToken("/v1/starter-packs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      openSuccessModal("Pack added successfully.");
      router.push("/management/starter-packs");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  const openSuccessModal = (message: string) => {
    setSuccessModal({ isOpen: true, message });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, message: "" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 m-6 max-w-4xl">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Pack</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pack Name *</label>
          <input
            type="text"
            value={packName}
            onChange={(e) => setPackName(e.target.value)}
            placeholder="e.g. phone"
            className="w-full px-3 py-4 text-sm focus:outline-none bg-gray-50 rounded-2xl"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Vendors *</label>
          <div className="flex gap-2 mb-2">
            <div
              className="flex-1 px-3 py-4 text-sm focus:outline-none bg-gray-50 rounded-2xl cursor-pointer min-h-[44px] flex items-center"
              onClick={() => setVendorModalOpen(true)}
            >
              {selectedVendors.length === 0 ? (
                <span className="text-gray-500">Search 20+ stores</span>
              ) : (
                <div className="flex flex-wrap items-center gap-1">
                  {selectedVendors.map((vendor) => (
                    <span
                      key={vendor.id}
                      className="inline-flex items-center px-2 py-1 bg-gray-200 text-xs rounded-full"
                    >
                      {vendor.name}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVendor(vendor.id);
                        }}
                        className="ml-1 text-gray-600 hover:cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. phone"
            className="w-full px-3 py-2 text-sm focus:outline-none bg-gray-50 rounded-2xl"
            rows={3}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="13000"
            className="w-full px-3 py-4 text-sm focus:outline-none bg-gray-50 rounded-2xl"
            required
          />
        </div>

        <div className="mb-6 flex items-center">
          <label className="text-sm font-medium text-gray-700 mr-3">Status *</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => router.back()} className="px-7 py-4 border border-gray-300 text-gray-800 rounded-2xl hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="px-7 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800">
            Add Pack
          </button>
        </div>
      </form>

      {vendorModalOpen && <StarterPackVendors onSelect={addVendor} onClose={() => setVendorModalOpen(false)} />}

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        message={successModal.message}
      />
    </motion.div>
  );
}