import React from "react";
import PaginatedTable from "../PagenationTable";

export default function BillsSummaryTable() {
  const headers = ["id", "صورة المستخدم", "إسم المستخدم", "مجمل الحجوزات"];
  const keys = ["id", "image", "name", "number_of_reservations"];
  return (
    <div className="w-[98%] px-4 py-4 mt-4 m-auto dark:bg-secend_dash rounded-md">
      <h1 className="text-xl pb-4 border-b border-gray-300 dark:dark:text-white text-black ">
        أكثر المستخدمين حجزا على المنصة
      </h1>
      <PaginatedTable
        keys={keys}
        headers={headers}
        api="/users-by-number-of-reservations"
        apidelete="/"
        editpath={"/users"}
      />
    </div>
  );
}
