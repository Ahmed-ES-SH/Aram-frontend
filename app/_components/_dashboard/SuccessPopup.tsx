"use client";
import { motion } from "framer-motion";
import { MdCheckCircle } from "react-icons/md";
import React from "react";
import { UseVariables } from "@/app/context/VariablesContext";

interface props {
  message: string;
  onClose: any;
}

export default function SuccessPopup({ message, onClose }: props) {
  const { language } = UseVariables();
  const popupVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999999999999]"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={popupVariants}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        {/* Success Icon */}
        <div className="flex items-center justify-center mb-4">
          <MdCheckCircle className="text-green-500 text-6xl" />
        </div>

        {/* Success Message */}
        <p
          style={{ direction: "rtl" }}
          className="text-gray-700 text-center text-lg font-medium mb-4"
        >
          {message}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          {language == "EN" ? "Close" : "إغلاق"}
        </button>
      </div>
    </motion.div>
  );
}
