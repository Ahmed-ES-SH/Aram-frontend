"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa6";
import Link from "next/link";
import { UseVariables } from "@/app/context/VariablesContext";
import CardComponent from "../Cardcomponent";
import CardPopup from "./CardPopup";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import { FaCheckCircle, FaClock, FaCrosshairs } from "react-icons/fa";

interface Props {
  direct: string;
  card: any;
  index: number;
}

export default function CardTypeComponent({ card, direct, index }: Props) {
  const { language }: any = UseVariables();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(card);

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  const openpopup = (card: any) => {
    setSelectedCard(card);
    setPopupOpen(true);
  };

  const statuses: any = {
    allow: {
      label: { AR: "مسموح", EN: "Allow" },
      color: "bg-green-500",
      hover: "hover:bg-green-500",
      icon: <FaCheckCircle />,
    },
    not_allow: {
      label: { AR: "غير مسموح", EN: "Not Allow" },
      color: "bg-red-500",
      hover: "hover:bg-red-500",
      icon: <FaCrosshairs />,
    },
    under_review: {
      label: { AR: "قيد المراجعة", EN: "Under Review" },
      color: "bg-yellow-500",
      hover: "hover:bg-yellow-500",
      icon: <FaClock />,
    },
  };

  return (
    <>
      <motion.div
        key={index}
        className="group relative w-full h-fit overflow-hidden rounded-lg border dark:border-gray-700 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }} // تأخير كل عنصر عن الذي قبله
      >
        <div
          style={{ direction: "ltr" }}
          className={` absolute text-white top-2 left-2 px-2 py-1 w-fit rounded-md shadow-md flex items-center gap-3 ${
            statuses[card.status].color
          } `}
        >
          <p>{statuses[card.status].label[language]}</p>
          {statuses[card.status].icon}
        </div>

        <div className="w-full h-full bg-gray-100 dark:bg-secend_dash">
          <Link
            href={`/${direct}/${card.id}?Card_title=${formatTitle(
              selectedCard?.title_en
            )}`}
            className="px-2"
          >
            <CardComponent
              bg_img={
                selectedCard.image ? selectedCard.image : "/cards/card_1.jpg"
              }
            />
          </Link>
        </div>

        <div className="h-1/3 bg-white  dark:bg-main_dash border-t dark:border-gray-600 p-4 pt-8">
          <Link
            href={`/${direct}/${card.id}?Card_title=${formatTitle(
              selectedCard.title_en
            )}`}
            className="text-sm font-bold text-gray-800 dark:text-secend_text group-hover:underline"
          >
            {language === "EN" ? selectedCard.title_en : selectedCard.title_ar}
          </Link>

          <div className="mt-1">
            {selectedCard.price_before_discount && (
              <span className="text-md text-red-500 line-through mr-2">
                ${selectedCard.price_before_discount}
              </span>
            )}
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              ${selectedCard.price}
            </span>
          </div>
        </div>

        <div
          className="w-12 h-12 mr-2  cursor-pointer my-2 ml-auto flex items-center justify-center border rounded-full bg-gray-100 shadow-md dark:border-gray-700 dark:bg-secend_dash dark:hover:bg-sky-400 dark:text-gray-400 dark:hover:text-white hover:bg-sky-300 hover:text-white duration-200"
          onClick={() => openpopup(card)}
        >
          <FaEye className="size-5" />
        </div>
      </motion.div>

      {/* نافذة البوب أب */}
      {isPopupOpen && (
        <CardPopup
          setShowSuccessPopup={setShowSuccessPopup}
          onClose={() => setPopupOpen((prev) => !prev)}
          card={card}
          setSelectedCard={setSelectedCard}
        />
      )}
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => setShowSuccessPopup(false)}
          message={
            language == "EN"
              ? "Card data has been modified successfully. Please review your request."
              : "تم تعديل بيانات البطاقة بنجاح سيم مراجعة طلبكم "
          }
        />
      )}
    </>
  );
}
