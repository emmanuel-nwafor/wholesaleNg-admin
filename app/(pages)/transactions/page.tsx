import AdminTransactionAnalytics from "@/app/components/analytics/AdminTransactionAnalytics";
import TransactionsTable from "@/app/components/tables/transactions/TransactionsTable";
import React from "react";

export default function Transactions() {
  return (
    <>
      <div className="">
        <AdminTransactionAnalytics />
        <div className="m-6">
          <TransactionsTable />
        </div>
      </div>
    </>
  );
}
