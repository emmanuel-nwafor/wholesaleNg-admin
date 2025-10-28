// TransactionModal.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { X as CloseIcon, Check } from "lucide-react";

interface Transaction {
  id: string;
  buyer: string;
  email: string;
  amount: string;
  coins: number;
  date: string;
  status: string;
  paymentMethod?: string;
  reference?: string;
  image: string;
}

interface TransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Successful":
      return "bg-green-100 text-green-800 border border-green-200";
    case "Failed":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

export default function TransactionModal({ transaction, isOpen, onClose }: TransactionModalProps) {
  if (!transaction || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Transaction Details</h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <CloseIcon size={20} />
          </motion.button>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* Buyer's Name, Image, and Status Badge */}
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <img src={transaction.image || "https://i.pinimg.com/1200x/74/23/c3/7423c3fa33cf7f3b32e73ed7123732b6.jpg"} alt="Buyer" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buyer's Name</label>
                  <p className="text-sm font-semibold underline text-blue-500">{transaction.buyer}</p>
                </div>
              </div>
            </div>

            {/* Amount and Coins */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                <p className="text-lg font-semibold text-gray-900">{transaction.amount}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coin Purchased</label>
                <p className="text-lg font-semibold text-gray-900">{transaction.coins}</p>
              </div>
            </div>

            {/* Payment Method and Reference */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <p className="text-gray-900 text-sm">{transaction.paymentMethod || "Paystack"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                <p className="text-gray-900 text-sm font-mono">{transaction.reference || transaction.id}</p>
              </div>
            </div>

            {/* Date and Status */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <p className="text-gray-900 text-sm">{transaction.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(transaction.status)}`}>
                  <Check className="w-3 h-3 mr-1" />
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 pt-4 border-t border-gray-200">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-50 text-gray-500 border border-gray-200 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors"
          >
            Close Details
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}