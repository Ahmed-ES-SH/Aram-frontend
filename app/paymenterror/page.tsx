"use client";
import { motion } from "framer-motion";
import React from "react";
import { FaTimesCircle } from "react-icons/fa"; // رمز الفشل
import Img from "../_components/Img";
import { AiOutlineHome } from "react-icons/ai";
import Navbar from "../_components/_website/Navbar";
import Footer from "../_components/_website/Footer";
import { UseVariables } from "../context/VariablesContext";
import ForbiddenPage from "../forbiddenpage/page";

export default function ErrorPaymentPage({ searchParams }: any) {
  const { language } = UseVariables();
  const { transactionId } = searchParams;

  const texts = {
    EN: {
      errorMessage: "Payment Failed!",
      transactionMessage:
        "Your transaction could not be completed. Please try again.",
      backButton: "Back to Home",
      helpMessage: "Need help? Contact our support team.",
    },
    AR: {
      errorMessage: "فشلت عملية الدفع!",
      transactionMessage:
        "لم تتم عملية الدفع الخاصة بك. يرجى المحاولة مرة أخرى.",
      backButton: "العودة إلى الصفحة الرئيسية",
      helpMessage: "هل تحتاج إلى مساعدة؟ تواصل مع فريق الدعم.",
    },
  };

  if (!transactionId) return <ForbiddenPage />;

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-400 to-white`}
      >
        {/* شعار الشركة */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Img
            src="/logo.png" // استبدل "/logo.png" بشعار شركتك
            className="w-56 max-md:w-40"
          />
        </motion.div>

        {/* رمز الفشل */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
          className="flex items-center justify-center w-24 h-24 bg-red-500 rounded-full shadow-xl mb-6"
        >
          <FaTimesCircle className="w-12 h-12 text-white" />
        </motion.div>

        {/* رسالة الفشل */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 text-center text-white"
        >
          <h1 className="text-3xl font-bold">
            {language === "EN" ? texts.EN.errorMessage : texts.AR.errorMessage}
          </h1>
          <p className="mt-2 text-lg">
            {language === "EN"
              ? texts.EN.transactionMessage
              : texts.AR.transactionMessage}
          </p>
        </motion.div>

        {/* زر العودة */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center px-6 py-2 mt-6 text-white bg-red-600 rounded-lg shadow-xl hover:bg-red-700 transition duration-300"
          onClick={() => (window.location.href = "/")}
        >
          <AiOutlineHome className="mr-2 w-5 h-5" />
          {language === "EN" ? texts.EN.backButton : texts.AR.backButton}
        </motion.button>

        {/* إضافة نص توضيحي */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 text-center text-white"
        >
          <p className="text-sm">
            {language === "EN" ? texts.EN.helpMessage : texts.AR.helpMessage}
          </p>
        </motion.div>
      </div>
    </>
  );
}
