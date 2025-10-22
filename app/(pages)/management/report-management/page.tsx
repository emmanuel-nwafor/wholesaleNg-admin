import AdminReportsAnalytics from "@/app/components/analytics/AdminReportsAnalytics";
import ReportsSwitchTabNav from "@/app/components/header/ReportsSwitchTabNav";
import ReportsTable from "@/app/components/tables/reports/ReportsTable";
import React from "react";

export default function Reports() {
  return (
    <>
      <div className="">
        <AdminReportsAnalytics />
        <ReportsSwitchTabNav />
        <div className="m-6">
          <ReportsTable />
        </div>
      </div>
    </>
  );
}
