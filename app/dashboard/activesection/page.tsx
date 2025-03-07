"use client";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "@/app/_components/Loading";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Link from "next/link";
import Image from "next/image";
import Img from "@/app/_components/Img";

export default function ActiveSection() {
  const containerVariants = {
    hidden: { opacity: 0, y: "-300%", x: "-50%" },
    visible: {
      opacity: 1,
      y: "-50%",
      x: "-50%",
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <>
      <div className="overflow-hidden   w-full">
        <div className="px-[15px] w-full h-screen overflow-hidden  relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full flex flex-col items-center justify-center max-lg:flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Img src={"/logo.png"} className="w-[200px] max-lg:w-[350px]" />
            <div className="w-[60%] max-lg:w-full max-md:w-full flex flex-col items-center justify-center gap-6">
              <h1 className="text-4xl mb-6 dark:text-white ">
                تحديد واجهة العرض
              </h1>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={linkVariants}
                className="grid grid-cols-2 justify-items-center gap-8 w-full p-2"
              >
                <Link
                  href={"/dashboard/videodash"}
                  className="px-8 py-4 h-[400px] w-full text-white bg-main_blue hover:bg-white border border-transparent hover:border-main_blue hover:text-black hover:scale-105 duration-200 rounded-md shadow-md flex flex-col items-center justify-center gap-4"
                >
                  <Img src={"/dashboard/video.png"} className="w-[180px]" />
                  <p className="text-xl mt-4">قسم الفيديو</p>
                </Link>
                <Link
                  href={"/dashboard/slidersectiondash"}
                  className="px-8 py-4 h-[400px] w-full cursor-pointer bg-main_orange text-white hover:bg-white border border-transparent hover:border-main_blue hover:text-black hover:scale-105 duration-200 rounded-md shadow-md flex flex-col items-center justify-center gap-4"
                >
                  <Img
                    src={"/dashboard/services-slider.png"}
                    className="w-[180px]"
                  />
                  <p className="text-xl mt-4">قسم الشرائح</p>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
