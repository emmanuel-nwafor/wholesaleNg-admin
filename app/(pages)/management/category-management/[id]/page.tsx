"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithToken } from "../../../../utils/fetchWithToken";
import { motion } from "framer-motion";
import { Folder } from "lucide-react";

interface Subcategory {
  name: string;
  brands: string[];
}

interface Category {
  _id: string;
  name: string;
  status: boolean;
  subcategories: Subcategory[];
}

interface CategoryResponse {
  category: Category;
}

export default function CategoryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Utility to safely extract a string name
  const getName = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null && "name" in value) {
      const obj = value as { name?: unknown };
      if (typeof obj.name === "string") return obj.name;
    }
    return "Unnamed";
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetchWithToken<CategoryResponse>(`/admin/categories/${id}`);

        if (res?.category) {
          // ✅ Normalize deeply nested structure
          const normalizedCategory: Category = {
            _id: res.category._id,
            name: getName(res.category.name),
            status: Boolean(res.category.status),
            subcategories:
              Array.isArray(res.category.subcategories)
                ? res.category.subcategories.map((s) => ({
                    name: getName(s.name),
                    brands: Array.isArray(s.brands)
                      ? s.brands.map((b) => getName(b))
                      : [],
                  }))
                : [],
          };

          setCategory(normalizedCategory);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading)
    return (
      <div className="p-8 text-gray-500 text-center bg-white rounded-2xl shadow-sm">
        Loading category details...
      </div>
    );

  if (!category)
    return (
      <div className="p-8 text-red-500 text-center bg-white rounded-2xl shadow-sm">
        Category not found.
      </div>
    );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{category.name}</h1>
          <p className="text-sm text-gray-500 mt-1">425 Products</p>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={() => router.push(`/management/category-management/edit/${category._id}`)}
            className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-all"
          >
            Edit Category
          </button>
          <button className="px-5 py-2.5 border border-red-400 text-red-500 text-sm rounded-lg hover:bg-red-50 transition-all">
            Delete Category
          </button>
        </div>
      </div>

      {/* Subcategories Section */}
      <div>
        <h2 className="text-base font-medium text-gray-700 mb-4">Subcategories</h2>

        {category.subcategories.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No subcategories available.</p>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {category.subcategories.map((sub, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Folder className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-800">
                    {getName(sub.name)}
                  </h3>
                  <span className="text-gray-500 text-xs ml-1">(20 Products)</span>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1 font-medium">
                    Brand / Nested Subcategories
                  </p>

                  {sub.brands.length > 0 ? (
                    <ul className="text-gray-700 text-sm list-disc list-inside">
                      {sub.brands.slice(0, 3).map((brand, i) => (
                        <li key={i}>{getName(brand)}</li>
                      ))}
                      {sub.brands.length > 3 && (
                        <li className="text-gray-500 text-xs">
                          +{sub.brands.length - 3} more
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm italic">0 Brand / Nested</p>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-100 transition">
                    Delete
                  </button>
                  <button className="flex-1 bg-gray-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-800 transition">
                    Edit
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
