import React from "react";
import { ArrowRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  email: string;
  price: string;
  amount: string;
  status: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Joanna Adeleke",
    email: "Joannaadeleke@gmail.com",
    price: "₦5,000",
    amount: "10 Coins",
    status: "Successful",
  },
  {
    id: 2,
    name: "Daniel Okafor",
    email: "daniel@gmail.com",
    price: "₦5,000",
    amount: "20 Coins",
    status: "Successful",
  },
  {
    id: 3,
    name: "Appfur NG",
    email: "appfur@mail.com",
    price: "₦5,000",
    amount: "100 Coins",
    status: "Successful",
  },
];

export default function CoinPurchase(): React.JSX.Element {
  return (
    <div className="m-4 bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-sm font-bold text-gray-900">Coin Purchases</h2>
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
                Buyer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-[12px] text-gray-500">
                        {product.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{product.price}</div>
                  <div className="text-gray-500">{product.amount}</div>
                </td>
                <td className="px-1 py-1 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <span className="px-1 text-[10px] py-1 bg-green-100 text-green-400 rounded-2xl transition">
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
