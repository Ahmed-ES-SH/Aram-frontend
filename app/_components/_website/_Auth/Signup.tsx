"use client";
import React, { useRef, useState } from "react";
import Img from "../../Img";
import Link from "next/link";
import { FaCameraRetro } from "react-icons/fa";
import { instance } from "@/app/Api/axios";
import Cookie from "cookie-universal";
import Loading from "../../Loading";
import { motion } from "framer-motion";
import { UseVariables } from "@/app/context/VariablesContext";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function SignupForm() {
  const { language }: any = UseVariables();
  const cookie = Cookie();
  const imageref = useRef<any>(null);
  const [form, setform] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });
  const [image, setimage] = useState<null | File>(null);
  const [passworderror, setpassworderror] = useState("");
  const [loading, setloading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errors, seterrors] = useState<any>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleimagechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setimage(files[0]);
    }
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setloading(true);
    setpassworderror("");
    seterrors({});

    // تحقق من تطابق كلمة المرور
    if (form.password !== form.password_confirmation) {
      setloading(false);
      return setpassworderror("تأكد أن كلمة السر متطابقة مع تأكيد كلمة السر.");
    }

    try {
      const formdata = new FormData();
      formdata.append("name", form.name);
      formdata.append("email", form.email);
      formdata.append("phone_number", form.phone_number);
      formdata.append("password", form.password);
      formdata.append("password_confirmation", form.password_confirmation);
      if (image) formdata.append("image", image);

      const response = await instance.post("/register", formdata);

      if (response.status === 201) {
        setIsPopupVisible(true);
        if (typeof window !== "undefined") {
          window.location.pathname = "/login";
        }
      }
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        seterrors(error.response.data.errors);
      } else {
        alert("حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.");
      }
    } finally {
      setloading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <section
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        className="bg-white dark:bg-main_dash"
      >
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <motion.section
            className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Img
              src="/signup.png"
              className="absolute inset-0 h-full w-full object-cover opacity-80 "
            />
          </motion.section>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <motion.div
              className="w-full p-2 "
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative -mt-16 block ">
                <div className="flex items-center gap-3 max-lg:mt-12">
                  <h1 className="text-2xl font-bold text-gray-700 dark:text-secend_text sm:text-3xl md:text-4xl">
                    {language === "EN"
                      ? "Welcome to Aram"
                      : "مرحباً بك في آرام"}
                  </h1>
                  <input
                    type="file"
                    name="image"
                    hidden
                    ref={imageref}
                    onChange={handleimagechange}
                  />
                  <motion.div
                    onClick={() => imageref.current.click()}
                    className="w-12 h-12 overflow-hidden border-2 border-main_blue cursor-pointer hover:bg-main_blue group duration-200 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    {image ? (
                      <Img
                        src={URL.createObjectURL(image)}
                        className="w-full"
                      />
                    ) : (
                      <FaCameraRetro className="size-7 text-main_blue group-hover:text-white duration-200" />
                    )}
                  </motion.div>
                </div>
                <motion.p
                  className="mt-4 leading-relaxed text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {language === "EN"
                    ? "We are here to assist you with everything you need. Please fill out the form below to get started."
                    : "نحن هنا لمساعدتك في كل ما تحتاجه. يرجى ملء النموذج أدناه لتبدأ."}
                </motion.p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 grid grid-cols-6 gap-6"
              >
                <motion.div
                  className="col-span-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <label
                    htmlFor="Name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {language === "EN" ? "Name" : "الاسم"}
                  </label>
                  <input
                    type="text"
                    id="Name"
                    name="name"
                    className="mt-1 py-2 outline-transparent  dark:bg-secend_dash  focus:outline-main_orange duration-200 px-2 border w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 dark:text-gray-300 shadow-sm"
                    value={form.name}
                    onChange={handlechange}
                  />
                  {errors && errors["name"] && (
                    <p className="text-red-400 my-3">{errors["name"]}</p>
                  )}
                </motion.div>

                <motion.div
                  className="col-span-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <label
                    htmlFor="Email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {language === "EN" ? "Email" : "البريد الإلكتروني"}
                  </label>
                  <input
                    type="email"
                    id="Email"
                    name="email"
                    className="mt-1 py-2 outline-transparent  dark:bg-secend_dash  focus:outline-main_orange duration-200 px-2 border w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 dark:text-gray-300 shadow-sm"
                    value={form.email}
                    onChange={handlechange}
                  />
                  {errors && errors["email"] && (
                    <p className="text-red-400 my-3">{errors["email"]}</p>
                  )}
                </motion.div>
                <motion.div
                  className="col-span-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {language === "EN" ? "phone number" : "رقم الهاتف"}
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    className="mt-1 py-2 outline-transparent  dark:bg-secend_dash  focus:outline-main_orange duration-200 px-2 border w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 dark:text-gray-300 shadow-sm"
                    value={form.phone_number}
                    onChange={handlechange}
                  />
                  {errors && errors["name"] && (
                    <p className="text-red-400 my-3">
                      {errors["phone_number"]}
                    </p>
                  )}
                </motion.div>

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
                      type={showPassword ? "text" : "password"} // تغيير النوع بناءً على الحالة
                      id="Password"
                      name="password"
                      className="mt-1 py-2 outline-transparent dark:bg-secend_dash focus:outline-main_orange duration-200 px-2 border w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 dark:text-gray-300 shadow-sm"
                      value={form.password}
                      onChange={handlechange}
                    />
                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility} // تغيير الحالة عند النقر
                    >
                      {showPassword ? (
                        <HiEyeOff className="text-gray-400 size-4" /> // أيقونة العين المغلقة
                      ) : (
                        <HiEye className="text-gray-400 size-4" /> // أيقونة العين المفتوحة
                      )}
                    </span>
                  </div>
                  {errors && errors["password"] && (
                    <p className="text-red-400 my-3">{errors["password"]}</p>
                  )}
                </motion.div>

                <motion.div
                  className="col-span-6 sm:col-span-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <label
                    htmlFor="PasswordConfirmation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {language === "EN"
                      ? "Confirm Password"
                      : "تأكيد كلمة المرور"}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"} // تغيير النوع بناءً على الحالة
                      id="PasswordConfirmation"
                      name="password_confirmation"
                      className="mt-1 py-2 outline-transparent dark:bg-secend_dash focus:outline-main_orange duration-200 px-2 border w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 dark:text-gray-300 shadow-sm"
                      value={form.password_confirmation}
                      onChange={handlechange}
                    />
                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility} // تغيير الحالة عند النقر
                    >
                      {showConfirmPassword ? (
                        <HiEyeOff className="text-gray-400 size-4" /> // أيقونة العين المغلقة
                      ) : (
                        <HiEye className="text-gray-400 size-4" /> // أيقونة العين المفتوحة
                      )}
                    </span>
                  </div>
                  {passworderror && (
                    <p className="text-red-400 my-3">{passworderror}</p>
                  )}
                </motion.div>

                <motion.div
                  className="col-span-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <label htmlFor="MarketingAccept" className="flex gap-4">
                    <input
                      type="checkbox"
                      id="MarketingAccept"
                      name="marketing_accept"
                      className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {language === "EN"
                        ? "I want to receive emails about events, updates, and announcements."
                        : "أريد استلام رسائل بريدية حول الفعاليات، التحديثات، والإعلانات."}
                    </span>
                  </label>
                </motion.div>

                <motion.div
                  className="col-span-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <p className="text-sm text-gray-500">
                    {language === "EN"
                      ? "By creating an account, you agree to the "
                      : "من خلال إنشاء حساب، أنت توافق على "}
                    <Link
                      href="/termsconditionsusers"
                      className="text-gray-700 dark:text-gray-300 underline"
                    >
                      {language === "EN"
                        ? "Terms & Conditions"
                        : "الشروط والأحكام"}
                    </Link>{" "}
                    {language === "EN" ? "and" : "و"}
                    <Link
                      href="/privacypolicyusers"
                      className="text-gray-700 dark:text-gray-300 underline"
                    >
                      {language === "EN" ? "Privacy Policy" : "سياسة الخصوصية"}
                    </Link>
                    .
                  </p>
                </motion.div>

                <motion.div
                  className="col-span-6 sm:flex sm:items-center sm:gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <button
                    type="submit"
                    className="inline-block shrink-0 rounded-md border border-main_orange bg-main_orange px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-main_orange duration-200 hover:scale-105 hover:bg-white dark:hover:text-black dark:hover:bg-white focus:outline-none focus:ring active:text-orange-500"
                  >
                    {language === "EN" ? "Create Account" : "إنشاء حساب"}
                  </button>

                  <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    {language === "EN"
                      ? "Already have an account?"
                      : "لديك حساب بالفعل؟"}
                    <Link
                      href="/login"
                      className="text-gray-700 dark:text-gray-300 underline"
                    >
                      {language === "EN" ? "Sign in" : "تسجيل الدخول"}
                    </Link>
                    .
                  </p>
                </motion.div>
              </form>
            </motion.div>
          </main>
        </div>
      </section>
      {isPopupVisible && (
        <SuccessPopup
          message={
            language === "EN"
              ? "Registration successful! You're being redirected to the home page."
              : "تم التسجيل بنجاح! جاري تحويلك إلى الصفحة الرئيسية."
          }
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </>
  );
}
