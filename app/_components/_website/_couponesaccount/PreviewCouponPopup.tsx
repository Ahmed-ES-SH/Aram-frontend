"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaTimes, FaCalendarAlt } from "react-icons/fa";
import { UseVariables } from "@/app/context/VariablesContext";
import Img from "../../Img";

interface coupon {
  id: number;
  title_ar: string;
  title_en: string;
  image: string;
  description_ar: string;
  description_en: string;
  code: string;
  start_date: string;
  end_date: string;
  discount_value: number;
  organization: {
    image: string;
    icon: string;
    title_ar: string;
    title_en: string;
  };
}

interface PopupProps {
  coupon: coupon;
  onClose: () => void;
}

export default function CouponPopup({ coupon, onClose }: PopupProps) {
  const { language } = UseVariables();
  const {
    organization,
    title_ar,
    title_en,
    image,
    description_ar,
    description_en,
    code,
    start_date,
    end_date,
  } = coupon;

  // تحديد النص بناءً على اللغة
  const title = language === "EN" ? title_en : title_ar;
  const description = language === "EN" ? description_en : description_ar;
  const orgTitle = organization
    ? language === "EN"
      ? organization.title_en
      : organization.title_ar
    : "Aram";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white dark:bg-secend_dash p-6 rounded-lg my-2 w-1/2 max-md:w-[97%] max-lg:w-[80%] max-md:p-2 relative">
        {/* صورة المنظمة */}
        <div className="w-full h-52 relative">
          <Img
            src={
              organization
                ? organization.image
                  ? organization.image
                  : "/services/service-03.jpg"
                : "/services/service-03.jpg"
            }
            className="w-full h-full rounded-md object-cover"
          />
        </div>

        {/* معلومات المنظمة */}
        <div className="flex items-center mb-4">
          <Img
            src={
              organization
                ? organization.icon
                  ? organization.icon
                  : "/logo.png"
                : "/logo.png"
            }
            className="w-8 h-8 ml-4"
          />
          <h2 className="ml-4 text-xl font-bold dark:text-white">{orgTitle}</h2>
        </div>

        {/* كود العرض */}
        <div className="text-center bg-orange-500 text-white py-2 mb-4">
          <p className="text-lg font-bold">{code}</p>
        </div>

        {/* عنوان العرض */}
        <h3 className="text-2xl font-semibold mb-2 dark:text-secend_text">
          {title}
        </h3>

        {/* وصف العرض */}
        <p className="text-gray-600 mb-4 dark:text-white">{description}</p>

        {/* التواريخ */}
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <FaCalendarAlt className="text-green-400 mr-2" />
            <span className="text-green-400">
              {language === "EN" ? "Start Date" : "تاريخ البداية"}:{" "}
            </span>
            <span>{start_date}</span>
          </div>

          <div className="flex items-center">
            <FaCalendarAlt className="text-red-400 mr-2" />
            <span className="text-red-400">
              {language === "EN" ? "End Date" : "تاريخ النهاية"}:{" "}
            </span>
            <span>{end_date}</span>
          </div>
        </div>

        {/* زر الإغلاق */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center"
          >
            {language === "EN" ? "Close" : "إغلاق"}{" "}
            <FaArrowRight className="ml-2" />
          </button>
        </div>
        <div className="w-16 h-16 text-white bg-red-400 absolute top-3 right-3 flex items-center justify-center border border-dashed rounded-full">
          {coupon.discount_value || "0"}%
        </div>
      </div>
    </motion.div>
  );
}
