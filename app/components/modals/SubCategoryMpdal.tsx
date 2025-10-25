"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Image as ImageIcon, Trash } from "lucide-react";

interface Brand {
  name: string;
  imagePreview?: string | null;
}

interface Subcategory {
  name: string;
  brands: Brand[];
}

interface SubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subcat: Subcategory) => void;
}

export default function SubCategoryModal({ isOpen, onClose, onSave }: SubCategoryModalProps) {
  const [subcatImagePreview, setSubcatImagePreview] = useState<string | null>(null);
  const [subcatImageFile, setSubcatImageFile] = useState<File | null>(null);
  const [subcatName, setSubcatName] = useState("");
  const [brands, setBrands] = useState<Brand[]>([{ name: "", imagePreview: null }]);

  const handleSubcatImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024 && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSubcatImageFile(file);
      setSubcatImagePreview(URL.createObjectURL(file));
    } else {
      alert('Invalid file. Supported: JPEG, PNG up to 2MB.');
    }
  };

  const handleBrandImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024 && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const updated = [...brands];
      updated[index].imagePreview = URL.createObjectURL(file);
      setBrands(updated);
    } else {
      alert('Invalid file. Supported: JPEG, PNG up to 2MB.');
    }
  };

  const addBrand = () => {
    setBrands([...brands, { name: "", imagePreview: null }]);
  };

  const updateBrandName = (index: number, value: string) => {
    const updated = [...brands];
    updated[index].name = value;
    setBrands(updated);
  };

  const removeBrand = (index: number) => {
    setBrands(brands.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!subcatName.trim()) return alert('Subcategory name required.');
    if (brands.length === 0 || brands.some(b => !b.name.trim())) return alert('All brand names required.');
    const subcat: Subcategory = {
      name: subcatName,
      brands: brands.map(b => ({ name: b.name }))
    };
    onSave(subcat);
    setSubcatName("");
    setBrands([{ name: "", imagePreview: null }]);
    setSubcatImagePreview(null);
    setSubcatImageFile(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Add Subcategory</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>
              <input type="file" id="subcat-image" accept="image/jpeg,image/png" onChange={handleSubcatImageChange} className="hidden" />
              <label htmlFor="subcat-image" className="inline-block w-[150px] px-4 py-6 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 text-center">
                {subcatImagePreview ? (
                  <img src={subcatImagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <>
                    <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">Media</span>
                  </>
                )}
              </label>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory name *</label>
              <input
                type="text"
                value={subcatName}
                onChange={(e) => setSubcatName(e.target.value)}
                placeholder="e.g. phone subcategories"
                className="w-full px-3 py-5 text-sm focus:outline-none bg-gray-50 rounded-2xl"
                required
              />
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-4 block">Brands / Nested Subcategories</label>
              <div className="flex px-4 py-3 bg-gray-100 rounded-xl mb-4 text-xs">
                <p className="mr-20">Images</p>
                <p className="">Name</p>
              </div>
              <div className="space-y-3">
                {brands.map((brand, index) => (
                  <div key={index} className="flex items-center gap-3 relative">
                    <div className="">
                      <input type="file" id={`brand-image-${index}`} accept="image/jpeg,image/png" onChange={(e) => handleBrandImageChange(index, e)} className="hidden" />
                      <label htmlFor={`brand-image-${index}`} className="w-[150px] bg-gray-50 px-4 py-5 rounded-xl cursor-pointer border border-dashed border-gray-300 text-center text-xs block h-full">
                        {brand.imagePreview ? (
                          <img src={brand.imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <>
                            <ImageIcon className="mx-auto h-4 w-4 text-gray-400" />
                            <span className="mt-1 block text-gray-900">Media</span>
                          </>
                        )}
                      </label>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={brand.name}
                        onChange={(e) => updateBrandName(index, e.target.value)}
                        placeholder="e.g 100"
                        className="w-full px-3 py-5 text-sm focus:outline-none bg-gray-50 rounded-2xl"
                      />
                    </div>
                    <button type="button" onClick={() => removeBrand(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-7">
                <div></div>
                <button onClick={addBrand} type="button" className="flex items-center border rounded-[16px] gap-1 px-2 py-2 text-black text-sm">
                  <Plus className="bg-slate-800 rounded-full text-white p-1" />
                  Add more
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-300 text-gray-800 rounded-2xl hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800">
                Save Subcategory
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}