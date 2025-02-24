"use client";
import OfferCardDash from "@/app/_components/_dashboard/_offers/OfferCardDash";
import OfferPopupDash from "@/app/_components/_dashboard/_offers/OfferPopupDash";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LuSearch } from "react-icons/lu";
import { MdSignalCellularNodata } from "react-icons/md";

export default function Page() {
  const [offers, setOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [contentSearch, setContentSearch] = useState("");
  const [searchReasult, setSearchReasult] = useState([]);
  const [selectedData, setSelectedData] = useState("Deafult");

  const onClose = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleOpen = (offer: any) => {
    setIsOpen(true);
    setSelectedOffer(offer);
  };

  const handlePageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };
  const handleSearchPageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= searchLastPage) {
      setSearchCurrentPage(newPage);
    }
  };

  const [isFirstLoad, setIsFirstLoad] = useState(true); // تتبع أول تحميل

  useEffect(() => {
    const getOffers = async (page: number) => {
      try {
        setLoading(true);
        const response = await instance.get(`/all-offers?page=${page}`);
        if (response.status === 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setOffers(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
        setIsFirstLoad(false);
      }
    };

    getOffers(currentPage);
  }, [currentPage, isFirstLoad]);

  useEffect(() => {
    if (!isFirstLoad) {
      window.scrollTo(0, 590);
    }
  }, [currentPage]);

  const getFilteredDataBySearch = async (
    contentSearch: string,
    searchCurrentPage: any
  ) => {
    try {
      setLoading(true);
      setSelectedData("searchData");
      const response = await instance.post(
        `/offers-by-search?page=${searchCurrentPage}`,
        { content_search: contentSearch }
      );
      if (response.status == 200) {
        const data = response.data.data;
        const pagination = response.data.pagination;
        setSearchReasult(data);
        setSearchCurrentPage(pagination.current_page);
        setSearchLastPage(pagination.last_page);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contentSearch.length == 0) {
      setSelectedData("Default");
    }
  }, [contentSearch]);

  const currentData = selectedData == "Default" ? offers : searchReasult;

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
    <div style={{ direction: "ltr" }}>
      {currentData.length > 0 ? (
        <div className="min-h-screen w-full">
          <div
            style={{ direction: "rtl" }}
            className="inputsearch  mb-5 mt-2 flex items-center gap-2 relative w-[50%] max-lg:w-3/4 max-md:w-[97%] mx-auto"
          >
            <div className="flex items-center w-full gap-2 max-md:flex-col ">
              <div className="relative bg-white rounded-md shadow-md h-[40px] flex items-center justify-center w-full">
                <LuSearch className="absolute right-2 top-1/2 text-secend_text size-5 transform -translate-y-1/2" />
                <input
                  type="text"
                  onChange={(e) => setContentSearch(e.target.value)}
                  name="titlesearch"
                  value={contentSearch}
                  placeholder="إبحث عن العرض هنا ..."
                  className="w-[90%] bg-transparent h-full pr-9 px-4 py-2 outline-none placeholder-shown:px-4 placeholder-shown:py-2 placeholder-shown:pr-9 placeholder-shown:text-[18px]"
                />
              </div>
              <button
                onClick={() =>
                  getFilteredDataBySearch(contentSearch, searchCurrentPage)
                }
                className={`px-6 py-2 hover:text-white text-center rounded-md shadow-md border border-main_orange hover:bg-orange-400 duration-200 ${
                  contentSearch.length > 0
                    ? "opacity-100 block"
                    : "opacity-0 cursor-auto hidden"
                }`}
              >
                بحث
              </button>
            </div>
          </div>

          <div className="w-full  overflow-hidden max-md:p-2 mx-auto p-6 grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 max-xl:grid-cols-3 max-lg:gap-4 gap-8">
            {currentData.map((offer, index) => (
              <OfferCardDash
                toggleOpen={toggleOpen}
                key={index}
                offer={offer}
                index={index}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center w-full bg-gray-50 rounded-lg p-6 shadow-md">
          <MdSignalCellularNodata className="text-gray-300 size-64" />
          <p className="text-gray-600 text-lg font-semibold">
            عفوا، لا توجد عروض أو كوبونات مطابقة لعملية البحث
          </p>
          <button
            onClick={() => setContentSearch("")}
            className="mt-4 px-6 py-2 bg-main_orange text-white rounded-md shadow-md hover:bg-orange-500 transition"
          >
            عرض جميع العروض
          </button>
        </div>
      )}

      {currentData.length > 0 && (
        <Pagination
          currentPage={
            selectedData == "Default" ? currentPage : searchCurrentPage
          }
          totalPages={selectedData == "Default" ? lastPage : searchLastPage}
          onPageChange={
            selectedData == "Default"
              ? handlePageChange
              : handleSearchPageChange
          }
        />
      )}

      <OfferPopupDash
        setShowSuccessPopup={setIsPopupVisible}
        isOpen={isOpen}
        onClose={onClose}
        offer={selectedOffer}
      />
      {isPopupVisible && (
        <SuccessPopup
          message="تمت العملية بنجاح!"
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </div>
  );
}
