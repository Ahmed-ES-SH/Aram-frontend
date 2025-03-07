"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { AiOutlineClose, AiOutlineCopy } from "react-icons/ai";
import Img from "../../Img";
import { FaCalendarAlt, FaTag } from "react-icons/fa";
import { UseVariables } from "@/app/context/VariablesContext";

interface OfferPopupProps {
  offer: any;
  isOpen: boolean;
  onClose: any;
}

export default function OfferPopup({
  offer,
  isOpen,
  onClose,
}: OfferPopupProps) {
  const { language } = UseVariables();
  const [isCopied, setIsCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(offer.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-md:w-[95%] max-w-lg rounded-2xl py-12 bg-white dark:bg-secend_dash shadow-lg"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 dark:text-white hover:text-gray-900"
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Offer Image */}
          <div className=" relative h-fit w-full">
            <Img
              src={offer.image}
              className="w-full h-48 rounded-lg object-cover"
            />
            <Img
              src={
                offer?.organization && offer?.organization?.icon
                  ? offer?.organization.icon
                  : "/public"
              }
              className=" absolute bottom-2 right-2 border w-12 h-12 bg-white rounded-full shadow-sm  object-cover"
            />
          </div>

          {/* Offer Details */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-secend_text">
              {offer.title_en}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-200 mt-2">
              {offer.description_en}
            </p>
          </div>

          {/* Discount Value */}
          <div className="mt-4 flex items-center gap-3 bg-gray-100 dark:bg-main_dash p-3 rounded-lg shadow-sm">
            <FaTag className="text-yellow-500 text-xl" />
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-300">
              {language == "EN" ? "Discount:" : "الخصم:"}
            </span>
            <span className="text-xl font-bold text-green-500">
              {offer.discount_value}%
            </span>
          </div>

          {/* Validity Dates */}
          <div className="mt-2 text-sm text-gray-700 dark:text-secend_text bg-gray-100 dark:bg-main_dash p-3 rounded-lg shadow-sm">
            <p className="flex items-center gap-2">
              <FaCalendarAlt className="text-sky-500" />
              {language == "EN" ? "Valid from:" : "بداية التفعيل :"}
              <span className="font-semibold text-gray-800 dark:text-white">
                {offer.start_date}
              </span>
            </p>
            <p className="flex items-center gap-2 mt-1">
              <FaCalendarAlt className="text-red-500" />
              {language == "EN" ? "Valid until:" : "نهاية التفعيل :"}
              <span className="font-semibold text-gray-800 dark:text-white">
                {offer.end_date}
              </span>
            </p>
          </div>

          {/* Code Box */}
          <div className="mt-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-300 dark:border-gray-700 p-4">
              <span className="font-mono text-lg text-gray-800">
                {offer.code}
              </span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
              >
                <AiOutlineCopy />
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
