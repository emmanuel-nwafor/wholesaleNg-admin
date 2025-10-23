import React from "react";
import { ArrowRight } from "lucide-react";

interface Request {
  id: number;
  name: string;
  seller: string;
  price: string;
  moq: string;
}

const mockProducts: Request[] = [
  {
    id: 1,
    name: "iPhone 16 Pro Max",
    seller: "by ABSOLUTE stores",
    price: "₦5,000",
    moq: "50 pieces",
  },
  {
    id: 2,
    name: "iPhone 16 Pro",
    seller: "by ABSOLUTE stores",
    price: "₦5,000",
    moq: "50 pieces",
  },
  {
    id: 3,
    name: "iPhone 16 Pro Max",
    seller: "by ABSOLUTE stores",
    price: "₦5,000",
    moq: "50 pieces",
  },
];

export default function VerificationRequests(): React.JSX.Element {
  return (
    <div className="m-4 bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-sm font-bold text-gray-900">
          Verification Requests
        </h2>
        <button className="flex items-center gap-1 text-blue-600 text-sm">
          View All
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Store Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Vendor Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-medium">IP</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.seller}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{product.price}</div>
                  <div className="text-gray-500">{product.moq}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="px-2 py-2 bg-gray-100 text-red-400 rounded-xl hover:bg-red-200 transition">
                    Reject
                  </button>
                  <button className="px-2 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-500 transition">
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
