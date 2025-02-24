"use client";
import Loading from "@/app/_components/Loading";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { MdSignalCellularNodata } from "react-icons/md";
import CouponeCardSelect from "./CouponeCardSelect";

interface props {
  setSelectedCouponeprop: any;
}

export default function CouponsForSelect({ setSelectedCouponeprop }: props) {
  const [coupons, setCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastpage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [contentSearch, setContentSearch] = useState("");
  const [selectCurrentData, setSelectCurrentData] = useState("DefaultData");
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedCoupone, setSelectedCoupone] = useState({});
  const [loading, setLoading] = useState(true);

  const getFilteredDataByTitle = async (title: string, page: number) => {
    if (title.trim() === "") {
      setSearchResult([]);
      setSelectCurrentData("DefaultData"); // العودة إلى البيانات الأصلية
      return;
    }
    setSearchResult([]);
    setSelectedCoupone({});
    setSelectedCouponeprop({});
    setSelectCurrentData("SearchData");
    try {
      setIsSearching(true);

      const response = await instance.post(`/search-copones?page=${page}`, {
        content_search: contentSearch,
      });
      if (response.status === 200) {
        const data = response.data.data;
        const pagination = response.data.pagination;
        setSearchResult(data);
        setSearchCurrentPage(pagination.current_page);
        setSearchLastPage(pagination.last_page);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const getCurrentData = () => {
    // إذا كان الحقل فارغًا، نعرض البيانات الافتراضية
    if (contentSearch.length === 0) {
      return coupons;
    }

    // إذا لم تكن هناك نتائج حديثة، نعيد قائمة فارغة بدلًا من النتائج السابقة
    if (selectCurrentData === "SearchData" && searchResult.length === 0) {
      return [];
    }

    // إعادة النتائج عند البحث
    return selectCurrentData === "SearchData" ? searchResult : coupons;
  };

  useEffect(() => {
    if (contentSearch.length === 0) {
      setSearchResult([]); // تفريغ النتائج عند إزالة البحث
    }
  }, [contentSearch]);

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
      default:
        return {
          currentPage: currentPage,
          lastPage: lastPage,
          onPageChange: (newPage: number) => setCurrentPage(newPage),
        };
    }
  };

  const currentData = getCurrentData();
  const {
    currentPage: activePage,
    lastPage: activeLastPage,
    onPageChange,
  } = getPaginationData();

  useEffect(() => {
    const getdata = async (page: number) => {
      try {
        const response = await instance.get(`/all-copones?page=${page}`);
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setCoupons(data);
          setCurrentPage(pagination.current_page);
          setLastpage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getdata(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (selectedCoupone) {
      setSelectedCouponeprop(selectedCoupone);
    }
  }, [selectedCoupone]);

  if (loading) return <Loading />;
  return (
    <>
      <div className="w-full min-h-screen p-6 max-md:p-2 mt-20">
        <h1 className="text-2xl max-md:text-[17px] w-fit mx-auto pb-3 border-b border-main_orange">
          حدد الكوبون
        </h1>
        <div
          style={{ direction: "rtl" }}
          className="inputsearch  mb-5 mt-2 flex items-center gap-2 relative w-[50%] max-lg:w-3/4 max-md:w-[97%] mx-auto"
        >
          <div className="flex items-center w-full gap-2 max-md:flex-col ">
            <div className="relative bg-white rounded-md shadow-md h-[40px] flex items-center justify-center w-full">
              <LuSearch
                className={`${"right-2"} top-1/2 text-secend_text size-5`}
              />
              <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setContentSearch(e.target.value)
                }
                name="titlesearch"
                value={contentSearch}
                placeholder={"إبحث عن الكوبون هنا  ..."}
                className="w-[90%] bg-transparent h-full pr-9 px-4 py-2 outline-none placeholder-shown:px-4 placeholder-shown:py-2 placeholder-shown:pr-9 placeholder-shown:text-[18px]"
              />
            </div>
            {
              <button
                onClick={() =>
                  getFilteredDataByTitle(contentSearch, searchCurrentPage)
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
        {isSearching ? (
          <motion.div
            className="flex flex-col items-center justify-center gap-4 min-h-[40vh]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FaSearch className="size-20 text-main_orange" />
            </motion.div>
            <p className="text-lg text-gray-600">{"جاري البحث..."}</p>
          </motion.div>
        ) : coupons && currentData.length > 0 ? (
          <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 max-md:grid-cols-1 gap-8 max-md:gap-2 w-full min-h-[90vh]">
            {currentData.map((coupone, index) => (
              <CouponeCardSelect
                key={index}
                setSelectedCoupone={setSelectedCoupone}
                selectedCoupoe={selectedCoupone}
                coupon={coupone}
              />
            ))}
          </div>
        ) : coupons.length == 0 ? (
          <div className="min-h-[90vh] w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <MdSignalCellularNodata className="text-gray-400 size-56" />
              <p>لا توجد كوبونات فى قاعدة البيانات حتى الان </p>
            </div>
          </div>
        ) : (
          <div className="min-h-[90vh] w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <MdSignalCellularNodata className="text-gray-400 size-56" />
              <p>لا توجد كوبونات مطابقة لعمليات البحث فى الوقت الحالى </p>
            </div>
          </div>
        )}
        <Pagination
          currentPage={activePage}
          totalPages={activeLastPage}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}
