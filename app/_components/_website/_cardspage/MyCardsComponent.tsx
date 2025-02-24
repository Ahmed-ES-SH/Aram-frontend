"use client";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useRef, useState } from "react";
import Loading from "../../Loading";
import { UseVariables } from "@/app/context/VariablesContext";
import CardComponent from "../Cardcomponent";
import VariableCard from "../VariableCard";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FaCreditCard, FaTimes } from "react-icons/fa";
import { CiBookmarkCheck } from "react-icons/ci";
import { LiaTimesSolid } from "react-icons/lia";
import Popup from "./PopupCardDetailes";

interface Card {
  id: number;
  user_id: number;
  card_number: string;
  cardtype_id: number;
  cvv: number;
  issue_date: string;
  expiry_date: string;
  status: string;
  card_type: {
    title_en: string;
    title_ar: string;
    duration: string;
    image: string;
  };
}

interface Props {
  id: number;
}

export default function MyCardsComponent({ id }: Props) {
  const { language } = UseVariables();
  const intervalId = useRef<any>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card>({
    id: 0,
    user_id: 0,
    card_number: "",
    cardtype_id: 0,
    cvv: 0,
    issue_date: "",
    expiry_date: "",
    status: "",
    card_type: {
      title_en: "",
      title_ar: "",
      duration: "",
      image: "",
    },
  });
  const [activePopup, setactivePopup] = useState(false);
  const [showSelectedCard, setShowSelectedCard] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        await instance.post("/updat-expired-cards");
        const response = await instance.get(`/mycards/${id}`);
        if (response.status === 200) {
          const data = response.data.data;
          setCards(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [id]);

  const activePopupToggle = (card: Card) => {
    setSelectedCard(card);
    setactivePopup((prev) => !prev);
  };

  const showCarddetailes = (card: Card) => {
    setSelectedCard(card);
    setShowSelectedCard((prev) => !prev);
  };

  const handleAgree = async (item: Card) => {
    try {
      const response = await instance.post(`/active-card/${item.id}`, {
        duration: Number(item.card_type.duration[0]),
      });
      if (response.status == 200) {
        const data = response.data.data;
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === item.id
              ? {
                  ...data,
                  status: "active",
                  issue_date: data.issue_date.split("T")[0],
                  expiry_date: data.expiry_date.split("T")[0],
                  card_number: data.card_number.toString(),
                }
              : card
          )
        );
        setSelectedCard(response.data.data);
        // التأكد من إزالة أي فاصل زمني سابق
        if (intervalId.current) {
          clearInterval(intervalId.current);
        }

        // إنشاء فاصل زمني جديد
        intervalId.current = setInterval(() => {
          setactivePopup(false);
          clearInterval(intervalId.current); // إزالة الفاصل الزمني بعد إتمام المهمة
          intervalId.current = null; // إعادة التعيين
        }, 3000);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleRefuse = () => {
    setactivePopup(false);
  };

  const headers = [
    {
      en: "Card",
      ar: "البطاقة",
    },
    {
      en: "Card Type",
      ar: "نوع البطاقة",
    },
    {
      en: "Card Number",
      ar: "رقم البطاقة",
    },
    {
      en: "Issue Date",
      ar: "تاريخ التفعيل",
    },
    {
      en: "Expiry Date",
      ar: "تاريخ الإنتهاء",
    },
    {
      en: "Card Status",
      ar: "حالة البطاقة",
    },
    {
      en: "Action",
      ar: "إجراء",
    },
  ];

  if (loading) return <Loading />;

  return (
    <>
      <div className="overflow-x-auto dark:bg-main_dash h-[90vh] mt-16 p-6">
        {cards.length === 0 ? (
          <motion.div
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 15,
            }}
          >
            <motion.div
              className="flex flex-col items-center justify-center "
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FaCreditCard className=" size-80 text-gray-400 mb-4 " />
              <motion.h2
                className="text-xl font-semibold text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {language === "EN"
                  ? "You have not purchased any cards yet."
                  : "لم تقم باقتناء أي بطاقات حتى الآن."}
              </motion.h2>

              <motion.button
                className="mt-6 px-6 py-2 bg-main_orange text-white rounded-lg hover:bg-orange-500 transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                onClick={() => (window.location.href = "/shop")} // إضافة الرابط إلى المتجر
              >
                <Link href={"/cards"}>
                  {language === "EN" ? "Start Shopping" : "ابدأ التسوق"}
                </Link>
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <table className="min-w-full h-fit overflow-y-auto divide-y-2 divide-gray-200 dark:divide-gray-700 bg-white dark:bg-secend_dash text-sm border shadow-md rounded-md dark:border-gray-700">
            <thead>
              <tr className="text-left">
                {headers.map((head, index) => (
                  <th
                    key={index}
                    className="whitespace-nowrap dark:text-secend_text   text-center py-4 font-medium text-gray-900"
                  >
                    {language === "EN" ? head.en : head.ar}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-500">
              {cards.map((card) => (
                <tr
                  key={card.id}
                  className="odd:bg-gray-50 dark:odd:bg-gray-600 dark:text-white"
                >
                  <td className="whitespace-nowrap text-center  px-4 py-2  font-medium text-gray-900">
                    <div className="w-fit mr-auto">
                      <CardComponent
                        width="w-52"
                        hight="h-32"
                        bg_img={card.card_type.image}
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-center px-4 py-2">
                    {card.card_type.title_en}
                  </td>
                  <td className="whitespace-nowrap text-center px-4 py-2">
                    {card.card_number
                      ? card.card_number
                      : "XXXX-XXXX-XXXX-XXXX"}
                  </td>
                  <td className="whitespace-nowrap text-center px-4 py-2">
                    {card.issue_date
                      ? card.issue_date.length > 12
                        ? card.issue_date.split(" ")[0]
                        : card.issue_date
                      : card.card_type.duration}
                  </td>
                  <td className="whitespace-nowrap text-center px-4 py-2">
                    {card.expiry_date
                      ? card.expiry_date.split(" ")[0]
                      : "--/--"}
                  </td>
                  <td className="whitespace-nowrap text-center px-4 py-2">
                    <span
                      className={`whitespace-nowrap text-center  px-6 rounded-md shadow-md py-3 text-white ${
                        card.status == "active"
                          ? "bg-green-400"
                          : card.status == "expired"
                          ? "bg-red-500"
                          : "bg-yellow-400"
                      }`}
                    >
                      {card.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-center px-4 py-2">
                    {card.status === "inactive" ? (
                      <button
                        onClick={() => activePopupToggle(card)}
                        className="bg-main_orange text-white  w-[100px] h-fit py-4 rounded hover:bg-transparent hover:border-main_orange border border-transparent hover:text-black  hover:scale-105 transition"
                      >
                        {language === "EN" ? "Activate" : "تفعيل"}
                      </button>
                    ) : card.status === "expired" ? (
                      <button
                        onClick={() => showCarddetailes(card)}
                        className="bg-red-500/60 text-white  w-[100px] h-fit py-4 rounded hover:bg-transparent hover:border-main_blue duration-100 hover:text-black border border-transparent"
                      >
                        {language === "EN" ? "Preview" : "معاينة"}
                      </button>
                    ) : (
                      <button
                        onClick={() => showCarddetailes(card)}
                        className="bg-blue-500/60 text-white  w-[100px] h-fit py-4 rounded hover:bg-transparent hover:border-main_blue duration-100 hover:text-black border border-transparent"
                      >
                        {language === "EN" ? "Preview" : "معاينة"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <AnimatePresence>
        {activePopup && selectedCard && (
          <motion.div
            className="w-full h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="min-w-[300px]  w-full max-w-md bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl shadow-2xl text-white p-8 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* زر الإغلاق */}
              <motion.div
                onClick={handleRefuse}
                className="w-8 h-8 absolute -top-3 -right-3 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-transform duration-300"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <FaTimes className="text-purple-600 size-4" />
              </motion.div>

              {/* بطاقة البطاقة */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <VariableCard card={selectedCard} />
              </motion.div>

              {/* الرسالة */}
              <motion.h1
                className="text-xl font-semibold mb-6 text-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {language === "EN"
                  ? "The card's validity will start counting once you click Agree."
                  : "سيبدأ عد تاريخ صلاحية البطاقة عند الضغط على موافق."}
              </motion.h1>

              {/* الأزرار */}
              {selectedCard.status !== "active" && (
                <motion.div
                  className="flex items-center justify-center gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <button
                    onClick={() => handleAgree(selectedCard)}
                    className="bg-white text-purple-600 px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-100 hover:scale-105 transition-transform duration-300"
                  >
                    <p>{language === "EN" ? "Agree" : "موافق"}</p>
                    <CiBookmarkCheck className="size-5" />
                  </button>
                  <button
                    onClick={handleRefuse}
                    className="bg-white text-red-600 px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100 hover:scale-105 transition-transform duration-300"
                  >
                    <p>{language === "EN" ? "Refuse" : "رفض"}</p>
                    <LiaTimesSolid className="size-5" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showSelectedCard && (
        <Popup
          card={selectedCard}
          onClose={() => setShowSelectedCard((prev) => !prev)}
        />
      )}
    </>
  );
}
