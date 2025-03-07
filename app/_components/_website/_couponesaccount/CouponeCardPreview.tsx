import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaTag,
  FaBuilding,
  FaLayerGroup,
  FaEye,
} from "react-icons/fa";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import CouponPopup from "./PreviewCouponPopup";

interface props {
  coupon: any;
}

export default function CouponeCardPreview({ coupon }: props) {
  const { language } = UseVariables();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <>
      <motion.div
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        className="relative bg-white dark:bg-secend_dash rounded-lg shadow-lg overflow-hidden w-full h-[480px]"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className=" relative w-full h-52">
          <Img
            src={coupon.coupon.image ? coupon.coupon.image : "/public"}
            className="w-full h-full object-cover"
          />
          <div className="w-12 h-12 rounded-full bg-white absolute bottom-2 right-2 flex items-center justify-center border shadow-md">
            <Img
              src={
                coupon.coupon.organization
                  ? coupon.coupon.organization.icon
                    ? coupon.coupon.organization.icon
                    : "/logo.png"
                  : "/logo.png"
              }
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl pb-2 border-b border-main_orange w-fit font-bold text-gray-800 dark:text-secend_text mb-2">
            {language == "EN" ? coupon.coupon.title_en : coupon.coupon.title_ar}
          </h2>
          <p className="text-gray-600 dark:text-gray-200  h-[50px] overflow-hidden mb-4">
            {language == "EN"
              ? coupon.coupon.description_en.length > 90
                ? coupon.coupon.description_en.slice(0, 90) + "..."
                : coupon.coupon.description_en
              : coupon.coupon.description_ar.length > 90
              ? coupon.coupon.description_ar.slice(0, 90) + "..."
              : coupon.coupon.description_ar}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <FaTag className="text-gray-500 dark:text-white mr-2" />
            <span className="text-gray-700 dark:text-secend_text">
              {language == "EN" ? " Discount " : " خصم "}:{" "}
              {coupon.coupon.discount_value}%
            </span>
          </div>

          <div className="flex items-center gap-2  mb-4">
            <FaCalendarAlt className="text-gray-500 dark:text-white mr-2" />
            <span className="text-gray-700 whitespace-nowrap dark:text-secend_text max-md:text-[14px]">
              {language == "EN" ? " Form " : " من "}
              {coupon.coupon.start_date} {language == "EN" ? " To " : " إلى "}{" "}
              {coupon.coupon.end_date}
            </span>
          </div>

          <div
            onClick={() => setIsPopupOpen(true)}
            className="flex items-center justify-center ml-auto rounded-full border bg-gray-100 dark:bg-main_dash dark:text-gray-300 dark:hover:bg-sky-400 dark:hover:text-white hover:text-white hover:bg-sky-400 duration-200 cursor-pointer py-1 "
          >
            <FaEye className="size-6" />
          </div>
        </div>
      </motion.div>
      {isPopupOpen && (
        <CouponPopup
          onClose={() => setIsPopupOpen(false)}
          coupon={coupon.coupon}
        />
      )}
    </>
  );
}
