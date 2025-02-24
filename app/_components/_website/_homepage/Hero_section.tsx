"use client";
import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Heroslide from "./Hero_slide";
import { UseVariables } from "@/app/context/VariablesContext";
import { instance } from "@/app/Api/axios";
import Loading from "../../Loading";

interface SLiderType {
  text_1_en: string;
  text_1_ar: string;
  text_2_en: string;
  text_2_ar: string;
  text_3_en: string;
  text_3_ar: string;
  image: string;
}

export default function SliderSection() {
  const { language }: any = UseVariables();
  const [sliders, setSliders] = useState<SLiderType[]>([]);
  const [loading, setloading] = useState(true);
  // Fetch policies
  const fetchPolicies = async () => {
    try {
      const response = await instance.get("/sliders");
      setSliders(response.data.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  if (loading) return <Loading />;
  return (
    <>
      <section
        style={{ direction: "ltr" }}
        className="bg-gray-100 dark:bg-main_dash text-gray-800 w-full  max-md:h-fit h-[90vh] mb-6  overflow-hidden mt-16 "
      >
        <Swiper
          pagination={{
            dynamicBullets: true,
            clickable: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {sliders.map((slider, index) => (
            <SwiperSlide
              style={{ overflow: "hidden" }}
              className=" overflow-hidden"
              key={index}
            >
              <Heroslide
                title_ar={slider.text_1_ar}
                title_en={slider.text_1_en}
                highlight_en={slider.text_2_en}
                highlight_ar={slider.text_2_ar}
                subtitle_ar={slider.text_3_ar}
                subtitle_en={slider.text_3_en}
                imageSrc={slider.image}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
}
