"use client";
import { instance } from "@/app/Api/axios";
import React, { useState, useEffect, useMemo } from "react";
import Loading from "../../Loading";
import SuccessPopup from "../SuccessPopup";
import {
  FaCheckCircle,
  FaClock,
  FaCrosshairs,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import Pagination from "../../PaginationComponent";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { UseVariables } from "@/app/context/VariablesContext";
import CardComponent from "../../_website/Cardcomponent";
import { LuSearch } from "react-icons/lu";
import { MdSignalCellularNodata } from "react-icons/md";
import CardPopup from "./CardPopup";

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
  status: string;
}

export default function AffiliateCardsDashComponent() {
  const { language } = UseVariables();
  const [cards, setCards] = useState<cardType[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1); // الصفحة الحالية
  const [lastPage, setLastPage] = useState<number>(1); // العدد الإجمالي للصفحات
  const [showdeletepopup, setshowdeletepopup] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentId, setCurrentId] = useState<number>(0); // الصفحة الحالية
  const [contentSearch, setContentSearch] = useState("");
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [selectCurrentData, setSelectCurrentData] = useState("DefaultData");

  useEffect(() => {
    const getdata = async (page: number) => {
      try {
        setloading(true);
        const response = await instance.get(
          `/affiliate-card-types?page=${page}`
        );
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

  const openCard = (card: any) => {
    setSelectedCard(card);
    setShowCard(true);
  };

  const onClose = () => {
    setShowCard((prev) => !prev);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const statuses: any = {
    allow: {
      label: "تم النشر",
      color: "bg-green-500",
      hover: "hover:bg-green-500",
      icon: <FaCheckCircle />,
    },
    not_allow: {
      label: "غير مسموح",
      color: "bg-red-500",
      hover: "hover:bg-red-500",
      icon: <FaCrosshairs />,
    },
    under_review: {
      label: "قيد المراجعة",
      color: "bg-yellow-500",
      hover: "hover:bg-yellow-500",
      icon: <FaClock />,
    },
  };

  const handleDelete = async (id: number) => {
    try {
      setshowdeletepopup(true);
      const response = await instance.delete(`/affiliate-card-type/${id}`);
      if (response.status === 200) {
        setCards(cards.filter((card: cardType) => card.id !== id));
      }
      setshowdeletepopup(false);
      setIsPopupVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getFilteredDataBySearch = async (
    contentSearch: string,
    page: number = 1
  ) => {
    try {
      if (contentSearch.trim() === "") {
        setSearchResult([]);
        return;
      }
      setSearchResult([]);
      setSelectCurrentData("SearchResult");
      setloading(true);
      const response = await instance.post(`/affiliate-card-Type-by-search`, {
        content_search: contentSearch,
        page: page,
      });
      if (response.status === 200) {
        const data = response.data.data;
        const pagination = response.data.pagination;
        setSearchResult(data);
        setSearchCurrentPage(pagination.current_page);
        setSearchLastPage(pagination.last_page);
      } else if (response.status === 404) {
        setSearchResult([]); // لا توجد بيانات
        // تعيين noData إلى true عند عدم وجود بيانات
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const deletepopuptoggle = () => {
    setshowdeletepopup((prev) => !prev);
  };
  const showdeletepopuptoggle = (id: number) => {
    setshowdeletepopup(true);
    setCurrentId(id);
  };

  useEffect(() => {
    if (contentSearch.length == 0) {
      setSelectCurrentData("DefaultData");
    } else if (searchResult.length == 0) {
      setSelectCurrentData("DefaultData");
    } else {
      setSelectCurrentData("SearchResult");
    }
  }, [contentSearch]);

  const getCurrentData = () => {
    if (selectCurrentData == "DefaultData") {
      return cards;
    } else {
      return searchResult;
    }
  };

  const currentData = getCurrentData();

  if (loading) return <Loading />;
  return (
    <>
      <section className="w-full p-6 mt-4 mx-auto bg-slate-50 dark:bg-secend_dash py-8 md:py-12 lg:py-20">
        <h1 className="mb-8 text-4xl text-gray-900 dark:text-secend_text w-fit mx-auto pb-2 border-b-2 border-sky-400">
          البطاقات التابعة
        </h1>
        <div
          style={{ direction: language == "EN" ? "ltr" : "rtl" }}
          className="inputsearch  mb-5 mt-2 flex items-center gap-2 relative w-[50%] max-lg:w-3/4 max-md:w-[97%] mx-auto"
        >
          <div className="flex items-center w-full gap-2 max-md:flex-col ">
            <div className="relative bg-white rounded-md shadow-md h-[40px] flex items-center justify-center w-full">
              <LuSearch
                className={`${
                  language == "EN" ? "left-2" : "right-2"
                } top-1/2 text-secend_text size-5`}
              />
              <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setContentSearch(e.target.value)
                }
                name="titlesearch"
                value={contentSearch}
                placeholder={
                  language == "EN"
                    ? "Find the Card here..."
                    : "إبحث عن البطاقة هنا  ..."
                }
                className="w-[90%] bg-transparent h-full pr-9 px-4 py-2 outline-none placeholder-shown:px-4 placeholder-shown:py-2 placeholder-shown:pr-9 placeholder-shown:text-[18px]"
              />
            </div>
            {
              <button
                onClick={() =>
                  getFilteredDataBySearch(contentSearch, searchCurrentPage)
                }
                className={`px-6 py-2 hover:text-white text-cenetr rounded-md shadow-md border border-main_orange hover:bg-orange-400 duration-200 ${
                  contentSearch.length > 0
                    ? "opacity-100 block"
                    : "opacity-0 cursor-auto hidden"
                }`}
              >
                {"بحث"}
              </button>
            }
          </div>
        </div>
        <div className="min-h-screen  ">
          {/* قائمة البطاقات */}
          {currentData.length > 0 ? (
            <div className="w-full  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {currentData.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="w-full flex  relative group flex-col items-start h-[400px] border dark:border-gray-600 rounded-md shadow-md "
                  >
                    <div
                      className={`w-fit px-4 py-2 z-50  text-center rounded-md shadow-md absolute top-2 left-2  ${
                        statuses[card?.status].color
                      }`}
                    >
                      {statuses[card?.status].label}
                    </div>
                    <div
                      className={`w-full h-[60%] bg-gray-100 dark:bg-main_dash`}
                    >
                      <CardComponent bg_img={card.image} />
                    </div>
                    <div className="content mt-8 px-4 flex flex-col gap-2 items-start">
                      <h1 className="dark:text-secend_text font-semibold text-[18px]">
                        {card.title_ar}
                      </h1>
                      <p className="dark:text-gray-500">
                        {card.description_ar.slice(0, 40) + "..."}
                      </p>
                    </div>
                    <div className="w-full h-0 rounded-md group-hover:h-full duration-200 overflow-hidden absolute left-0 top-0 bg-black/50 flex items-center justify-center">
                      <div className="flex items-center  gap-2">
                        <button
                          onClick={() => openCard(card)}
                          className="flex items-center gap-2 text-white bg-sky-400 px-3 py-1 rounded-md shadow-sm"
                        >
                          <p>تحقق</p>
                          <FaPen />
                        </button>
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
          ) : (
            <div className="min-h-[90vh] flex items-center justify-center">
              <div className="flex gap-3 items-center justify-center flex-col">
                <MdSignalCellularNodata className="size-64 text-gray-400" />
                <p className="text-lg">لا يوحد نتائج متطابقة </p>
              </div>
            </div>
          )}
        </div>
        {/* الـ Pagination */}
        {currentData.length > 0 ? (
          searchResult.length > 0 ? (
            <Pagination
              currentPage={searchCurrentPage}
              totalPages={searchLastPage}
              onPageChange={(newPage) => {
                setSearchCurrentPage(newPage);
                getFilteredDataBySearch(contentSearch, newPage);
              }}
            />
          ) : (
            <Pagination
              currentPage={currentPage}
              totalPages={lastPage}
              onPageChange={handlePageChange}
            />
          )
        ) : (
          <div></div>
        )}
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

      {showCard && (
        <CardPopup
          onClose={onClose}
          data={selectedCard}
          setShowSuccessPopup={setIsPopupVisible}
        />
      )}
    </>
  );
}
