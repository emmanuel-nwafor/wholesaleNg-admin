import React from "react";
import AdminAnalytics from "../analytics/AdminAnalytics";
import TransactionsBarChart from "../transactions/TransactionsBarChart";
import RenderTables from "../tables/RenderTables";

export default function RenderHome() {
  return (
    <div className="flex">
      <div className="flex-1">
        <AdminAnalytics />
        <TransactionsBarChart />
        <RenderTables />
      </div>
    </div>
  );
}
