"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MoreHorizontal,
  Check,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { fetchWithToken } from "../../../utils/fetchWithToken";
import SuccessModal from "../../../components/modals/SuccessModal";

interface ApiCategory {
  _id: string;
  name: string;
  status: boolean;
  subcategories: { name: string; brands: string[] }[];
  __v: number;
}

interface CategoriesResponse {
  categories: ApiCategory[];
}

interface Category {
  id: string;
  name: string;
  productCount: number;
  subcategories: number;
  brands: number;
  status: "Active" | "Archived";
}

interface UpdateResponse {
  message?: string;
  category?: ApiCategory;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Archived":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string): React.JSX.Element | null => {
  switch (status) {
    case "Active":
      return <Check className="w-3 h-3" />;
    case "Archived":
      return <X className="w-3 h-3" />;
    default:
      return null;
  }
};

export default function CategoriesTable(): React.JSX.Element {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 20;

  // Fetch categories (typed)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchWithToken<CategoriesResponse>("/admin/categories");
        if (data?.categories) {
          const mappedCategories: Category[] = data.categories.map((c) => {
            const uniqueBrands = new Set(c.subcategories.flatMap((s) => s.brands));
            return {
              id: c._id,
              name: c.name,
              productCount: 0,
              subcategories: c.subcategories.length,
              brands: uniqueBrands.size,
              status: c.status ? "Active" : "Archived",
            };
          });
          setCategories(mappedCategories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const openSuccessModal = (message: string) => {
    setSuccessModal({ isOpen: true, message });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, message: "" });
  };

  // ✅ Update status (PATCH)
  const handleStatusChange = async (categoryId: string, newStatus: boolean) => {
    const oldCategories = [...categories];
    const statusText = newStatus ? "Active" : "Archived";

    // Optimistic update
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, status: statusText } : c
      )
    );

    try {
      const data = await fetchWithToken<UpdateResponse>(`/admin/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (data?.message && data.category) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === data.category!._id
              ? { ...c, status: data.category!.status ? "Active" : "Archived" }
              : c
          )
        );
        openSuccessModal(`Category ${statusText.toLowerCase()}d successfully`);
      } else {
        throw new Error("No data returned");
      }
    } catch (err) {
      setCategories(oldCategories);
      console.error("Error updating category status:", err);
    }
  };

  // ✅ Delete category
  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const oldCategories = [...categories];
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));

    try {
      await fetchWithToken(`/admin/categories/${categoryId}`, { method: "DELETE" });
      openSuccessModal("Category deleted successfully");
    } catch (err) {
      setCategories(oldCategories);
      console.error("Error deleting category:", err);
    }
  };

  // ✅ View category
  const handleViewCategory = (id: string) => {
    router.push(`/management/category-management/${id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 text-center text-gray-600"
      >
        Loading categories...
      </motion.div>
    );
  }

  const renderActionButton = (category: Category) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setOpenDropdown(openDropdown === category.id ? null : category.id)}
      className="px-2 py-2 text-gray-400 rounded-xl"
    >
      <MoreHorizontal size={16} />
    </motion.button>
  );

  const renderDropdown = (category: Category) => (
    <div
      className="absolute right-0 mt-2 py-4 m-5 text-xs rounded-xl w-40 bg-white border border-gray-200 shadow-lg z-50 cursor-pointer"
      ref={dropdownRef}
    >
      <button
        className="block w-full text-left px-5 py-2 text-xs rounded-lg hover:bg-gray-50 text-gray-700"
        onClick={() => {
          setOpenDropdown(null);
          handleViewCategory(category.id);
        }}
      >
        View Category
      </button>
      <button
        className="block w-full text-left px-5 py-2 text-xs rounded-lg hover:bg-gray-50 text-gray-700"
        onClick={() => {
          setOpenDropdown(null);
          router.push(`/management/category-management/${category.id}`);
        }}
      >
        Edit Category
      </button>
      <button
        className="block w-full text-left px-5 py-2 text-xs rounded-lg hover:bg-gray-50 text-red-700"
        onClick={() => {
          setOpenDropdown(null);
          handleDelete(category.id);
        }}
      >
        Delete Category
      </button>
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <motion.div
          className="p-4 md:p-6 border-b border-gray-200"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-full sm:w-auto sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-7 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <div className="hidden lg:block overflow-x-auto">
          <motion.table
            className="w-full text-sm"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">Name</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">Subcategories</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">Brands</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCategories.map((category) => (
                <motion.tr key={category.id} className="hover:bg-gray-50" variants={itemVariants}>
                  <td className="px-4 py-4 text-gray-900 font-medium">{category.name}</td>
                  <td className="px-4 py-4 text-gray-900">{category.subcategories}</td>
                  <td className="px-4 py-4 text-gray-900">{category.brands}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        category.status
                      )}`}
                    >
                      {getStatusIcon(category.status)}
                      <span className="ml-1">{category.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 relative">
                    {renderActionButton(category)}
                    {openDropdown === category.id && renderDropdown(category)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </motion.div>

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        message={successModal.message}
      />
    </>
  );
}
