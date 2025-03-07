"use client";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";
import Loading from "../../Loading";
import { UseVariables } from "@/app/context/VariablesContext";
import { useDataContext } from "@/app/context/DataContext";
import Pagination from "../../PaginationComponent";
import OfferCard from "../_Couponsoffers/OfferCard";
import Img from "../../Img";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { motion } from "framer-motion";
import { MdSignalCellularNodata } from "react-icons/md";
import Link from "next/link";
import { CiSquarePlus } from "react-icons/ci";
import OfferPopup from "../_Couponsoffers/OfferPopup";

export default function CenteroffersComponent() {
  const { language } = UseVariables();
  const { currentuser } = useDataContext();
  const orgId = currentuser && currentuser.id;
  const [offers, setOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [organizationData, setOrganizationData] = useState<any>(null);
  const [contentSearch, setContentSearch] = useState("");
  const [selectCurrentData, setSelectCurrentData] = useState("DefaultData"); // DefaultData or SearchData
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});
  const toggleOpen = (offer: any) => {
    setIsOpen(true);
    setSelectedOffer(offer);
  };
  useEffect(() => {
    const getOffers = async (page: number) => {
      try {
        instance.post("/check-offer-date");
        const response = await instance.get(
          `/organization-offers/${orgId}?page=${page}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setOffers(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
          setOrganizationData(currentuser);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (orgId) getOffers(currentPage);
  }, [currentPage, orgId]);

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

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
      const response = await instance.post(
        `/offers-for-organization-by-search/${orgId}`,
        {
          content_search: contentSearch,
          page: page,
        }
      );
      if (response.status === 200) {
        const data = response.data.data;
        const pagination = response.data.pagination;
        setSearchResult(data);
        setSearchCurrentPage(pagination.current_page);
        setSearchLastPage(pagination.last_page);
      } else if (response.status == 404) {
        setSearchResult([]); // لا توجد بيانات
        console.log(response.status);
      }
    } catch (error: any) {
      if (error.response.status == 404) [setSearchResult([])];
      console.log(error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const handleSearchPageChange = (page: any) => {
    setSearchCurrentPage(page);
    getFilteredDataBySearch(contentSearch, page);
  };

  useEffect(() => {
    if (contentSearch.length === 0) {
      setSearchResult([]);
      if (searchResult.length == 0) {
        setSelectCurrentData("DefaultData");
      } else {
        setSelectCurrentData("FilterData");
      }
    }
  }, [contentSearch]);

  if (loading) return <Loading />;
  return (
    <>
      <div className="flex max-lg:flex-col  relative w-full mt-20 max-md:p-1 p-4  gap-6">
        {/* Sidebar for Organization Details */}
        {organizationData && (
          <div className="max-xl:hidden w-[20%] min-h-screen bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            {/* Organization Icon and Title */}
            <div className="flex flex-col items-center text-center">
              <Img
                src={
                  organizationData.icon ? organizationData.icon : "/logo.png"
                }
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4"
              />
              <h2
                style={{ overflowWrap: "anywhere" }}
                className="text-2xl my-4 font-bold text-gray-800 "
              >
                {language == "EN"
                  ? organizationData.title_en
                  : organizationData.title_ar}
              </h2>
            </div>

            {/* Organization Details */}
            <div className="space-y-4">
              {/* Phone Number */}
              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <FaPhone className="text-main_orange mr-3" />
                <span className="text-sm text-gray-700">
                  {organizationData.phone_number}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <FaEnvelope className="text-main_orange mr-3" />
                <span className="text-sm text-gray-700">
                  {organizationData.email}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-main_orange mr-3" />
                <span className="text-sm text-gray-700">
                  {JSON.parse(organizationData.location).address}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content for Services */}
        <div className="max-lg:w-full relative flex-1  flex-grow w-3/4">
          <Link
            href={`/addnewoffer?organization_title=${
              organizationData && formatTitle(organizationData?.title_en)
            }`}
            className=" text-white bg-sky-400 hover:bg-white hover:scale-110 hover:text-black hover:border-sky-400 border border-transparent duration-200 px-4 py-2 rounded-md shadow-md absolute max-md:relative  max-md:ml-auto max-md:mb-4 top-2 right-2 flex items-center  justify-center max-md:w-[90%] max-md:mx-auto  gap-4  "
          >
            <CiSquarePlus className="size-6" />
            <p>{language == "EN" ? "Add new offer" : "إضافة عرض جديد"}</p>
          </Link>
          <h1 className="text-2xl font-bold pb-3 border-b border-main_orange w-fit mx-auto mb-6">
            {language == "EN" ? "Center Offers" : "عروض المركز"}
          </h1>

          {/* Search Bar */}
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
                      ? "Find the offer here..."
                      : "إبحث عن العرض هنا  ..."
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

          {/* Display Services or Search Results */}
          {searchLoading ? (
            <div className="min-h-[80vh] flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                <LuSearch className="size-56 text-main_orange" />
              </motion.div>
            </div>
          ) : selectCurrentData === "SearchData" ? (
            searchResult.length === 0 ? (
              <div className="w-full min-h-[90vh] flex items-center justify-center">
                <div className="text-center flex flex-col gap-3 items-center justify-center text-gray-500">
                  <MdSignalCellularNodata className="size-64 text-gray-400" />
                  <p>
                    {language == "EN"
                      ? "There are no matching search results."
                      : "لا توجد نتائج بحث متطابقة."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid  max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-2 xl:grid-cols-3 2xl:max-md:grid-cols-4 gap-6 min-h-screen max-md:p-1 p-6">
                  {searchResult.map((offer: any, index) => (
                    <OfferCard
                      key={index}
                      index={index}
                      offer={offer}
                      toggleOpen={toggleOpen}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={searchCurrentPage}
                  totalPages={searchLastPage}
                  onPageChange={handleSearchPageChange}
                />
              </>
            )
          ) : offers.length === 0 ? (
            <div className="w-full min-h-[90vh] flex items-center justify-center">
              <div className="text-center flex flex-col gap-3 items-center justify-center text-gray-500">
                <p>
                  {language == "EN"
                    ? "There are no special offers at the center at the moment."
                    : "لا توجد عروض فى  خاصة بالمركز فى الوقت الحالى ."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-2 xl:grid-cols-3 2xl:max-md:grid-cols-4 gap-6 min-h-screen max-md:p-1 p-6">
                {offers.map((offer: any, index) => (
                  <OfferCard
                    key={index}
                    index={index}
                    offer={offer}
                    toggleOpen={toggleOpen}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={lastPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
      <OfferPopup
        isOpen={isOpen}
        onClose={() => setIsOpen((prev) => !prev)}
        offer={selectedOffer}
      />
    </>
  );
}
