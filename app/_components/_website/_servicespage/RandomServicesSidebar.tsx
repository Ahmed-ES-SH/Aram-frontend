"use client";
import { useDataContext } from "@/app/context/DataContext";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import Img from "../../Img";

export default function RandomServicesSidebar() {
  const { language } = UseVariables();
  const { activeServices } = useDataContext();
  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");
  return (
    <>
      <div className="  max-xl:w-full  px-3  dark:bg-secend_dash  w-1/4 flex-grow  border dark:border-gray-600 pt-2 pb-4 h-full rounded-md shadow-md   ">
        <h1 className="my-4 text-center text-main_orange dark:text-secend_text pb-3 border-b border-main_blue w-fit mx-auto font-semibold">
          {language == "EN" ? "Other Services" : "خدمات أخرى"}
        </h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex  xl:flex-col  justify-center items-center flex-wrap gap-4 w-full"
        >
          {activeServices.slice(0, 4).map((service: any, index: number) => (
            <Link
              className="block w-full max-xl:w-[48%] max-sm:w-full "
              key={index}
              href={`/services/${formatTitle(service.title_en)}?serviceId=${
                service.id
              }`}
            >
              <motion.div
                key={index}
                className=" flex flex-col items-start h-[342px] w-full  border dark:border-gray-600 rounded-md shadow-md relative group overflow-hidden cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div
                  style={{ backgroundImage: `url(${service.image})` }}
                  className="w-full h-[60%] bg-cover bg-center rounded-t-md"
                ></div>
                <div className="content mt-4 px-4 flex flex-col gap-2 items-start">
                  <h1 className="dark:text-secend_text font-semibold text-[18px]">
                    {language == "EN" ? service.title_en : service.title_ar}
                  </h1>
                  <p className="dark:text-gray-500">
                    {language == "EN"
                      ? service.description_en
                      : service.description_ar}
                  </p>
                </div>
                <div
                  className={`absolute w-[60px] h-[60px] rounded-md shadow-sm duration-200 bg-main_blue -right-40 group-hover:right-3 top-[60%] -translate-y-1/2 border dark:border-gray-700 flex items-center justify-center`}
                >
                  <Img
                    src={service.icon ? service.icon : "/logo.png"}
                    className="w-full h-full rounded-md"
                  />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </>
  );
}
