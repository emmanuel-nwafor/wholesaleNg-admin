import React from "react";
import { ArrowRight } from "lucide-react";

interface Product {
  id: number;
  imageUrl: string;
  name: string;
  date: string;
  price: string;
  device: string;
  status: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    imageUrl:
      "https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg",
    name: "Start",
    date: "End Date -12/09/2025",
    price: "₦5,000",
    device: "Mobile",
    status: "Successful",
  },
  {
    id: 2,
    imageUrl:
      "https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg",
    name: "Start",
    date: "End Date -12/09/2025",
    price: "₦5,000",
    device: "Mobile",
    status: "Successful",
  },
  {
    id: 3,
    imageUrl:
      "https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg",
    name: "Start",
    date: "End Date -12/09/2025",
    price: "₦5,000",
    device: "Mobile",
    status: "Successful",
  },
];

export default function Banners(): React.JSX.Element {
  return (
    <div className="m-4 bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-sm font-bold text-gray-900">Active Banners</h2>
        <button className="flex items-center gap-1 text-blue-600 text-sm hover:underline">
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Banner Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Device
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <img
                      src={product.imageUrl}
                      alt="banner"
                      className="h-10 w-10 rounded-lg mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-[12px] text-gray-500">
                        {product.date}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {product.device}
                </td>
                <td className="px-4 py-4 text-sm font-medium">
                  <span className="text-[10px] px-1 py-1 bg-green-100 text-green-400 rounded-2xl">
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden grid grid-cols-1 gap-4 p-4">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col bg-gray-50 p-4 rounded-xl shadow-sm"
          >
            <div className="flex items-center mb-2">
              <img
                src={product.imageUrl}
                alt="banner"
                className="h-12 w-12 rounded-lg mr-3"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {product.name}
                </div>
                <div className="text-[12px] text-gray-500">{product.date}</div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-900 mb-2">
              <div>Device: {product.device}</div>
              <div>
                <span className="text-[10px] px-2 py-1 bg-green-100 text-green-400 rounded-2xl">
                  {product.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
