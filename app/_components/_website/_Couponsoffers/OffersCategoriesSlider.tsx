"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import OfferCategorySlide from "./OfferCategorySlide";
import { useDataContext } from "@/app/context/DataContext";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
export default function OffersCategoriesSlider() {
  const { language } = UseVariables();
  const { allCategories } = useDataContext();
  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="w-[90%] mx-auto p-6 max-md:p-2">
      <div className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center head">
        <h1
          style={{ overflowWrap: "anywhere" }}
          className="pb-2 border-b border-b-main_orange w-fit lg:whitespace-nowrap mx-auto text-center font-manrope font-bold max-sm:text-lg text-3xl text-gray-900 dark:text-secend_text mb-5 md:text-4xl md:leading-normal"
        >
          {language === "EN"
            ? "Discover Exclusive Deals and Offers from"
            : "استكشف العروض الحصرية المقدمة من"}
          <br />
          <span className="text-main_orange">
            {language === "EN"
              ? "Our Partner Organizations"
              : "شركائنا الموثوقين"}
          </span>
        </h1>
      </div>

      <Swiper
        className="mt-7"
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 2500,
        }}
        spaceBetween={10}
        slidesPerView={7}
        breakpoints={{
          300: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          600: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          800: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
          1000: {
            slidesPerView: 6,
            spaceBetween: 20,
          },
          1400: {
            slidesPerView: 7,
            spaceBetween: 10,
          },
        }}
      >
        {allCategories &&
          allCategories.length > 0 &&
          allCategories.map((category: any, index: number) => (
            <SwiperSlide key={index}>
              <Link
                className="block w-full"
                href={`/couponsoffers/${category.id}?=category=${
                  category.title_en
                }&categoryId=${btoa(category.id.toString())}`}
              >
                <OfferCategorySlide category={category} />
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
