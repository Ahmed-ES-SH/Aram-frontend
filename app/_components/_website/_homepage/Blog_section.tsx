"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import BlogCard from "../BlogCard";
import Separator from "../Separator";
import { UseVariables } from "@/app/context/VariablesContext";
import { instance } from "@/app/Api/axios";
import Loading from "../../Loading";
import { useDataContext } from "@/app/context/DataContext";

interface articaltype {
  image: string;
  created_at: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  author: {
    name: string;
    image: string;
  };
}

export default function Blog_section() {
  const { language }: any = UseVariables();

  // Data & Loading state
  const { activeArticles, loading } = useDataContext();

  // Loading Component
  if (loading) return <Loading />;

  // main component
  return (
    <>
      <Separator
        bg_dark="dark:bg-secend_dash"
        text={language == "EN" ? "Our Blog" : "أخر مقالاتنا"}
      />
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 2500 }}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1} // Shows one slide at a time
        className=" max-w-screen-xl max-lg:w-[98%] rounded-xl my-8"
      >
        {activeArticles &&
          activeArticles.map((article: articaltype, index: number) => (
            <SwiperSlide key={index}>
              <BlogCard
                image={article.image}
                avatar={article.author.image}
                author={article.author.name}
                date={article.created_at}
                title={language == "EN" ? article.title_en : article.title_ar}
                description={
                  language == "EN"
                    ? article.description_en
                    : article.description_ar
                }
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
}
