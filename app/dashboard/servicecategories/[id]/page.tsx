"use client";
import DynamicPage from "@/app/_components/_dashboard/DynamicPage";
import React from "react";

export default function EditServiceCategoryPage() {
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
        api="/service-category"
        updateapi="/update-service-category"
        direct="/dashboard/servicecategories"
        state="services"
      />
    </>
  );
}
