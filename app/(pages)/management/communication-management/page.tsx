import CommunicationSwitchTabNav from "@/app/components/header/CommunicationSwitchTabNav";
import React from "react";

export default function Communications() {
  return (
    <>
      <div className="">
        <h1 className="text-xl font-bold mb-6 m-5">Communication Management</h1>
        <CommunicationSwitchTabNav />
      </div>
    </>
  );
}
