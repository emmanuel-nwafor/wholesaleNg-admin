import AdminCategoriesAnalytics from "@/app/components/analytics/AdminCategoriesAnalytics";
import CategoriesSwitchTabNav from "@/app/components/header/CategoriesSwitchTabNav";
import CategoriesTable from "@/app/components/tables/categories/CategoriesTable";
import React from "react";

export default function CategoriesManagement() {
  return (
    <>
      <div className="">
        <AdminCategoriesAnalytics />
        <CategoriesSwitchTabNav />
        <div className="m-6">
          <CategoriesTable />
        </div>
      </div>
    </>
  );
}
