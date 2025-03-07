"use client";
import DynamicPage from "@/app/_components/_dashboard/DynamicPage";
import React from "react";

export default function EditArticalCategoryPage() {
  const inputs: {
    [key: string]: string;
  }[] = [
    {
      name: "title_ar",
      label: "العنوان (AR)",
      type: "text",
    },
    {
      name: "title_en",
      label: "العنوان (EN)",
      type: "text",
    },
    { name: "image", type: "file" },
  ];
  return (
    <>
      <DynamicPage
        inputs={inputs}
        api="/artical-category"
        updateapi="/update-artical-category"
        direct="/dashboard/articalservices"
        state=""
      />
    </>
  );
}
