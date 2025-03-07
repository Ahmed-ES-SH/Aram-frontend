"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react"; // أضفنا useEffect هنا
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SlideAd from "./SlideAd";
import { useDataContext } from "@/app/context/DataContext";

export default function SiderbarAds() {
  const { randomOffers } = useDataContext();
  const [isOpen, setIsOpen] = useState(false);

  // تأخير ظهور الشريط الجانبي بعد 5 ثوانٍ
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true); // افتح الشريط الجانبي بعد 5 ثوانٍ
    }, 8000); // 5000 مللي ثانية = 5 ثوانٍ

    return () => clearTimeout(timer); // تنظيف المؤقت عند إلغاء التثبيت
  }, []); // [] يعني أن هذا التأثير يعمل مرة واحدة عند التحميل

  const clickToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div
        className={`flex flex-row-reverse items-center ${
          isOpen ? "lg:w-[350px] max-lg:w-3/4 " : ""
        }  min-h-screen h-fit z-40 fixed top-0 right-0 `}
      >
        <AnimatePresence>
          {/* العنصر الرئيسي */}
          {isOpen && (
            <motion.div
              key="sidebar" // مفتاح فريد لتتبع العنصر
              initial={{ width: 0, opacity: 0 }} // الحالة الأولية: عرض 0 وشفافية 0
              animate={{ width: isOpen ? 350 : 0, opacity: isOpen ? 1 : 0 }} // الحالة النهائية بناءً على isOpen
              exit={{ width: 0, opacity: 0 }} // العرض عند الخروج: 0 مع شفافية
              transition={{ duration: 0.5, ease: "easeInOut" }} // مدة الحركة ونوعها
              className={`bg-white shadow-md rounded-md duration-200 flex flex-col h-screen lg:w-[350px] max-lg:w-full ${
                isOpen ? "w-[350px] max-md:w-3/4" : "w-0"
              }`}
            >
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 2500,
                }}
                slidesPerView={1}
                className="h-screen"
              >
                {randomOffers &&
                  randomOffers.map((offer: any, index: number) => (
                    <SwiperSlide key={index}>
                      <SlideAd offer={offer} />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* زر التبديل */}
        <div
          className="bg-red-400 z-[9999999] relative text-white group w-[30px] h-fit py-1 rounded-l-md cursor-pointer hover:scale-125 duration-150 flex items-center justify-center"
          onClick={clickToggle} // إضافة وظيفة الإغلاق
        >
          {isOpen ? (
            <MdOutlineArrowRight className="size-5 group-hover:scale-110 duration-100" />
          ) : (
            <MdOutlineArrowLeft className="size-5 group-hover:scale-110 duration-100" />
          )}
        </div>
      </div>
    </>
  );
}
