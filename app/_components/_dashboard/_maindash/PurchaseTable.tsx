import React from "react";
import PaginatedTable from "../PagenationTable";

export default function PurchaseTable() {
  const headers = [
    "id",
    "صورة المستخدم",
    "إسم المستخدم",
    "مجموع عمليات الشراء لهذا المروج",
    "عدد عمليات الشراء لهذا المروج ",
  ];
  const keys = [
    "id",
    "image",
    "name",
    "purchases_sum_amount",
    "purchases_count",
  ];
  return (
    <>
      <div className="w-[98%] px-4 py-4 mt-4 m-auto dark:bg-secend_dash rounded-md">
        <h1 className="text-xl pb-4 border-b border-gray-300 dark:dark:text-white text-black ">
          أكثر المستخدمين ترويجا لعمليات الشراء على المنصة
        </h1>
        <PaginatedTable
          keys={keys}
          headers={headers}
          api="/user-purchases-count"
          apidelete="/"
          editpath={"/showpurchasedetailes"}
        />
      </div>
    </>
  );
}
