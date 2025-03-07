"use client";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <motion.div
      className="flex fixed z-[99999999] top-0 left-0 w-full flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* العنوان الرئيسي */}
      <motion.h1
        className="text-9xl font-bold mb-4 flex items-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        4
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <FaExclamationTriangle className="text-yellow-400 mx-4" />
        </motion.span>
        4
      </motion.h1>

      {/* الرسالة */}
      <motion.p
        className="text-2xl mb-8 text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        عذرًا، الصفحة التي تبحث عنها غير موجودة.
      </motion.p>

      {/* زر العودة للصفحة الرئيسية */}
      <motion.a
        href="/"
        className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-100 transition duration-300"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        العودة للصفحة الرئيسية
      </motion.a>
    </motion.div>
  );
}
