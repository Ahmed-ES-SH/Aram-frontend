"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaImage,
  FaCalendarAlt,
  FaTag,
  FaPen,
  FaCheck,
  FaTimes,
  FaSearch,
  FaBarcode,
} from "react-icons/fa";
import { CiDiscount1, CiText } from "react-icons/ci";
import { BsCursorText } from "react-icons/bs";
import { UseVariables } from "@/app/context/VariablesContext";
import { useDataContext } from "@/app/context/DataContext";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Img from "@/app/_components/Img";
import { instance } from "@/app/Api/axios";
import Loading from "@/app/_components/Loading";
import { MdSignalCellularNodata } from "react-icons/md";
import PaginationWithoutNumbers from "@/app/_components/paginationWithOutnumbers";
import { LuSearch } from "react-icons/lu";

interface catgeorytype {
  id: any;
  title_en: string;
  title_ar: string;
}

export default function Page() {
  const { language } = UseVariables();
  const { allCategories, currentuser } = useDataContext();
  const orgId = currentuser && currentuser.id;
  const openInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    title_ar: "",
    title_en: "",
    image: null,
    description_ar: "",
    description_en: "",
    discount_value: "",
    start_date: "",
    end_date: "",
    category_id: "",
    code: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errors, setErrors] = useState<any>([]);
  const [status, setStatus] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>({});
  const [orgs, setOrgs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [contentSearch, setContentSearch] = useState("");
  const [selectCurrentData, setSelectCurrentData] = useState("DefaultData");
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files && files.length > 0) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formdata = new FormData();
      formdata.append("title_ar", form.title_ar);
      formdata.append("title_en", form.title_en);
      formdata.append("image", form.image);
      formdata.append("description_ar", form.description_ar);
      formdata.append("description_en", form.description_en);
      formdata.append("discount_value", form.discount_value);
      formdata.append("start_date", form.start_date);
      formdata.append("end_date", form.end_date);
      formdata.append("is_active", status ? "1" : "0");
      formdata.append("organization_id", selectedOrg.id);
      formdata.append("category_id", selectedCategories[0]);
      formdata.append("code", form.code);

      const response = await instance.post("/add-offer", formdata);
      if (response.status == 201) {
        setShowSuccessPopup(true);
        setForm({
          title_ar: "",
          title_en: "",
          image: "",
          description_ar: "",
          description_en: "",
          discount_value: "",
          start_date: "",
          end_date: "",
          category_id: "",
        });
        setSelectedCategories([]);
        setSelectedOrg({});
        setStatus(false);
      }
    } catch (error: any) {
      setErrors(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (status: boolean) => {
    setStatus(status);
  };

  const toggleCategory = (category: catgeorytype) => {
    if (selectedCategories.includes(category.id)) {
      // إزالة القسم إذا كان هو نفسه الذي تم تحديده
      setSelectedCategories([]);
    } else {
      // استبدال القسم الحالي بالقسم الجديد
      setSelectedCategories([category.id]);
    }
  };

  const getFilteredDataByTitle = async (title: string, page: number) => {
    if (title.trim() === "") {
      setSearchResult([]);
      setSelectCurrentData("DefaultData"); // العودة إلى البيانات الأصلية
      return;
    }
    setSelectCurrentData("SearchData");
    try {
      setIsSearching(true);
      const response = await instance.get(
        `/organizations-by-title/${encodeURIComponent(title)}?page=${page}`
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

  const generateRandomCode = (length: number = 10) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setForm({ ...form, code: code });
  };

  const getCurrentData = () => {
    // إذا كان الحقل فارغًا، نعرض البيانات الافتراضية
    if (contentSearch.length === 0) {
      return orgs;
    }

    // إذا لم تكن هناك نتائج حديثة، نعيد قائمة فارغة بدلًا من النتائج السابقة
    if (selectCurrentData === "SearchData" && searchResult.length === 0) {
      return [];
    }

    // إعادة النتائج عند البحث
    return selectCurrentData === "SearchData" ? searchResult : orgs;
  };

  useEffect(() => {
    if (contentSearch.length === 0) {
      setSearchResult([]); // تفريغ النتائج عند إزالة البحث
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

  const selectOrg = (org: any) => {
    setSelectedOrg(org);
  };

  useEffect(() => {
    const getOrgs = async (page: number) => {
      try {
        setIsSearching(true);
        const response = await instance.get(
          `/published-organiztions-with-selected-data?page=${page}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setOrgs(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
          setIsSearching(false);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };
    getOrgs(currentPage);
  }, [currentPage]);

  const currentData = getCurrentData();
  const {
    currentPage: activePage,
    lastPage: activeLastPage,
    onPageChange,
  } = getPaginationData();

  if (loading) return <Loading />;

  return (
    <motion.div
      style={{ direction: "rtl" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen mt-12 flex items-center justify-center bg-gray-50 py-12 px-4 max-md:px-1 sm:px-6 lg:px-8"
    >
      <div className="min-w-2xl w-full space-y-8 bg-white border dark:border-gray-700 p-8 max-md:p-2 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {"إنشاء عرض جديد"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {"يرجى ملء النموذج أدناه لإضافة عرض جديد"}
          </p>
        </div>
        <form className="mt-8 " onSubmit={handleSubmit}>
          <input
            ref={openInput}
            id="image"
            name="image"
            type="file"
            className="hidden"
            onChange={handleChange}
          />
          <div className="rounded-md shadow-sm flex flex-col gap-3">
            {/* صورة */}
            {form.image ? (
              form.image instanceof File && (
                <div className="flex items-center justify-center">
                  <div className="flex flex-col  overflow-hidden group items-center justify-center w-full h-52 border-2 relative border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <Img
                      src={URL.createObjectURL(form.image)}
                      className="w-full h-full object-cover"
                    />
                    <div
                      onClick={() => openInput.current.click()}
                      className="w-8 h-8 absolute bottom-2 group-hover:left-2 -left-40 text-white bg-sky-400 flex items-center justify-center rounded-md shadow-md cursor-pointer hover:scale-110 duration-150 hover:outline-sky-500"
                    >
                      <FaPen className="size-5" />
                    </div>
                  </div>
                </div>
              )
            ) : (
              <>
                <div
                  onClick={() => openInput.current.click()}
                  className="flex items-center justify-center"
                >
                  <div className="flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <FaImage className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500">{"إختر صورة "}</p>
                  </div>
                </div>
                {errors && errors["image"] && (
                  <p className="text-red-400 my-3">
                    {errors["image"][0]["Ar"]}
                  </p>
                )}
              </>
            )}
            {/* عنوان بالعربية */}
            <div>
              <label
                htmlFor="title_ar"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {"العنوان بالعربية"}
              </label>
              <div className="flex items-center gap-2">
                <CiText className="w-5 h-5 text-gray-400 max-md:hidden " />
                <input
                  id="title_ar"
                  name="title_ar"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="العنوان بالعربية"
                  value={form.title_ar}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["title_ar"] && (
                <p className="text-red-400 my-3">
                  {errors["title_ar"][0]["AR"]}
                </p>
              )}
            </div>

            {/* عنوان بالإنجليزية */}
            <div>
              <label
                htmlFor="title_en"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {"العنوان بالإنجليزية"}
              </label>
              <div className="flex items-center gap-2">
                <CiText className="w-5 h-5 text-gray-400 max-md:hidden " />
                <input
                  id="title_en"
                  name="title_en"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="العنوان بالإنجليزية"
                  value={form.title_en}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["title_en"] && (
                <p className="text-red-400 my-3">
                  {errors["title_en"][0]["AR"]}
                </p>
              )}
            </div>
            {/* وصف بالعربية */}
            <div>
              <label
                htmlFor="description_ar"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {"الوصف بالعربية"}
              </label>
              <div className="flex items-center gap-2">
                <BsCursorText className="w-5 h-5 text-gray-400 max-md:hidden " />
                <textarea
                  id="description_ar"
                  name="description_ar"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="الوصف بالعربية"
                  value={form.description_ar}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["description_ar"] && (
                <p className="text-red-400 my-3">
                  {errors["description_ar"][0]["AR"]}
                </p>
              )}
            </div>
            {/* وصف بالإنجليزية */}
            <div>
              <label
                htmlFor="description_en"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {"الوصف بالإنجليزية"}
              </label>
              <div className="flex items-center gap-2">
                <BsCursorText className="w-5 h-5 text-gray-400 max-md:hidden " />
                <textarea
                  id="description_en"
                  name="description_en"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="الوصف بالإنجليزية"
                  value={form.description_en}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["description_en"] && (
                <p className="text-red-400 my-3">
                  {errors["description_en"][0]["AR"]}
                </p>
              )}
            </div>

            {/* قيمة الخصم */}
            <div>
              <label
                htmlFor="discount_value"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {"قيمة الخصم"}
              </label>
              <div className="flex items-center gap-2">
                <CiDiscount1 className="w-5 h-5 text-gray-400 max-md:hidden " />
                <input
                  id="discount_value"
                  name="discount_value"
                  type="number"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="قيمة الخصم"
                  value={form.discount_value}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["discount_value"] && (
                <p className="text-red-400 my-3">
                  {errors["discount_value"][0]["AR"]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="end_date"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {"كود العرض"}
              </label>
              <div className="flex items-center gap-2 relative">
                <FaBarcode className="w-5 h-5 text-gray-400 max-md:hidden " />
                <input
                  id="code"
                  name="code"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={form.code}
                  onChange={handleChange}
                />
                <div
                  onClick={() => generateRandomCode(10)}
                  className="px-4 py-2 cursor-pointer  shadow-sm text-center bg-main_orange duration-150 text-white whitespace-nowrap text-[14px] absolute left-0 top-1/2 -translate-y-1/2 hover:bg-white hover:text-black hover:border-main_orange border border-transparent"
                >
                  إنشاء كود عشوائى
                </div>
              </div>
              {errors && errors["code"] && (
                <p className="text-red-400 my-3">{errors["code"][0]["AR"]}</p>
              )}
            </div>
            {/* تاريخ البدء */}
            <div>
              <label
                htmlFor="start_date"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {"تاريخ البدء"}
              </label>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5 text-gray-400 max-md:hidden " />
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={form.start_date}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["start_date"] && (
                <p className="text-red-400 my-3">
                  {errors["start_date"][0]["AR"]}
                </p>
              )}
            </div>
            {/* تاريخ الانتهاء */}
            <div>
              <label
                htmlFor="end_date"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {"تاريخ الانتهاء"}
              </label>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5 text-gray-400 max-md:hidden " />
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={form.end_date}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["end_date"] && (
                <p className="text-red-400 my-3">
                  {errors["end_date"][0]["AR"]}
                </p>
              )}
            </div>
            {/* الفئة */}
            <div>
              <div className="flex items-center gap-2 my-2 w-fit pb-3 border-b border-main_orange">
                <FaTag className="w-5 h-5 text-gray-400 max-md:hidden " />
                <label htmlFor="category_id">{"الفئة"}</label>
              </div>
              {errors && errors["category_id"] && (
                <p className="text-red-400 my-3">
                  {errors["category_id"][0]["AR"]}
                </p>
              )}
              {allCategories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allCategories.map((category: any, index: number) => (
                    <motion.div
                      key={category.id}
                      onClick={() => toggleCategory(category)}
                      className={`p-3 rounded-md  cursor-pointer border transition duration-200 ${
                        selectedCategories.includes(category.id)
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-white"
                      } hover:shadow-md`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {category.title_ar} / {category.title_en}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.p
                  className="text-gray-500 dark:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {"تحميل الأقسام ..."}
                </motion.p>
              )}
            </div>
          </div>

          {/* start orgs section */}
          <label className="block mb-3 mt-7 text-lg pb-2 border-b w-fit mx-auto border-main_orange">
            حدد المركز صاحب الكوبون
          </label>
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
                <div
                  onClick={() =>
                    getFilteredDataByTitle(contentSearch, searchCurrentPage)
                  }
                  className={`px-6 py-2 cursor-pointer hover:text-white text-cenetr rounded-md shadow-md border border-main_orange hover:bg-orange-400 duration-200 ${
                    contentSearch.length > 0
                      ? "opacity-100 block"
                      : "opacity-0 cursor-auto hidden"
                  }`}
                >
                  {"بحث"}
                </div>
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
          ) : currentData.length > 0 ? (
            <div className="w-full  grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3  max-md:grid-cols-2 gap-8 max-md:gap-2 ">
              {orgs &&
                currentData.map((org: any, index) => (
                  <div
                    onClick={() => selectOrg(org)}
                    key={index}
                    className={`flex flex-col items-center h-fit gap-3 py-4 px-2 rounded-md shadow-sm border relative cursor-pointer   duration-200 ${
                      selectedOrg && selectedOrg.id == org.id
                        ? "bg-sky-400 text-white"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <Img
                      className="w-14 h-14 rounded-full"
                      src={org.icon ? org.icon : "/public"}
                    />
                    <p className="text-[17px] whitespace-nowrap max-md:text-[11px]">
                      {org.title_en && org.title_en.length > 25
                        ? org.title_en.slice(0, 25) + "..."
                        : org.title_en}
                    </p>
                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center border shadow-sm absolute bottom-2 right-2 cursor-pointer">
                      {
                        <div
                          className={`w-3 h-3 rounded-full ${
                            selectedOrg.id == org.id
                              ? " opacity-100"
                              : "opacity-0"
                          } duration-200 bg-sky-400 `}
                        ></div>
                      }
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="min-h-[50vh] w-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <MdSignalCellularNodata className="text-gray-400 size-24" />
                <p>لا توجد مراكز طبية مطابقة لعمليات البحث فى الوقت الحالى </p>
              </div>
            </div>
          )}
          {currentData.length > 0 && !isSearching && (
            <PaginationWithoutNumbers
              currentPage={activePage}
              totalPages={activeLastPage}
              onPageChange={onPageChange}
            />
          )}

          {errors && errors["organization_id"] && (
            <p className="text-red-400 my-3">
              {errors["organization_id"][0]["AR"]}
            </p>
          )}

          <div className="mt-4">
            <label className="my-2 block w-fit pb-2 border-b border-main_orange">
              حالة العرض
            </label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <motion.div
                className={`p-4 rounded-lg cursor-pointer flex flex-col items-center justify-center ${
                  status
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-gray-100 border-2 border-gray-300"
                }`}
                onClick={() => toggleStatus(true)}
                whileHover={{ scale: 1.05 }}
              >
                <FaCheck className="text-green-500 text-2xl" />
                <span className="mt-2 text-sm text-gray-700">عام</span>
              </motion.div>
              <motion.div
                className={`p-4 rounded-lg cursor-pointer flex flex-col items-center justify-center ${
                  !status
                    ? "bg-red-100 border-2 border-red-500"
                    : "bg-gray-100 border-2 border-gray-300"
                }`}
                onClick={() => toggleStatus(false)}
                whileHover={{ scale: 1.05 }}
              >
                <FaTimes className="text-red-500 text-2xl" />
                <span className="mt-2 text-sm text-gray-700">خاص</span>
              </motion.div>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="group mt-4 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-main_orange hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
            >
              {"إرسال"}
            </motion.button>
          </div>
        </form>
      </div>
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => setShowSuccessPopup((prev) => !prev)}
          message={"تم اضافة العرض الى قائمة العروض بنجاح ."}
        />
      )}
    </motion.div>
  );
}
