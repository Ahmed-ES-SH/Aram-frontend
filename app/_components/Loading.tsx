import { motion } from "framer-motion";
import React from "react";

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-screen fixed top-0 left-0 bg-white dark:bg-secend_dash flex items-center justify-center z-[999999999999999999]"
    >
      <span className="loader"></span>
    </motion.div>
  );
}
