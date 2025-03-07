import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import React, { useEffect, useState } from "react";
import {
  FaFolder,
  FaHeart,
  FaTimesCircle,
  FaSearch,
  FaSadTear,
} from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import Img from "../../Img";
import Link from "next/link";

export default function SearchArticles({ onClose, showState }: any) {
  const { language } = UseVariables();
  const [contentSeacrch, setContentSeacrch] = useState("");
  const [searchReasults, setSearchReasults] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // حالة لتحديد ما إذا كان البحث جارٍ

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      const getdata = async () => {
        if (contentSeacrch) {
          setIsSearching(true); // بدء البحث
          try {
            const response = await instance.get(
              `/get-articles-by-search/${encodeURIComponent(contentSeacrch)}`
            );
            if (response.status === 200) {
              const data = response.data.data;
              setSearchReasults(data);
            }
          } catch (error) {
            console.log(error);
          } finally {
            setIsSearching(false); // انتهاء البحث
          }
        } else {
          setSearchReasults([]);
        }
      };

      getdata();
    }, 800); // تأخير 800 مللي ثانية

    return () => clearTimeout(delaySearch);
  }, [contentSeacrch]);

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  return (
    <>
      <AnimatePresence>
        {showState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
            className="w-full z-[9999999999999999] h-screen fixed top-0 left-0 bg-black/50 flex items-center max-md:items-end justify-center"
          >
            <motion.div
              initial={{ scale: 1.4 }} // يبدأ بحجم أكبر قليلاً
              animate={{ scale: 1 }} // يعود إلى الحجم الطبيعي
              transition={{
                duration: 0.6, // مدة الحركة
                ease: "easeOut", // جعل الحركة أكثر سلاسة
              }}
              exit={{ scale: 1.4 }}
              style={{ originX: 0.5, originY: 0.5 }} // نقطة التحويل من المركز
              className="bg-white relative w-3/4 max-md:w-[98%] h-[80vh] max-md:h-[95vh] dark:bg-secend_dash p-2 rounded-md shadow-md"
            >
              <div
                style={{ direction: language == "EN" ? "ltr" : "rtl" }}
                className="inputsearch  mb-5 mt-2 flex items-center gap-2 relative w-[70%] max-lg:w-3/4 max-md:w-[97%] mx-auto"
              >
                <div className="relative bg-white rounded-md shadow-md h-[40px] flex items-center justify-center w-full">
                  <LuSearch
                    className={`${
                      language == "EN" ? "left-2" : "right-2"
                    } top-1/2 text-secend_text size-5`}
                  />
                  <input
                    type="text"
                    onChange={(e) => setContentSeacrch(e.target.value)}
                    name="titlesearch"
                    value={contentSeacrch}
                    placeholder={
                      language == "EN"
                        ? "Find the Article here..."
                        : "إبحث عن المقال هنا  ..."
                    }
                    className="w-[90%] bg-transparent h-full pr-9 px-4 py-2 outline-none placeholder-shown:px-4 placeholder-shown:py-2 placeholder-shown:pr-9 placeholder-shown:text-[18px]"
                  />
                </div>
              </div>

              <div
                onClick={onClose}
                className="w-7 h-7 max-md:w-5 max-md:h-5 flex items-center justify-center rounded-full bg-white absolute -top-10 -right-8 max-md:-top-6 max-md:right-0 cursor-pointer hover:scale-110 duration-150 shadow-sm"
              >
                <FaTimesCircle className="size-6 max-md:size-4" />
              </div>

              <AnimatePresence>
                <motion.div
                  className="overflow-y-auto overflow-x-hidden p-12 max-md:p-2 h-[calc(80vh-100px)] max-md:h-[calc(90vh-100px)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* حالة البحث الجاري */}
                  {isSearching && (
                    <motion.div
                      className="flex flex-col items-center justify-center gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <FaSearch className="text-4xl text-gray-500" />
                      </motion.div>
                      <p className="text-lg text-gray-600">
                        {language === "EN" ? "Searching..." : "جاري البحث..."}
                      </p>
                    </motion.div>
                  )}

                  {/* حالة عدم وجود بحث */}
                  {!contentSeacrch && !isSearching && (
                    <motion.div
                      className="flex flex-col items-center justify-center gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <FaSearch className="text-4xl text-gray-500" />
                      <p className="text-lg text-gray-600">
                        {language === "EN"
                          ? "Start typing to search for articles..."
                          : "ابدأ بالكتابة للبحث عن المقالات..."}
                      </p>
                    </motion.div>
                  )}

                  {/* حالة عدم وجود نتائج */}
                  {contentSeacrch &&
                    !isSearching &&
                    searchReasults.length === 0 && (
                      <motion.div
                        className="flex flex-col items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <FaSadTear className="text-4xl text-gray-500" />
                        <p className="text-lg text-gray-600">
                          {language === "EN"
                            ? "No articles found. Try another search!"
                            : "لم يتم العثور على مقالات. حاول بحثًا آخر!"}
                        </p>
                      </motion.div>
                    )}

                  {/* عرض نتائج البحث */}
                  {!isSearching &&
                    searchReasults.map((result: any, index) => (
                      <Link
                        href={`/blog/${formatTitle(result.title_en)}?id=${
                          result.blog_id
                        }`}
                        key={result.category_id}
                        className="block w-full"
                      >
                        <motion.div
                          className="bg-white dark:bg-gray-800 border z-30 dark:border-gray-700 cursor-pointer p-4 rounded-lg shadow-md mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
                            transition: { duration: 0.1 },
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <Img
                              src={result.image}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">
                                {language === "EN"
                                  ? result.title_en
                                  : result.title_ar}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <FaFolder className="text-gray-500" />
                                <p className="text-sm text-gray-500">
                                  {language === "EN"
                                    ? result.category.title_en
                                    : result.category.title_ar}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <FaHeart className="text-red-500" />
                                <p className="text-sm text-gray-500">
                                  {result.total_reactions} Reactions
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
