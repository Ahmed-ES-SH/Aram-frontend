"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Separator from "../Separator";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import { instance } from "@/app/Api/axios";
import Pagination from "../../PaginationComponent";
import Img from "../../Img";
import Loading from "../../Loading";
import RandomArticlesSidebar from "../_blogpage/RandomArticlesSidebar";
import { LuSearch, LuSlidersHorizontal } from "react-icons/lu";
import SidebarFilters from "../_organizationspage/SidebarFilter";
import OrganizationSlider from "./OrganizationSlider";
import { MdOutlineSignalCellularNodata } from "react-icons/md";

interface serviceType {
  id: number;
  title_en: string;
  title_ar: string;
  description_ar: string;
  description_en: string;
  icon: string;
  image: string;
  popularity: string;
  tags: string;
}

export default function Main_Service_Section() {
  const { language }: any = UseVariables();
  const [selectedFilter, setSelectedFilter] = useState<any>({
    title_en: "All",
    title_ar: "الكل",
  });
  const [services, setServices] = useState<serviceType[]>([]);
  const [filteredServices, setFilteredServices] = useState<serviceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentSearch, setContentSearch] = useState("");
  const [activeTab, setActiveTab] = useState("departments");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilterPage, setCurrentFilterPage] = useState(1);
  const [lastFilterPage, setLastFilterPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isDefaultMode, setIsDefaultMode] = useState(true);
  const [searchResults, setSearchResults] = useState<serviceType[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const getData = async (page: number) => {
      try {
        setLoading(true);
        const response = await instance.get("/services", {
          params: { page },
        });
        const data = response.data.data;
        const pagination = response.data.pagination;
        setServices(data);
        setCurrentPage(pagination.current_page);
        setLastPage(pagination.last_page);
        console.log("Services Data:", data); // تحقق من البيانات
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const getFilteredData = async (newPage: number) => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/get-services-by-service-category/${selectedFilter.id}?page=${newPage}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setFilteredServices(data);
          setCurrentFilterPage(pagination.current_page);
          setLastFilterPage(pagination.last_page);
          console.log("Filtered Services Data:", data); // تحقق من البيانات
        } else {
          setFilteredServices([]); // إعادة تعيين filteredServices إذا لم تكن هناك بيانات
        }
      } catch (error: any) {
        console.log(error);
        setFilteredServices([]); // إعادة تعيين filteredServices في حالة حدوث خطأ
      } finally {
        setLoading(false);
      }
    };

    if (isDefaultMode) {
      getData(currentPage);
    } else {
      getFilteredData(currentFilterPage);
    }
  }, [currentPage, currentFilterPage, selectedFilter, isDefaultMode]);

  // جلب البيانات المفلترة بناءً على العنوان مع تأخير
  useEffect(() => {
    if (contentSearch.trim() === "") {
      // إذا كان مربع البحث فارغًا، قم بعرض جميع البيانات الأصلية
      setSearchResults([]); // إعادة تعيين نتائج البحث إلى مصفوفة فارغة
      setIsSearchMode(false); // الخروج من وضع البحث
    }
  }, [contentSearch, currentFilterPage]);

  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true);
      if (newPage > 0 && newPage <= lastPage) {
        setCurrentPage(newPage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilteredPageChange = async (newPage: number) => {
    try {
      setLoading(true);
      if (newPage > 0 && newPage <= lastFilterPage) {
        setCurrentFilterPage(newPage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const activePage = isSearchMode
    ? currentFilterPage
    : isDefaultMode
    ? currentPage
    : currentFilterPage;
  const activeLastPage = isSearchMode
    ? lastFilterPage
    : isDefaultMode
    ? lastPage
    : lastFilterPage;
  const currentData = isSearchMode
    ? searchResults
    : isDefaultMode
    ? services
    : filteredServices;

  const fetchServicesBySearch = async (text: string, page: number) => {
    try {
      setIsSearching(true); // بدء البحث
      setLoading(true);
      const response = await instance.get(
        `/get-services-by-search/${encodeURIComponent(text)}?page=${page}`
      );
      if (response.status === 200) {
        const data = response.data.data;
        const pagination = response.data.pagination;
        setSearchResults(data);
        setCurrentFilterPage(pagination.current_page);
        setLastFilterPage(pagination.last_page);
        setIsSearchMode(true);
        console.log("Search Results Data:", data); // تحقق من البيانات
      } else {
        setSearchResults([]);
      }
    } catch (error: any) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
      setIsSearching(false); // انتهاء البحث
    }
  };

  useEffect(() => {
    setIsDefaultMode(selectedFilter.title_en === "All");
  }, [selectedFilter]);

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  console.log("Current Data:", currentData); // تحقق من البيانات الحالية

  if (loading) return <Loading />;

  return (
    <div className="max-md:mt-4 pt-2">
      <section
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        className="w-full mx-auto  dark:bg-secend_dash"
      >
        <Separator
          bg_dark="dark:bg-secend_dash"
          text={language == "EN" ? "Aram Services" : "خدمات آرام"}
        />
        <div className="mx-auto text-center space-y-4">
          <motion.h2
            className="font-semibold pb-2 border-b border-main_blue w-fit mx-auto text-3xl md:text-4xl dark:text-secend_text text-center mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {language === "EN" ? "Services" : "خدماتنا"}
          </motion.h2>

          <motion.p
            className="text-md w-[60%] max-md:w-full mx-auto text-gray-700 dark:text-gray-300 text-center mb-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            {language === "EN"
              ? "Aram Medical Services offer unparalleled health solutions tailored to meet the needs of individuals and businesses. With state-of-the-art facilities and a dedicated team of experts, we ensure the highest quality of care for everyone."
              : "تقدم خدمات آرام الطبية حلولاً صحية لا مثيل لها لتلبية احتياجات الأفراد والشركات. مع مرافق متطورة وفريق متخصص، نضمن أعلى مستوى من الرعاية للجميع."}
          </motion.p>
        </div>

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
                    ? "Find the service here..."
                    : "إبحث عن الخدمة هنا  ..."
                }
                className="w-[90%] bg-transparent h-full pr-9 px-4 py-2 outline-none placeholder-shown:px-4 placeholder-shown:py-2 placeholder-shown:pr-9 placeholder-shown:text-[18px]"
              />

              <LuSlidersHorizontal
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className={`${
                  language == "EN" ? "right-2" : "left-2"
                } top-1/2 text-main_orange cursor-pointer size-6 hover:scale-125 duration-150`}
              />
            </div>
            {
              <button
                onClick={() =>
                  fetchServicesBySearch(contentSearch, currentFilterPage)
                }
                className={`px-6 py-2 hover:text-white text-cenetr rounded-md shadow-md border border-main_orange hover:bg-orange-400 duration-200 ${
                  contentSearch.length > 0
                    ? "opacity-100 block"
                    : "opacity-0 cursor-auto hidden"
                }`}
              >
                {language == "EN" ? "Search" : "بحث"}
              </button>
            }
          </div>
        </div>
        <div className="flex items-start max-xl:flex-col-reverse gap-2 w-full p-2">
          <RandomArticlesSidebar length={5} />
          <div className="flex-1 flex-grow max-xl:w-full h-fit lg:pb-28 border rounded-md dark:border-gray-700 p-2">
            <AnimatePresence>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {currentData.length > 0 ? (
                  currentData.map((card) => (
                    <Link
                      key={card.id}
                      href={`/services/${formatTitle(
                        card.title_en
                      )}?serviceId=${card.id}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="w-full flex flex-col items-start h-[400px] border dark:border-gray-600 rounded-md shadow-md relative"
                      >
                        <div
                          style={{
                            backgroundImage: `url(${
                              card.image
                                ? card.image
                                : "/services/service-02.jpg"
                            })`,
                          }}
                          className={`w-full h-[60%] bg-cover rounded-t-md`}
                        ></div>
                        <div className="content mt-8 px-4 flex flex-col gap-2 items-start">
                          <h1 className="dark:text-secend_text font-semibold pb-2 border-b border-main_blue text-[18px]">
                            {language == "EN" ? card.title_en : card.title_ar}
                          </h1>
                          <p className="dark:text-gray-500">
                            {language == "EN"
                              ? card.description_en.slice(0, 60) + "..."
                              : card.description_ar.slice(0, 60) + "..."}
                          </p>
                        </div>
                        <div
                          className={`absolute w-[60px] h-[60px] rounded-md shadow-sm bg-main_blue ${
                            language == "EN" ? "right-3" : "left-3"
                          } top-[60%] -translate-y-1/2 dark:border-gray-700 flex items-center justify-center`}
                        >
                          <Img
                            src={card.icon ? card.icon : "/logo.ico"}
                            className="w-full h-full rounded-md"
                          />
                        </div>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-center w-full col-span-3 justify-center h-[80vh]">
                    <MdOutlineSignalCellularNodata className="text-gray-500 size-72" />
                    <p className="text-gray-500 mt-4">
                      {language === "EN"
                        ? "No matching Services found."
                        : "لا توجد خدمات مطابقة."}
                    </p>
                  </div>
                )}
              </div>
              {currentData.length > 0 && (
                <Pagination
                  currentPage={activePage}
                  totalPages={activeLastPage}
                  onPageChange={
                    isSearchMode
                      ? handleFilteredPageChange
                      : isDefaultMode
                      ? handlePageChange
                      : handleFilteredPageChange
                  }
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      <div className="w-full p-2 my-4">
        <OrganizationSlider />
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <SidebarFilters
            category_id={1}
            setSelectedFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
            isFilterOpen={isFilterOpen}
            setactiveTab={setActiveTab}
            setIsFilterOpen={setIsFilterOpen}
            setloading={setLoading}
            selectedLocation={""}
            setSelectedLocation={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
