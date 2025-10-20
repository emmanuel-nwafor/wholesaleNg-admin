import AdminProductAnalytics from "@/app/components/analytics/AdminProductAnalyitcs";
import ProductTable from "@/app/components/tables/products/ProductTable";
import React from "react";

export default function ProductManagement() {
  return (
    <>
      <div className="">
        <AdminProductAnalytics />
        <div className="m-6">
          <ProductTable />
        </div>
      </div>
    </>
  );
}
