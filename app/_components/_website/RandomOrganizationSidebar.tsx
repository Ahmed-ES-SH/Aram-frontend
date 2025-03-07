import { useDataContext } from "@/app/context/DataContext";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import OrganiztionSliderCard from "./_organizationspage/OrganiztionSliderCard";

export default function RandomOrganizationsSidebar({
  length,
}: {
  length: number;
}) {
  const { publishedOrgs } = useDataContext();
  const { language } = UseVariables();
  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");
  return (
    <>
      <motion.div
        className="w-[25%] max-xl:w-full flex-shrink-0 max-lg:p-2 shadow-lg bg-white dark:bg-secend_dash rounded-lg p-3  h-fit border dark:border-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl text-center text-teal-400 pb-2 border-b border-main_blue w-fit mx-auto font-semibold  dark:text-white mb-4">
          {language == "EN" ? "Selected Centers" : "مراكز مرشحة"}
        </h2>
        <div className="w-full ">
          <ul className="space-y-4 w-full max-xl:grid max-xl:grid-cols-2 max-md:grid-cols-1 xl:grid-cols-1 max-xl:gap-3  ">
            {publishedOrgs &&
              publishedOrgs.length > 0 &&
              publishedOrgs
                .slice(0, length)
                .map((org: any, index: number) => (
                  <OrganiztionSliderCard organization={org} key={index} />
                ))}
          </ul>
        </div>
      </motion.div>
    </>
  );
}
