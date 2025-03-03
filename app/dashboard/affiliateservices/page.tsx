"use client";
import React, { useEffect, useState } from "react";
import AffiliateServiceCard from "@/app/_components/_website/_affiliate_services/AffiliateServiceCard";
import Loading from "@/app/_components/Loading";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import { BiSolidError } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { GiTireIronCross } from "react-icons/gi";
import { LuSearch } from "react-icons/lu";
import {
  MdCheckCircle,
  MdErrorOutline,
  MdOutlineSignalCellularNodata,
} from "react-icons/md";

export default function AffiliateServices() {
  const [allServices, setAllServices] = useState([]); // تخزين جميع البيانات
  const [services, setServices] = useState([]); // البيانات المعروضة حالياً
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [contentSearch, setContentSearch] = useState("");
  const [selectCurrentData, setSelectCurrentData] = useState("DefaultData");
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // إضافة حالة الفلتر
  const [filterStatus, setFilterStatus] = useState<
    "all" | "waiting" | "done" | "updated"
  >("all");

  useEffect(() => {
    if (contentSearch.length === 0) {
      setSearchResult([]);
      setSelectCurrentData("DefaultData");
    }
  }, [contentSearch]);

  // دالة لجلب جميع البيانات عند التحميل الأولي
  const getAllData = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/all-affiliate-services`);
      if (response.status === 200) {
        const data = response.data.data;
        setAllServices(data); // تخزين جميع البيانات
        setServices(data); // تعيين البيانات المعروضة حالياً
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // دالة لجلب البيانات بناءً على الحالة
  const getDataByStatus = async (status: string, page: number = 1) => {
    try {
      setLoading(true);
      const response = await instance.get(
        `/all-affiliate-services-by-status/${status}?page=${page}`
      );
      if (response.status === 200) {
        const data = response.data.data;
        const pagination = response.data.pagination;
        setServices(data);
        setCurrentPage(pagination.current_page);
        setLastPage(pagination.last_page);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // استدعاء البيانات عند تغيير الحالة أو الصفحة
  useEffect(() => {
    if (filterStatus === "all") {
      setServices(allServices); // عرض جميع البيانات المخزنة
    } else {
      getDataByStatus(filterStatus, currentPage); // جلب البيانات من الـ API
    }
  }, [filterStatus, currentPage]);

  // جلب جميع البيانات عند التحميل الأولي
  useEffect(() => {
    getAllData();
  }, []);

  const getFilteredDataBySearch = async (
    contentSearch: string,
    page: number = 1
  ) => {
    try {
      if (contentSearch.trim() === "") {
        setSearchResult([]);
        setSelectCurrentData("DefaultData");
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
        setSelectCurrentData("SearchData");
      } else if (response.status === 404) {
        setSearchResult([]);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const getCurrentData = () => {
    if (contentSearch.length === 0) {
      return services; // عرض البيانات الافتراضية
    }
    return searchResult; // عرض نتائج البحث
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
      default:
        return {
          currentPage: currentPage,
          lastPage: lastPage,
          onPageChange: (newPage: number) => {
            setCurrentPage(newPage);
            if (filterStatus !== "all") {
              getDataByStatus(filterStatus, newPage);
            }
          },
        };
    }
  };

  const paginationData = getPaginationData();
  const currentData = getCurrentData();

  if (loading) return <Loading />;

  return (
    <>
      <div style={{ direction: "ltr" }} className="w-full">
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
                placeholder={"إبحث عن الخدمة هنا  ..."}
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
                {"بحث"}
              </button>
            }
          </div>
        </div>

        {/* إضافة واجهة الفلتر */}
        {/* <div className="flex justify-center gap-4 max-md:flex-wrap mb-6">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-md ${
              filterStatus === "all"
                ? "bg-main_orange text-white"
                : "bg-gray-200"
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilterStatus("waiting")}
            className={`px-4 py-2 rounded-md ${
              filterStatus === "waiting"
                ? "bg-yellow-400 text-white"
                : "bg-gray-200"
            }`}
          >
            فى انتظار التحقق
          </button>
          <button
            onClick={() => setFilterStatus("done")}
            className={`px-4 py-2 rounded-md ${
              filterStatus === "done"
                ? "bg-green-400 text-white"
                : "bg-gray-200"
            }`}
          >
            تم التحقق
          </button>
          <button
            onClick={() => setFilterStatus("updated")}
            className={`px-4 py-2 rounded-md ${
              filterStatus === "updated"
                ? "bg-blue-400 text-white"
                : "bg-gray-200"
            }`}
          >
            تم التحديث
          </button>
        </div> */}

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
            <div className="affiliate-services p-6 max-md:p-2 max-md:w-[95%] min-h-screen mx-auto my-4 h-full flex-1 flex-grow grid xl:grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2  max-sm:grid-cols-1 gap-4 gap-y-12 max-md:gap-y-5 justify-items-center items-start">
              {currentData.map((service: any, index) => {
                const cardVariants = {
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.2 },
                  },
                };
                return (
                  <div className=" relative group  w-full" key={index}>
                    <AffiliateServiceCard
                      key={index}
                      index={index}
                      service={service}
                      direct="dashboard/affiliateservices"
                    />
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className={`${
                        service.status ? "bg-green-400" : "bg-red-400"
                      } px-2 py-1 z-50 group-hover:scale-110 duration-300 flex items-center gap-2 text-white rounded-md shadow-md absolute bottom-2 right-2 text-center`}
                    >
                      {service.status == "1" ? (
                        <MdCheckCircle className="size-4 text-green-500" />
                      ) : (
                        <GiTireIronCross className="size-4 text-red-500" />
                      )}
                      <p>
                        {service.status == "1" ? "تم النشر" : "لم يتم النشر"}
                      </p>
                    </motion.div>
                    {/* <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className={`${
                        service.check_status == "done"
                          ? "bg-green-400"
                          : service.check_status == "waiting"
                          ? "bg-yellow-300"
                          : "bg-red-400"
                      } px-2 py-1 z-50 group-hover:scale-110 duration-300 flex items-center gap-2 text-white rounded-md shadow-md absolute top-2 right-2 text-center`}
                    >
                      {service.check_status == "done" ? (
                        <MdCheckCircle className="size-4 text-green-500" />
                      ) : service.check_status == "waiting" ? (
                        <MdErrorOutline className="size-4 text-yellow-500" />
                      ) : (
                        <BiSolidError className="size-4 text-red-500" />
                      )}
                      <p>
                        {service.check_status == "done"
                          ? "تم التحقق"
                          : service.check_status == "waiting"
                          ? "فى انتظار التحقق"
                          : "تم تحديثها وفى انتظار التحقق"}
                      </p>
                    </motion.div> */}
                  </div>
                );
              })}
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
            <p>{"عفوا لا يوجد بيانات تطابق عملية البحث الخاصة بك  ."}</p>
          </div>
        )}
      </div>
    </>
  );
}
