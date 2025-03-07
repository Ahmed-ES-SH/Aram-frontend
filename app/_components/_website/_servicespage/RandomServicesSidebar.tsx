"use client";
import { useDataContext } from "@/app/context/DataContext";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import Img from "../../Img";
import AffiliateServiceCard from "../_affiliate_services/AffiliateServiceCard";

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
            <AffiliateServiceCard
              key={index}
              service={service}
              index={index}
              direct="affiliateservices"
            />
          ))}
        </motion.div>
      </div>
    </>
  );
}
