"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SuccessModal from "./SuccessModal";

interface RequestItem {
  id: string;
  storeImage?: string;
  storeName: string;
  email: string;
  fullName: string;
  userImage?: string;
  nni: string;
  cacNo: string;
  dateSubmitted: string;
  status: string;
}

const Avatar: React.FC<{ name: string; image?: string; size?: 'small' | 'medium' | 'large' }> = ({ name, image, size = 'medium' }) => {
  const sizeClasses = size === 'small' ? 'h-8 w-8' : size === 'medium' ? 'h-12 w-12' : 'h-10 w-10';
  const textSize = size === 'small' ? 'text-xs' : 'text-sm';

  const safeName = name || '';
  const initials = safeName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative">
      {image ? (
        <img className={`${sizeClasses} rounded-full object-cover`} src={image} alt={name} />
      ) : (
        <div className={`${sizeClasses} rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium ${textSize}`}>
          {initials}
        </div>
      )}
    </div>
  );
};

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  request: RequestItem;
}

export default function VerificationModal({ isOpen, onClose, onApprove, onReject, request }: VerificationModalProps) {
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Others');
  const [customReason, setCustomReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const finalReason = selectedReason === 'Others' ? customReason : selectedReason;
  const reasons = ['Inaccurate Details', 'Fraud/Scam', 'Others'];

  const handleReasonChange = (value: string) => {
    setSelectedReason(value);
  };

  const handleApprove = async () => {
    try {
      await onApprove();
      setSuccessMessage('Verification approved successfully');
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to approve');
      onClose();
    }
  };

  const handleRejectClick = () => {
    setShowRejectionForm(true);
  };

  const handleCancelReject = () => {
    setShowRejectionForm(false);
    setSelectedReason('Others');
    setCustomReason('');
  };

  const handleSubmitReject = async () => {
    if (!finalReason.trim()) return;
    try {
      await onReject(finalReason);
      setSuccessMessage('Verification rejected successfully');
      setShowSuccess(true);
      setShowRejectionForm(false);
      setSelectedReason('Others');
      setCustomReason('');
    } catch (error) {
      console.error('Failed to reject');
      onClose();
    }
  };

  if (showSuccess) {
    return <SuccessModal isOpen={true} onClose={() => { setShowSuccess(false); onClose(); }} message={successMessage} />;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {showRejectionForm ? 'Reject Verification' : 'Verification Request'}
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {!showRejectionForm ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Avatar name={request.fullName} image={request.userImage} size="medium" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">{request.fullName}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-gray-900 mb-3">KYC Info</p>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500">NIN</p>
                          <p className="font-medium text-gray-900">{request.nni}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500">CAC No.</p>
                          <p className="font-medium text-gray-900">{request.cacNo}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500">Date Submitted</p>
                          <p className="font-medium text-gray-900">{request.dateSubmitted}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {request.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        className="flex-1 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
                        onClick={handleRejectClick}
                      >
                        Reject
                      </button>
                      <button
                        className="flex-1 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
                        onClick={handleApprove}
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="text-gray-900 text-sm mb-4">Are you sure you want to reject this verification request?</p>
                  <p className="text-gray-600 text-sm mb-4">Why are you rejecting this verification request? Please select a reason.</p>
                  <div className="space-y-3 mb-4">
                    {reasons.map((reason) => (
                      <label key={reason} className="flex items-start cursor-pointer">
                        <input
                          type="radio"
                          name="rejectReason"
                          value={reason}
                          checked={selectedReason === reason}
                          onChange={(e) => handleReasonChange(e.target.value)}
                          className="mt-0.5 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-900">{reason}</span>
                      </label>
                    ))}
                  </div>
                  {selectedReason === 'Others' && (
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Enter reason"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none h-20 text-sm"
                      rows={3}
                    />
                  )}
                  <div className="flex gap-3 mt-6">
                    <button
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
                      onClick={handleCancelReject}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 text-sm font-medium disabled:cursor-not-allowed"
                      onClick={handleSubmitReject}
                      disabled={!finalReason.trim()}
                    >
                      Reject Verification
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}