"use client";
import { instance } from "@/app/Api/axios";
import React, { useState, useEffect } from "react";
import Loading from "../../Loading";
import SuccessPopup from "../SuccessPopup";
import { FaPen, FaTrash } from "react-icons/fa";
import Pagination from "../../PaginationComponent";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { UseVariables } from "@/app/context/VariablesContext";
import CardComponent from "../../_website/Cardcomponent";

interface cardType {
  id: number;
  title_ar: string;
  title_en: string;
  description_en: string;
  description_ar: string;
  features_ar: string[];
  features_en: string[];
  image: string;
  price: number;
  quantity: number;
}

export default function CardsDashComponent() {
  const { language } = UseVariables();
  const [cards, setCards] = useState<cardType[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1); // الصفحة الحالية
  const [lastPage, setLastPage] = useState<number>(1); // العدد الإجمالي للصفحات
  const [showdeletepopup, setshowdeletepopup] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentId, setCurrentId] = useState<number>(0); // الصفحة الحالية

  useEffect(() => {
    const getdata = async (page: number) => {
      try {
        const response = await instance.get(`/card-types?page=${page}`);
        const data = response.data.data;
        setCurrentPage(response.data.pagination.current_page);
        setLastPage(response.data.pagination.last_page);
        setCards(data);
      } catch (error: any) {
        console.error(error);
      } finally {
        setloading(false);
      }
    };
    getdata(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      setshowdeletepopup(true);
      const response = await instance.delete(`/card-type/${id}`);
      if (response.status === 200) {
        setCards(cards.filter((card: cardType) => card.id !== id));
      }
      setshowdeletepopup(false);
      setIsPopupVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deletepopuptoggle = () => {
    setshowdeletepopup((prev) => !prev);
  };
  const showdeletepopuptoggle = (id: number) => {
    setshowdeletepopup(true);
    setCurrentId(id);
  };

  if (loading) return <Loading />;
  return (
    <>
      <section className="w-full p-6 mt-4 mx-auto bg-slate-50 dark:bg-secend_dash py-8 md:py-12 lg:py-20">
        <h1 className="mb-8 text-4xl text-gray-900 dark:text-secend_text w-fit mx-auto pb-2 border-b-2 border-sky-400">
          البطاقات
        </h1>
        <div className="h-screen  hidden-scrollbar overflow-y-auto">
          {/* قائمة البطاقات */}
          <div className="w-full  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full flex group flex-col items-start h-[400px] border dark:border-gray-600 rounded-md shadow-md relative"
                >
                  <div
                    className={`w-full h-[60%] bg-gray-100 dark:bg-main_dash`}
                  >
                    <CardComponent bg_img={card.image} />
                  </div>
                  <div className="content mt-8 px-4 flex flex-col gap-2 items-start">
                    <h1 className="dark:text-secend_text font-semibold text-[18px]">
                      {language === "EN" ? card.title_en : card.title_ar}
                    </h1>
                    <p className="dark:text-gray-500">
                      {language === "EN"
                        ? card.description_en.slice(0, 40) + "..."
                        : card.description_ar.slice(0, 40) + "..."}
                    </p>
                  </div>
                  <div className="w-full h-0 rounded-md group-hover:h-full duration-200 overflow-hidden absolute left-0 top-0 bg-black/50 flex items-center justify-center">
                    <div className="flex items-center  gap-2">
                      <Link
                        href={`/dashboard/cards/${card.id}`}
                        className="flex items-center gap-2 text-white bg-sky-400 px-3 py-1 rounded-md shadow-sm"
                      >
                        <p>تعديل</p>
                        <FaPen />
                      </Link>
                      <button
                        onClick={() => showdeletepopuptoggle(card.id)}
                        className="flex items-center gap-2 text-white bg-red-400 px-3 py-1 rounded-md shadow-sm"
                      >
                        <p>حذف</p>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        {/* الـ Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={handlePageChange}
        />
      </section>
      {isPopupVisible && (
        <SuccessPopup
          message="تمت العملية بنجاح!"
          onClose={() => setIsPopupVisible(false)}
        />
      )}

      {showdeletepopup && (
        <div className="w-full h-screen bg-black/50 fixed top-0 left-0 z-[99999] flex items-center justify-center">
          <div className="w-[20%] h-fit rounded-md shadow-md py-6 flex flex-col gap-4 items-center justify-center bg-white dark:bg-secend_dash">
            <p>سيتم حذف العنصر بشكل نهائى هل انت متأكد ؟</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(currentId)}
                className="px-3 py-1 text-white rounded-md border bg-red-400"
              >
                تأكيد
              </button>
              <button
                onClick={deletepopuptoggle}
                className="px-3 py-1 text-white rounded-md border bg-sky-400"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
