"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import { TbDeviceUnknown } from "react-icons/tb";
import { BiMessageRoundedDots } from "react-icons/bi";
import { useDataContext } from "@/app/context/DataContext";
import { instance } from "@/app/Api/axios";
import { useRouter } from "next/navigation";
import CheckCurrentUserPopup from "../_Auth/CheckCurrentUserPopup";

export default function OrganiztionCard({ organization }: any) {
  const { language }: any = UseVariables();
  const { currentuser, type } = useDataContext();
  const [currentUserCheck, setCurrentUserCheck] = useState(false);
  const userId = currentuser && currentuser.id;
  const router = useRouter();
  const currentlocation = organization.location
    ? JSON.parse(organization.location)
    : { address: "عنوان غير معروف ." };

  const category =
    organization.categories && organization.categories.length > 0
      ? language == "EN"
        ? organization.categories[0].title_en
        : organization.categories[0].title_ar
      : "تصنيف غير معرف";

  const startConversation = async () => {
    if (!currentuser) {
      return setCurrentUserCheck(true);
    }
    try {
      const formdata = new FormData();
      formdata.append("participant_one_type", type);
      formdata.append("participant_one_id", userId);
      formdata.append("participant_two_id", organization.id);
      formdata.append("participant_two_type", organization.account_type);
      const response = await instance.post(`/make-conversation`, formdata);
      if (response.status == 200) {
        const data = response.data.data;
        router.push(
          `/conversations/${data.id}?conversationId=${data.id}&account_type=${type}&userId=${userId}`
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const CheckToggle = () => {
    setCurrentUserCheck((prev) => !prev);
  };

  return (
    <>
      <motion.div
        className={`relative group w-full mb-5 mx-auto bg-white dark:bg-main_dash rounded-md cursor-pointer border dark:border-gray-600 shadow-lg overflow-hidden flex max-md:flex-col  ${
          organization.rightOrleft ? "flex-row-reverse" : "flex-row"
        }`}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Section */}
        <div className="relative w-full md:w-1/3 h-48 md:h-full">
          <Img
            className="w-full h-[350px] max-md:h-full object-cover"
            src={
              organization.image
                ? organization.image
                : "/services/service-03.jpg"
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
        <div className="content flex-1 px-6 py-4 flex flex-col justify-between">
          {/* Organization Name */}
          <h1 className="text-xl font-bold text-gray-900 dark:text-secend_text w-fit border-b pb-2 border-main_orange">
            {language === "EN" ? organization.title_en : organization.title_ar}
          </h1>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            {organization.description && language === "EN"
              ? organization?.description_en.length > 200
                ? organization.description_en + "..."
                : organization.description_en
              : organization?.description_ar.length > 200
              ? organization.description_ar + "..."
              : organization.description_ar}
          </p>

          {/* Category */}
          <div className="flex items-center gap-2 mt-4 text-teal-500 text-sm">
            <FaBuilding />
            <span>{category ? category : "تصنيف غير محدد "}</span>
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
            <FaMapMarkerAlt />
            <span>{currentlocation.address || "عنوان غير محدد"}</span>
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
        <div className="w-full h-0 group-hover:h-full duration-300 absolute bg-black/50 overflow-hidden">
          <div className="w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
            <Link
              className="flex items-center gap-2 px-4 py-2 text-center bg-main_orange border border-transparent text-white hover:border-main_orange hover:bg-white hover:text-main_orange hover:shadow-md rounded-md duration-300 "
              href={`/organizations/${organization.id}`}
            >
              <p className=" whitespace-nowrap">
                {language == "EN" ? "Know More" : "إعرف أكثر "}
              </p>
              <TbDeviceUnknown className="size-5" />
            </Link>
            <button
              onClick={startConversation}
              className="flex items-center gap-2 px-4 py-2 text-center bg-sky-400 border border-transparent text-white hover:border-sky-400 hover:bg-white hover:text-sky-400 hover:shadow-md rounded-md duration-300 "
            >
              <p className=" whitespace-nowrap">
                {language == "EN" ? "Contact Us" : "تواصل معنا"}
              </p>
              <BiMessageRoundedDots className="size-5" />
            </button>
          </div>
        </div>
      </motion.div>
      {currentUserCheck && (
        <CheckCurrentUserPopup
          isOpen={CheckCurrentUserPopup}
          onClose={CheckToggle}
          language={language}
        />
      )}
    </>
  );
}
