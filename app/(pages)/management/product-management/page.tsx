"use client";

import AdminProductAnalytics from "@/app/components/analytics/AdminProductAnalyitcs";
import SwitchTabsNav from "@/app/components/header/ProductsSwitchTabsNav";
import ProductTable from "@/app/components/tables/products/ProductTable";
import React, { useState } from "react";

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <>
      <div className="">
        <AdminProductAnalytics />
        <SwitchTabsNav activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="m-6">
          <ProductTable filter={activeTab} />
        </div>
      </div>
    </>
  );
}