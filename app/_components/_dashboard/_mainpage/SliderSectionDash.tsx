"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Loading from "../../Loading";
import { instance } from "@/app/Api/axios";
import SuccessPopup from "../SuccessPopup";
import HeroSection from "../../_website/_homepage/Hero_section";

export default function SliderSectionDash() {
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [loading, setloading] = useState(true);
  const [mainScreen, setMainScreen] = useState<any>(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/get-slidermainscreen");
        const data = response.data.data[2];
        if (data) {
          setMainScreen(data.main_screen);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    getData();
  }, []);

  const updateText = async () => {
    const formData = new FormData();
    // إضافة قيمة main_screen إلى FormData
    formData.append("main_screen", mainScreen ? "1" : "0");

    try {
      setloading(true);
      const response = await instance.post(`/update-mainscreen/3`, formData);

      setMainScreen(response.data.data.main_screen);
    } catch (error) {
      console.error("Error updating text:", error);
    } finally {
      setloading(false);
    }
  };

  const toggleupdate = async () => {
    setMainScreen((prev: any) => !prev);
  };

  if (loading) return <Loading />;
  return (
    <>
      <h1 className="pb-2 border-b border-sky-600 dark:text-white w-fit mx-auto text-xl pt-4 block">
        قسم عرض الشرائح
      </h1>
      <motion.div
        className="w-full  p-6 mb-4   dark:text-white  border-b border-sky-400 flex items-center justify-between "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>حالة العرض </h1>
        {/* Toggle on the left */}
        <div
          onClick={
            () => toggleupdate() // التبديل بين القيم
          }
          className={`flex cursor-pointer items-center w-[80px] h-[40px] relative ${
            mainScreen == "1" ? "bg-green-400" : "bg-gray-300"
          } rounded-full duration-200 shadow-md border `}
        >
          <motion.span
            layout
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ scale: 1.1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
            className="w-[25px] h-[25px] rounded-full bg-white absolute"
            style={{
              left: mainScreen == "1" ? "10px" : "45px",
            }}
          ></motion.span>
        </div>
      </motion.div>
      <div className="w-full flex items-center justify-center mt-2">
        <button
          onClick={updateText}
          className=" px-2 py-2 duration-200 w-1/4 max-md:w-[95%] mx-auto bg-green-400 border border-transparent rounded-md shadow-md text-white hover:border-green-400 hover:bg-white hover:text-black dark:hover:text-black"
        >
          حفظ
        </button>
      </div>
      <HeroSection />
      {/* عرض الـ Popup عند نجاح العملية */}
      {isPopupVisible && (
        <SuccessPopup
          message="تمت العملية بنجاح!"
          onClose={() => setIsPopupVisible(false)} // إغلاق الـ Popup عند الضغط على زر الإغلاق
        />
      )}
    </>
  );
}
