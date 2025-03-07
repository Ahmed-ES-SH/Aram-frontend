"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Img from "../../Img";
import { FaStarOfLife } from "react-icons/fa";
import { GiMoebiusStar } from "react-icons/gi";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";

interface OfferProps {
  offer: {
    id: number;
    title: string;
    description: string;
    discount_value: number;
    image: string;
    code: string;
    url: string;
    organization: {
      icon: string;
      title_en: string;
      title_ar: string;
    };
  };
}

export default function SlideAd({ offer }: OfferProps) {
  const { language } = UseVariables();

  return (
    <AnimatePresence>
      <motion.div className="bg-white shadow-md rounded-md flex flex-col min-h-screen w-full h-fit overflow-hidden">
        {/* العنوان */}
        <div className="center-name relative flex items-center justify-center min-h-[30px] w-full bg-gray-100">
          <h1 className="text-xl text-main_blue ">
            {language == "EN" ? "Exclusive Offers" : "عروض حصرية"}
          </h1>
        </div>

        {/* العناصر ذات الخلفية */}
        <div className="flex-1 flex flex-wrap bg-gradient-to-r from-sky-200 to-sky-500 w-full overflow-hidden relative">
          {/* {Array.from({ length: 40 }).map((_, index) => (
            <motion.div
              key={index}
              className="w-20 h-20 absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GiMoebiusStar className="text-white size-5" />
            </motion.div>
          ))} */}
        </div>

        {/* تفاصيل العرض */}
        <div className="bg-white dark:bg-secend_dash h-[370px] max-md:h-[250px] flex flex-col items-center justify-end w-full relative">
          {/* صورة العرض */}
          <div className="absolute -top-14">
            <Img src={"/screen.png"} className="w-[250px] max-md:w-[160px]" />
            <Img
              src="/personalized.png"
              className="w-[130px] max-md:w-[80px] absolute top-4 right-0 -scale-x-100 rotate-45"
            />
          </div>

          {/* وصف العرض */}
          <p className="text-2xl font-thin leading-10 text-gray-700 text-center">
            {offer.description}
          </p>

          {/* الكود وزر التوجيه */}
          <div className="mt-4 flex w-full flex-col items-center">
            <p className="text-lg font-semibold text-blue-600">
              {language === "EN" ? "Promo Code:" : "كود الخصم:"}{" "}
              <span className="font-bold text-red-600">{offer.code}</span>
            </p>
            <div className="flex items-center justify-between w-[80%] mx-auto self-end my-4">
              <Img src="/logo.png" className="w-[60px] max-md:w-[50px]" />
              <Img src="/handshake.png" className="w-[50px] max-md:w-[40px]" />
              <Img
                src={
                  offer.organization && offer.organization.icon
                    ? offer.organization.icon
                    : "/logo.png"
                }
                className="w-[40px] max-md:w-[30px]"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-wrap bg-gradient-to-r from-orange-200 to-orange-500 w-full overflow-hidden relative">
          {/* {Array.from({ length: 40 }).map((_, index) => (
            <motion.div
              key={index}
              className="w-20 h-20 absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FaStarOfLife className="size-5 text-white" />
            </motion.div>
          ))} */}
          {/* نسبة الخصم */}
          <div className="flex flex-col absolute top-3 left-1/2 -translate-x-1/2 items-center justify-center">
            <p className="text-5xl  whitespace-nowrap border rounded-md block bg-sky-200  px-3 py-1 italic font-bold text-red-500 text-center">
              {offer.discount_value}% OFF
            </p>
            <Link
              href={`/couponsoffers`}
              target="_blank"
              className="mt-3 px-6 py-2 bg-main_blue text-white rounded-lg hover:bg-blue-700"
            >
              {language === "EN" ? "Go to Offers" : "انتقل إلى العروض"}
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
