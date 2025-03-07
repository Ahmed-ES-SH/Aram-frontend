import React from "react";
import PaginatedTable from "../PagenationTable";

export default function NewUsersPromoterTable() {
  const headers = [
    "id",
    "صورة المروج",
    "إسم المروج",
    "كود المروج",
    "عدد العملاء",
  ];
  const keys = ["id", "image", "name", "user_code", "count"];
  return (
    <>
      <div className="w-[98%] px-4 py-4 mt-4 m-auto dark:bg-secend_dash rounded-md">
        <h1 className="text-xl pb-4 border-b border-gray-300 dark:dark:text-white text-black ">
          أكثر المروجين جلبا لعملاء جدد
        </h1>
        <PaginatedTable
          keys={keys}
          headers={headers}
          api="/new-members-count"
          apidelete="/"
          editpath={"/shownewusersdetailes"}
        />
      </div>
    </>
  );
}
