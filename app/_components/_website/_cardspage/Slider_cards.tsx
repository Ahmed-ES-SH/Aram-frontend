"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { UseVariables } from "@/app/context/VariablesContext";
import "swiper/css";
import "swiper/css/pagination";
import Separator from "../Separator";
import ProductCard from "../ProductCard";
import { instance } from "@/app/Api/axios";
import Loading from "../../Loading";

interface cardType {
  id: number;
  title_ar: string;
  title_en: string;
  description_en: string;
  description_ar: string;
  features_ar: string[];
  features_en: string[];
  price: number;
  quantity: number;
  image: string;
}

export default function Slider_part() {
  const { language }: any = UseVariables();
  const [cards, setCards] = useState<cardType[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await instance.get(`/card-types`);
        const data = response.data.data;
        setCards(data);
      } catch (error: any) {
        console.error(error);
      } finally {
        setloading(false);
      }
    };
    getdata();
  }, []);

  if (loading) return <Loading />;
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center mt-20 max-md:mt-24 head">
        <h1 className="max-w-2xl mx-auto text-center font-manrope font-bold text-4xl text-gray-900 dark:text-secend_text mb-5 md:text-5xl md:leading-normal">
          {language === "EN" ? "Find the Perfect" : "اكتشف البطاقة"}{" "}
          <span className="text-main_orange">
            {language === "EN" ? "Card for You" : "المثالية لك"}
          </span>
        </h1>
        <p className="max-w-lg mx-auto text-center text-base font-normal leading-7 text-gray-500 mb-9">
          {language === "EN"
            ? "Choose from a variety of cards tailored to meet your unique needs. Enjoy exclusive benefits, discounts, and more."
            : "اختر من بين مجموعة متنوعة من البطاقات المصممة لتلبية احتياجاتك. استمتع بمزايا حصرية وخصومات والمزيد."}
        </p>
      </div>

      <div
        style={{ direction: "ltr" }}
        className="w-full px-2 py-2  mx-auto h-fullrelative my-4"
      >
        <Separator
          bg_dark="dark:bg-secend_dash"
          text={language == "EN" ? "Aram Cards" : "بطاقات آرام"}
        />
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{
            delay: 2500,
          }}
          spaceBetween={20}
          slidesPerView={3}
          breakpoints={{
            320: {
              spaceBetween: 20,
              slidesPerView: 1, // شريحة واحدة للشاشات الصغيرة
            },
            640: {
              spaceBetween: 20,
              slidesPerView: 2, // شريحة واحدة للشاشات الصغيرة
            },
            768: {
              spaceBetween: 30,
              slidesPerView: 2, // شريحتان للشاشات المتوسطة
            },
            1024: {
              spaceBetween: 20,
              slidesPerView: 3, // ثلاث شرائح للشاشات الأكبر
            },
          }}
          className="h-full w-full py-2 rounded-md"
        >
          {cards.map((card, index) => (
            <SwiperSlide className="dark:bg-main_dash w-full" key={index}>
              <ProductCard direct="cards" card={card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
