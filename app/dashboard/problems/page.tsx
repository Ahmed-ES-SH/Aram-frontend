import HeadTable from "@/app/_components/_dashboard/Head_table";
import PaginatedTable from "@/app/_components/_dashboard/PagenationTable";
import React from "react";

export default function page() {
  const headers = [
    "id",
    "الإسم",
    "البريد الإلكترونى ",
    "رقم الهاتف",
    "الحالة",
    "وقت الإرسال",
  ];
  const keys = ["id", "name", "email", "phone_number", "status", "created_at"];

  return (
    <div className="flex items-start flex-col gap-3 w-full p-6 max-md:p-2">
      <HeadTable title="" linktitle="" path="" />
      <PaginatedTable
        headers={headers}
        editpath={"/problems"}
        keys={keys}
        api="/problems"
        apidelete="/problem"
      />
    </div>
  );
}
