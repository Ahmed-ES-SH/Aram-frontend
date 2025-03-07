"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { UseVariables } from "@/app/context/VariablesContext";
import Separator from "../Separator";
import Link from "next/link";
import Img from "../../Img";
import Loading from "../../Loading";
import { useDataContext } from "@/app/context/DataContext";

export default function Organizations_section() {
  const { language }: any = UseVariables();
  const { activeOrganizations, loading } = useDataContext();
  if (loading) return <Loading />;

  return (
    <div style={{ direction: "ltr" }} className="dark:bg-main_dash py-4">
      <Separator
        bg_dark="dark:bg-main_dash"
        text={language == "EN" ? "Aram Organizations" : "منظمات آرام"}
      />
      <div className="w-full h-[500px] my-4">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 2500,
          }}
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={3}
          breakpoints={{
            320: {
              slidesPerView: 1, // شريحة واحدة للشاشات الصغيرة
            },
            640: {
              slidesPerView: 1, // شريحة واحدة للشاشات الصغيرة
            },
            768: {
              slidesPerView: 2, // شريحتان للشاشات المتوسطة
            },
            1024: {
              slidesPerView: 3, // ثلاث شرائح للشاشات الأكبر
            },
          }}
          className="h-full"
        >
          {activeOrganizations &&
            activeOrganizations.map((org: any) => (
              <SwiperSlide key={org.id}>
                <Link
                  href={`/organizations/${org.id}`}
                  className="relative h-full w-full bg-cover bg-center group cursor-pointer block"
                  style={{ backgroundImage: `url(${org.image})` }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
                    <h2 className="text-3xl font-bold mb-4">
                      {language == "EN" ? org.title_en : org.title_ar}
                    </h2>
                    <h3 className="text-lg font-semibold text-teal-400 mb-2">
                      {org.categories.length > 0
                        ? language == "EN"
                          ? org.categories[0].title_en
                          : org.categories[0].title_ar
                        : "تصنيف غير محدد"}
                    </h3>
                    <p
                      style={{ direction: language == "EN" ? "ltr" : "rtl" }}
                      className="text-sm max-w-[600px]"
                    >
                      {language === "EN"
                        ? org.description_en
                        : org.description_ar}
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
                        {language == "EN" ? org.title_en : org.title_ar}
                      </h2>
                      <h3 className="text-[10px] font-semibold text-teal-400 ">
                        {/* {org.department} */}
                      </h3>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div className="button w-full mx-auto">
        <Link
          className="w-[30%] max-lg:w-1/2 max-md:w-[90%] mx-auto h-[40px] flex items-center duration-200 justify-center rounded-md shadow-md my-2 bg-main_orange text-white border border-transparent hover:border-main_orange hover:bg-white hover:text-black "
          href={"/organizations"}
        >
          <p>{language == "EN" ? "Show All" : "شاهد الكل"}</p>
        </Link>
      </div>
    </div>
  );
}
