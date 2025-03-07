import React from "react";
import PaginatedTable from "../PagenationTable";

export default function TobOrganizations() {
  const headers = [
    "id",
    "شعار المركز",
    "إسم المركز",
    "عدد الحجوزات",
    "وقت الإنشاء",
  ];
  const keys = [
    "id",
    "icon",
    "title_en",
    "number_of_reservations",
    "created_at",
  ];
  return (
    <div className="w-[98%] px-4 py-4 mt-4 m-auto dark:bg-secend_dash rounded-md">
      <h1 className="text-xl pb-4 border-b border-gray-300 dark:dark:text-white text-black ">
        أعلى المراكز استقبالا للحجوزات
      </h1>
      <PaginatedTable
        keys={keys}
        headers={headers}
        api="/orgs-by-number-of-reservations"
        apidelete="/"
        editpath="/organizations"
      />
    </div>
  );
}
