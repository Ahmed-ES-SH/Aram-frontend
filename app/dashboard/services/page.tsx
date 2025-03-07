"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import { instance } from "@/app/Api/axios";
import {
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaPen,
  FaTrash,
} from "react-icons/fa"; // استيراد الأيقونات من react-icons
import Img from "@/app/_components/Img";
import Loading from "@/app/_components/Loading";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";

export default function Main_Service_Section() {
  const { language }: any = UseVariables();
  const [selectedCategory, setSelectedCategory] = useState<string | number>(
    "All"
  );
  const [categories, setCategories] = useState<any[]>([]); // نوع البيانات المسترجعة من API
  const [services, setServices] = useState<any[]>([]); // نوع البيانات المسترجعة من API
  const [currentPage, setCurrentPage] = useState<number>(1); // الصفحة الحالية
  const [lastPage, setLastPage] = useState<number>(1); // العدد الإجمالي للصفحات
  const [loading, setLoading] = useState<boolean>(false); // حالة التحميل
  const [showdeletepopup, setshowdeletepopup] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentId, setCurrentId] = useState<number>(0); // الصفحة الحالية

  // تحميل البيانات من الـ API مع Pagination
  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await instance.get(`/services?page=${page}&limit=8`);
      setServices(response.data.data);
      setCurrentPage(response.data.pagination.current_page);
      setLastPage(response.data.pagination.last_page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instance.get("/all-service-categories");
        setCategories(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
    fetchData(currentPage); // تحميل البيانات الخاصة بالخدمات للصفحة الحالية
  }, [currentPage]);

  // تحضير قائمة الفئات للتصفية باستخدام category_id
  const filterCategories = [
    { id: "All", name: "All" },
    ...categories.map((category) => ({
      id: category.id,
      name: language === "EN" ? category.title_en : category.title_ar,
    })),
  ];

  // تصفية الخدمات حسب الـ category_id المحدد
  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((service) => service.category_id === selectedCategory);

  const handleCategoryChange = (categoryId: string | number) => {
    setSelectedCategory(categoryId);
  };

  const handleDelete = async (id: number) => {
    try {
      setshowdeletepopup(true);
      const response = await instance.delete(`/service/${id}`);
      if (response.status === 200) {
        setServices(services.filter((slider: any) => slider.id !== id));
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

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <section className="w-full p-6 mt-4 mx-auto bg-slate-50 dark:bg-secend_dash py-8 md:py-12 lg:py-20">
        <h1 className="mb-8 text-4xl text-gray-900 dark:text-secend_text w-fit mx-auto pb-2 border-b-2 border-sky-400">
          الخدمات
        </h1>
        <div className="flex min-h-screen h-fit flex-col xl:flex-row gap-6">
          {/* الشريط الجانبي */}
          <aside className="w-full overflow-y-auto max-h-[80vh] max-xl:min-h-[50vh] xl:w-1/4 bg-white dark:bg-secend_dash p-4 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold dark:text-secend_text mb-4">
              تصفية حسب الفئة
            </h2>
            <ul className="space-y-2">
              {filterCategories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                      selectedCategory === category.id
                        ? "bg-main_blue text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* قائمة الخدمات */}
          <div className="w-full xl:w-3/4 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredServices.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full flex group flex-col items-start h-[400px] border dark:border-gray-600 rounded-md shadow-md relative"
                >
                  <div
                    style={{ backgroundImage: `url(${card.image || ""})` }}
                    className={`w-full h-[60%] bg-cover`}
                  ></div>
                  <div className="content mt-8 px-4 flex flex-col gap-2 items-start">
                    <h1 className="dark:text-secend_text font-semibold text-[18px]">
                      {language === "EN" ? card.title_en : card.title_ar}
                    </h1>
                    <p className="dark:text-gray-500">
                      {language === "EN"
                        ? card.description_en
                        : card.description_ar}
                    </p>
                  </div>
                  <div
                    className={`absolute overflow-hidden rounded-md shadow-sm bg-main_blue ${
                      language === "EN" ? "right-3" : "left-3"
                    } top-[60%] -translate-y-1/2 border dark:border-gray-700 flex items-center justify-center`}
                  >
                    <Img src={card.icon} className="w-[60px]" />
                  </div>
                  <div className="w-full h-0 group-hover:h-full duration-200 overflow-hidden absolute left-0 top-0 bg-black/50 flex items-center justify-center">
                    <div className="flex items-center  gap-2">
                      <Link
                        href={`/dashboard/services/${card.id}`}
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
        <div className="w-fit mx-auto bg-main_orange ml-2 mt-4 px-2 py-1 border border-gray-300 rounded-md">
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
                    currentPage < lastPage ? "cursor-pointer" : "text-gray-400"
                  }
                />
              </button>
            </li>
          </ol>
        </div>
      </section>
      {isPopupVisible && (
        <SuccessPopup
          message="تمت العملية بنجاح!"
          onClose={() => setIsPopupVisible(false)}
        />
      )}

      {showdeletepopup && (
        <div className="w-full h-screen bg-black/50  fixed top-0 left-0 z-[99999] flex items-center justify-center">
          <div className="w-[20%] h-fit rounded-md shadow-md py-6 flex flex-col gap-4 items-center justify-center bg-white dark:bg-secend_dash">
            <p className="dark:text-white">
              سيتم حذف العنصر بشكل نهائى هل انت متأكد ؟
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(currentId)}
                className="px-3 py-1 text-white rounded-md  duration-300 bg-red-400 hover:bg-transparent hover:border-red-400 hover:text-white border border-transparent"
              >
                تأكيد
              </button>
              <button
                onClick={deletepopuptoggle}
                className="px-3 py-1 text-white rounded-md  duration-300 bg-sky-400 hover:bg-transparent hover:border-sky-400 hover:text-white border border-transparent"
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
