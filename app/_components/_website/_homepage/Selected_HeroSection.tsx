"use client";
import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import React, { useEffect, useState } from "react";
import Loading from "../../Loading";
import SliderSection from "./Hero_section";
import HeroVideo from "./HeroVideo";
import { useSearchParams } from "next/navigation";

export default function Selected_HeroSection() {
  const { language }: { language: string } = UseVariables();
  const searchParams = useSearchParams();
  const promoCode: any = searchParams.get("currentCode");
  const decodeCode = atob(promoCode);
  const [sliderstate, setsliderstate] = useState<boolean>(false);
  const [videostate, setvideostate] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/get-mainscreens");
        const slider_data = response.data.data[2];
        const video_data = response.data.data[1];
        if (response.status == 200) {
          setsliderstate(slider_data.main_screen);
          setvideostate(video_data.main_screen);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const checkCode = async () => {
      try {
        const response = await instance.post(`/track-visit`, {
          code: decodeCode,
        });
        if (response.status == 200) {
          console.log("vistor tracor");
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    if (decodeCode) checkCode();
  }, [decodeCode]);

  if (loading) return <Loading />;

  if (sliderstate) return <SliderSection />;

  if (videostate) return <HeroVideo />;
  return (
    <>
      <div className="w-full flex items-center justify-center mt-16 pb-6 ">
        <div className="text-center">
          <h1>
            {language == "EN"
              ? "Sorry, it seems that there is a problem fetching data!"
              : "عذرا يبدوا أن هناك مشكلة فى جلب البيانات !"}
          </h1>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {language == "EN" ? "Retry" : "إعادة المحاولة"}
          </button>
        </div>
      </div>
    </>
  );
}
