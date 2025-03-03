import React from "react";
import PaginatedTable from "../PagenationTable";

export default function SummaryPromotersStatsWithCards() {
  const headers = [
    "id",
    "صورة المروج",
    "إسم المروج",
    "كود المروج",
    "عدد العملاء",
  ];
  const keys = [
    "id",
    "promoter.image",
    "promoter.name",
    "promoter.user_code",
    "count",
  ];
  return (
    <>
      <div className="w-[98%] px-4 py-4 mt-4 m-auto dark:bg-secend_dash rounded-md">
        <h1 className="text-xl pb-4 border-b border-gray-300 dark:dark:text-white text-black ">
          إحصائيات المروجين مع البطاقات
        </h1>
        <PaginatedTable
          keys={keys}
          headers={headers}
          api="/cards-statics-count-for-all-promoters"
          apidelete="/"
          editpath={"/showcardsdetailes"}
        />
      </div>
    </>
  );
}
