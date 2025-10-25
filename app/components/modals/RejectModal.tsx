// RejectModal.tsx
"use client";

import React from 'react';
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export default function RejectModal({ isOpen, onClose, onConfirm, productName }: RejectModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4"
              >
                <X className="w-6 h-6 text-red-600" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">Reject Product</h3>
              <p className="text-gray-600">Are you sure you want to reject <span className="font-medium">"{productName}"</span>?</p>
            </div>
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 bg-white text-gray-700 rounded-2xl border border-gray-200 hover:bg-gray-50 flex-1 text-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="px-4 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 flex-1 text-sm font-medium"
              >
                Reject
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}