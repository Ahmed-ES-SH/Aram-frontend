"use client";
// import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaCheckCircle,
  FaMoneyBill,
} from "react-icons/fa";
import { organizations } from "@/app/constants/website";
import Img from "../../Img";
import CardComponent from "../Cardcomponent";
import { UseVariables } from "@/app/context/VariablesContext";
import Separator from "../Separator";
import Slider_cards from "./Slider_cards";
import Link from "next/link";
import Footer from "../Footer";
import Loading from "../../Loading";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { instance } from "@/app/Api/axios";
import { Cardcontext } from "@/app/context/CartContext";
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

export default function CardPage() {
  const { language }: any = UseVariables();
  const { cartitems, addToCart } = Cardcontext();
  const { activeOrganizations } = useDataContext();
  const router = useRouter();
  const params = useParams();
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
        const response = await instance.get(`/card-type/${id}`);
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

  const handlesubmit = (card: cardType) => {
    addToCart(card);
    router.push("/cart");
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="bg-gray-50 dark:bg-main_dash mt-16 ">
        <div className="w-full  mx-auto p-3 max-md:p-2 flex items-start justify-between max-lg:flex-col  gap-3 mt-10">
          {/* البطاقة الرئيسية */}
          <motion.div
            style={{ direction: language == "EN" ? "ltr" : "rtl" }}
            className=" bg-white dark:bg-secend_dash rounded-lg shadow-lg p-6 w-[75%] max-lg:w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* صورة البطاقة */}
            <div className="relative mb-6">
              <CardComponent bg_img="/cards/card_1.jpg" />
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
              <motion.a
                href="#"
                className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaFacebook />
              </motion.a>
              <motion.a
                href="#"
                className="p-2 text-white bg-blue-400 rounded-full hover:bg-blue-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter />
              </motion.a>
              <motion.a
                href="#"
                className="p-2 text-white bg-blue-800 rounded-full hover:bg-blue-900"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin />
              </motion.a>
            </div>
            <div className="button w-full mx-auto mt-6">
              <div
                className="w-[30%] max-lg:w-1/2 max-md:w-[90%]  mx-auto cursor-pointer h-[40px] flex items-center gap-4 duration-200 justify-center rounded-md shadow-md my-2 bg-main_orange text-white border border-transparent hover:border-main_orange hover:bg-white hover:text-black"
                onClick={() => handlesubmit(card)}
              >
                <FaMoneyBill className="size-4 " />
                <p>{language == "EN" ? "Buy Now" : "إقتنى البطاقة الأن"}</p>
              </div>
            </div>
            <Slider_cards />
          </motion.div>

          {/* القسم الجانبي */}
          <motion.div
            className="bg-white dark:bg-secend_dash rounded-lg shadow-lg p-3 max-lg:p-2 w-[25%] max-lg:w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Separator
              bg_dark="dark:bg-secend_dash"
              text={language == "EN" ? "Aram Orgenizations" : "مراكز آرام"}
            />
            <div className="flex flex-col items-start justify-center mx-auto gap-4 max-lg:flex-row max-lg:flex-wrap w-full">
              {activeOrganizations
                .slice(0, 5)
                .map((org: any, index: number) => {
                  const description_en =
                    org.description_en && org.description_en.length > 40
                      ? org.description_en.slice(0, 40) + "..."
                      : org.description_en;
                  const description_ar =
                    org.description_ar && org.description_ar.length > 40
                      ? org.description_ar.slice(0, 40) + "..."
                      : org.description_ar;
                  return (
                    <Link
                      className="w-full block"
                      key={index}
                      href={`/organizations/${org.id}`}
                    >
                      <motion.div
                        key={index}
                        className="relative h-[250px] w-full max-lg:w-[48%] max-md:w-[98%] bg-cover bg-center group cursor-pointer rounded-lg dark:bg-main_dash overflow-hidden"
                        style={{ backgroundImage: `url(${org.image})` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>

                        {/* Content */}
                        <div className="flex items-center gap-3 absolute -top-40 left-4 duration-200 group-hover:top-3">
                          <div className="flex items-center justify-center w-[32px] h-[32px] border bg-gray-100 rounded-full">
                            <Img
                              src={org.icon ? org.icon : "/logo.png"}
                              className="w-[30px] h-[30px] rounded-full"
                            />
                          </div>
                          <p className="text-white font-semibold text-[12px]">
                            {language == "EN" ? org.title_en : org.title_ar}
                          </p>
                        </div>
                        <div
                          style={{
                            direction: language == "EN" ? "ltr" : "rtl",
                          }}
                          className={`group-hover:bottom-6 gap-4 absolute -bottom-40 ${
                            language == "EN" ? "left-6" : "right-6"
                          } duration-200`}
                        >
                          <div className="content flex flex-col items-start">
                            <p className="text-left font-bold mb-1 text-white dark:text-white">
                              {language == "EN"
                                ? description_en
                                : description_ar}
                            </p>
                            <h3 className="text-[12px] text-left font-semibold text-teal-400">
                              {org.category && org.category}
                            </h3>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
