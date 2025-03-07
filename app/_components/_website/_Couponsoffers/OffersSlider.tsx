"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { instance } from "@/app/Api/axios";
import Loading from "../../Loading";
import OfferSlide from "./OfferSlide";
import OfferPopup from "./OfferPopup";
export default function OffersSlider() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSldie, setActiveSlide] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});

  const onClose = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleOpen = (offer: any) => {
    setIsOpen(true);
    setSelectedOffer(offer);
    console.log("click");
  };
  useEffect(() => {
    const getOffers = async () => {
      try {
        const response = await instance.get("/trending-offers");
        if (response.status == 200) {
          const data = response.data.data;
          setOffers(data);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getOffers();
  }, []);

  const handleSlideChange = (swiper: any) => {
    setActiveSlide(swiper.activeIndex);
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full p-6 max-md:p-2">
      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false, // استمرار التشغيل التلقائي بعد التفاعل
        }}
        onSlideChange={handleSlideChange}
        slidesPerView={2} // عرض 1.5 شريحة في كل مرة
        spaceBetween={20} // المسافة بين الشرائح
        centeredSlides={true} // جعل الشريحة الرئيسية في المنتصف
        loop={true} // تكرار الشرائح بشكل لانهائي
        breakpoints={{
          // إعدادات استجابة للتغيير في حجم الشاشة
          300: {
            slidesPerView: 1,
          },
          1200: {
            slidesPerView: 1.5,
          },
          1400: {
            slidesPerView: 2,
          },
        }}
      >
        {offers &&
          offers.length > 0 &&
          offers.map((offer, i) => (
            <SwiperSlide className="rounded-md dark:bg-main_dash" key={i}>
              <OfferSlide toggleOpen={toggleOpen} offer={offer} />
            </SwiperSlide>
          ))}
      </Swiper>

      <OfferPopup isOpen={isOpen} onClose={onClose} offer={selectedOffer} />
    </div>
  );
}
