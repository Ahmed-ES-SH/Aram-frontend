"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrganiztionCard from "./OrganiztionCard";
import { FaFilter, FaSearch } from "react-icons/fa";
import Separator from "../Separator";
import { UseVariables } from "@/app/context/VariablesContext";
import SidebarFilters from "./SidebarFilter";
import { instance } from "@/app/Api/axios";
import Loading from "../../Loading";
import Pagination from "../../PaginationComponent";
import { useDataContext } from "@/app/context/DataContext";
import { MdOutlineSignalCellularNodata } from "react-icons/md";
import { LuSearch, LuSlidersHorizontal } from "react-icons/lu";
import RandomCategoriesSidebar from "./RandomCategoriesSidebar";

interface Organization {
  id: number;
  email: string;
  password: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  location: string;
  categories: { title_en: string; title_ar: string; [key: string]: string }[];
  phone_number: string;
  open_at: string;
  close_at: string;
  url: string;
  image: string;
  icon: string;
}

interface props {
  category_id: number;
}

export default function Organizations({ category_id }: props) {
  const { language }: any = UseVariables();
  const { currentuser, type } = useDataContext();
  const [selectedFilter, setSelectedFilter] = useState<any>({
    title_en: "All",
    title_ar: "الكل",
  });
  const [selectedLocation, setSelectedLocation] = useState<any>({
    address: "All",
  });
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredData, setFilteredData] = useState<Organization[]>([]);
  const [searchResults, setSearchResults] = useState<Organization[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCurrentPage, setFilteredCurrentPage] = useState(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filteredLastPage, setFilteredLastPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [contentSearch, setContentSearch] = useState("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("departments");

  const [selectCurrentData, setSelectCurrentData] =
    useState<string>("OriginalData");

  const userId = currentuser && currentuser.id;

  useEffect(() => {
    const getOrganizations = async (page: number) => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/organizations-by-service/${category_id}`,
          {
            params: { page },
          }
        );
        const fetchedOrganizations: Organization[] = response.data.data;
        const filterorgs = fetchedOrganizations.filter(
          (org) => org.id != userId
        );

        const pagination = response.data.pagination;
        setOrganizations(
          userId && type == "Organization" ? filterorgs : fetchedOrganizations
        );
        setCurrentPage(pagination.current_page);
        setLastPage(pagination.last_page);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getOrganizations(currentPage);
  }, [currentPage, userId]);

  useEffect(() => {
    const getFilterData = async (api: string, page: number) => {
      try {
        setSelectCurrentData("FilterData"); // تعيين نوع البيانات إلى "FilterData"
        setLoading(true);
        const response = await instance.get(`${api}?page=${page}`);
        if (response.status === 200) {
          const data = response.data.data;
          setFilteredData(data);
          setFilteredCurrentPage(response.data.pagination.current_page);
          setFilteredLastPage(response.data.pagination.last_page);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (
      selectedFilter.title_en !== "All" ||
      selectedLocation.address !== "All"
    ) {
      if (activeTab !== "departments") {
        getFilterData(
          `/organizations-by-location/${encodeURIComponent(
            selectedLocation.address
          )}`,
          filteredCurrentPage
        );
      } else if (selectedFilter.id) {
        getFilterData(
          `/organizations-by-service/${selectedFilter.id}`,
          filteredCurrentPage
        );
      } else {
        setFilteredData([]);
        setSelectCurrentData("OriginalData"); // العودة إلى البيانات الأصلية
      }
    } else {
      setFilteredData([]);
      setSelectCurrentData("OriginalData"); // العودة إلى البيانات الأصلية
    }
  }, [selectedFilter, selectedLocation, filteredCurrentPage]);

  const getFilteredDataByTitle = async (title: string, page: number) => {
    if (title.trim() === "") {
      setSearchResults([]);
      setSelectCurrentData("DefaultData"); // العودة إلى البيانات الأصلية
      return;
    }
    setSelectCurrentData("SearchData"); // تعيين نوع البيانات إلى "SearchData"
    try {
      setIsSearching(true);
      const response = await instance.get(
        `/organizations-by-title/${encodeURIComponent(title)}?page=${page}`
      );
      if (response.status === 200) {
        const data = response.data.data;
        setSearchResults(data);
        setSearchCurrentPage(response.data.pagination.current_page);
        setSearchLastPage(response.data.pagination.last_page);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  // تحديد البيانات المعروضة بناءً على selectCurrentData والشروط الإضافية
  const getCurrentData = () => {
    // إذا كان محتوى البحث فارغًا ولم يتم اختيار أي فلتر غير All
    if (
      contentSearch.length === 0 &&
      selectedFilter.title_en === "All" &&
      selectedLocation.address === "All"
    ) {
      return organizations; // عرض البيانات الافتراضية
    }

    // إذا لم تكن الشروط السابقة متحققة، نعتمد على selectCurrentData
    switch (selectCurrentData) {
      case "SearchData":
        return searchResults;
      case "FilterData":
        return filteredData;
      default:
        return organizations; // DefaultData
    }
  };

  // تحديد Pagination بناءً على selectCurrentData
  const getPaginationData = () => {
    switch (selectCurrentData) {
      case "SearchData":
        return {
          currentPage: searchCurrentPage,
          lastPage: searchLastPage,
          onPageChange: (newPage: number) => {
            setSearchCurrentPage(newPage);
            getFilteredDataByTitle(contentSearch, newPage);
          },
        };
      case "FilterData":
        return {
          currentPage: filteredCurrentPage,
          lastPage: filteredLastPage,
          onPageChange: (newPage: number) => setFilteredCurrentPage(newPage),
        };
      default:
        return {
          currentPage: currentPage,
          lastPage: lastPage,
          onPageChange: (newPage: number) => setCurrentPage(newPage),
        };
    }
  };

  useEffect(() => {
    if (contentSearch.length === 0) {
      setSearchResults([]);
      setSelectCurrentData("OriginalData");
    }
  }, [contentSearch]);

  const currentData = getCurrentData();
  const {
    currentPage: activePage,
    lastPage: activeLastPage,
    onPageChange,
  } = getPaginationData();

  if (loading) return <Loading />;

  return (
    <>
      <div
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        className="mt-20"
      >
        <Separator
          bg_dark="dark:bg-main_dash"
          text={language === "EN" ? "Aram Organizations" : "منظمات آرام"}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center head">
          <h1 className="pb-2 border-b border-b-main_orange w-fit lg:whitespace-nowrap mx-auto text-center font-manrope font-bold max-sm:text-lg text-3xl text-gray-900 dark:text-secend_text mb-5 md:text-4xl md:leading-normal">
            {language === "EN"
              ? "Discover Excellence with Our"
              : " اكتشف التميز مع"}
            <span className="text-main_orange">
              {language === "EN"
                ? " Partner Organizations"
                : " المنظمات الشريكة"}
            </span>
          </h1>
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
                    ? "Find the center here..."
                    : "إبحث عن المركز هنا  ..."
                }
                className="w-[90%] bg-transparent h-full pr-9 px-4 py-2 outline-none placeholder-shown:px-4 placeholder-shown:py-2 placeholder-shown:pr-9 placeholder-shown:text-[18px]"
              />

              <LuSlidersHorizontal
                onClick={() => setIsFilterOpen(true)}
                className={`${
                  language == "EN" ? "right-2" : "left-2"
                } top-1/2 text-main_orange cursor-pointer size-6 hover:scale-125 duration-150`}
              />
            </div>
            {
              <button
                onClick={() =>
                  getFilteredDataByTitle(contentSearch, searchCurrentPage)
                }
                className={`px-6 py-2 hover:text-white text-cenetr rounded-md shadow-md border border-main_orange hover:bg-orange-400 duration-200 ${
                  contentSearch.length > 0
                    ? "opacity-100"
                    : "opacity-0 cursor-auto"
                }`}
              >
                {language == "EN" ? "Search" : "بحث"}
              </button>
            }
          </div>
        </div>
        <div className="relative flex items-start max-xl:flex-col-reverse gap-2 p-2">
          {/* Sidebar */}
          <SidebarFilters
            setSelectedFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
            setSelectedLocation={setSelectedLocation}
            selectedLocation={selectedLocation}
            isFilterOpen={isFilterOpen}
            setactiveTab={setActiveTab}
            setIsFilterOpen={setIsFilterOpen}
            setloading={setLoading}
            category_id={category_id}
          />
          <RandomCategoriesSidebar />
          {/* Main Content */}
          <div className="flex-1 h-fit max-xl:w-full border rounded-md dark:border-gray-700 dark:bg-secend_dash dark:text-secend_text px-3 py-6">
            <button
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="fixed bottom-4 right-4 bg-main_orange text-white p-3 rounded-full shadow-lg z-50"
            >
              <FaFilter size={20} />
            </button>

            {/* Organizations List */}
            <motion.div className="h-fit" layout>
              <AnimatePresence>
                {isSearching ? ( // إذا كان البحث جاريًا، عرض رسالة تحميل
                  <motion.div
                    className="flex flex-col items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <FaSearch className="text-4xl text-gray-500" />
                    </motion.div>
                    <p className="text-lg text-gray-600">
                      {language === "EN" ? "Searching..." : "جاري البحث..."}
                    </p>
                  </motion.div>
                ) : currentData.length > 0 ? ( // إذا كانت هناك بيانات، عرضها
                  currentData.map((organization, index) => (
                    <div key={index} className="block">
                      <motion.div
                        key={organization.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <OrganiztionCard organization={organization} />
                      </motion.div>
                    </div>
                  ))
                ) : (
                  ((contentSearch.length > 0 && searchResults.length === 0) || // حالة البحث بدون نتائج
                    (selectedFilter.title_en !== "All" &&
                      filteredData.length === 0) || // حالة التصفية بدون نتائج
                    (selectedLocation.address !== "All" &&
                      filteredData.length === 0)) && ( // حالة التصفية بدون نتائج
                    <div className="flex flex-col items-center justify-center h-[80vh]">
                      <MdOutlineSignalCellularNodata className="text-gray-500 size-72" />
                      <p className="text-gray-500 mt-4">
                        {language === "EN"
                          ? "No matching organizations found."
                          : "لا توجد منظمات مطابقة."}
                      </p>
                    </div>
                  )
                )}
              </AnimatePresence>
            </motion.div>
            {currentData.length > 0 && !isSearching && (
              <Pagination
                currentPage={activePage}
                totalPages={activeLastPage}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
