import { UseVariables } from "@/app/context/VariablesContext";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface props {
  categories: any;
  setSelectCurrentData: any;
  handlegetDataByCategory: any;
  selectedCategory: any;
  setSelectedCategory: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterCards({
  categories,
  setSelectCurrentData,
  handlegetDataByCategory,
  selectedCategory,
  setSelectedCategory,
  isOpen,
  onClose,
}: props) {
  const { language } = UseVariables();

  // التأكد من تحديد "الكل" افتراضيًا إذا لم يكن هناك قسم محدد
  useEffect(() => {
    if (!selectedCategory || Object.keys(selectedCategory).length === 0) {
      setSelectCurrentData("DefaultData");
    }
  }, [selectedCategory, setSelectCurrentData]);

  const clickAll = () => {
    setSelectCurrentData("DefaultData");
    setSelectedCategory(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed z-[999999] top-0 left-0 h-screen overflow-y-auto w-[400px] max-md:w-3/4 hidden-scrollbar bg-gray-200 dark:bg-secend_dash shadow-lg p-6"
        >
          <h2 className="text-lg mt-4 pb-2 border-b border-sky-400 w-fit mx-auto font-bold text-center mb-3 text-gray-700">
            {language === "EN" ? "Filter by Category" : "تصفية حسب الفئة"}
          </h2>
          <ul className="flex flex-col items-start justify-start gap-3 relative">
            <li
              onClick={clickAll}
              className={`w-full text-left px-4 py-2 cursor-pointer text-sm font-medium rounded-lg border ${
                !selectedCategory || Object.keys(selectedCategory).length === 0
                  ? "bg-main_orange text-white border-main_orange"
                  : "bg-white dark:bg-secend_dash dark:text-secend_text dark:border-gray-700 text-gray-700 border-gray-300 hover:bg-gray-200"
              } transition duration-200`}
            >
              {language === "EN" ? "All" : "الكل"}
            </li>
            {categories.map((cat: any, index: number) => (
              <li
                key={index}
                onClick={() => handlegetDataByCategory(cat)}
                className={`w-full text-left px-4 py-2 cursor-pointer text-sm font-medium rounded-lg border ${
                  selectedCategory?.id == cat.id
                    ? "bg-main_orange text-white border-main_orange"
                    : "bg-white dark:bg-secend_dash dark:text-secend_text dark:border-gray-700 text-gray-700 border-gray-300 hover:bg-gray-200"
                } transition duration-200`}
              >
                {language === "EN" ? cat.title_en : cat.title_ar}
              </li>
            ))}
          </ul>
          <FaTimes
            onClick={onClose}
            className="text-red-400 absolute top-2 right-2 size-6 cursor-pointer"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
