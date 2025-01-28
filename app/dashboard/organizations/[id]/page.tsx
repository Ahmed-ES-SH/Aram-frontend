"use client";
import DynamicPage from "@/app/_components/_dashboard/DynamicPage";
import React from "react";

export default function EditOrganizationPage() {
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
      name: "description_en",
      label: "الوصف (EN)",
      type: "textarea",
    },
    {
      name: "description_ar",
      label: "الوصف (AR)",
      type: "textarea",
    },

    { name: "image", type: "file" },
    { name: "icon", type: "file" },
  ];
  return (
    <>
      <DynamicPage
        inputs={inputs}
        state="service"
        api="/organization"
        updateapi="/update-organization"
        direct="/dashboard/organizations"
      />
    </>
  );
}
