"use client";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../ProductCard";
import Separator from "../Separator";
import Footer from "../Footer";
import { instance } from "@/app/Api/axios";
import Loading from "../../Loading";
import RandomServicesSidebar from "../_servicespage/RandomServicesSidebar";
import Pagination from "../../PaginationComponent";
import OrganizationSlider from "../_servicespage/OrganizationSlider";
import { FaArrowDown19 } from "react-icons/fa6";
import { TfiLayersAlt } from "react-icons/tfi";
import { MdOutlineSignalCellularNodata } from "react-icons/md";
import { LuFilter, LuLoader } from "react-icons/lu";
import FilterCards from "./FilterCards";

interface cardType {
  id: number;
  title_ar: string;
  title_en: string;
  description_en: string;
  description_ar: string;
  features_ar: string[];
  features_en: string[];
  price: number;
  quantity: number;
  image: string;
}

export default function CardsPage() {
  const { language }: any = UseVariables();
  const description_ar =
    "تقدم شركتنا بطاقات مميزة تمنح حامليها امتيازات حصرية تشمل خصومات على الخدمات، أولوية في الحجز، وعروض خاصة مصممة لتلبية احتياجاتك. هذه البطاقات تمثل استثمارًا قيّمًا للحصول على تجربة أفضل وأكثر تميزًا.";
  const description_en =
    "Our company offers exclusive cards that provide holders with special privileges, including discounts on services, priority booking, and tailored offers. These cards are a valuable investment for a superior and more distinguished experience.";

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const [cards, setcards] = useState<cardType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectCurrentData, setSelectCurrentData] = useState("DefaultData");
  const [FilterReasult, setFilterReasult] = useState<cardType[]>([]);
  const [FilterCurrentPage, setFilterCurrentPage] = useState(1);
  const [FilterLastPage, setFilterLastPage] = useState(1);
  const [FilterLoading, setFilterLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const getdata = async (page: number) => {
      try {
        setFilterLoading(true);
        const response = await instance.get(`/card-types?page=${page}`);
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setcards(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
        setFilterLoading(false);
      }
    };
    getdata(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await instance.get("/all-card-type-categories");
        if (response.status == 200) {
          const data = response.data.data;
          setCategories(data);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    getdata();
  }, []);

  const handlegetDataByCategory = async (category: any, page: number) => {
    try {
      setFilterReasult([]);
      setFilterLoading(true);
      setSelectedCategory(category);
      setSelectCurrentData("FilterData");
      const response = await instance.get(
        `/cards-by-category/${category.id}?page=${page}`
      );
      if (response.status == 200) {
        const data = response.data.data;
        const pagination = response.data.pagination;
        setFilterReasult(data);
        setFilterCurrentPage(pagination.current_page);
        setFilterLastPage(pagination.last_page);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setFilterLoading(false);
    }
  };

  const getPaginationData = () => {
    switch (selectCurrentData) {
      case "FilterData":
        return {
          currentPage: FilterCurrentPage,
          lastPage: FilterLastPage,
          onPageChange: (newPage: number) => setFilterCurrentPage(newPage),
        };
      default:
        return {
          currentPage: currentPage,
          lastPage: lastPage,
          onPageChange: (newPage: number) => setCurrentPage(newPage),
        };
    }
  };

  const getCurrentData = () => {
    switch (selectCurrentData) {
      case "FilterData":
        return FilterReasult;
      default:
        return cards;
    }
  };

  const {
    currentPage: activeCurrentPage,
    lastPage: activeLastPage,
    onPageChange: activePageChange,
  } = getPaginationData();

  const CurrentData = getCurrentData();

  const onClose = () => {
    setFilterOpen(false);
  };

  const clickAll = () => {
    setSelectCurrentData("DefaultData");
    setSelectedCategory(null);
  };

  if (loading) return <Loading />;

  return (
    <>
      <div
        className="pt-16"
        style={{ direction: language === "EN" ? "ltr" : "rtl" }}
      >
        {/* Separator Component */}
        <Separator
          bg_dark="dark:bg-main_dash"
          text={language === "EN" ? "Aram Cards" : "بطاقات آرام"}
        />

        {/* Main Section */}
        <motion.section
          className="w-full p-1"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {/* Header */}
          <header className="text-center">
            <h2 className="text-3xl max-md:text-xl font-bold text-gray-900 dark:text-secend_text">
              {language === "EN" ? "Selected Cards" : "بطاقات مختارة"}
            </h2>
            <p className="mt-4 max-w-4xl mx-auto text-gray-500">
              {language === "EN" ? description_en : description_ar}
            </p>
          </header>

          {/* Cards Section */}
          <div className="flex items-start gap-2 max-xl:flex-col w-full my-4">
            <div className="w-3/4 border dark:border-gray-600 rounded-md shadow-md max-xl:w-full py-2  h-full">
              <div className="w-full mx-auto max-lg:hidden ">
                {/* العنوان التوضيحي */}
                <h2 className="text-lg pb-2 border-b border-sky-400 w-fit mx-auto font-bold text-center mb-3 text-gray-700">
                  {language === "EN" ? "Filter by Category" : "تصفية حسب الفئة"}
                </h2>

                {/* قائمة الفئات */}
                <div className="flex max-xl:flex-wrap items-center justify-center gap-2 relative">
                  <div
                    onClick={clickAll}
                    className={`text-center  rounded-md shadow-md px-2 py-1  cursor-pointer hover:scale-110   duration-200 ${
                      !selectedCategory ||
                      Object.keys(selectedCategory).length === 0
                        ? "bg-white border border-main_orange"
                        : "hover:text-black text-white bg-main_orange hover:bg-white hover:border-main_orange border border-transparent"
                    }`}
                  >
                    {language == "EN" ? "All" : "الكل"}
                  </div>
                  {categories.slice(0, 8).map((cat: any, index: number) => (
                    <div
                      key={index}
                      onClick={() =>
                        handlegetDataByCategory(cat, FilterCurrentPage)
                      }
                      className={`text-center  whitespace-nowrap rounded-md shadow-md px-2 py-1  cursor-pointer hover:scale-110  duration-200 ${
                        selectedCategory && selectedCategory.id == cat.id
                          ? "bg-white border border-main_orange"
                          : "hover:text-black text-white bg-main_orange hover:bg-white hover:border-main_orange border border-transparent"
                      }`}
                    >
                      {language === "EN" ? cat.title_en : cat.title_ar}
                    </div>
                  ))}

                  {/* زر عرض المزيد */}
                  <div
                    onClick={() => setFilterOpen(true)}
                    className="text-center text-white rounded-md shadow-md px-2 py-1 bg-main_orange cursor-pointer hover:scale-110 hover:text-black hover:bg-white hover:border-main_orange border border-transparent duration-200"
                  >
                    <TfiLayersAlt className="size-6" />
                  </div>
                </div>
              </div>

              {FilterLoading ? (
                <div className="min-h-[90vh] w-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center justify-center"
                  >
                    <LuLoader className="size-52 text-main_orange max-md:size-32" />
                  </motion.div>
                </div>
              ) : CurrentData.length === 0 ? (
                <div className="text-center min-h-[90vh] flex items-center justify-center text-gray-500 mt-6">
                  <div className="w-fit">
                    <MdOutlineSignalCellularNodata className="size-60 max-md:size-20 text-gray-400" />
                    <p>
                      {language === "EN"
                        ? "No data available"
                        : "لا توجد بيانات متاحة"}
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="grid mt-6 justify-items-center p-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 ">
                  {CurrentData.map((card, index) => (
                    <motion.li
                      key={index}
                      className="w-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ProductCard direct="cards" card={card} />
                    </motion.li>
                  ))}
                </ul>
              )}
              {/* Show More Button */}
              <Pagination
                currentPage={activeCurrentPage}
                totalPages={activeLastPage}
                onPageChange={activePageChange}
              />
            </div>
            <RandomServicesSidebar />
          </div>
        </motion.section>
        <div className="w-full p-2 my-3">
          <OrganizationSlider />
        </div>
      </div>
      <div
        onClick={() => setFilterOpen(true)}
        className=" fixed bottom-3 right-3 hidden bg-main_orange cursor-pointer w-12 h-12 max-lg:flex  items-center justify-center border border-main_orange rounded-full"
      >
        <LuFilter className="text-white size-7" />
      </div>
      <FilterCards
        categories={categories}
        handlegetDataByCategory={handlegetDataByCategory}
        setSelectCurrentData={setSelectCurrentData}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isOpen={filterOpen}
        onClose={onClose}
      />
    </>
  );
}
