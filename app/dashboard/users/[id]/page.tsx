"use client";
import DynamicPage from "@/app/_components/_dashboard/DynamicPage";
import React from "react";

export default function EditUserPage() {
  const inputs: {
    [key: string]: string;
  }[] = [
    {
      name: "name",
      label: "الإسم",
      type: "text",
    },
    {
      name: "email",
      label: "البريد الإلكترونى",
      type: "email",
    },
    {
      name: "phone_number",
      label: "رقم الهاتف",
      type: "text",
    },
    { name: "image", type: "file" },
  ];
  return (
    <>
      <DynamicPage
        inputs={inputs}
        api="/user"
        updateapi="/update-user"
        direct="/dashboard/users"
        state=""
      />
    </>
  );
}
