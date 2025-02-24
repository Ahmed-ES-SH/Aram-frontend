"use client";
import React from "react";
import { organizations } from "@/app/constants/website";
import { UseVariables } from "@/app/context/VariablesContext";
import Separator from "../Separator";
import Link from "next/link";
import Img from "../../Img";

export default function Organizations_Cards() {
  const { language }: any = UseVariables();

  return (
    <div style={{ direction: "ltr" }} className="dark:bg-main_dash py-4">
      <Separator
        bg_dark="dark:bg-secend_dash"
        text={language == "EN" ? "Aram Organizations" : "منظمات آرام"}
      />

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
        {/* عرض كل منظمة في بطاقة */}
        {organizations.map((org) => (
          <div
            key={org.id}
            className="relative w-full h-[400px] max-md:h-[450px] overflow-hidden bg-cover bg-center rounded-md group cursor-pointer"
            style={{ backgroundImage: `url(${org.image})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
              <h2 className="text-xl font-bold mb-4">{org.name}</h2>
              <h3 className="text-sm font-semibold text-teal-400 mb-2">
                {org.department}
              </h3>
              <p
                style={{ direction: language == "EN" ? "ltr" : "rtl" }}
                className="text-sm max-w-[600px]"
              >
                {language === "EN" ? org.description.en : org.description.ar}
              </p>
            </div>

            {/* Hover Content (على البطاقة عند التمرير عليها) */}
            <div className="flex group-hover:bottom-6 items-center gap-4 absolute -bottom-40 left-6 duration-200">
              <div className="flex items-center justify-center w-[42px] h-[42px] border bg-gray-100 rounded-full">
                <Img
                  src="/logo.png"
                  className="w-[40px] h-[40px] rounded-full"
                />
              </div>
              <div className="content flex flex-col items-start">
                <h2 className="text-md font-bold mb-1 text-white dark:text-secend_text">
                  {org.name}
                </h2>
                <h3 className="text-[10px] font-semibold text-teal-400">
                  {org.department}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* زر لعرض المزيد */}
      <div className="button w-full mx-auto">
        <Link
          className="w-[30%] max-lg:w-1/2 max-md:w-[90%] mx-auto h-[40px] flex items-center duration-200 justify-center rounded-md shadow-md my-2 bg-main_orange text-white border border-transparent hover:border-main_orange hover:bg-white hover:text-black"
          href={"#"}
        >
          <p>{language == "EN" ? "Show All" : "شاهد الكل"}</p>
        </Link>
      </div>
    </div>
  );
}
