"use client";
import { useDataContext } from "@/app/context/DataContext";
import React, { useEffect, useState } from "react";
import Img from "../../Img";
import { instance } from "@/app/Api/axios";
import Pagination from "../../PaginationComponent";
import { LuSearch } from "react-icons/lu";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { MdSignalCellularNodata } from "react-icons/md";
import CouponeCardPreview from "./CouponeCardPreview";
import { UseVariables } from "@/app/context/VariablesContext";
import Loading from "../../Loading";

export default function CouponesaccountComponent() {
  const { language } = UseVariables();
  const { currentuser, type } = useDataContext();
  const userId = currentuser && currentuser.id;
  const [coupones, setCoupones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [contentSearch, setContentSearch] = useState("");
  const [selectCurrentData, setSelectCurrentData] = useState("DefaultData");
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFilteredDataByTitle = async (title: string, page: number) => {
    if (title.trim() === "") {
      setSearchResult([]);
      setSelectCurrentData("DefaultData"); // العودة إلى البيانات الأصلية
      return;
    }
    setSearchResult([]);
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
      return coupones;
    }

    // إذا لم تكن هناك نتائج حديثة، نعيد قائمة فارغة بدلًا من النتائج السابقة
    if (selectCurrentData === "SearchData" && searchResult.length === 0) {
      return [];
    }

    // إعادة النتائج عند البحث
    return selectCurrentData === "SearchData" ? searchResult : coupones;
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

  useEffect(() => {
    const getdata = async (page: number) => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/copones-for-account/${userId}/${type}?page=${page}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setCoupones(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) getdata(currentPage);
  }, [currentPage, userId]);

  const currentData = getCurrentData();
  const {
    currentPage: activePage,
    lastPage: activeLastPage,
    onPageChange,
  } = getPaginationData();

  if (loading) return <Loading />;

  return (
    <>
      <div className="w-full min-h-screen flex items-start gap-3 justify-between p-6 max-md:p-2 mt-20">
        {/* <div className="user-detiles w-[15%] p-1 self-center justify-center max-lg:hidden border-r min-h-screen">
          {currentuser && (
            <div className="flex flex-col gap-4 items-center shadow-md">
              <Img
                src={
                  currentuser.image
                    ? currentuser.image
                    : "/avatars/avatar_male.png"
                }
                className="w-20 h-20 rounded-full border shadow-md"
              />
              <p className="text-xl ">{currentuser.name || ""}</p>
            </div>
          )}
        </div> */}
        <div className="coupones max-lg:w-full flex-1 flex-grow">
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
          ) : coupones && currentData.length > 0 ? (
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-3  md:grid-cols-2 max-md:grid-cols-1 gap-8 max-md:gap-2 w-full min-h-[90vh]">
              {currentData.map((coupone, index) => (
                <CouponeCardPreview key={index} coupon={coupone} />
              ))}
            </div>
          ) : coupones.length == 0 ? (
            <div className="min-h-[90vh] w-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <MdSignalCellularNodata className="text-gray-400 size-56" />
                <p>
                  {language == "EN"
                    ? "There are no coupons for this account."
                    : "لا توجد كوبونات تخص هذا الحساب "}
                </p>
              </div>
            </div>
          ) : (
            <div className="min-h-[90vh] w-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <MdSignalCellularNodata className="text-gray-400 size-56" />
                <p>
                  {language == "EN"
                    ? "There are no coupons matching your search at this time."
                    : "لا توجد كوبونات مطابقة لعمليات البحث فى الوقت الحالى "}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Pagination
        currentPage={activePage}
        totalPages={activeLastPage}
        onPageChange={onPageChange}
      />
    </>
  );
}
