import AdminVerificationRequestAnalitics from "@/app/components/analytics/AdminVerificationRequestAnalytics";
import RequestsSwitchTabNav from "@/app/components/header/RequestsSwitchTabNav";
import RequestsTable from "@/app/components/tables/requests/RequestsTable";
import React from "react";

export default function VerificationRequests() {
  return (
    <>
      <div className="">
        <AdminVerificationRequestAnalitics />
        <RequestsSwitchTabNav />
        <div className="m-6">
          <RequestsTable />
        </div>
      </div>
    </>
  );
}
