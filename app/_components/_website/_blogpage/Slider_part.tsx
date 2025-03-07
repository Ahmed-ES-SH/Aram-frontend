"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { UseVariables } from "@/app/context/VariablesContext";
import Img from "../../Img";
import "swiper/css";
import "swiper/css/pagination";
import Separator from "../Separator";
import Link from "next/link";
import { instance } from "@/app/Api/axios";
import Loading from "../../Loading";
import { FaComments, FaRegObjectUngroup } from "react-icons/fa";

interface articalType {
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  views: string;
  likes: string;
  published_at: string;
  image: string;
  author: {
    image: string;
    name: string;
  };
}

export default function Slider_part() {
  const { language }: any = UseVariables();
  const [articals, setarticals] = useState<articalType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await instance.get("/top-articals");
        const data = response.data.data;
        setarticals(data);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  if (loading) return <Loading />;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center mt-20 max-md:mt-24 head">
        <h1 className="max-w-2xl mx-auto text-center font-manrope font-bold text-xl max-md:text-xl text-gray-900 dark:text-secend_text mb-5 md:text-5xl md:leading-normal">
          {language === "EN"
            ? "Stay Updated with Our Latest"
            : "ابق على اطلاع مع أحدث"}
          <span className="text-main_orange">
            {" "}
            {language === "EN" ? "Articles" : "المقالات"}{" "}
          </span>
        </h1>
        <p className="max-w-sm mx-auto text-center text-base font-normal leading-7 text-gray-500 mb-9">
          {language === "EN"
            ? "Read insightful articles and stay informed about the latest trends in our industry."
            : "اقرأ مقالات قيمة وتعرف على أحدث الاتجاهات في مجالنا."}
        </p>
      </div>

      <div
        style={{ direction: "ltr" }}
        className="w-[85%] max-lg:w-[90%] max-md:w-[96%] max-sm:w-[99%] px-2 py-2  mx-auto h-fullrelative my-4"
      >
        <Separator
          bg_dark="dark:bg-secend_dash"
          text={language == "EN" ? "Last Articles" : "أكثر المقالات تفاعلا"}
        />
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{
            delay: 2500,
          }}
          navigation
          spaceBetween={20}
          slidesPerView={4}
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
              spaceBetween: 20,
              slidesPerView: 3, // شريحتان للشاشات المتوسطة
            },
            1024: {
              spaceBetween: 20,
              slidesPerView: 4, // ثلاث شرائح للشاشات الأكبر
            },
          }}
          className="h-full rounded-md"
        >
          {articals.map((article: any, index: number) => (
            <SwiperSlide className="dark:bg-main_dash rounded-lg" key={index}>
              <Link
                href={`/blog/${formatTitle(article.title_en)}?id=${article.id}`}
              >
                <div
                  className="relative h-[350px] w-full bg-cover bg-center group cursor-pointer rounded-lg dark:bg-main_dash"
                  style={{ backgroundImage: `url(${article.image})` }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>

                  {/* Content */}
                  <div className="flex -center gap-3 absolute -top-40 left-4 duration-200 group-hover:top-3">
                    <div className="flex -center justify-center w-[32px] h-[32px] border bg-gray-100 rounded-full">
                      <Img
                        src={
                          article.author ? article.author.image : "/logo.png"
                        }
                        className="w-[30px] h-[30px] rounded-full"
                      />
                    </div>
                    <p className="text-white font-semibold text-[12px]">
                      {article.author.name}
                    </p>
                  </div>
                  <div className="group-hover:bottom-6 gap-4 absolute -bottom-40 left-6 duration-200">
                    <div className="content flex flex-col -start">
                      <h2 className="text-left font-bold mb-1 text-white dark:text-secend_text">
                        {language == "EN" ? article.title_en : article.title_ar}
                      </h2>
                      <h3 className="text-[12px] text-left font-semibold text-teal-400">
                        {language == "EN"
                          ? article.content_en.slice(0, 30) + "..."
                          : article.content_ar.slice(0, 30) + "..."}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 absolute top-2 group-hover:right-3 duration-200 text-white -right-[200px]">
                    <FaComments />
                    <p>{article.comments_count}</p>
                  </div>
                  <div className="flex items-center gap-2 absolute bottom-2 group-hover:right-3 duration-200 text-white -right-[200px]">
                    <FaRegObjectUngroup />
                    <p>{article.reactions_count || 0}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
