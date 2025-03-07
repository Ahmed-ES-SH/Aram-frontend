"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaKey, FaCheckCircle } from "react-icons/fa";

import { LuLoader } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { UseVariables } from "@/app/context/VariablesContext";
import { instance } from "@/app/Api/axios";

export default function ForgotPassword() {
  const router = useRouter();
  const { language } = UseVariables();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({ AR: "", EN: "" });
  const [success, setSuccess] = useState({ AR: "", EN: "" });
  const [loading, setloading] = useState(false);

  const isArabic = language === "AR"; // تحقق إذا كانت اللغة عربية

  // النصوص بناءً على اللغة
  const texts = {
    step1: {
      title: isArabic ? "طلب البريد الإلكتروني" : "Request Email",
      description: isArabic
        ? "أدخل بريدك الإلكتروني لإرسال رمز التحقق."
        : "Enter your email to receive a verification code.",
      placeholder: isArabic ? "البريد الإلكتروني" : "Email",
      button: isArabic ? "التالي" : "Next",
    },
    step2: {
      title: isArabic ? "إدخال رمز التحقق" : "Enter Verification Code",
      description: isArabic
        ? "أدخل الرمز الذي تم إرساله إلى بريدك الإلكتروني."
        : "Enter the code sent to your email.",
      placeholder: isArabic ? "رمز التحقق" : "Verification Code",
      previous: isArabic ? "السابق" : "Previous",
      button: isArabic ? "التالي" : "Next",
    },
    step3: {
      title: isArabic ? "إدخال كلمة السر الجديدة" : "Enter New Password",
      description: isArabic
        ? "أدخل كلمة السر الجديدة وتأكيدها."
        : "Enter and confirm your new password.",
      placeholderPassword: isArabic ? "كلمة السر الجديدة" : "New Password",
      placeholderConfirm: isArabic ? "تأكيد كلمة السر" : "Confirm Password",
      previous: isArabic ? "السابق" : "Previous",
      button: isArabic ? "إرسال" : "Submit",
    },
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleCheckEmail = async () => {
    try {
      setError({ AR: "", EN: "" });
      setloading(true);
      const response = await instance.post(`/send-verification-code`, {
        email: email,
      });

      if (response.status === 200) {
        setStep(2);
        setError({ AR: "", EN: "" });
      }
    } catch (error: any) {
      if (error.response.status == 404) {
        setError({
          AR: "البريد الإلكتروني غير مسجل لدينا.",
          EN: "The email is not registered in our system.",
        });
      } else {
        // Handle other errors (e.g., network issues)
        console.error("Error:", error.message);
      }
    } finally {
      setloading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setError({ AR: "", EN: "" });
      setloading(true);
      const response = await instance.post("/verify-code", {
        email: email,
        code: code,
      });
      if (response.status == 200) {
        setStep(3);
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        setError({
          EN: "Please check the code and try again.",
          AR: "من فضلك تأكد من الكود وأعد المحاولة",
        });
      }
    } finally {
      setloading(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setError({ AR: "", EN: "" });
      setSuccess({ AR: "", EN: "" });
      // التأكد من أن كلمة المرور الجديدة مطابقة
      if (newPassword !== confirmPassword) {
        setError({
          AR: "كلمة المرور الجديدة غير متطابقة.",
          EN: "The new password does not match the confirmation password.",
        });
        return;
      }

      setloading(true);

      // إرسال البيانات إلى الـ API لتحديث كلمة المرور
      const response = await instance.post("/update-password", {
        email: email,
        password: newPassword,
      });

      // التحقق من نجاح العملية
      if (response.status === 200) {
        setSuccess({
          AR: "تم تحديث كلمة المرور بنجاح.",
          EN: "Password updated successfully.",
        });
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        // التعامل مع الأخطاء في الرد
        setError({
          AR: "حدث خطأ أثناء تحديث كلمة المرور.",
          EN: "An error occurred while updating the password.",
        });
      }
    } catch (error: any) {
      console.log(error);
      setError({
        AR: "حدث خطأ غير متوقع.",
        EN: "An unexpected error occurred.",
      });
    } finally {
      setloading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-fit"
        >
          <LuLoader className="size-40 max-md:size-32 text-main_orange" />
        </motion.div>
      </div>
    );

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-100 ${
        isArabic ? "text-right" : "text-left"
      }`}
      dir={isArabic ? "rtl" : "ltr"} // تغيير اتجاه الصفحة بناءً على اللغة
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center text-4xl text-main_orange">
                <FaEnvelope />
              </div>
              <h2 className="text-2xl font-bold text-center">
                {texts.step1.title}
              </h2>
              <p className="text-gray-600 text-center">
                {texts.step1.description}
              </p>
              <input
                type="email"
                placeholder={texts.step1.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
              <button
                onClick={handleCheckEmail}
                className="w-full bg-main_orange text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                {texts.step1.button}
              </button>
              {error.EN && (
                <p className="text-red-400 text-lg w-fit mx-auto my-3">
                  {language == "EN" ? error.EN : error.AR}
                </p>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center text-4xl text-main_orange">
                <FaKey />
              </div>
              <h2 className="text-2xl font-bold text-center">
                {texts.step2.title}
              </h2>
              <p className="text-gray-600 text-center">
                {texts.step2.description}
              </p>
              <input
                type="text"
                placeholder={texts.step2.placeholder}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
              <div className="flex gap-4">
                <button
                  onClick={handlePreviousStep}
                  className="w-1/2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  {texts.step2.previous}
                </button>
                <button
                  onClick={handleVerifyCode}
                  className="w-1/2 bg-main_orange text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  {texts.step2.button}
                </button>
              </div>
              {error.EN && (
                <p className="text-red-400 text-lg w-fit mx-auto my-3">
                  {language == "EN" ? error.EN : error.AR}
                </p>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center text-4xl text-main_orange">
                <FaCheckCircle />
              </div>
              <h2 className="text-2xl font-bold text-center">
                {texts.step3.title}
              </h2>
              <p className="text-gray-600 text-center">
                {texts.step3.description}
              </p>
              <input
                type="password"
                placeholder={texts.step3.placeholderPassword}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
              <input
                type="password"
                placeholder={texts.step3.placeholderConfirm}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
              <div className="flex gap-4">
                <button
                  onClick={handlePreviousStep}
                  className="w-1/2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  {texts.step3.previous}
                </button>
                <button
                  onClick={handleUpdatePassword}
                  className="w-1/2 bg-main_orange text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  {texts.step3.button}
                </button>
              </div>
              {error.EN && (
                <p className="text-red-400 text-lg w-fit mx-auto my-3">
                  {language == "EN" ? error.EN : error.AR}
                </p>
              )}
              {success.EN && (
                <p className="text-green-400 text-lg w-fit mx-auto my-3">
                  {language == "EN" ? success.EN : success.AR}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
