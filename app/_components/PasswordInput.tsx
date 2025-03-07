"use client";
import { motion } from "framer-motion";
import { HiEye, HiEyeOff } from "react-icons/hi";
import React, { useState } from "react";

interface props {
  language: string;
  value: string;
  handlechange: any;
  errorpassword: string;
  setPasswordStrengthProps: any;
}

export default function PasswordInput({
  language,
  value,
  handlechange,
  errorpassword,
  setPasswordStrengthProps,
}: props) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0: ضعيف, 1: متوسط, 2: قوي

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;

    // تحقق من طول كلمة السر
    if (password.length >= 8) strength++;

    // تحقق من وجود حرف كبير
    if (/[A-Z]/.test(password)) strength++;

    // تحقق من وجود حرف صغير
    if (/[a-z]/.test(password)) strength++;

    // تحقق من وجود رقم
    if (/[0-9]/.test(password)) strength++;

    // تحقق من وجود رمز خاص
    if (/[!@#$%^&*]/.test(password)) strength++;

    // تحديد قوة كلمة السر بناءً على النقاط
    if (strength <= 2) return 0; // ضعيف
    if (strength <= 4) return 1; // متوسط
    return 2; // قوي
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlechange(e); // تحديث حالة كلمة السر
    const strength = checkPasswordStrength(e.target.value);
    setPasswordStrength(strength); // تحديث قوة كلمة السر
    setPasswordStrengthProps(strength); // تحديث حالة ��هور رمز خا��
  };

  return (
    <motion.div
      className="col-span-6 sm:col-span-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <label
        htmlFor="Password"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {language === "EN" ? "Password" : "كلمة المرور"}
      </label>
      <div className="relative">
        <input
          placeholder={"abCD34@#"}
          type={showPassword ? "text" : "password"}
          id="Password"
          name="password"
          style={{ direction: language == "EN" ? "ltr" : "rtl" }}
          className="mt-1 py-2 outline-transparent dark:bg-secend_dash focus:outline-main_orange duration-200 px-2 border w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 dark:text-gray-300 shadow-sm"
          value={value}
          onChange={handlePasswordChange} // استخدام الدالة المحدثة
        />
        <span
          className={`absolute inset-y-0 pr-3 flex items-center cursor-pointer ${
            language == "EN" ? "right-0" : "left-2"
          }`}
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <HiEyeOff className="text-gray-400 size-4" />
          ) : (
            <HiEye className="text-gray-400 size-4" />
          )}
        </span>
      </div>

      {/* البارات التي تعبر عن قوة كلمة السر */}
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded ${
              passwordStrength >= index
                ? passwordStrength === 0
                  ? "bg-red-500" // ضعيف
                  : passwordStrength === 1
                  ? "bg-yellow-500" // متوسط
                  : "bg-green-500" // قوي
                : "bg-gray-200" // غير نشط
            }`}
          />
        ))}
      </div>

      {/* رسائل توضيحية لقوة كلمة السر */}
      <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
        {passwordStrength === 0
          ? language === "EN"
            ? "Weak password"
            : "كلمة مرور ضعيفة"
          : passwordStrength === 1
          ? language === "EN"
            ? "Medium password"
            : "كلمة مرور متوسطة"
          : language === "EN"
          ? "Strong password"
          : "كلمة مرور قوية"}
      </p>

      {errorpassword && <p className="text-red-400 my-3">{errorpassword}</p>}
    </motion.div>
  );
}
