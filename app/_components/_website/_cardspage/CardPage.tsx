"use client";
// import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaCheckCircle,
  FaMoneyBill,
  FaTimes,
} from "react-icons/fa";
import CardComponent from "../Cardcomponent";
import { UseVariables } from "@/app/context/VariablesContext";
import Slider_cards from "./Slider_cards";
import Loading from "../../Loading";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { instance } from "@/app/Api/axios";
import { Cardcontext } from "@/app/context/CartContext";
import RandomOrganizationsSidebar from "../RandomOrganizationSidebar";
import { useDataContext } from "@/app/context/DataContext";

interface cardType {
  id: number;
  title_ar: string;
  title_en: string;
  description_en: string;
  description_ar: string;
  features_ar: string[];
  features_en: string[];
  image: string;
  price: any;
  duration: string;
  quantity: number;
}

interface props {
  api: string;
}

export default function CardPage({ api }: props) {
  const { language }: any = UseVariables();
  const { cartitems, addToCart }: any = Cardcontext();
  const { currentuser } = useDataContext();
  const userCode = btoa(currentuser && currentuser.user_code);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const promoCode: any = searchParams.get("currentCode");
  const decodeCode = atob(promoCode);
  const id = params.cardId;
  const [card, setCard] = useState<cardType>({
    id: 0,
    title_ar: "",
    title_en: "",
    description_en: "",
    description_ar: "",
    features_ar: [],
    features_en: [],
    image: "",
    duration: "",
    price: 0,
    quantity: 0,
  });
  const [loading, setloading] = useState<boolean>(true);

  const cardDetails = {
    title: language === "EN" ? card.title_en : card.title_ar,
    description: language === "EN" ? card.description_en : card.description_ar,
    features: language == "EN" ? card.features_en : card.features_ar,
    duration:
      language === "EN"
        ? `Valid for ${card.duration}  months`
        : `صالحة لمدة ${card.duration} شهرًا`,
    imageUrl: card.image ? card.image : "/images/card-image.jpg", // ضع مسار صورة البطاقة هنا
  };

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await instance.get(`/${api}/${id}`);
        const data = response.data.data;
        console.log(data);
        if (data.features_ar && data.features_en) {
          setCard({
            id: data.id,
            title_ar: data.title_ar || "",
            title_en: data.title_en || "",
            description_en: data.description_en || "",
            description_ar: data.description_ar || "",
            image: data.image || "",
            duration: data.duration || "",
            price: data.price || 0,
            quantity: data.quantity || 0,
            features_ar: Array.isArray(data.features_ar)
              ? data.features_ar
              : JSON.parse(data.features_ar),
            features_en: Array.isArray(data.features_en)
              ? data.features_en
              : JSON.parse(data.features_en),
          });
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setloading(false);
      }
    };
    getdata();
  }, []);

  const [showPopup, setShowPopup] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState<{ code: boolean; link: boolean }>({
    code: false,
    link: false,
  });

  // دالة فتح الـ Popup وتحديد الرابط الحالي
  const handleShareClick = () => {
    const currentUrl = window.location.href; // الحصول على الرابط الحالي
    setShareUrl(currentUrl);
    setShowPopup(true);
  };

  const handleCopy = async (text: string, type: "code" | "link") => {
    if (!text) {
      console.error("⚠️ لا يوجد نص للنسخ!");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied((prev) => ({ ...prev, [type]: true }));

      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [type]: false }));
      }, 1500);
    } catch (error) {
      console.error("❌ فشل النسخ:", error);
    }
  };

  const handlesubmit = (card: cardType) => {
    if (cartitems.find((carditem: any) => carditem.id === card.id)) {
      alert("This item is already in the cart!"); // إشعار
      return;
    } else {
      addToCart(card); // إضافة العنصر للسلة
      router.push("/cart");
    }
  };

  useEffect(() => {
    const checkCode = async () => {
      try {
        const response = await instance.post(`/track-card-visit`, {
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

  return (
    <>
      <div className="bg-gray-50 dark:bg-main_dash mt-20 ">
        <div className="w-full  mx-auto p-3 max-md:p-2 flex items-start justify-between max-xl:flex-col  gap-3 mt-10">
          {/* البطاقة الرئيسية */}
          <motion.div
            style={{ direction: language == "EN" ? "ltr" : "rtl" }}
            className=" bg-white dark:bg-secend_dash rounded-lg shadow-lg p-6 w-[75%] max-xl:w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* صورة البطاقة */}
            <div className="relative mb-6">
              <CardComponent bg_img={card.image ? card.image : "/public"} />
            </div>

            {/* العنوان و تفاصيل البطاقة */}
            <div className=" text-white">
              <h1 className="text-2xl w-fit font-bold text-teal-400 dark:text-white mb-2 pb-4 border-b border-main_orange">
                {cardDetails.title}
              </h1>
            </div>

            {/*وصف البطاقة*/}
            <motion.div
              className="prose lg:prose-xl dark:prose-invert mt-6"
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {cardDetails.description}
              </p>
            </motion.div>
            <motion.div
              className="prose lg:prose-xl dark:prose-invert mt-8"
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-3 border-main_red  mb-4">
                {language === "EN" ? "Features" : "المميزات"}
              </h3>
              <ul className="space-y-2">
                {cardDetails.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-400"
                  >
                    <FaCheckCircle className="text-main_orange" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* مشاركة البطاقة */}
            <div className="flex justify-center gap-6 mt-8">
              <motion.button
                className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShareClick}
              >
                <FaFacebook />
              </motion.button>
              <motion.button
                className="p-2 text-white bg-blue-400 rounded-full hover:bg-blue-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShareClick}
              >
                <FaTwitter />
              </motion.button>
              <motion.button
                className="p-2 text-white bg-blue-800 rounded-full hover:bg-blue-900"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShareClick}
              >
                <FaLinkedin />
              </motion.button>
            </div>
            <div className="button w-full mx-auto mt-6">
              <div
                className="w-[30%] max-xl:w-1/2 max-md:w-[90%]  mx-auto cursor-pointer h-[40px] flex items-center gap-4 duration-200 justify-center rounded-md shadow-md my-2 bg-main_orange text-white border border-transparent hover:border-main_orange hover:bg-white hover:text-black"
                onClick={() => handlesubmit(card)}
              >
                <FaMoneyBill className="size-4 " />
                <p>{language == "EN" ? "Buy Now" : "إقتنى البطاقة الأن"}</p>
              </div>
            </div>
            <Slider_cards />
          </motion.div>

          <RandomOrganizationsSidebar length={5} />
        </div>
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center z-[999] items-center">
          <div className="bg-white relative p-6 rounded-lg shadow-lg w-fit max-md:w-[98%] max-xl:w-[90%] text-center">
            <button
              className="absolute top-2 right-2 text-red-500"
              onClick={() => setShowPopup(false)}
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-lg font-bold mb-3">مشاركة الرابط</h3>
            <p
              style={{ overflowWrap: "anywhere" }}
              className="break-words text-gray-600 mb-3"
            >
              {`${shareUrl}${!promoCode ? `&currentCode=${userCode}` : ""}`}
            </p>

            {/* زر النسخ مع تأكيد النجاح */}
            <button
              className="bg-main_orange text-white px-4 py-2 rounded-lg mt-3 relative"
              onClick={() =>
                handleCopy(
                  `${shareUrl}${
                    !promoCode ? `&currentCode=${userCode}` : ""
                  }` || "",
                  "code"
                )
              }
            >
              {copied.code ? "✅ تم النسخ!" : "📋 نسخ الرابط"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
