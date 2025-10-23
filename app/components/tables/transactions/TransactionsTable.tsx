"use client";

import React, { useState } from "react";
import {
  Search,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  X as CloseIcon,
} from "lucide-react";

interface Transaction {
  id: string;
  buyer: string;
  email: string;
  amount: string;
  coins: number;
  date: string;
  status: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    buyer: "Johanna Adeke",
    email: "johanna@adeke.com",
    amount: "₦5,000",
    coins: 50,
    date: "12-09-2025 19:00 PM",
    status: "Successful",
  },
  {
    id: "TXN-002",
    buyer: "Johanna Adeke",
    email: "johanna@adeke.com",
    amount: "₦5,000",
    coins: 50,
    date: "12-09-2025 19:00 PM",
    status: "Failed",
  },
  {
    id: "TXN-003",
    buyer: "Johanna Adeke",
    email: "johanna@adeke.com",
    amount: "₦5,000",
    coins: 50,
    date: "12-09-2025 19:00 PM",
    status: "Successful",
  },
  {
    id: "TXN-004",
    buyer: "Johanna Adeke",
    email: "johanna@adeke.com",
    amount: "₦5,000",
    coins: 50,
    date: "12-09-2025 19:00 PM",
    status: "Successful",
  },
  {
    id: "TXN-005",
    buyer: "Johanna Adeke",
    email: "johanna@adeke.com",
    amount: "₦5,000",
    coins: 50,
    date: "12-09-2025 19:00 PM",
    status: "Failed",
  },
  {
    id: "TXN-006",
    buyer: "Johanna Adeke",
    email: "johanna@adeke.com",
    amount: "₦5,000",
    coins: 50,
    date: "12-09-2025 19:00 PM",
    status: "Successful",
  },
  {
    id: "TXN-007",
    buyer: "Johanna Adeke",
    email: "johanna@adeke.com",
    amount: "₦5,000",
    coins: 50,
    date: "12-09-2025 19:00 PM",
    status: "Successful",
  },
  {
    id: "TXN-008",
    buyer: "Johanna Adeke",
    email: "johanna@adeke.com",
    amount: "₦5,000",
    coins: 50,
    date: "12-09-2025 19:00 PM",
    status: "Successful",
  },
];

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Successful":
      return "bg-green-100 text-green-800";
    case "Failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case "Successful":
      return <Check className="w-3 h-3" />;
    case "Failed":
      return <X className="w-3 h-3" />;
    default:
      return null;
  }
};

export default function TransactionsTable(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dateFilter] = useState<string>("");
  const [statusFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const itemsPerPage = 8;

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter === "" || transaction.date.includes(dateFilter);
    const matchesStatus = statusFilter === "" || transaction.status === statusFilter;

    return matchesSearch && matchesDate && matchesStatus;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (transaction: Transaction): void => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTransaction(null), 300);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-full sm:w-auto sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search starter packs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-20 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <button className="p-3 rounded-2xl bg-gray-800 text-white">
              Search
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="p-4 bg-gray-100 rounded-xl text-sm flex items-center gap-1">
              <Calendar size={16} />
              Date
            </button>
            <button className="p-4 bg-gray-100 rounded-xl text-sm flex items-center gap-1">
              <Filter size={16} />
              Status
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount (₦)</th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">Coin Purchased</th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date Purchased</th>
              <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-200 ease-in-out"
                onClick={() => handleRowClick(transaction)}
              >
                <td className="px-4 py-4 text-gray-900">{transaction.id}</td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{transaction.buyer}</div>
                  <div className="text-sm text-gray-500">{transaction.email}</div>
                </td>
                <td className="px-4 py-4 text-gray-900">{transaction.amount}</td>
                <td className="px-4 py-4 text-gray-900">{transaction.coins}</td>
                <td className="px-4 py-4 text-gray-900">{transaction.date}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                  >
                    {getStatusIcon(transaction.status)}
                    <span className="ml-1">{transaction.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid */}
      <div className="lg:hidden p-4 grid grid-cols-1 gap-4">
        {paginatedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="border border-gray-200 rounded-xl p-4 relative cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out"
            onClick={() => handleRowClick(transaction)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{transaction.id}</h3>
                <p className="text-xs text-gray-500">{transaction.buyer}</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <div><span className="font-medium">Email:</span> {transaction.email}</div>
              <div><span className="font-medium">Amount:</span> {transaction.amount}</div>
              <div><span className="font-medium">Coins:</span> {transaction.coins}</div>
              <div><span className="font-medium">Date:</span> {transaction.date}</div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span className={`inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {getStatusIcon(transaction.status)}
                  <span className="ml-1">{transaction.status}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedTransaction && isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
          <div
            className={`bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-in-out ${
              isModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Transaction Details</h3>
              <button
                onClick={closeModal}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="font-medium text-gray-700">Transaction ID:</span>
                <p className="text-gray-900">{selectedTransaction.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Buyer:</span>
                <p className="text-gray-900">{selectedTransaction.buyer}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-900">{selectedTransaction.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Amount:</span>
                <p className="text-gray-900">{selectedTransaction.amount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Coins Purchased:</span>
                <p className="text-gray-900">{selectedTransaction.coins}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Date:</span>
                <p className="text-gray-900">{selectedTransaction.date}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}
                >
                  {getStatusIcon(selectedTransaction.status)}
                  <span className="ml-1">{selectedTransaction.status}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 md:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm text-gray-700 text-center sm:text-left">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium">{filteredTransactions.length}</span>{" "}
            results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
