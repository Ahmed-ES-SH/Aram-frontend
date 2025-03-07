"use client";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";
import { MdSignalCellularNodata } from "react-icons/md";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaFile, FaKey, FaSearch } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaIdCard,
} from "react-icons/fa";
import Pagination from "../PaginationComponent";
import Loading from "../Loading";
import { GrStatusGood } from "react-icons/gr";
import Img from "../Img";

export default function OrgsWithCooperationFiles() {
  const [Orgs, setOrgs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastpage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [selectCurrentData, setSelectCurrentData] = useState("DefaultData");
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [contentSearch, setContentSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrgs, setSelectedOrgs] = useState<any>([]); // حالة لتخزين المستخدمين المحددين

  useEffect(() => {
    const getdata = async (page: number) => {
      try {
        const response = await instance.get(
          `/organizations-by-verfiy?page=${page}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setOrgs(data);
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
      const response = await instance.post(
        `/search-by-title-for-organization/${contentSearch}?page=${page}`
      );
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

  // تحديد البيانات الحالية للعرض
  const getCurrentData = () => {
    if (selectCurrentData === "SearchData" && contentSearch.length > 0) {
      return searchResult; // عرض نتائج البحث إذا كانت موجودة
    }
    return Orgs; // عرض البيانات الافتراضية
  };

  // إعادة تعيين نتائج البحث إذا تم مسح حقل البحث
  useEffect(() => {
    if (contentSearch.trim() === "") {
      setSearchResult([]);
      setSelectCurrentData("DefaultData");
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

  const handleDownloadFile = async (id: number) => {
    try {
      const response = await instance.get(`/download-cooperation-file/${id}`, {
        responseType: "blob", // تحديد نوع الاستجابة كـ blob (ملف)
      });

      // إنشاء رابط URL للملف
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "cooperation_agreement.pdf"; // اسم الملف عند التحميل
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.log(error);
    }
  };

  const currentData = getCurrentData();
  const {
    currentPage: activePage,
    lastPage: activeLastPage,
    onPageChange,
  } = getPaginationData();

  if (loading) return <Loading />;

  return (
    <>
      <div className="w-full min-h-screen p-6 max-md:p-2 ">
        <h1 className="text-2xl max-md:text-[17px] w-fit mx-auto pb-3 border-b border-main_orange">
          إتفاقيات المراكز الطبية
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
                placeholder={"إبحث عن المركز هنا  ..."}
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
        ) : Orgs && currentData.length > 0 ? (
          <motion.div
            className="overflow-auto p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-auto">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4  text-right">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <FaUser className="inline-block mr-2" />
                      الشعار
                    </div>
                  </th>
                  <th className="py-3 px-4  text-right">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <FaUser className="inline-block mr-2" />
                      الإسم
                    </div>
                  </th>
                  <th className="py-3 px-4  text-right">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <FaEnvelope className="inline-block mr-2" />
                      البريد الإلكترونى
                    </div>
                  </th>
                  <th className="py-3 px-4  text-right">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <GrStatusGood className="inline-block mr-2" />
                      حالة التفعيل
                    </div>
                  </th>
                  <th className="py-3 px-4  text-right">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <FaCalendar className="inline-block mr-2" />
                      وقت إنشاء الحساب
                    </div>
                  </th>
                  <th className="py-3 px-4  text-right">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <FaFile className="inline-block mr-2" />
                      ملف الاتفاقية
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentData.map((org: any) => (
                  <motion.tr
                    key={org.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`border-b border-gray-200 ${
                      selectedOrgs.includes(org.id)
                        ? "bg-blue-50"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <td className="py-3 px-4">
                      <Img
                        src={org.icon ? org.icon : "/logo.png"}
                        className="w-12 h-12 rounded-full"
                      />
                    </td>
                    <td className="py-3 px-4">{org.title_en}</td>
                    <td className="py-3 px-4">{org.email}</td>
                    <td className="py-3 px-4">
                      {org.email_verified_at ? (
                        <span className="px-2 py-1 text-white bg-green-300 rounded-md shadow-sm text-center">
                          مفعل
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-white bg-red-300 rounded-md shadow-sm text-center">
                          غير مفعل
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {new Date(org.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {org.cooperation_file ? (
                        <p
                          onClick={() => handleDownloadFile(org.id)}
                          className="text-green-300 underline underline-green-400 cursor-pointer"
                        >
                          تحميل الملف
                        </p>
                      ) : (
                        <p className="text-red-300 underline underline-red-400 cursor-not-allowed">
                          لم يتم رفع الملف الى الأن !
                        </p>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : Orgs.length == 0 ? (
          <div className="min-h-[90vh] w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <MdSignalCellularNodata className="text-gray-400 size-56" />
              <p>لا يوجد مستخدمين فى قاعدة البيانات حتى الان </p>
            </div>
          </div>
        ) : (
          <div className="min-h-[90vh] w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <MdSignalCellularNodata className="text-gray-400 size-56" />
              <p>لا يوجد مستخدمين تطابق لعمليات البحث فى الوقت الحالى </p>
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
