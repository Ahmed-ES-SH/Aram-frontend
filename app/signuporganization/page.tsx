"use client";
import React from "react";
import Navbar from "../_components/_website/Navbar";
import Footer from "../_components/_website/Footer";
import dynamic from "next/dynamic";

const DynamicAddOrganizationForm = dynamic(
  () => import("../_components/_website/_Auth/AddOrganizationForm"),
  {
    ssr: false, // إيقاف الـ SSR لهذا المكون
  }
);

export default function page() {
  return (
    <>
      <DynamicAddOrganizationForm />
    </>
  );
}
