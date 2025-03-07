"use client";
// LoadingScreen.js
import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  return (
    <div className="flex fixed top-0 left-0 w-full flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <motion.div
        className="w-16 h-16 bg-blue-500 rounded-full"
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 180, 180, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
      <div className="mt-4 text-lg font-semibold">
        {currentDate} - {currentTime}
      </div>
      <div className="mt-2 text-sm text-gray-400">جاري التحميل...</div>
    </div>
  );
};

export default LoadingScreen;
