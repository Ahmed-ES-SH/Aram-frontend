"use client";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Separator from "../../_website/Separator";
import Loading from "../../Loading";
import Link from "next/link";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

interface CardType {
  id: number;
  title_en: string;
  image: string;
  created_at: string;
  active: boolean;
}

export default function SelectedCards() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]); // مصفوفة البطاقات المحددة
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState(1);

  const handlePageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (date: any) => {
    const inputDate = new Date(date);
    const today = new Date();

    // مقارنة التواريخ بدون الوقت
    const isToday =
      inputDate.getFullYear() === today.getFullYear() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getDate() === today.getDate();

    if (isToday) {
      // إذا كان اليوم
      return inputDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // إذا كان في يوم مختلف
      return (
        inputDate.toLocaleDateString([], {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }) +
        " " +
        inputDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };

  // جلب البيانات
  useEffect(() => {
    const getorganizations = async (
      page: number,
      api: string,
      set: React.Dispatch<React.SetStateAction<CardType[]>>
    ) => {
      try {
        setLoading(true);
        const response = await instance.get(api, { params: { page } });
        set(response.data.data); // تخزين جميع الخدمات
        if (api == "/card-types") {
          setCurrentPage(response.data.pagination.current_page);
          setLastPage(response.data.pagination.last_page);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
      }
    };
    getorganizations(currentPage, "/card-types", setCards);
    getorganizations(currentPage, "/active-card-types", setSelectedCards);
  }, [currentPage]);

  // دالة لتحديث حالة البطاقة (تفعيل أو تعطيل)
  const updateCardState = async (cardId: number, activeState: boolean) => {
    try {
      const response = await instance.get(
        `/update-active/${cardId}/${activeState}`
      );
      console.log("Card state updated:", response.data);
    } catch (error: any) {
      console.error("Error updating card state:", error.response.data);
    }
  };

  // التعامل مع إضافة البطاقة إلى selectedCards أو إزالتها
  const handleCardAction = (card: CardType) => {
    const isCardSelected = selectedCards.some(
      (selectedCard) => selectedCard.id === card.id
    );

    if (isCardSelected) {
      // إذا كانت البطاقة محددة، نزيلها
      setSelectedCards((prevSelectedCards) =>
        prevSelectedCards.filter((selectedCard) => selectedCard.id !== card.id)
      );
      // تعديل قيمة active إلى false
      updateCardState(card.id, false); // تحديث حالة البطاقة في الخادم
    } else {
      // إذا لم تكن محددة، نضيفها
      setSelectedCards((prevSelectedCards) => [...prevSelectedCards, card]);
      // تعديل قيمة active إلى true
      updateCardState(card.id, true); // تحديث حالة البطاقة في الخادم
    }
  };

  return (
    <div className="w-full h-fit py-4">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex max-md:flex-col max-md:items-center items-start p-2 gap-2">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white dark:text-secend_text text-sm dark:divide-gray-300/20   dark:bg-secend_dash ">
                <thead className="bg-gray-100 dark:bg-gray-500 dark:text-white ">
                  <tr>
                    <th className="px-6 py-4 text-right font-semibold">
                      نوع البطاقة
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      خلفية البطاقة
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      تاريخ الرفع
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      إختيار
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => (
                    <tr
                      key={card.id}
                      className="border-b hover:bg-sky-400 dark:hover:text-white"
                    >
                      <td className="px-6 py-4">{card.title_en}</td>
                      <td className="px-6 py-4">
                        <div
                          style={{ backgroundImage: `url(${card.image})` }}
                          className="w-44 h-20 bg-cover bg-center rounded-md"
                        ></div>
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(card.created_at)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <motion.button
                          className={`relative inline-block w-10 h-6 transition duration-200 ${
                            selectedCards.some(
                              (selectedCard) => selectedCard.id == card.id
                            )
                              ? "bg-green-400"
                              : "bg-gray-200"
                          } rounded-full`}
                          onClick={() => handleCardAction(card)} // التعامل مع إضافة أو إزالة البطاقة
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span
                            className={`dot w-4 h-4 ${
                              selectedCards.some(
                                (selectedCard) => selectedCard.id === card.id
                              )
                                ? "left-1"
                                : "right-1"
                            } rounded-full bg-white absolute top-1 transition-all duration-200 ease-in-out`}
                          ></span>
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AnimatePresence>
              <div className="mt-4 max-h-[130vh] overflow-y-auto hidden-scrollbar py-2 w-[20%] max-md:w-full">
                <Separator bg_dark="" text="البطاقات المختارة" />
                <div className="flex flex-col items-center max-md:flex-row max-md:justify-center max-md:flex-wrap max-md:w-full p-3 gap-3 h-fit">
                  {selectedCards.map((card, index) => (
                    <Link
                      className="w-full block"
                      href={`/dashboard/cards/${card.id}`}
                      key={index}
                    >
                      <motion.div
                        className="w-full h-32  rounded-md bg-cover bg-center relative"
                        style={{
                          backgroundImage: `url(${
                            card.image ? card.image : "/cards/card_1.jpg"
                          })`,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h1 className=" absolute bottom-0 w-full rounded-b-md bg-black/50 text-white text-center">
                          {card.title_en}
                        </h1>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatePresence>
          </div>
          <div className="w-fit bg-sky-400 mr-4 mt-6 px-2 py-1 border border-gray-300 rounded-md max-md:mx-auto">
            <ol className="flex justify-center gap-1 text-xs font-medium">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
                >
                  <span className="sr-only">Prev Page</span>
                  <FaChevronCircleLeft
                    className={
                      currentPage > 1 ? "cursor-pointer" : "text-gray-400"
                    }
                  />
                </button>
              </li>

              {[...Array(lastPage)].map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`block size-8 rounded border text-center leading-8 ${
                      index + 1 === currentPage
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-100 bg-white text-gray-900"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= lastPage}
                  className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
                >
                  <span className="sr-only">Next Page</span>
                  <FaChevronCircleRight
                    className={
                      currentPage < lastPage
                        ? "cursor-pointer"
                        : "text-gray-400"
                    }
                  />
                </button>
              </li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
