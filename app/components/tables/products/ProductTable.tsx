"use client"

import React, { useState } from 'react'
import { Search, MoreHorizontal, Check, Clock, X } from 'lucide-react'

const mockProducts = [
  {
    id: 'PRD-001',
    image: 'https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg',
    name: 'iPhone 16 Pro Max',
    seller: 'by ABSOLUTE stores',
    categories: 'Phones & Tablets',
    type: 'Simple',
    price: '₦5,000',
    moq: '50 pieces',
    status: 'Approved',
  },
  {
    id: 'PRD-002',
    image: 'https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg',
    name: 'Premium Cotton T-Shirt',
    seller: 'by Fashion Hub',
    categories: 'Fashion',
    type: 'Variant',
    price: '₦5,000',
    moq: '50 pieces',
    status: 'Pending',
  },
  {
    id: 'PRD-003',
    image: 'https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg',
    name: 'Premium Cotton T-Shirt',
    seller: 'by Fashion Hub',
    categories: 'Fashion',
    type: 'Simple',
    price: '₦5,000',
    moq: '50 pieces',
    status: 'Pending',
  },
  {
    id: 'PRD-004',
    image: 'https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg',
    name: 'Premium Cotton T-Shirt',
    seller: 'by Fashion Hub',
    categories: 'Fashion',
    type: 'Simple',
    price: '₦5,000',
    moq: '50 pieces',
    status: 'Pending',
  },
  {
    id: 'PRD-005',
    image: 'https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg',
    name: 'Premium Cotton T-Shirt',
    seller: 'by Fashion Hub',
    categories: 'Fashion',
    type: 'Simple',
    price: '₦5,000',
    moq: '50 pieces',
    status: 'Rejected',
  },
  {
    id: 'PRD-006',
    image: 'https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg',
    name: 'Premium Cotton T-Shirt',
    seller: 'by Fashion Hub',
    categories: 'Fashion',
    type: 'Simple',
    price: '₦5,000',
    moq: '50 pieces',
    status: 'Rejected',
  },
  {
    id: 'PRD-007',
    image: 'https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg',
    name: 'Premium Cotton T-Shirt',
    seller: 'by Fashion Hub',
    categories: 'Fashion',
    type: 'Simple',
    price: '₦5,000',
    moq: '50 pieces',
    status: 'Rejected',
  },
  {
    id: 'PRD-008',
    image: 'https://i.pinimg.com/736x/7d/b9/5d/7db95d35d90cf0e92be064de0c3c3358.jpg',
    name: 'Premium Cotton T-Shirt',
    seller: 'by Fashion Hub',
    categories: 'Fashion',
    type: 'Simple',
    price: '₦5,000',
    moq: '50 pieces',
    status: 'Rejected',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-800'
    case 'Pending': return 'bg-yellow-100 text-yellow-800'
    case 'Rejected': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Approved': return <Check className="w-3 h-3" />
    case 'Pending': return <Clock className="w-3 h-3" />
    case 'Rejected': return <X className="w-3 h-3" />
    default: return null
  }
}

export default function ProductTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.seller.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/MOQ</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-12 w-12 rounded-lg object-cover mr-4" src={product.image} alt={product.name} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.seller}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.categories}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{product.price}</div>
                  <div className="text-sm text-gray-500">{product.moq}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {getStatusIcon(product.status)}
                    <span className="ml-1">{product.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block text-left">
                    <button className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-medium">{filteredProducts.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}