"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
// import { Metadata } from "next";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { UseVariables } from "@/app/context/VariablesContext";
import { useDataContext } from "@/app/context/DataContext";
import UserAlreadyIn from "../UserAlreadyIn";

// export const metadata: Metadata = {
//   title: "آرام جروب - اختيار نوع الحساب",
//   description: "آرام جروب - اختيار نوع الحساب",
// };

export default function MembershipComponent() {
  const { language } = UseVariables();
  const { currentuser } = useDataContext();
  const searchParams = useSearchParams();
  const promoCode: any = searchParams.get("currentCode");
  const decodeCode = atob(promoCode);
  const containerVariants = {
    hidden: { opacity: 0, y: "-300%", x: "-50%" },
    visible: {
      opacity: 1,
      y: "-50%",
      x: "-50%",
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  if (currentuser) return <UserAlreadyIn />;

  return (
    <>
      <div className="overflow-hidden bg-gradient-to-r from-orange-200 to-white w-full">
        <div className="px-[15px] w-full h-screen overflow-hidden  relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full flex flex-col items-center justify-center max-lg:flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Image
              src={"/logo.png"}
              alt="logo"
              width={1024}
              height={1280}
              className="w-[200px] max-lg:w-[350px]"
            />
            <div className=" max-lg:w-full  flex flex-col items-center justify-center gap-6">
              <h1 className="text-4xl ">
                {language == "EN" ? "Create a new account" : "انشاء حساب جديد"}
              </h1>
              <p className="py-2 border-b border-sky-500 text-gray-400 text-2xl">
                {language == "EN"
                  ? "Please choose the type you would like to create"
                  : "يرجى اختيار نوع الحساب الذي ترغب في إنشائه"}
              </p>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={linkVariants}
                className="grid grid-cols-2 gap-8  w-full px-4"
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={linkVariants}
                >
                  <Link
                    href={`/signup?currentCode=${promoCode ? promoCode : ""}`}
                    className="w-[400px] max-lg:w-full  h-[300px] max-sm:h-[250px] text-white bg-main_blue hover:bg-white border border-transparent hover:border-main_blue hover:text-black hover:scale-105 duration-200 rounded-md shadow-md flex flex-col items-center justify-center gap-4"
                  >
                    <Image
                      src={"/man.png"}
                      alt="user"
                      width={1024}
                      height={1280}
                      className="w-[180px] max-md:w-[120px]"
                    />
                    <p className="text-xl  mt-4">
                      {language == "EN" ? "Account User" : "حساب عميل"}
                    </p>
                  </Link>
                </motion.div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={linkVariants}
                >
                  <Link
                    href={`/signuporganization?currentCode=${
                      promoCode ? promoCode : ""
                    }`}
                    className="w-[400px] max-lg:w-full  h-[300px] cursor-pointer max-sm:h-[250px] bg-main_orange text-white hover:bg-white border border-transparent hover:border-main_blue hover:text-black hover:scale-105 duration-200 rounded-md shadow-md flex flex-col items-center justify-center gap-4"
                  >
                    <Image
                      src={"/orange-ho.png"}
                      alt="VENDOR"
                      width={1024}
                      height={1280}
                      className="w-[180px] max-md:w-[120px]"
                    />
                    <p className="text-xl  mt-4">
                      {language == "EN" ? "Account Center" : "حساب مركز طبى"}
                    </p>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
