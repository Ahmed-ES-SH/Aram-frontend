"use client";
import DynamicPage from "@/app/_components/_dashboard/DynamicPage";
import React from "react";

export default function EditServicePage() {
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
    {
      name: "content_en",
      label: "المحتوى (EN)",
      type: "textarea",
    },
    {
      name: "content_ar",
      label: "المحتوى (AR)",
      type: "textarea",
    },
    {
      name: "published_at",
      label: "تاريخ النشر",
      type: "date",
    },

    { name: "image", type: "file" },
  ];
  return (
    <>
      <DynamicPage
        state="artical"
        inputs={inputs}
        api="/artical_dash"
        updateapi="/update-artical"
        direct="/dashboard/articals"
      />
    </>
  );
}
