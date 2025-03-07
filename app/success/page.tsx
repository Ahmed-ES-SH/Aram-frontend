"use client";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Img from "../_components/Img";
import { AiOutlineHome } from "react-icons/ai";
import Navbar from "../_components/_website/Navbar";
import Footer from "../_components/_website/Footer";
import { UseVariables } from "../context/VariablesContext";
import { instance } from "../Api/axios";
import ForbiddenPage from "../forbiddenpage/page";

export default function SuccessPaymentPage({ searchParams }: any) {
  const { language } = UseVariables();
  const { transactionId } = searchParams;

  const texts = {
    EN: {
      successMessage: "Payment Successful!",
      transactionMessage: "Your transaction ID is: ",
      backButton: "Back to Home",
      helpMessage: "Need help? Contact our support team.",
    },
    AR: {
      successMessage: "تمت عملية الدفع بنجاح!",
      transactionMessage: "معرف المعاملة الخاصة بك هو: ",
      backButton: "العودة إلى الصفحة الرئيسية",
      helpMessage: "هل تحتاج إلى مساعدة؟ تواصل مع فريق الدعم.",
    },
  };

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await instance.post("/payment/status", {
          paymentId: transactionId,
        });
        console.log(response);
        if (response.data.IsSuccess) {
          localStorage.removeItem("cartitems");
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    checkPaymentStatus();
  }, [transactionId]);

  if (!transactionId) return <ForbiddenPage />;

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-white`}
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
            className="w-56"
          />
        </motion.div>

        {/* رمز النجاح */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
          className="flex items-center justify-center w-24 h-24 bg-green-500 rounded-full shadow-xl mb-6"
        >
          <FaCheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        {/* رسالة النجاح */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 text-center text-white"
        >
          <h1 className="text-3xl font-bold">
            {language === "EN"
              ? texts.EN.successMessage
              : texts.AR.successMessage}
          </h1>
          <p className="mt-2 text-lg">
            {language === "EN"
              ? texts.EN.transactionMessage
              : texts.AR.transactionMessage}{" "}
            <span className="font-bold text-sky-600 tracking-wide underline underline-sky-400">
              {transactionId}
            </span>
          </p>
        </motion.div>

        {/* زر العودة */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center px-6 py-2 mt-6 text-white bg-green-600 rounded-lg shadow-xl hover:bg-green-700 transition duration-300"
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
