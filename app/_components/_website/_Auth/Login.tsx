"use client";
import React, { useEffect, useState } from "react";
import { HiMail, HiEye, HiEyeOff } from "react-icons/hi";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import { instance, main_api } from "@/app/Api/axios";
import Cookie from "cookie-universal";
import Loading from "../../Loading";
import { motion } from "framer-motion";
import Separator from "../Separator";
import { useDataContext } from "@/app/context/DataContext";
import UserAlreadyIn from "../../UserAlreadyIn";

///////////////////////////////////////////////
/// end of import lines
//////////////////////////////////////////////

interface formtype {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { language }: any = UseVariables();
  const { currentuser } = useDataContext();
  const cookie = Cookie();

  const textContent: any = {
    EN: {
      title: "Get started today!",
      description:
        "Join us and manage your account easily. Sign up or log in to access exclusive features and stay connected.",
      emailPlaceholder: "Enter email",
      passwordPlaceholder: "Enter password",
      noAccount: "No account?",
      signUp: "Sign up",
      signIn: "Sign in",
      ForgotPassword: "Forgot your password?",
    },
    AR: {
      title: "ابدأ اليوم!",
      description:
        "انضم إلينا وأدر حسابك بسهولة. قم بالتسجيل أو تسجيل الدخول للوصول إلى ميزات حصرية والبقاء على اتصال.",
      emailPlaceholder: "أدخل البريد الإلكتروني",
      passwordPlaceholder: "أدخل كلمة المرور",
      noAccount: "ليس لديك حساب؟",
      signUp: "سجل الآن",
      signIn: "تسجيل الدخول",
      ForgotPassword: "هل نسيت كلمة السر ؟",
    },
  };

  const content = textContent[language];

  ///////////////////////////////////////////////
  /// stats
  //////////////////////////////////////////////

  const [form, setform] = useState<formtype>({
    email: "",
    password: "",
  });

  const [error, seterror] = useState({
    ar: "",
    en: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState(false);
  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handlesubmit = async () => {
    setloading(true);
    try {
      const formdata = new FormData();
      formdata.append("email", form.email);
      formdata.append("password", form.password);
      const response = await instance.post("/login", formdata);
      if (response.status == 200) {
        cookie.set("aram_token", response.data.token);
        if (typeof window !== undefined) {
          window.location.pathname = "/";
        }
      }
    } catch (error: any) {
      console.log(error);
      seterror({
        en: "Sorry , Please Check Your Password And Email .",
        ar: "عفواً البريد الإلكترونى او كلمة السر غير صحيحة .",
      });
      setloading(false);
    }
  };

  useEffect(() => {
    setInterval(() => {
      setloading(false);
    }, 500);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) return <Loading />;

  if (currentuser) return <UserAlreadyIn />;

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`relative flex flex-wrap dark:bg-main_dash  h-screen lg:items-center max-lg:mt-16 ${
          language === "AR" ? "rtl" : ""
        }`}
      >
        <motion.div
          style={{ direction: language == "EN" ? "ltr" : "rtl" }}
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 60 }}
          className="w-full bg-cover bg-center flex items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24 max-lg:bg-[url('/login-bg.png')]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-fit px-6 py-3 shadow-lg  dark:bg-secend_dash dark:shadow-sm rounded-md bg-white"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-lg text-center "
            >
              <h1 className="text-2xl font-bold sm:text-3xl dark:text-secend_text">
                {content.title}
              </h1>
              <p className="mt-4 text-gray-500 dark:text-white">
                {content.description}
              </p>
            </motion.div>

            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto mb-0 mt-8 max-w-md space-y-4"
            >
              <div>
                <label htmlFor="email" className="sr-only">
                  {language == "EN" ? "Email" : "البريد الإلكترونى"}
                </label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    onChange={handlechange}
                    value={form.email}
                    className=" invalid:outline-red-300 valid:outline-main_orange  w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-transparent  duration-200"
                    placeholder={content.emailPlaceholder}
                  />
                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                    <HiMail className="text-gray-400 size-4" />
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  {language == "EN" ? "Password" : "كلمة السر"}
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"} // تغيير النوع بناءً على الحالة
                    id="password"
                    name="password"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={handlechange}
                    value={form.password}
                    className="invalid:outline-red-300 valid:outline-main_orange w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-transparent duration-200"
                    placeholder={content.passwordPlaceholder}
                  />
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={
                      isFocused ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                    }
                    transition={{ duration: 0.3 }}
                    className="absolute inset-y-0 end-0 grid place-content-center px-4 cursor-pointer"
                    onClick={togglePasswordVisibility} // تغيير الحالة عند النقر
                  >
                    {showPassword ? (
                      <HiEyeOff className="text-gray-400 size-4" /> // أيقونة العين المغلقة
                    ) : (
                      <HiEye className="text-gray-400 size-4" /> // أيقونة العين المفتوحة
                    )}
                  </motion.span>
                </div>
              </div>

              <div className="flex items-center justify-between max-lg:flex-col-reverse max-lg:items-end">
                <div className="flex flex-col items-start gap-3 max-lg:self-start">
                  <p className="text-sm text-gray-500 dark:text-white ">
                    {content.noAccount}{" "}
                    <Link className="underline" href="/signup">
                      {content.signUp}
                    </Link>
                  </p>

                  <Link
                    className="text-sm underline text-gray-500 dark:text-white "
                    href="/forgetpassword"
                  >
                    {content.ForgotPassword}
                  </Link>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  onClick={handlesubmit}
                  className="inline-block rounded-lg bg-main_orange hover:bg-white border border-transparent hover:border-main_orange hover:text-black duration-200 px-5 py-3 text-sm font-medium text-white"
                >
                  {content.signIn}
                </motion.button>
              </div>
              <p className="my-3 text-red-400 text-md">
                {error && language == "EN" ? error.en : error.ar}
              </p>
            </motion.form>
            <Separator bg_dark="dark:bg-secend_dash" text="OR" />
            <div
              style={{ direction: "ltr" }}
              className="flex flex-col items-center justify-center gap-2"
            >
              <Link
                href={`${main_api}/auth/google/redirect`}
                className="flex items-center justify-center rounded-md border-none w-full max-w-xs  text-sm font-medium text-gray-700 bg-white   h-[50px] shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                <div className="w-[15%] flex items-center justify-center">
                  <Img src="/google.png" className="w-5 " />
                </div>
                <span className="w-[90%] flex items-center justify-center h-full bg-green-400 rounded-r-md text-white">
                  Sign in with Google
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 60 }}
          className="relative max-lg:hidden h-64 w-full sm:h-96 lg:h-full lg:w-1/2"
        >
          <Img
            src="/login-bg.png"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
      </motion.section>
    </>
  );
}
