import React from 'react'
import { ArrowRight, Eye } from 'lucide-react'

const mockProducts = [
  { id: 1, imageUrl: "https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg", name: 'Start', date: 'End Date -12/09/2025', price: '₦5,000', device: 'Mobile', status: "Successful" },
  { id: 2, imageUrl: "https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg", name: 'Start', date: 'End Date -12/09/2025', price: '₦5,000', device: 'Mobile', status: "Successful" },
  { id: 3, imageUrl: "https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg", name: 'Start', date: 'End Date -12/09/2025', price: '₦5,000', device: 'Mobile', status: "Successful" },
]

export default function Banners() {
  return (
    <div className="m-4 bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-sm font-bold text-gray-900">Active Banners</h2>
        <button className="flex items-center gap-1 text-blue-600 text-sm hover:underline">
          <Eye size={16} />
          View All
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Banner Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Device</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className='flex items-center'>
                      <img src={product.imageUrl} alt="banner" className='h-10 w-10 rounded-lg mr-3' />
                      <div>
                         <div className="text-sm font-medium text-gray-900">{product.name}</div>
                         <div className="text-[12px] text-gray-500">{product.date}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{product.device}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <span className='text-[10px] px-1 py-1 bg-green-100 text-green-400 rounded-2xl transition'>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}