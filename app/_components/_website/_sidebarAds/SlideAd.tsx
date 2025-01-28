"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Img from "../../Img";
import { FaStarOfLife } from "react-icons/fa";
import { GiMoebiusStar } from "react-icons/gi";
import { UseVariables } from "@/app/context/VariablesContext";

export default function SlideAd() {
  const { language } = UseVariables();

  return (
    <>
      <AnimatePresence>
        {/* العنصر الرئيسي */}
        <motion.div className="bg-white shadow-md rounded-md flex flex-col min-h-screen w-full h-fit overflow-hidden">
          {/* العنوان */}
          <div className="center-name relative flex items-center justify-center min-h-[30px] w-full bg-gray-100">
            <h1 className="text-xl text-main_blue ">
              {language == "EN" ? "Exclusive offers" : "عروض حصرية"}
            </h1>
          </div>

          {/* العناصر ذات الخلفية */}
          <div className="flex-1 flex flex-wrap  bg-gradient-to-r from-sky-200 to-sky-500 w-full overflow-hidden relative">
            {Array.from({ length: 40 }).map((_, index) => (
              <motion.div
                key={index}
                className="w-20 h-20  absolute"
                style={{
                  top: `${Math.random() * 100}%`, // وضع عشوائي على المحور الرأسي
                  left: `${Math.random() * 100}%`, // وضع عشوائي على المحور الأفقي
                }}
                initial={{ scale: 0 }} // حجم الدائرة الأولي: 0
                animate={{ scale: 1 }} // حجم الدائرة النهائي: 1
                transition={{ duration: 0.5, delay: index * 0.1 }} // تأخير لإنشاء تأثير تسلسلي
              >
                <GiMoebiusStar className="text-white size-5" />
              </motion.div>
            ))}
          </div>

          <div className=" bg-white h-[370px] max-md:h-[250px]  flex flex-col items-center justify-end w-full relative ">
            {/* صورة العرض */}
            <div className=" absolute -top-14">
              <Img src="/led.png" className="w-[250px] max-md:w-[160px]" />
              <Img
                src="/personalized.png"
                className="w-[130px] max-md:w-[80px] absolute top-4 right-0  -scale-x-100 rotate-45 "
              />
            </div>

            {/* نص العرض */}
            <p className="text-5xl italic font-bold text-red-500 text-center">
              50% OFF
            </p>
            <p className="text-2xl font-thin leading-10 text-gray-700 text-center">
              on our Services
            </p>
            {/* الشعار والصور */}
            <div className="flex items-center justify-between w-[80%] mx-auto self-end mt-4">
              <Img src="/logo.png" className="w-[60px] max-md:w-[50px]" />
              <Img src="/handshake.png" className="w-[50px] max-md:w-[40px]" />
              <Img src="/google.png" className="w-[40px] max-md:w-[30px]" />
            </div>
          </div>

          <div className="flex-1 flex flex-wrap  bg-gradient-to-r from-orange-200 to-orange-500 w-full overflow-hidden relative">
            {Array.from({ length: 40 }).map((_, index) => (
              <motion.div
                key={index}
                className="w-20 h-20   absolute"
                style={{
                  top: `${Math.random() * 100}%`, // وضع عشوائي على المحور الرأسي
                  left: `${Math.random() * 100}%`, // وضع عشوائي على المحور الأفقي
                }}
                initial={{ scale: 0 }} // حجم الدائرة الأولي: 0
                animate={{ scale: 1 }} // حجم الدائرة النهائي: 1
                transition={{ duration: 0.5, delay: index * 0.1 }} // تأخير لإنشاء تأثير تسلسلي
              >
                {" "}
                <FaStarOfLife className="size-5 text-white" key={index} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
