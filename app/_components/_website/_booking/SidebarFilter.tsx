import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiFilter,
  FiThumbsUp,
  FiXCircle,
} from "react-icons/fi";
import React, { useEffect } from "react";
import { UseVariables } from "@/app/context/VariablesContext";
import { FaArrowRight } from "react-icons/fa6";
import { LuArrowRightFromLine } from "react-icons/lu";

export default function SidebarFilter({
  filter,
  setFilter,
  setFilteredBookings,
  bookings,
  sidebarShow,
  setSidebarShow,
}: any) {
  const { language } = UseVariables();
  const translations: any = {
    AR: {
      filters: {
        all: "الكل",
        waiting: "قيد الانتظار",
        done: "منتهية",
        expired: "منتهية الصلاحية",
        acceptable: "مقبول",
        unacceptable: "غير مقبول",
        filter: "فلترة المواعيد",
      },
    },
    EN: {
      filters: {
        all: "All",
        waiting: "Waiting",
        done: "Done",
        expired: "Expired",
        acceptable: "Acceptable",
        unacceptable: "Unacceptable",
        filter: "Filter Appointments",
      },
    },
  };

  const t = translations[language] || translations.EN;
  const filterColors: Record<string, string> = {
    all: "bg-blue-500/50",
    done: "bg-green-500/50",
    waiting: "bg-main_orange",
    acceptable: "bg-sky-400/50",
    expired: "bg-gray-400/50",
    unacceptable: "bg-red-500/50 ",
  };
  const hoverfilterColors: Record<string, string> = {
    all: "hover:bg-blue-500/50",
    done: "hover:bg-green-500/50",
    waiting: "hover:bg-main_orange",
    acceptable: "hover:bg-sky-400/50",
    expired: "hover:bg-gray-400/50",
    unacceptable: "hover:bg-red-500/50 ",
  };
  const filterIcons: Record<string, JSX.Element> = {
    all: <FiFilter className="text-blue-500" />,
    waiting: <FiClock className="text-orange-500" />,
    done: <FiCheck className="text-green-500" />,
    expired: <FiAlertCircle className="text-gray-400" />,
    acceptable: <FiThumbsUp className="text-sky-400" />,
    unacceptable: <FiXCircle className="text-red-500" />,
  };

  useEffect(() => {
    // تصفية الحجوزات بناءً على الفلتر
    if (filter === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter((booking: any) => booking.status === filter)
      );
    }
  }, [filter, bookings]);

  const showToggle = () => {
    setSidebarShow((prev: any) => !prev);
  };

  const showContion = sidebarShow
    ? "w-full  p-4 overflow-normal"
    : "w-0  p-0 overflow-hidden";

  return (
    <>
      <div className="flex md:hidden h-screen fixed top-16 left-0 w-[300px] items-start">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={` bg-gray-200 h-full dark:bg-gray-800 dark:text-secend_text duration-200 ${showContion}`}
        >
          <h2 className="text-lg whitespace-nowrap font-semibold mb-4">
            {t.filters.filter}
          </h2>
          <ul className="divide-y divide-gray-300 dark:divide-gray-700">
            {/* لإضافة خط سفلي */}
            {Object.keys(filterColors).map((key) => (
              <motion.li
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 cursor-pointer duration-150 dark:text-white p-2 rounded ${
                  filter === key
                    ? `${filterColors[key]} text-white` // اللون النشط
                    : `${hoverfilterColors[key]} hover:text-white` // لون عند التمرير
                }`}
                onClick={() => setFilter(key)}
              >
                {filterIcons[key]} {/* عرض الأيقونة */}
                <span>{t.filters[key]}</span> {/* النص بجانب الأيقونة */}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <div
          onClick={showToggle}
          className="flex items-center mt-8 justify-center text-white bg-sky-400 rounded-r-md shadow-md cursor-pointer p-2 hover:bg-white hover:text-black hover:border-sky-400 duration-150 border border-transparent"
        >
          <LuArrowRightFromLine className="size-5 " />
        </div>
      </div>
    </>
  );
}
