"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SuccessModal from "../../../../components/modals/SuccessModal";
import SubCategoryModal from "../../../../components/modals/SubCategoryMpdal";
import { Plus, Trash2, ImageMinus } from "lucide-react";
import { fetchWithToken } from "../../../../utils/fetchWithToken";

interface Brand {
  name: string;
}

interface Subcategory {
  name: string;
  brands: Brand[];
}

export default function AddCategories() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [status, setStatus] = useState(false);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024 && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      alert('Invalid file. Supported: JPEG, PNG up to 2MB.');
    }
  };

  const removeSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const addSubcategoryFromModal = (subcat: Subcategory) => {
    setSubcategories([...subcategories, subcat]);
    setSubcategoryModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return alert('Category name required.');

    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('status', status.toString());
    const subcats = subcategories.map(sub => ({
      name: sub.name,
      brands: sub.brands.map(b => ({ name: b.name }))
    }));
    formData.append('subcategories', JSON.stringify(subcats));
    if (imageFile) formData.append('image', imageFile);

    try {
      await fetchWithToken('/admin/categories', {
        method: 'POST',
        body: formData,
      });
      openSuccessModal('Category added successfully.');
      router.push('/management/category-management');
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  const openSuccessModal = (message: string) => {
    setSuccessModal({ isOpen: true, message });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, message: '' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 m-6 max-w-4xl">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Category</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Category Image *</label>
          <div className="items-center justify-center flex-col">
            <input type="file" id="image" accept="image/jpeg,image/png" onChange={handleImageChange} className="hidden" />
            <label htmlFor="image" className="w-[200px] h-[200px] rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <ImageMinus className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">Media</span>
                </>
              )}
            </label>
          </div>
          {!imagePreview && (
            <>
              <p className="text-xs text-gray-500 mt-1">Supported formats: JPEG, PNG</p>
              <p className="text-xs text-gray-500 mt-2">Media may not exceed 2MB</p>
            </>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category name *</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g. phone"
            className="w-full px-3 py-5 text-sm focus:outline-none bg-gray-50 rounded-2xl"
            required
          />
        </div>

    <div className="mb-6 flex items-center">
      <label className="text-sm font-medium text-gray-700 mr-3">
        Status *
      </label>
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
    
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700">Subcategories</label>
            <button type="button" onClick={() => setSubcategoryModalOpen(true)} className="flex items-center border rounded-[20px] gap-1 px-3 py-3 text-black text-sm">
              <Plus className="bg-slate-800 rounded-full text-white p-1" />
              Add subcategory
            </button>
          </div>
          {subcategories.length > 0 && (
            <div className="space-y-2">
              {subcategories.map((sub, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <span className="text-sm font-medium">{sub.name} ({sub.brands.map(b => b.name).join(', ')})</span>
                  <button type="button" onClick={() => removeSubcategory(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => router.back()} className="px-7 py-4 border border-gray-300 text-gray-800 rounded-2xl hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="px-7 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800">
            Add Category
          </button>
        </div>
      </form>

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        message={successModal.message}
      />
      <SubCategoryModal
        isOpen={subcategoryModalOpen}
        onClose={() => setSubcategoryModalOpen(false)}
        onSave={addSubcategoryFromModal}
      />
    </motion.div>
  );
}