import StarterPackTable from "@/app/components/tables/starter-pack/StarterPackTable";
import Link from "next/link";
import React from "react";

export default function StarterPacks() {
  return (
    <>
      <div className="m-6">
              <div className="flex items-center justify-between m-2">
        <h1 className="text-xl font-bold mb-6 m-3">Starter Packs</h1>

        <Link href="/starter-packs/add">
          <button className="p-3 rounded-2xl bg-gray-800 text-white hover:bg-gray-700 transition hover:cursor-pointer">
            Add Packs
          </button>
        </Link>
      </div>
        <StarterPackTable />
      </div>
    </>
  );
}
