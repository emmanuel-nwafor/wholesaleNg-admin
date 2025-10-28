// Updated TransactionsTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  TextSelectionIcon,
} from "lucide-react";
import { fetchWithToken } from "../../../utils/fetchWithToken";
import TransactionModal from "../../modals/TransactionsModal";

interface ApiTransaction {
  _id: string;
  userId: string;
  type: "CREDIT" | "DEBIT";
  reason: string;
  amount: number;
  createdAt: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
}

interface Transaction {
  id: string;
  buyer: string;
  email: string;
  amount: string;
  coins: number;
  date: string;
  status: string;
  image: string;
}

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
  const [apiTransactions, setApiTransactions] = useState<ApiTransaction[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, { name: string; email: string }>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const itemsPerPage = 8;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [transactionsRes, usersRes] = await Promise.all([
          fetchWithToken<{ wallet: any; transactions: ApiTransaction[] }>("/wallet/transactions"),
          fetchWithToken<{ users: User[]; total: number; page: number; limit: number }>("/v1/users"),
        ]);
        setApiTransactions(transactionsRes.transactions);
        const usersMapTemp: Record<string, { name: string; email: string }> = {};
        usersRes.users.forEach((user) => {
          usersMapTemp[user._id] = { name: user.fullName, email: user.email };
        });
        setUsersMap(usersMapTemp);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transactions: Transaction[] = apiTransactions.map((t) => {
    const userInfo = usersMap[t.userId] || { name: t.userId, email: "" };
    const nairaAmount = `₦${t.amount * 100}`;
    const date = new Date(t.createdAt).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return {
      id: t._id,
      buyer: userInfo.name,
      email: userInfo.email,
      amount: nairaAmount,
      coins: t.amount,
      date,
      status: "Successful",
      image: "https://via.placeholder.com/48x48?text=👤", // Placeholder; update with actual image URL from user data when available
    };
  });

  const filteredTransactions = transactions.filter((transaction) => {
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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 text-center text-gray-600"
      >
        Loading transactions...
      </motion.div>
    );
  }

  return (
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-full sm:w-auto sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-2xl bg-gray-800 text-white"
            >
              Search
            </motion.button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-gray-100 rounded-xl text-sm flex items-center gap-1"
            >
              <Calendar size={16} />
              Date
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-gray-100 rounded-xl text-sm flex items-center gap-1"
            >
              <Filter size={16} />
              Status
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <motion.table
          className="w-full text-sm"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
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
              <motion.tr
                key={transaction.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-200 ease-in-out"
                variants={itemVariants}
                transition={{ duration: 0.2 }}
                onClick={() => handleRowClick(transaction)}
              >
                <td className="px-4 py-4 text-gray-900">{transaction.id}</td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{transaction.buyer}</div>
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
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      {/* Mobile Grid */}
      <motion.div
        className="lg:hidden p-4 grid grid-cols-1 gap-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {paginatedTransactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            className="border border-gray-200 rounded-xl p-4 relative cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out"
            variants={itemVariants}
            transition={{ duration: 0.2 }}
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
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-4 md:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3"
        >
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronLeft size={16} />
            </motion.button>
            {Array.from({ length: totalPages }, (_, i) => (
              <motion.button
                key={i + 1}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}