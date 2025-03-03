"use client";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";
import AffiliateServiceCard from "./AffiliateServiceCard";
import { UseVariables } from "@/app/context/VariablesContext";
import Pagination from "../../PaginationComponent";
import { LuSearch } from "react-icons/lu";
import Separator from "../Separator";
import FilterAffiliateServices from "./FilterAffiliateServices";
import { CiFilter } from "react-icons/ci";
import { MdOutlineSignalCellularNodata } from "react-icons/md";
import OrganizationsSlider from "../_organizationspage/Organization_slider";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function AffiliateServices() {
  const { language } = UseVariables();
  const [affiliateServices, setAffiliateServices] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState<any>({
    title_en: "All",
    title_ar: "الكل",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filterData, setFilterData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [filterDataCurrentPage, setFilterDataCurrentPage] = useState(1);
  const [filterLastPage, setFilterLastPage] = useState(1);
  const [contentSearch, setContentSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectCurrentData, setSelectCurrentData] = useState("DefaultData");
  const [isOpen, setIsOpen] = useState(false);

  // تحديد Pagination بناءً على selectCurrentData

  useEffect(() => {
    if (contentSearch.length === 0) {
      setSearchResult([]);
      if (filterData.length == 0) {
        setSelectCurrentData("DefaultData");
      } else {
        setSelectCurrentData("FilterData");
      }
    }
  }, [contentSearch]);

  useEffect(() => {
    const getData = async (page: number) => {
      try {
        const response = await instance.get(
          `/active-affiliate-services?page=${page}`
        );
        if (response.status === 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
          setAffiliateServices(data);
          setSelectCurrentData("DefaultData"); // تحديث الحالة إلى البيانات العادية
        } else if (response.status === 404) {
          // تعيين noData إلى true عند عدم وجود بيانات
          setAffiliateServices([]);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const getServicesByFilter = async (page: number) => {
      try {
        setSelectCurrentData("FilterData");
        setSearchLoading(true);
        const response = await instance.get(
          `/affiliate-services-by-category/${selectedFilter.id}?page=${page}`
        );
        if (response.status === 200) {
          setIsOpen(false);
          const data = response.data.data;
          const pagination = response.data.pagination;
          setFilterData(data);
          setFilterDataCurrentPage(pagination.current_page);
          setFilterLastPage(pagination.last_page);
          setSelectCurrentData("FilterData"); // تحديث الحالة إلى بيانات الفلتر
        } else if (response.status == 404) {
          console.log(2121);
          setFilterData([]); // لا توجد بيانات
          // تعيين noData إلى true عند عدم وجود بيانات
        }
      } catch (error: any) {
        if (error.status == 404) {
          setFilterData([]); // لا توجد بيانات
        }
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    };

    if (selectedFilter.id) {
      getServicesByFilter(filterDataCurrentPage);
    } else {
      getData(currentPage);
    }
  }, [selectedFilter.id, currentPage, filterDataCurrentPage]);

  const getFilteredDataBySearch = async (
    contentSearch: string,
    page: number = 1
  ) => {
    try {
      if (contentSearch.trim() === "") {
        setSearchResult([]);
        setSelectCurrentData("DefaultData"); // العودة إلى البيانات الأصلية
        return;
      }
      setSearchLoading(true);
      setSelectCurrentData("SearchData");
      const response = await instance.post(`/affiliate-services-by-search`, {
        content_search: contentSearch,
        page: page,
      });
      if (response.status === 200) {
        const data = response.data.data;
        const pagination = response.data.pagination;
        setSearchResult(data);
        setSearchCurrentPage(pagination.current_page);
        setSearchLastPage(pagination.last_page);
        setSelectCurrentData("SearchData"); // تحديث الحالة إلى بيانات البحث
      } else if (response.status === 404) {
        setSearchResult([]); // لا توجد بيانات
        setFilterData([]); // لا توجد بيانات
        // تعيين noData إلى true عند عدم وجود بيانات
      }
    } catch (error: any) {
      if (error.status == 404) {
        setSearchResult([]); // لا توجد بيانات
      }
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const getCurrentData = () => {
    // إذا كان محتوى البحث فارغًا ولم يتم اختيار أي فلتر غير All
    if (contentSearch.length === 0 && selectedFilter.title_en === "All") {
      return affiliateServices; // عرض البيانات الافتراضية
    }

    // إذا لم تكن الشروط السابقة متحققة، نعتمد على selectCurrentData
    switch (selectCurrentData) {
      case "SearchData":
        return searchResult;
      case "FilterData":
        return filterData;
      default:
        return affiliateServices; // DefaultData
    }
  };

  const getPaginationData = () => {
    switch (selectCurrentData) {
      case "SearchData":
        return {
          currentPage: searchCurrentPage,
          lastPage: searchLastPage,
          onPageChange: (newPage: number) => {
            setSearchCurrentPage(newPage);
            getFilteredDataBySearch(contentSearch, newPage);
          },
        };
      case "FilterData":
        return {
          currentPage: filterDataCurrentPage,
          lastPage: filterLastPage,
          onPageChange: (newPage: number) => setFilterDataCurrentPage(newPage),
        };
      default:
        return {
          currentPage: currentPage,
          lastPage: lastPage,
          onPageChange: (newPage: number) => setCurrentPage(newPage),
        };
    }
  };

  const openToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const paginationData = getPaginationData();
  const currentData = getCurrentData();

  if (loading)
    return (
      <div className="min-h-[90vh] h-full w-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <AiOutlineLoading3Quarters className="size-36 max-xl:size-24 text-main_orange animate-pulse" />
        </motion.div>
      </div>
    );

  return (
    <>
      <div
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        className="mt-16 w-full min-h-screen flex max-xl:flex-col items-start justify-between gap-2 dark:bg-secend_dash p-2 max-md:p-2"
      >
        <FilterAffiliateServices
          isOpen={isOpen}
          openToggle={openToggle}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        <div className="w-full">
          <Separator
            bg_dark="dark:bg-secend_dash"
            text={
              language === "EN"
                ? "Aram Affiliate Services"
                : "خدمات آرام التابعة"
            }
          />
          <div className="mx-auto my-6 max-w-7xl  px-4 sm:px-6 lg:px-8 relative text-center head">
            <h1
              style={{ overflowWrap: "anywhere" }}
              className="pb-2 border-b border-b-main_orange w-fit lg:whitespace-nowrap mx-auto text-center font-manrope font-bold max-sm:text-lg text-3xl text-gray-900 dark:text-secend_text mb-5 md:text-4xl md:leading-normal"
            >
              {language === "EN"
                ? "Explore Exceptional Services with Our"
                : "اكتشف الخدمات الاستثنائية مع"}
              <br />
              <span className="text-main_orange">
                {language === "EN"
                  ? "Trusted Partner Organizations"
                  : "المنظمات الشريكة الموثوقة"}
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {language === "EN"
                ? "We collaborate with leading organizations to provide you with top-notch services tailored to your needs."
                : "نحن نتعاون مع المنظمات الرائدة لتقديم خدمات عالية الجودة مصممة خصيصًا لتلبية احتياجاتك."}
            </p>
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
                      ? "Find the Service here..."
                      : "إبحث عن الخدمة هنا  ..."
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
                  {language == "EN" ? "Search" : "بحث"}
                </button>
              }
            </div>
          </div>

          {/* عرض البيانات إذا كانت متوفرة */}
          {searchLoading ? (
            <div className="min-h-[80vh] flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FaSearch className=" size-24 text-main_orange" />
              </motion.div>
            </div>
          ) : currentData && currentData.length > 0 ? (
            <>
              <div className="affiliate-services p-6 max-md:p-2 max-md:w-[95%] min-h-screen mx-auto my-4 h-full flex-1 flex-grow grid xl:grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 gap-y-12 max-md:gap-y-5 justify-items-center items-start">
                {currentData.map((service, index) => (
                  <AffiliateServiceCard
                    key={index}
                    index={index}
                    service={service}
                    direct="affiliateservices"
                  />
                ))}
              </div>
              <Pagination
                currentPage={paginationData.currentPage}
                totalPages={paginationData.lastPage}
                onPageChange={paginationData.onPageChange}
              />
            </>
          ) : (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
              <MdOutlineSignalCellularNodata className="text-gray-400 size-72" />
              <p>
                {language == "EN"
                  ? "Sorry , No Data Founded ."
                  : "عفوا لا يوجد بيانات تطابق عملية البحث الخاصة بك  ."}
              </p>
            </div>
          )}
        </div>
      </div>
      <OrganizationsSlider />
      <div
        onClick={openToggle}
        className="w-16 h-16 max-md:w-12 max-md:h-12 xl:hidden cursor-pointer hover:bg-white hover:scale-110 duration-200 hover:text-black hover:border-main_orange border border-transparent flex z-[9999] items-center justify-center rounded-full bg-main_orange shadow-md text-white fixed bottom-4 right-6"
      >
        <CiFilter className="size-12 max-md:size-8" />
      </div>
    </>
  );
}
