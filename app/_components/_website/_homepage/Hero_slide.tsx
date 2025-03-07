"use client";
import React from "react";
import Img from "../../Img";
import Link from "next/link";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion, useInView } from "framer-motion";

interface Props {
  imageSrc: string;
  title_ar: string;
  title_en: string;
  highlight_en: string;
  highlight_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
}

export default function Heroslide({
  imageSrc = "/doctor_1.png",
  title_ar,
  title_en,
  highlight_en,
  highlight_ar,
  subtitle_en,
  subtitle_ar,
}: Props) {
  const { language }: any = UseVariables();

  // محتوى النصوص باللغتين
  const content: any = {
    EN: {
      primaryButtonText: "Get Started",
      secondaryButtonText: "Learn More",
      primaryButtonLink: "/membership",
      secondaryButtonLink: "/about",
    },
    AR: {
      primaryButtonText: "ابدأ الآن",
      secondaryButtonText: "اعرف المزيد",
      primaryButtonLink: "/membership",
      secondaryButtonLink: "/about",
    },
  };

  // اختيار النصوص بناءً على اللغة
  const {
    primaryButtonText,
    secondaryButtonText,
    primaryButtonLink,
    secondaryButtonLink,
  } = content[language];

  // تحديد اتجاه النص بناءً على اللغة
  const textDirection = language === "AR" ? "rtl" : "ltr";
  const textAlign = language === "AR" ? "text-right" : "text-left";

  return (
    <section
      style={{ direction: language == "EN" ? "ltr" : "rtl" }}
      className="bg-gray-100 dark:bg-secend_dash text-gray-800 dark:text-secend_text w-full h-fit min-h-[90vh] overflow-hidden flex items-center justify-center"
    >
      <motion.div className="w-[95%] mx-auto flex max-xl:flex-col items-start">
        {/* النصوص */}
        <motion.div
          className={`flex z-[3] flex-col justify-center p-6 rounded-sm lg:max-w-md xl:max-w-lg ${textAlign}`}
          dir={textDirection}
        >
          <motion.h1 className="text-5xl max-lg:text-3xl font-bold leading-none sm:text-6xl">
            {language == "EN"
              ? title_en.split(highlight_en)[0]
              : title_ar.split(highlight_ar)[0]}
            <span className="text-main_orange p-2">
              {language == "EN" ? highlight_en : highlight_ar}
            </span>
            {language == "EN"
              ? title_en.split(highlight_en)[1]
              : title_ar.split(highlight_ar)[1]}
          </motion.h1>
          <motion.p className="mt-6 mb-8 text-lg sm:mb-12">
            {language == "EN" ? subtitle_en : subtitle_ar}
          </motion.p>
          <motion.div
            className={`flex flex-col gap-6 sm:items-center sm:flex-row lg:justify-start w-full`}
          >
            <Link
              rel="noopener noreferrer"
              href={primaryButtonLink}
              className="px-8 py-3 text-lg shadow-md font-semibold rounded bg-main_orange hover:bg-white duration-300 hover:text-black hover:border-main_orange border border-transparent text-gray-50"
            >
              {primaryButtonText}
            </Link>
            <Link
              rel="noopener noreferrer"
              href={secondaryButtonLink}
              className="px-8 py-3 shadow-md text-lg font-semibold border rounded border-gray-500 dark:border-gray-300 hover:border-white duration-200 relative group overflow-hidden"
            >
              <p className="z-10  group-hover:text-white duration-300 relative">
                {secondaryButtonText}
              </p>
              <span className="group-hover:w-full w-0 absolute top-0 left-0 h-44 bg-main_blue duration-300 z-[1]"></span>
            </Link>
          </motion.div>
        </motion.div>

        {/* الصورة */}
        <motion.div
          className={`absolute bottom-0  z-[1] ${
            language == "EN"
              ? "-right-[25rem] max-lg:-right-[46rem] max-sm:-right-[51rem]"
              : "-left-[25rem] max-lg:-left-[46rem] max-sm:-left-[51rem]"
          }`}
        >
          <Img
            src={imageSrc ? imageSrc : "/file.png"}
            className="w-[50%] max-sm:w-[45%] object-cover"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
