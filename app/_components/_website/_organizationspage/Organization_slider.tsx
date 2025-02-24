"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { organizations } from "@/app/constants/website";
import { UseVariables } from "@/app/context/VariablesContext";
import Separator from "../Separator";
import Link from "next/link";
import Img from "../../Img";

export default function OrganizationsSlider() {
  const { language }: any = UseVariables();
  return (
    <div style={{ direction: "ltr" }} className="dark:bg-main_dash py-4">
      <Separator
        bg_dark="dark:bg-main_dash"
        text={language == "EN" ? "Aram Organizations" : "منظمات آرام"}
      />
      <div className="w-full h-[505px] my-4">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 2500,
          }}
          navigation
          spaceBetween={30}
          slidesPerView={3}
          breakpoints={{
            320: {
              slidesPerView: 1, // شريحة واحدة للشاشات الصغيرة
            },
            640: {
              slidesPerView: 1, // شريحة واحدة للشاشات الصغيرة
            },
            800: {
              slidesPerView: 2, // شريحتان للشاشات المتوسطة
            },
            1024: {
              slidesPerView: 3, // ثلاث شرائح للشاشات الأكبر
            },
          }}
          className="h-full"
        >
          {organizations.map((org) => (
            <SwiperSlide className="rounded-md" key={org.id}>
              <Link
                href={"/organizations/4"}
                className="relative h-full w-full bg-cover bg-center rounded-md group cursor-pointer block"
                style={{ backgroundImage: `url(${org.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 rounded-md bg-black bg-opacity-50"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
                  <h2 className="text-3xl font-bold mb-4">{org.name}</h2>
                  <h3 className="text-lg font-semibold text-teal-400 mb-2">
                    {org.department}
                  </h3>
                  <p
                    style={{ direction: language == "EN" ? "ltr" : "rtl" }}
                    className="text-sm max-w-[600px]"
                  >
                    {language === "EN"
                      ? org.description.en
                      : org.description.ar}
                  </p>
                </div>
                <div className="flex group-hover:bottom-6  items-center gap-4 absolute -bottom-40  left-6 duration-200 ">
                  <div className="flex items-center justify-center  w-[42px] h-[42px] border bg-gray-100 rounded-full">
                    <Img
                      src="/logo.png"
                      className="w-[40px] h-[40px] rounded-full "
                    />
                  </div>
                  <div className="content flex flex-col items-start">
                    <h2 className="text-md font-bold mb-1 text-white dark:text-secend_text">
                      {org.name}
                    </h2>
                    <h3 className="text-[10px] font-semibold text-teal-400 ">
                      {org.department}
                    </h3>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
