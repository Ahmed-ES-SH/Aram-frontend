"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaUpload, FaDollarSign, FaClock, FaHeading } from "react-icons/fa6";
import { FaCheck, FaInfoCircle, FaSearch } from "react-icons/fa";
import { UseVariables } from "@/app/context/VariablesContext";
import Img from "../../Img";
import { CiCalendarDate } from "react-icons/ci";
import { instance } from "@/app/Api/axios";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import Loading from "../../Loading";
import { LuSearch } from "react-icons/lu";
import PaginationWithoutNumbers from "../../paginationWithOutnumbers";
import { MdSignalCellularNodata } from "react-icons/md";
import { GiTireIronCross } from "react-icons/gi";

export default function AddAffiliateCard() {
  const { language } = UseVariables();
  const openinput = useRef<any>(null);
  const [cardData, setCardData] = useState<any>({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    price_before_discount: "",
    price: "",
    features_ar: ["", "", ""],
    features_en: ["", "", ""],
    duration: "",
    status: "",
  });
  const [durationerror, setdurationerror] = useState<string | null>(null);

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (value > 12) {
      setdurationerror(
        language === "EN"
          ? "Duration cannot exceed 12 months"
          : "لا يمكن أن تتجاوز المدة 12 شهرًا"
      );
    } else {
      setdurationerror(null);
    }

    handleChange(e); // استدعاء الدالة الأصلية لتحديث البيانات
  };
  const [image, setImage] = useState<null | File>(null);
  const [error, setError] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<any>({});
  const [contentSearch, setContentSearch] = useState("");
  const [selectCurrentData, setSelectCurrentData] = useState("DefaultData");
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchLastPage, setSearchLastPage] = useState(1);
  const [errorArrayMessage, setErrorArrayMessage] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const handleChange = (e: any) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index: any, lang: any, value: any) => {
    const updatedFeatures = [...cardData[lang]];
    updatedFeatures[index] = value;
    setCardData({ ...cardData, [lang]: updatedFeatures });
  };

  const addFeature = (lang: any) => {
    if (cardData[lang].length >= 5) {
      setError("لا يمكنك إضافة أكثر من 5 ميزات");
      return;
    }
    setError("");
    setCardData({ ...cardData, [lang]: [...cardData[lang], ""] });
  };

  const removeFeature = (index: any, lang: any) => {
    if (cardData[lang].length <= 3) {
      setError("يجب أن تحتوي البطاقة على 3 ميزات على الأقل");
      return;
    }
    const updatedFeatures = cardData[lang].filter(
      (_: any, i: any) => i !== index
    );
    setCardData({ ...cardData, [lang]: updatedFeatures });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const cleanArray = (arr: any) => {
    return arr.filter(
      (item: any) =>
        item !== null &&
        item !== undefined &&
        item !== "" &&
        (typeof item !== "object" || Object.keys(item).length > 0)
    );
  };

  const handlesubmit = async () => {
    try {
      if (cardData.duration > 12) {
        return null;
      }
      setErrorArrayMessage("");
      setError("");
      const filteredFeaturesAr = cleanArray(cardData.features_ar);
      const filteredFeaturesEn = cleanArray(cardData.features_en);

      if (filteredFeaturesAr.length < 3 || filteredFeaturesEn.length < 3) {
        setErrorArrayMessage("يجب إدخال 3 ميزات على الأقل لكل لغة.");
        return; // إيقاف التنفيذ
      }

      const formdata: any = new FormData();
      formdata.append("title_en", cardData.title_en);
      formdata.append("title_ar", cardData.title_ar);
      formdata.append("description_ar", cardData.description_ar);
      formdata.append("description_en", cardData.description_en);
      formdata.append("duration", cardData.duration);
      formdata.append("price_before_discount", cardData.price_before_discount);
      formdata.append("price", cardData.price);
      if (filteredFeaturesAr.length > 0) {
        formdata.append("features_ar", JSON.stringify(filteredFeaturesAr));
      }

      if (filteredFeaturesEn.length > 0) {
        formdata.append("features_en", JSON.stringify(filteredFeaturesEn));
      }
      formdata.append("image", image);
      formdata.append("status", cardData.status);
      formdata.append("organization_id", selectedOrg.id);
      formdata.append("active", "0");

      const response = await instance.post(
        `/add-affiliate-card-type`,
        formdata
      );
      if (response.status == 201) {
        setShowSuccessPopup(true);
        setCardData({
          title_en: "",
          title_ar: "",
          description_en: "",
          description_ar: "",
          price_before_discount: "",
          price: "",
          features_ar: ["", "", ""],
          features_en: ["", "", ""],
          duration: "",
          status: "",
        });
        setImage(null);
        setSelectedOrg(null);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
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

  const selectOrg = (org: any) => {
    setSelectedOrg(org);
  };

  const selectStatus = (status: string) => {
    setCardData({ ...cardData, status: status });
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

  if (loading) return <Loading />;

  return (
    <motion.div
      style={{ direction: "rtl" }}
      className="p-6 w-[90%] max-lg:w-[95%] max-md:w-[98%] mt-24 mb-4 mx-auto bg-white rounded-xl shadow-md space-y-4 border-main_orange border-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold pb-2 border-b border-main_blue w-fit mx-auto text-main_orange text-center">
        {"إضافة بطاقة جديدة"}
      </h2>

      <div
        onClick={() => openinput.current.click()}
        className="flex items-center text-orange-300 hover:text-main_orange justify-center border-2 border-dashed w-full h-52 border-orange-300 duration-200 cursor-pointer hover:border-orange-500 group"
      >
        {image instanceof File ? (
          <Img
            src={URL.createObjectURL(image)}
            className="w-72 h-40 rounded-md object-cover shadow-md"
          />
        ) : (
          <FaUpload className="size-7 group-hover:scale-150 duration-300" />
        )}
      </div>
      <input
        ref={openinput}
        type="file"
        className="hidden"
        onChange={handleImageChange}
      />

      <div className="space-y-2">
        <div className="flex items-center border pl-1 rounded bg-orange-100">
          <FaHeading className="text-orange-500 mr-2" />
          <input
            type="text"
            name="title_en"
            placeholder={"العنوان بالإنجليزية"}
            value={cardData.title_en}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200 "
          />
        </div>

        <div className="flex items-center border pl-1 rounded bg-orange-100">
          <FaHeading className="text-orange-500 mr-2" />
          <input
            type="text"
            name="title_ar"
            placeholder={"العنوان بالعربية"}
            value={cardData.title_ar}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200 "
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center border pl-1 rounded bg-orange-100">
          <FaInfoCircle className="text-orange-500 mr-2" />
          <textarea
            name="description_en"
            placeholder={"وصف البطاقة بالإنجليزية "}
            value={cardData.description_en}
            onChange={handleChange}
            className="w-full bg-transparent leading-5 focus:outline-none focus:bg-white p-2 duration-200 "
          ></textarea>
        </div>
      </div>

      <div className="flex items-center border pl-1 rounded bg-orange-100">
        <FaInfoCircle className="text-orange-500 mr-2" />
        <textarea
          name="description_ar"
          placeholder={"وصف البطاقة بالعربية "}
          value={cardData.description_ar}
          onChange={handleChange}
          className="w-full leading-5 bg-transparent focus:outline-none focus:bg-white p-2 duration-200 "
        ></textarea>
      </div>

      <div className="flex gap-2">
        <div className="flex items-center border pl-1 rounded bg-orange-100 w-full">
          <FaDollarSign className="text-orange-500 mr-2" />
          <input
            type="number"
            min={0}
            name="price_before_discount"
            placeholder={"السعر قبل الخصم"}
            value={cardData.price_before_discount}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200"
          />
        </div>
      </div>
      <div className="flex items-center border pl-1 rounded bg-orange-100 w-full">
        <FaDollarSign className="text-orange-500 mr-2" />
        <input
          type="number"
          name="price"
          min={0}
          placeholder={"السعر بعد الخصم"}
          value={cardData.price}
          onChange={handleChange}
          className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200"
        />
      </div>
      <div className="w-full">
        <div className="flex items-center border pl-1 rounded bg-orange-100 w-full">
          <CiCalendarDate className="text-orange-500 size-5 mr-2" />
          <input
            type="number"
            name="duration"
            placeholder={"مدة البطاقة بالشهور"}
            value={cardData.duration}
            min={1}
            onChange={handleDurationChange}
            className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200"
          />
        </div>

        {durationerror && (
          <p className="text-red-500 text-sm mt-1">{durationerror}</p>
        )}
      </div>

      <div
        className={`space-y-2 ${
          errorArrayMessage.length > 0
            ? "border border-red-300 p-2 rounded-md shadow-md shadow-red-300"
            : ""
        }`}
      >
        <h3 className="text-lg pb-1 border-b border-main_blue w-fit ">
          {"المميزات بالعربية"}
        </h3>
        {cardData.features_ar.map((feature: any, index: any) => (
          <div
            key={index}
            className="flex gap-2 items-center border p-2 rounded bg-orange-100"
          >
            <input
              type="text"
              value={feature}
              onChange={(e) =>
                handleFeatureChange(index, "features_ar", e.target.value)
              }
              className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200"
            />
            <button
              onClick={() => removeFeature(index, "features_ar")}
              className="text-red-500"
            >
              <AiOutlineMinus />
            </button>
          </div>
        ))}
        <button
          onClick={() => addFeature("features_ar")}
          className="text-orange-500 flex items-center gap-1"
        >
          <AiOutlinePlus /> {"إضافة ميزة"}
        </button>
      </div>

      <div
        className={`space-y-2 ${
          errorArrayMessage.length > 0
            ? "border border-red-300 p-2 rounded-md shadow-md shadow-red-300"
            : ""
        }`}
      >
        <h3 className="text-lg pb-1 border-b border-main_blue w-fit">
          {"المميزات بالإنجليزية"}
        </h3>
        {cardData.features_en.map((feature: any, index: any) => (
          <div
            key={index}
            className="flex gap-2 items-center border p-2 rounded bg-orange-100"
          >
            <input
              type="text"
              value={feature}
              onChange={(e) =>
                handleFeatureChange(index, "features_en", e.target.value)
              }
              className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200"
            />
            <button
              onClick={() => removeFeature(index, "features_en")}
              className="text-red-500"
            >
              <AiOutlineMinus />
            </button>
          </div>
        ))}
        <button
          onClick={() => addFeature("features_en")}
          className="text-orange-500 flex items-center gap-1"
        >
          <AiOutlinePlus /> {"إضافة ميزة"}
        </button>
      </div>
      {errorArrayMessage && (
        <p className="text-red-500 text-sm">{errorArrayMessage}</p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* start orgs section */}
      <label className="block my-3 text-lg pb-2 border-b w-fit mx-auto border-main_orange">
        حدد المركز صاحب البطاقة
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
          <p className="text-lg text-gray-600">
            {language === "EN" ? "Searching..." : "جاري البحث..."}
          </p>
        </motion.div>
      ) : currentData.length > 0 ? (
        <div className="w-full  grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3  max-md:grid-cols-2 gap-8 max-md:gap-2 ">
          {orgs &&
            currentData.map((org: any, index) => (
              <div
                onClick={() => selectOrg(org)}
                key={index}
                className={`flex flex-col items-center h-fit gap-3 py-4 px-2 rounded-md shadow-sm border relative cursor-pointer   duration-200 ${
                  selectedOrg.id == org.id
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
                        selectedOrg.id == org.id ? " opacity-100" : "opacity-0"
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

      {/* end orgs section */}

      {/*  start select status of Card */}
      <label className="block mb-3 text-lg pb-2 mt-6 border-b w-fit mx-auto border-main_orange">
        حدد حالة البطاقة
      </label>
      <div className="flex items-center justify-between w-full gap-3 max-md:flex-col ">
        <div
          onClick={() => selectStatus("allow")}
          className={`${
            cardData.status == "allow"
              ? "bg-green-400 text-white"
              : "bg-gray-100"
          } flex-1 duration-200 max-md:w-full hover:bg-green-400 rounded-md shadow-sm border flex items-center justify-center flex-col gap-3 py-3 px-2 cursor-pointer`}
        >
          <FaCheck className="size-6" />
          <p className="text-lg max-md:text-[13px]">نشطة</p>
        </div>
        <div
          onClick={() => selectStatus("not_allow")}
          className={`${
            cardData.status == "not_allow"
              ? "bg-red-400 text-white"
              : "bg-gray-100"
          } flex-1 duration-200 max-md:w-full hover:bg-red-400 rounded-md shadow-sm border flex items-center justify-center flex-col gap-3 py-3 px-2 cursor-pointer`}
        >
          <GiTireIronCross className="size-6" />
          <p className="text-lg max-md:text-[13px]">غير نشطة</p>
        </div>
      </div>
      {/*  end select status of Card */}

      <button
        onClick={handlesubmit}
        className="bg-main_orange outline-none hover:scale-105 duration-150 hover:bg-white hover:text-black hover:border-main_orange border border-transparent text-white px-12 py-2 rounded-lg w-fit mx-auto block mt-4"
      >
        {"إرسال البطاقة"}
      </button>

      {showSuccessPopup && (
        <SuccessPopup
          message="تم إنشاء البطاقة بنجاح "
          onClose={() => setShowSuccessPopup((prev) => !prev)}
        />
      )}
    </motion.div>
  );
}
