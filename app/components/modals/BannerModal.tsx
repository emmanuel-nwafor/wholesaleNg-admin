// components/BannerModal.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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

interface FormData {
  title: string;
  type: string;
  device: string;
  startDate: string;
  endDate: string;
  image: File | null;
}

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "add";
  banner?: ApiBanner;
  onSubmit?: (data: FormData) => Promise<void>;
  loading?: boolean;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
};

const formatDisplayDate = (isoDate?: string) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
};

const parseDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toISOString().split("T")[0];
};

export default function BannerModal({ isOpen, onClose, mode, banner, onSubmit, loading = false }: BannerModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: banner?.bannerTitle || "",
    type: banner?.type || "",
    device: banner?.position || "",
    startDate: banner ? parseDate(banner.startDate) : "",
    endDate: banner ? parseDate(banner.endDate) : "",
    image: null,
  });

  useEffect(() => {
    if (banner && (mode === "edit" || mode === "view")) {
      setFormData({
        title: banner.bannerTitle,
        type: banner.type,
        device: banner.position,
        startDate: parseDate(banner.startDate),
        endDate: parseDate(banner.endDate),
        image: null,
      });
    } else if (mode === "add") {
      setFormData({ title: "", type: "", device: "", startDate: "", endDate: "", image: null });
    }
  }, [banner, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && (mode === "edit" || mode === "add")) {
      await onSubmit(formData);
      onClose();
    }
  };

  const isView = mode === "view";
  const title = { view: "Banner Details", edit: "Edit Banner", add: "Add Banner" }[mode];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <>
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        />
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Banner Title</label>
                  {isView ? (
                    <p className="font-medium text-gray-600">{banner?.bannerTitle}</p>
                  ) : (
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Type</label>
                  {isView ? (
                    <p className="font-medium text-gray-600">{banner?.type}</p>
                  ) : (
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Position (Device)</label>
                  {isView ? (
                    <p className="font-medium text-gray-600">{banner?.position}</p>
                  ) : (
                    <input
                      type="text"
                      value={formData.device}
                      onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                      className="w-full px-3 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Image</label>
                  {isView && banner?.image ? (
                    <img src={banner.image} alt="Banner" className="w-full h-32 object-cover rounded-2xl" />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                      className="w-full px-3 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-gray-500 mb-1 block">Start Date</label>
                    {isView ? (
                      <p className="text-sm text-gray-500">{formatDisplayDate(banner?.startDate)}</p>
                    ) : (
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-500 mb-1 block">End Date</label>
                    {isView ? (
                      <p className="text-sm text-gray-500">{formatDisplayDate(banner?.endDate)}</p>
                    ) : (
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    )}
                  </div>
                </div>
                {isView && (
                  <>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Status</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        banner?.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {banner?.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Created At</label>
                      <p className="text-sm text-gray-600">
                        {banner?.createdAt ? new Date(banner.createdAt).toLocaleString() : ""}
                      </p>
                    </div>
                  </>
                )}
              </div>
              {!isView && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 border border-gray-300 text-gray-600 rounded-2xl hover:bg-gray-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-slate-700 text-white rounded-2xl hover:bg-slate-900 text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? "Saving..." : `${mode === "add" ? "Add" : "Update"} Banner`}
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}