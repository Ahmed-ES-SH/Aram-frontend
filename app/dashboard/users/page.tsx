"use client";
import HeadTable from "@/app/_components/_dashboard/Head_table";
import PaginatedTable from "@/app/_components/_dashboard/PagenationTable";
import React from "react";

export default function Users() {
  const headers = [
    "id",
    "الصورة",
    "الإسم",
    "البريد الإلكترونى ",
    "رقم الهاتف",
    "نوع الحساب",
    "وقت الإنشاء",
  ];
  const keys = [
    "id",
    "image",
    "name",
    "email",
    "phone_number",
    "role",
    "created_at",
  ];

  return (
    <div className="flex items-start flex-col gap-3 w-full p-6 max-md:p-2">
      <HeadTable
        title="المستخدمين"
        linktitle="أضف مستخدم جديد"
        path="/dashboard/adduser"
      />
      <PaginatedTable
        headers={headers}
        editpath={"/users"}
        keys={keys}
        api="/users"
        apidelete="/user"
      />
    </div>
  );
}
