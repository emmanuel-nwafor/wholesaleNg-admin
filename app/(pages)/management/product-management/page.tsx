import AdminProductAnalytics from "@/app/components/analytics/AdminProductAnalyitcs";
import SwitchTabsNav from "@/app/components/header/ProductsSwitchTabsNav";
import ProductTable from "@/app/components/tables/products/ProductTable";
import React from "react";

export default function ProductManagement() {
  return (
    <>
      <div className="">
        <AdminProductAnalytics />
        <SwitchTabsNav />
        <div className="m-6">
          <ProductTable />
        </div>
      </div>
    </>
  );
}
