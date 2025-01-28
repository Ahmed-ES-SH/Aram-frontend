"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import Loading from "../../Loading";
import { AnimatePresence, motion } from "framer-motion";

interface texttype {
  EN: string;
  AR: string;
}

export default function Hero_video_dash() {
  const { language }: any = UseVariables();
  const [video, setvideo] = useState<any>("");
  const [text1, setText1] = useState<texttype>({
    EN: "Welcome to Your Trusted Medical Partner",
    AR: "مرحباً بكم في شريككم الطبي الموثوق",
  });
  const [text2, setText2] = useState<texttype>({
    EN: "Comprehensive Healthcare Solutions",
    AR: "حلول طبية شاملة",
  });
  const [text3, setText3] = useState<texttype>({
    EN: "Care Beyond Expectations",
    AR: "رعاية تتجاوز التوقعات",
  });
  const [text4, setText4] = useState<texttype>({
    EN: "Discover our services tailored to your needs.",
    AR: "اكتشف خدماتنا المصممة لتلبية احتياجاتك.",
  });

  const [loading, setloading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/get-videoscreen");
        const data = response.data.data;

        if (data) {
          setText1({ EN: data.main_text_en, AR: data.main_text_ar });
          setText2({ EN: data.second_text_en, AR: data.second_text_ar });
          setText3({ EN: data.third_text_en, AR: data.third_text_ar });
          setText4({ EN: data.forth_text_en, AR: data.forth_text_ar });
          setvideo(data.video);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    getData();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <div
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        className="w-full mt-16 flex flex-col items-center rounded-md "
      >
        <div className="relative h-screen flex items-center justify-center w-full bg-black">
          {/* فيديو الخلفية */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={video}
            autoPlay
            loop
            muted
            playsInline
          />
          ){/* طبقة سوداء شفافة فوق الفيديو */}
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
          {/* المحتوى النصي */}
          <motion.div
            className="z-10 flex flex-col items-center text-center gap-6 px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className={`${
                language === "EN"
                  ? "text-5xl max-md:text-3xl max-sm:text-xl"
                  : "text-3xl max-md:text-2xl max-sm:text-lg"
              } font-bold text-white cursor-pointer`}
              whileHover={{ scale: 1.05, color: "#38bdf8" }}
              transition={{ duration: 0.3 }}
            >
              {language == "EN" ? text1.EN : text1.AR}
            </motion.h1>

            <motion.h2
              className={`${
                language === "EN"
                  ? "text-3xl max-md:text-2xl max-sm:text-lg"
                  : "text-2xl max-md:text-xl max-sm:text-md"
              } w-3/4 max-lg:w-[95%] font-semibold text-main_orange cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {language == "EN" ? text2.EN : text2.AR}
            </motion.h2>

            <motion.h3
              className={`${
                language === "EN"
                  ? "text-5xl max-md:text-2xl"
                  : "text-4xl max-md:text-xl"
              } font-medium text-gray-200 cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {language == "EN" ? text3.EN : text3.AR}
            </motion.h3>

            <Link
              href="/membership"
              className="relative px-6 py-3 block text-lg font-semibold text-white border duration-200 border-main_orange rounded-lg group overflow-hidden"
            >
              <span className="relative z-10">
                {language === "EN" ? "Join Now" : "إنضم الآن"}
              </span>
              <motion.div className="absolute inset-0 w-0 duration-200 h-full group-hover:w-full bg-main_orange"></motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
