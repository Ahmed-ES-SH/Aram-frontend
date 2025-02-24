"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaComments } from "react-icons/fa";

export default function ConversationsComponent({ language = "EN" }) {
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center  ">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8   "
      >
        <div className="flex items-center justify-center mb-4 text-main_orange">
          <FaComments className="size-80 max-md:size-52" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          {language === "EN" ? "Start a Conversation!" : "ابدأ محادثة!"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {language === "EN"
            ? "Connect with others and share your thoughts."
            : "تواصل مع الآخرين وشارك أفكارك."}
        </p>
      </motion.div>
    </div>
  );
}
