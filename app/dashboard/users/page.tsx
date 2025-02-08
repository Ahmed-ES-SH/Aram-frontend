"use client";
import HeadTable from "@/app/_components/_dashboard/Head_table";
import PaginatedTable from "@/app/_components/_dashboard/PagenationTable";
import React, { useState, useEffect } from "react";
import { LuSearch } from "react-icons/lu";

export default function Users() {
  const [contentSearch, setContentSearch] = useState("");
  const [apiUrl, setApiUrl] = useState("/users"); // API الافتراضي

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

  // تحديث API عند الضغط على زر البحث
  const handleSearch = () => {
    if (contentSearch.trim()) {
      setApiUrl(`/get-user-by-name/${contentSearch}`);
    }
  };

  // عند تفريغ مربع البحث يعود API الأساسي تلقائيًا
  useEffect(() => {
    if (contentSearch.trim() === "") {
      setApiUrl("/users");
    }
  }, [contentSearch]);

  return (
    <div className="flex items-start flex-col gap-3 w-full p-6 max-md:p-2">
      <HeadTable
        title="المستخدمين"
        linktitle="أضف مستخدم جديد"
        path="/dashboard/adduser"
      />
      <div
        style={{ direction: "rtl" }}
        className="inputsearch  mb-5 mt-2 flex items-center gap-2 relative w-[50%] max-lg:w-3/4 max-md:w-[97%] mx-auto"
      >
        <div className="flex items-center w-full gap-2 max-md:flex-col ">
          <div className="relative bg-white rounded-md shadow-md h-[40px] flex items-center justify-center w-full">
            <LuSearch className="right-2 top-1/2 text-secend_text size-5" />
            <input
              type="text"
              onChange={(e) => setContentSearch(e.target.value)}
              name="titlesearch"
              value={contentSearch}
              placeholder="إبحث عن المستخدم هنا ..."
              className="w-[90%] bg-transparent h-full pr-9 px-4 py-2 outline-none placeholder-shown:px-4 placeholder-shown:py-2 placeholder-shown:pr-9 placeholder-shown:text-[18px]"
            />
          </div>
          <button
            onClick={handleSearch}
            className={`px-6 py-2 hover:text-white text-center rounded-md shadow-md border border-main_orange hover:bg-orange-400 duration-200 ${
              contentSearch.length > 0
                ? "opacity-100 block"
                : "opacity-0 cursor-auto hidden"
            }`}
          >
            بحث
          </button>
        </div>
      </div>
      <PaginatedTable
        headers={headers}
        editpath="/users"
        keys={keys}
        api={apiUrl} // API يتغير تلقائيًا حسب الإدخال
        apidelete="/user"
      />
    </div>
  );
}
