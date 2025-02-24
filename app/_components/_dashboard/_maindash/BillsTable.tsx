import React from "react";
import PaginatedTable from "../PagenationTable";

export default function BillsTable() {
  const headers = [
    "id",
    "صورة المستخدم",
    "إسم المتسخدم",
    "قية الفاتورة",
    " نوع الفاتورة",
    "وقت الإنشاء",
  ];
  const keys = [
    "id",
    "user.image",
    "user.name",
    "amount",
    "bell_type",
    "created_at",
  ];
  return (
    <div className="w-[98%] px-4 py-4 mt-4 m-auto dark:bg-secend_dash rounded-md">
      <h1 className="text-xl pb-4 border-b border-gray-300 dark:dark:text-white text-black ">
        جدول الفواتير
      </h1>
      <PaginatedTable
        keys={keys}
        headers={headers}
        api="/bells"
        editpath="/bells"
        apidelete="/bell-delete"
      />
    </div>
  );
}
