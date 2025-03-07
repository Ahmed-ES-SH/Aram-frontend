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
import Pagination from "@/app/_components/PaginationComponent";

export default function Main_Service_Section() {
  const { language }: any = UseVariables();
  const [selectedCategory, setSelectedCategory] = useState<any>({
    id: "All",
    name: "All",
  });
  const [showdeletepopup, setshowdeletepopup] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filtercurrentPage, setfiltercurrentPage] = useState<number>(1);
  const [currentId, setCurrentId] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(1);
  const [filterlastPage, setfilterlastPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterorgs, setFilterOrgs] = useState([]);
  const [selecteddata, setselecteddata] = useState("default");

  const fetchData = async (categoryId: string | number, page: number) => {
    setLoading(true);
    try {
      if (categoryId === "All") {
        const response = await instance.get(`/organizations?page=${page}`);
        setOrganizations(response.data.data);
        setCurrentPage(response.data.pagination.current_page);
        setLastPage(response.data.pagination.last_page);
        setselecteddata("default");
      } else {
        const response = await instance.get(
          `/all-organizations-by-service/${categoryId}?page=${page}`
        );
        setFilterOrgs(response.data.data);
        setfiltercurrentPage(response.data.pagination.current_page);
        setfilterlastPage(response.data.pagination.last_page);
        setselecteddata("filterdata");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
      fetchData(selectedCategory.id, newPage);
    }
  };

  const handlefilterpagechange = (newPage: number) => {
    if (newPage > 0 && newPage <= filterlastPage) {
      setfiltercurrentPage(newPage);
      fetchData(selectedCategory.id, newPage);
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
    fetchData(selectedCategory.id, currentPage); // جلب البيانات عند تحميل الصفحة لأول مرة
  }, []);

  useEffect(() => {
    fetchData(selectedCategory.id, currentPage);
  }, [selectedCategory, currentPage]);

  const filterCategories = [
    { id: "All", name: "All" },
    ...categories.map((category) => ({
      id: category.id,
      name: language === "EN" ? category.title_en : category.title_ar,
    })),
  ];

  const handleCategoryChange = (categoryId: string | number) => {
    setSelectedCategory({
      id: categoryId,
      name: categoryId === "All" ? "All" : "",
    });
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      setshowdeletepopup(true);
      const response = await instance.delete(`/organization/${id}`);
      if (response.status === 200) {
        setOrganizations(
          organizations.filter((slider: any) => slider.id !== id)
        );
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

  const currentdata = selecteddata == "filterdata" ? filterorgs : organizations;

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <section className="w-full p-6 max-xl:p-2 mt-4 mx-auto bg-slate-50 dark:bg-secend_dash py-8 md:py-12 lg:py-20">
        <h1 className="mb-8 text-4xl text-gray-900 dark:text-secend_text w-fit mx-auto pb-2 border-b-2 border-sky-400">
          المراكز
        </h1>
        <div className="flex min-h-screen overflow-y-auto max-xl:h-fit max-xl:flex-col  gap-6">
          <aside className="w-full overflow-y-auto h-screen max-xl:h-[50vh] xl:w-1/4 bg-white dark:bg-secend_dash p-4 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold dark:text-secend_text mb-4">
              تصفية حسب الفئة
            </h2>
            <ul className="space-y-2">
              {filterCategories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                      selectedCategory.id === category.id
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

          <div className="w-full xl:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {currentdata.length > 0 ? (
                currentdata.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="w-full flex group overflow-hidden flex-col items-start h-[420px] border dark:border-gray-600 rounded-md shadow-md relative"
                  >
                    <div
                      style={{
                        backgroundImage: `url(${
                          card.image || "/services/service-02.jpg"
                        })`,
                      }}
                      className={`w-full h-[60%] bg-cover`}
                    ></div>
                    <div className="content mt-8 px-4 flex flex-col gap-2 items-start">
                      <h1 className="dark:text-secend_text font-semibold text-[18px]">
                        {language === "EN" ? card.title_en : card.title_ar}
                      </h1>
                      <p className="dark:text-gray-500">
                        {language === "EN"
                          ? card.description_en.length > 40
                            ? card.description_en.slice(0, 40) + "..."
                            : card.description_en
                          : card.description_ar.length > 40
                          ? card.description_ar.slice(0, 40) + "..."
                          : card.description_ar}
                      </p>
                    </div>
                    <div
                      className={`absolute overflow-hidden rounded-md shadow-sm bg-main_blue ${
                        language === "EN" ? "right-3" : "left-3"
                      } top-[60%] -translate-y-1/2 border dark:border-gray-700 flex items-center justify-center`}
                    >
                      <Img
                        src={card.icon || "/logo.png"}
                        className="w-[60px]"
                      />
                    </div>
                    <div className="w-full h-0 group-hover:h-full duration-200 overflow-hidden absolute left-0 top-0 bg-black/50 flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/organizations/${card.id}`}
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
                ))
              ) : (
                <div className="w-full text-center text-lg text-gray-500">
                  لا توجد منظمات تطابق الفلتر
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Pagination
          currentPage={
            selecteddata == "filterdata" ? filtercurrentPage : currentPage
          }
          totalPages={selecteddata == "filterdata" ? filterlastPage : lastPage}
          onPageChange={
            selecteddata == "filterdata"
              ? handlefilterpagechange
              : handlePageChange
          }
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
