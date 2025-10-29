"use client";

import CommunicationSwitchTabNav from "@/app/components/header/CommunicationSwitchTabNav";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Paperclip, ImageMinus } from "lucide-react";
import SuccessModal from "../../../components/modals/SuccessModal";
import { fetchWithToken } from "@/app/utils/fetchWithToken";

export default function Communications() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("email");
  const [to, setTo] = useState("All user");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });
  const [loading, setLoading] = useState(false);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024 && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    } else {
      alert('Invalid file. Supported: JPEG, PNG up to 10MB.');
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEmail = activeTab === 'email';
    const isSMS = activeTab === 'sms';
    const isInApp = activeTab === 'in-app';

    if (isSMS && !message.trim()) return alert('Message required.');
    if ((isEmail || isInApp) && !title.trim()) return alert('Title required.');

    const endpoint = isEmail ? '/v1/communication/email' : isSMS ? '/v1/communication/sms' : '/v1/communication/in-app';

    setLoading(true);

    try {
      if (isEmail) {
        const formData = new FormData();
        formData.append('target', JSON.stringify({}));
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('message', message);
        if (bannerFile) formData.append('bannerFile', bannerFile);
        if (attachment) formData.append('attachmentFile', attachment);

        const res = await fetchWithToken(endpoint, {
          method: 'POST',
          body: formData,
        });
        const data = (res as { message?: string }) ?? { message: '' };
        openSuccessModal(data.message ?? 'Email campaign sent.');
      } else {
        const payload = {
          target: {},
          ...(isSMS ? { message } : { title, message }),
        };

        const res = await fetchWithToken(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = (res as { message?: string }) ?? { message: '' };
        openSuccessModal(data.message ?? `${isSMS ? 'SMS' : 'In-App'} campaign sent.`);
      }
    } catch (error: any) {
      alert(`Error sending campaign: ${error?.message || 'Failed to send'}`);
    } finally {
      setLoading(false);
    }
  };

  const openSuccessModal = (message: string) => {
    setSuccessModal({ isOpen: true, message });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, message: '' });
  };

  const renderForm = () => {
    const isEmail = activeTab === 'email';
    const isSMS = activeTab === 'sms';
    const isInApp = activeTab === 'in-app';

    const maxChars = isSMS ? 160 : 500;
    const rows = isSMS ? 3 : 6;
    const messageLabel = isEmail ? 'Message' : isSMS ? 'SMS Text' : 'Message';
    const titleLabel = (isEmail || isInApp) ? 'Title *' : 'Title *';
    const h1Text = isEmail ? 'Create Email Campaign' : isSMS ? 'Create SMS Campaign' : 'Create In-App Notification';
    const iconBg = isEmail ? 'bg-green-500' : isSMS ? 'bg-blue-500' : 'bg-purple-500';
    const iconText = isEmail ? 'E' : isSMS ? 'S' : 'I';
    const buttonText = isEmail ? 'Send Email' : isSMS ? 'Send SMS' : 'Send Notification';
    const titlePlaceholder = 'e.g phone';
    const messagePlaceholder = isSMS ? 'e.g phone' : 'Enter message';

    return (
      <form onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold text-gray-900 mb-6">{h1Text}</h1>

        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
            <span className="text-white font-bold">{iconText}</span>
          </div>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option>All user</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{titleLabel}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={titlePlaceholder}
            className="w-full px-3 py-5 text-sm focus:outline-none bg-gray-50 rounded-2xl"
            required={isEmail || isInApp}
          />
        </div>

        {isEmail && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g phone"
              className="w-full px-3 py-5 text-sm focus:outline-none bg-gray-50 rounded-2xl"
            />
          </div>
        )}

        {isEmail && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner</label>
            <div className="items-center justify-center flex-col">
              <input type="file" id="banner" accept="image/jpeg,image/png" onChange={handleBannerChange} className="hidden" />
              <label htmlFor="banner" className="w-full h-[200px] rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <>
                    <ImageMinus className="mx-auto h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">Media</span>
                  </>
                )}
              </label>
            </div>
            {!bannerPreview && (
              <>
                <p className="text-xs text-gray-500 mt-1">Supported formats: JPEG, PNG</p>
                <p className="text-xs text-gray-500 mt-2">Media may not exceed 10MB</p>
              </>
            )}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{messageLabel}</label>
          <div className="border border-gray-300 rounded-2xl p-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={messagePlaceholder}
              className="w-full border-none focus:outline-none resize-none bg-gray-50 px-3 py-2 text-sm"
              rows={rows}
              maxLength={maxChars}
              required
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>Character count: {message.length} of {maxChars}</span>
            </div>
          </div>
        </div>

        {isEmail && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
            <div className="border border-gray-300 rounded-2xl p-3 flex items-center gap-3 bg-gray-50">
              <Paperclip className="w-5 h-5 text-gray-400" />
              <input
                type="file"
                onChange={handleAttachmentChange}
                className="hidden"
                id="attachment"
              />
              <label htmlFor="attachment" className="text-sm text-gray-500 cursor-pointer flex-1">
                {attachment ? attachment.name : "Choose file"}
              </label>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => router.back()} className="px-7 py-4 border border-gray-300 text-gray-800 rounded-2xl hover:bg-gray-50" disabled={loading}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-7 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 disabled:opacity-50">
            {loading ? 'Sending...' : buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <>
      <CommunicationSwitchTabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 m-6 max-w-4xl">
        {renderForm()}

        <SuccessModal
          isOpen={successModal.isOpen}
          onClose={closeSuccessModal}
          message={successModal.message}
        />
      </motion.div>
    </>
  );
}