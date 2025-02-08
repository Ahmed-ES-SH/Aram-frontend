"use client";
import { instance } from "@/app/Api/axios";
import { useDataContext } from "@/app/context/DataContext";
import React, { useEffect, useState } from "react";
import Loading from "../../Loading";
import AffiliateServiceCard from "./AffiliateServiceCard";
import { FaClock, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Pagination from "../../PaginationComponent";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import { LuFilePlus, LuSearch } from "react-icons/lu";
import { motion } from "framer-motion";
import { MdOutlineAddToPhotos } from "react-icons/md";

export default function MyAffiliateservices() {
  const { currentuser } = useDataContext();
  const { language } = UseVariables();
  const orgId = currentuser && currentuser.id;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [services, setServices] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [organizationData, setOrganizationData] = useState<any>(null);
  const [contentSearch, setContentSearch] = useState("");
  const [selectCurrentData, setSelectCurrentData] = useState("DefaultData"); // DefaultData or SearchData

  useEffect(() => {
    const getServices = async () => {
      try {
        const response = await instance.get(
          `/organization-affiliate-services/${orgId}?page=${currentPage}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setServices(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    setOrganizationData(currentuser);
    getServices();
  }, [currentPage, orgId]);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const handleSearchPageChange = (page: any) => {
    setSearchCurrentPage(page);
    getFilteredDataBySearch(contentSearch, page);
  };

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
        `/affiliate-services-for-organization-by-search/${orgId}`,
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
      } else if (response.status === 404) {
        setSearchResult([]); // لا توجد بيانات
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setSearchLoading(false);
    }
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
    <div className="flex max-lg:flex-col  relative w-full mt-20 p-4 max-md:p-2 gap-6">
      {/* Sidebar for Organization Details */}
      {organizationData && (
        <div className="max-xl:hidden w-[20%] min-h-screen bg-white shadow-xl rounded-xl p-6 border border-gray-100">
          {/* Organization Icon and Title */}
          <div className="flex flex-col items-center text-center">
            <Img
              src={organizationData.icon ? organizationData.icon : "/logo.png"}
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
      <div className="max-lg:w-full flex-1  flex-grow w-3/4">
        <h1 className="text-2xl font-bold pb-3 border-b border-main_orange w-fit mx-auto mb-6">
          {language == "EN" ? "Center Services" : "خدمات المركز"}
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
            <div className="text-center text-gray-500">
              <p>لا توجد نتائج بحث متطابقة.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2  max-xl:grid-cols-3 2xl:grid-cols-4 gap-6 min-h-screen p-6">
                {searchResult.map((service: any, index) => (
                  <AffiliateServiceCard
                    key={index}
                    index={index}
                    service={service}
                    direct="myaffiliateservices"
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
        ) : services.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>لا توجد خدمات متاحة حاليًا.</p>
          </div>
        ) : (
          <>
            <div className="grid max-sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 min-h-screen p-6">
              {services.map((service: any, index) => (
                <AffiliateServiceCard
                  key={index}
                  index={index}
                  service={service}
                  direct="myaffiliateservices"
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
  );
}
