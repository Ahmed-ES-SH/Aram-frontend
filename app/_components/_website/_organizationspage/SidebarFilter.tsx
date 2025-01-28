"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { UseVariables } from "@/app/context/VariablesContext";
import { instance } from "@/app/Api/axios";
import PaginationWithoutNumbers from "../../paginationWithOutnumbers";
import { useDataContext } from "@/app/context/DataContext";
import { usePathname } from "next/navigation";

interface SidebarFiltersProps {
  setSelectedFilter: any;
  selectedFilter: any;
  setSelectedLocation: any;
  selectedLocation: any;
  setactiveTab: any;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  setloading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SidebarFilters({
  setSelectedFilter,
  selectedFilter,
  setSelectedLocation,
  selectedLocation,
  isFilterOpen,
  setloading,
  setactiveTab,
  setIsFilterOpen,
}: SidebarFiltersProps): JSX.Element {
  const { language }: any = UseVariables();
  const {
    catgeories,
    locations,
    categoriesPage,
    locationPage,
    lastcategoriesPage,
    lastlocationPage,
    setcategoriesPage,
    setlocationPage,
  } = useDataContext();
  const path_name = usePathname();

  const [activeTab, setActiveTab] = useState<string>("departments");

  // تحديث علامة التبويب النشطة عند تحميل المكون بناءً على الفلتر/الموقع
  useEffect(() => {
    if (selectedFilter?.title_en !== "All") {
      setActiveTab("departments");
    } else if (selectedLocation?.address !== "All") {
      setActiveTab("locations");
    }
  }, [selectedFilter, selectedLocation]);

  const handlePageChange = async (newPage: any) => {
    try {
      setloading(true);
      if (newPage > 0 && newPage <= lastcategoriesPage) {
        if (activeTab == "departments") {
          setcategoriesPage(newPage);
        } else {
          setlocationPage(newPage);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isFilterOpen && (
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed z-[999999] top-0 left-0 h-screen overflow-y-auto w-[400px] max-md:w-full bg-gray-200 dark:bg-secend_dash shadow-lg p-6"
        >
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-secend_text">
              {language == "EN" ? "Filters" : "تصفية النتائج"}
            </h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-700 dark:text-gray-300"
            >
              <FaTimes className="text-red-300" size={20} />
            </button>
          </div>

          {/* Tabs for switching */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => {
                setActiveTab("departments");
                setactiveTab("departments");
              }}
              className={`w-1/2 pb-2 text-center font-medium ${
                activeTab === "departments"
                  ? "border-b-2 border-main_orange text-main_orange"
                  : "text-gray-600 hover:text-main_orange"
              } duration-200`}
            >
              {language == "EN" ? "Departments" : "الأقسام"}
            </button>
            {path_name != "/services" && (
              <button
                onClick={() => {
                  setActiveTab("locations");
                  setactiveTab("locations");
                }}
                className={`w-1/2 pb-2 text-center font-medium ${
                  activeTab === "locations"
                    ? "border-b-2 border-main_orange text-main_orange"
                    : "text-gray-600 hover:text-main_orange"
                } duration-200`}
              >
                {language == "EN" ? "Locations" : "المواقع"}
              </button>
            )}
          </div>

          {/* Content based on the active tab */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === "departments" && (
                <motion.ul
                  key="departments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <li className="mb-2">
                    <button
                      onClick={() => {
                        setSelectedFilter({
                          title_en: "All",
                          title_ar: "الكل",
                        });
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg border ${
                        selectedFilter.title_en == "All"
                          ? "bg-main_orange text-white border-main_orange"
                          : "bg-white dark:bg-secend_dash dark:text-secend_text dark:border-gray-700 text-gray-700 border-gray-300 hover:bg-gray-200"
                      } transition duration-200`}
                    >
                      {language == "EN" ? "All" : "الكل"}
                    </button>
                  </li>
                  {catgeories.map((department: any, index: number) => (
                    <li className="mb-2" key={index}>
                      <button
                        onClick={() => {
                          setactiveTab("departments");
                          setSelectedFilter(department);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg border ${
                          department.title_en == selectedFilter.title_en
                            ? "bg-main_orange text-white border-main_orange"
                            : "bg-white dark:bg-secend_dash dark:text-secend_text dark:border-gray-700 text-gray-700 border-gray-300 hover:bg-gray-200"
                        } transition duration-200`}
                      >
                        {language == "EN"
                          ? department.title_en
                          : department.title_ar}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
              {activeTab === "locations" && (
                <motion.ul
                  key="locations"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* العنصر المضاف يدويًا */}
                  <li className="mb-2">
                    <button
                      onClick={() => {
                        setSelectedLocation({ address: "All" }); // تعيين "All" كاختيار
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg border ${
                        selectedLocation?.address === "All"
                          ? "bg-main_orange text-white border-main_orange"
                          : "bg-white dark:bg-secend_dash dark:text-secend_text dark:border-gray-700 text-gray-700 border-gray-300 hover:bg-gray-200"
                      } transition duration-200`}
                    >
                      {language == "EN" ? "All" : "الكل"}
                    </button>
                  </li>

                  {/* العناصر الأخرى */}
                  {path_name != "/services" &&
                    locations.map((location: any, index: number) => (
                      <li className="mb-2" key={index}>
                        <button
                          onClick={() => {
                            setactiveTab("locations");
                            setSelectedLocation(location); // تعيين الموقع الحالي
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg border ${
                            location?.address == selectedLocation?.address
                              ? "bg-main_orange text-white border-main_orange"
                              : "bg-white dark:bg-secend_dash dark:text-secend_text dark:border-gray-700 text-gray-700 border-gray-300 hover:bg-gray-200"
                          } transition duration-200`}
                        >
                          {location?.address || "Unknown Address"}
                        </button>
                      </li>
                    ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <PaginationWithoutNumbers
            currentPage={
              activeTab == "departments" ? categoriesPage : locationPage
            }
            totalPages={
              activeTab == "departments" ? lastcategoriesPage : lastlocationPage
            }
            onPageChange={handlePageChange}
          />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
