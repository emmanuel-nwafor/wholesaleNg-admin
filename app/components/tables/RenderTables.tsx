import React from "react";
import ProductsApprove from "./ProductsApprove";
import VerificationRequests from "./VerificationRequests";
import CoinPurchase from "./CoinPurchase";
import Banners from "./Banners";

export default function RenderTables() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4 m-3">
        <ProductsApprove />
        <VerificationRequests />
        <CoinPurchase />
        <Banners />
      </div>
    </>
  );
}
