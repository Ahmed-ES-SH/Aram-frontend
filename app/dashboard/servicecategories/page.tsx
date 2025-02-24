"use client";
import HeadTable from "@/app/_components/_dashboard/Head_table";
import PaginatedTable from "@/app/_components/_dashboard/PagenationTable";
import React from "react";

export default function Servicecategories() {
  const headers = [
    "id",
    "الصورة",
    "العنوان (AR)",
    "العنوان (EN)",
    "وقت الإنشاء",
  ];
  const keys = ["id", "image", "title_ar", "title_en", "created_at"];

  return (
    <div className="flex items-start flex-col gap-3 w-full p-6 max-md:p-2">
      <HeadTable
        title="أقسام الخدمات"
        linktitle="أضف قسم جديد"
        path="/dashboard/addservicecategory"
      />
      <PaginatedTable
        headers={headers}
        editpath="/servicecategories"
        keys={keys}
        api="/service-categories"
        apidelete="/service-category"
      />
    </div>
  );
}
