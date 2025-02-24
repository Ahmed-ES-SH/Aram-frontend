import React from "react";
import PaginatedTable from "../PagenationTable";

export default function VisitsTable() {
  const headers = ["id", "صورة المستخدم", "إسم المستخدم", "عدد الزوار "];
  const keys = ["id", "image", "name", "visitors_count"];
  return (
    <>
      <div className="w-[98%] px-4 py-4 mt-4 m-auto dark:bg-secend_dash rounded-md">
        <h1 className="text-xl pb-4 border-b border-gray-300 dark:dark:text-white text-black ">
          أكثر المستخدمين ترويجا لزيارة الموقع
        </h1>
        <PaginatedTable
          keys={keys}
          headers={headers}
          api="/visits-count"
          apidelete="/"
          editpath={"/showvisitsetailes"}
        />
      </div>
    </>
  );
}
