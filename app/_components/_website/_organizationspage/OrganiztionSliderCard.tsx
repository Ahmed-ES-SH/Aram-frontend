"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";

interface props {
  organization: any;
}

export default function OrganiztionSliderCard({ organization }: props) {
  const { language }: any = UseVariables();
  const defaultLocation = {
    latitude: 21.4735,
    longitude: 55.9754,
    address: "سلطنة عمان",
  };
  const currentlocation = organization.location
    ? typeof organization.location == "string"
      ? JSON.parse(organization.location)
      : organization.location
    : defaultLocation;

  const category =
    organization.categories.length > 0
      ? organization.categories[0]
        ? language == "EN"
          ? organization.categories[0].title_en
          : organization.categories[0].title_ar
        : "تصنيف غير معرف"
      : "تصنيف غير معرف";

  return (
    <motion.div
      className={`relative group   w-full  mx-auto bg-white dark:bg-main_dash rounded-md cursor-pointer border dark:border-gray-600 shadow-lg overflow-hidden flex flex-col h-[500px]  `}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Section */}
      <div className="relative w-full h-1/2">
        <Img
          className="w-full h-full object-cover"
          src={
            organization.image ? organization.image : "/services/service-03.jpg"
          }
        />
        {/* organization logo */}
        <div
          className={`rounded-full bg-white dark:bg-secend_dash h-12 w-12 shadow-md absolute bottom-3 max-md:bottom-0 right-3 max-md:top-3`}
        >
          <Img
            src={organization.icon ? organization.icon : "/logo.ico"}
            className="w-full h-full rounded-full"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="content flex-1 px-6 py-4 flex flex-col items-start justify-between">
        {/* Organization Name */}
        <h1 className="text-xl font-bold text-gray-900 dark:text-secend_text w-fit border-b pb-2 border-main_orange">
          {language == "EN" ? organization.title_en : organization.title_ar}
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
          {organization.description_en && language == "EN"
            ? organization.description_en.slice(0, 40) + "..."
            : organization.description_ar.slice(0, 40) + "..."}
        </p>

        {/* Category */}
        <div className="flex items-center gap-2 mt-4 text-teal-500 text-sm">
          <FaBuilding />
          <span>{category}</span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
          <FaMapMarkerAlt />
          <span className="whitespace-nowrap">
            {currentlocation.address &&
              currentlocation.address.slice(0, 30) + "..."}
          </span>
        </div>
      </div>

      {/* Ribbon Effect */}
      <div
        className={`absolute top-0 ${
          organization.rightOrleft ? "right-0" : "left-0"
        } bg-main_orange text-white px-4 py-1 text-sm font-bold rounded-br-md`}
      >
        {language === "EN" ? "Featured" : "مميز"}
      </div>
      {/* overlay */}
      <div className="w-full h-0 group-hover:h-full duration-300 absolute bg-black/30 overflow-hidden">
        <Link
          className="block px-4 py-2 text-center bg-main_orange text-white hover:bg-white hover:text-main_orange hover:shadow-md rounded-md duration-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          href={`/organizations/${organization.id}`}
        >
          {language == "EN" ? "Know More" : "إعرف أكثر "}
        </Link>
      </div>
    </motion.div>
  );
}
