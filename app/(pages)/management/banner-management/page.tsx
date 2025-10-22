import BannersTable from "@/app/components/tables/banners/BannersTable";
import React from "react";

export default function BannersManagement() {
  return (
    <>
      <div className="m-6">
        <h1 className="text-xl font-bold mb-6 m-3">Banners</h1>
        <BannersTable />
      </div>
    </>
  );
}
