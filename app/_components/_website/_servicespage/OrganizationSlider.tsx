"use client";
import React, { useEffect, useState } from "react";
import { instance } from "@/app/Api/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Loading from "../../Loading";
import OrganiztionSliderCard from "../_organizationspage/OrganiztionSliderCard";
import Separator from "../Separator";
import { UseVariables } from "@/app/context/VariablesContext";

interface Organization {
  id: number;
  email: string;
  password: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  // location: {
  //   latitude: string;
  //   longitude: string;
  //   address: string;
  // };
  location: string;
  categories: { title_en: string; title_ar: string; [key: string]: string }[];
  phone_number: string;
  open_at: string;
  close_at: string;
  url: string;
  image: string;
  icon: string;
}

export default function OrganizationSlider() {
  const { language } = UseVariables();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await instance.get("/published-organiztions");
        const fetchedOrganizations: Organization[] = response.data.data;
        setOrganizations(fetchedOrganizations);
        // استخراج جميع الأقسام
        const categoriesSet = new Set<string>();
        fetchedOrganizations.forEach((org) =>
          org.categories.forEach((cat) => {
            categoriesSet.add(cat.title_en); // أو استخدم title_ar حسب اللغة
          })
        );
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="w-full my-3 p-2">
      <Separator
        bg_dark="dark:bg-main_dash"
        text={language == "EN" ? "Aram Organizations" : "منظمات آرام"}
      />
      <Swiper
        style={{ direction: "ltr" }}
        modules={[Autoplay, Navigation]}
        autoplay={{
          delay: 2500,
        }}
        navigation
        spaceBetween={100}
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
        {organizations.map((organization, index) => {
          return (
            <SwiperSlide className="dark:bg-secend_dash w-[200px]" key={index}>
              <OrganiztionSliderCard organization={organization} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
