import AdminUserAnalytics from "@/app/components/analytics/AdminUserAnalytics";
import UsersSwitchTabNav from "@/app/components/header/UsersSwitchTabNav";
import UsersTable from "@/app/components/tables/users/UsersTable";
import React from "react";

export default function UsersManagement() {
  return (
    <>
      <div className="">
        <AdminUserAnalytics />
        <UsersSwitchTabNav />
        <div className="m-6">
          <UsersTable />
        </div>
      </div>
    </>
  );
}
