"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
// import { FaPlayCircle } from "react-icons/fa";
// import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import Loading from "../../Loading";
import { instance } from "@/app/Api/axios";

export default function Video_Section() {
  const { language }: any = UseVariables();
  const [text1, setText1] = useState<any>({ en: "", ar: "" });
  const [text2, setText2] = useState<any>({ en: "", ar: "" });
  const [text3, setText3] = useState<any>({ en: "", ar: "" });
  const [text4, setText4] = useState<any>({ en: "", ar: "" });
  const [loading, setLoading] = useState(false);
  const [videosrc, setvideosrc] = useState("");
  //   const [isPlaying, setIsPlaying] = useState(true); // حالة تشغيل الفيديو
  const videoRef = useRef<any>(null); // مرجع للفيديو

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/detailes");
        const data = response.data.data;
        setvideosrc(data.main_video);
        if (data) {
          setText1({ en: data.text1_en, ar: data.text1_ar });
          setText2({ en: data.text2_en, ar: data.text2_ar });
          setText3({ en: data.text3_en, ar: data.text3_ar });
          setText4({ en: data.text4_en, ar: data.text4_ar });
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return (
    <>
      <div className="relative h-screen flex items-center justify-center w-full">
        {/* فيديو الخلفية */}
        <video
          ref={videoRef} // مرجع للفيديو
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={videosrc ? videosrc : "/videos/about_video.mp4"}
          autoPlay
          loop
          muted
          playsInline
        ></video>

        {/* طبقة سوداء شفافة فوق الفيديو */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        {/* المحتوى النصي */}
        <div className="flex  flex-col gap-6 items-center   w-[90%] z-[999]">
          <section className="py-14 lg:py-24 relative z-0 ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center">
              <h1 className="max-w-2xl mx-auto text-center font-manrope font-bold text-4xl max-md:text-2xl text-secend_text  mb-5 md:text-5xl md:leading-normal">
                {language === "EN"
                  ? "Redefine Your Beauty with"
                  : "أعد تعريف جمالك مع"}
                <span className="text-main_orange">
                  {" "}
                  {language === "EN"
                    ? "Our Expert Care"
                    : "عنايتنا الاحترافية"}{" "}
                </span>
              </h1>
              <p className="max-w-sm mx-auto text-center text-base font-normal leading-7 text-gray-500 mb-9">
                {language === "EN"
                  ? "Discover personalized care and advanced solutions for your beauty and wellness journey."
                  : "اكتشف العناية المخصصة والحلول المتقدمة لرحلتك في الجمال والصحة."}
              </p>
            </div>

            <Link
              href={"/signup"}
              className="px-4 block relative  w-fit h-fit mx-auto text-main_orange text-xl pb-2 border-b border-main_blue group overflow-hidden   "
            >
              <p className=" group-hover:text-white z-[99] relative duration-200">
                {" "}
                {language == "EN" ? "Join now" : "إنضم الأن"}
              </p>
              <div className="group-hover:w-full left absolute left-0 top-0 bg-main_orange w-0 duration-700 h-[500px]"></div>
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
