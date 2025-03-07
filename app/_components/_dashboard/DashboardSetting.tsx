"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { LiaToggleOffSolid, LiaToggleOnSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { UseVariables } from "@/app/context/VariablesContext";
export default function DashboardSetting() {
  const { language }: any = UseVariables();
  const [openSettings, setOpenSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<any>(false);
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-main_dash");
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof document !== "undefined") {
      setIsDarkMode((prevMode: any) => {
        const newMode = !prevMode;
        localStorage.setItem("darkMode", newMode.toString());
        if (newMode) {
          document.documentElement.classList.add("dark");
          document.body.classList.add("bg-main_dash");
        } else {
          document.documentElement.classList.remove("dark");
          document.body.classList.remove("bg-main_dash");
        }
        return newMode;
      });
    }
  };
  const toggleSettings = () => setOpenSettings((prev) => !prev);
  return (
    <>
      <div
        onClick={toggleSettings}
        className=" fixed top-32 z-[999999999999999999999999999999999] right-0 flex  items-center justify-center hover:bg-white hover:text-black cursor-pointer duration-200  bg-main_orange text-white rounded-l-md shadow-md w-[30px] h-[30px]"
      >
        <IoSettingsOutline />
      </div>
      {/* قائمة الإعدادات */}
      <AnimatePresence>
        {openSettings && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="w-[180px] h-screen  fixed z-[99999] right-0 top-0 bg-white dark:bg-secend_dash dark:text-secend_text shadow-md  px-4 py-2"
          >
            <div className="w-full cursor-pointer pb-2  mt-8 flex items-center justify-between">
              <p> {language ? "Dark mode" : "الوضع المظلم"}</p>
              <motion.button
                onClick={toggleDarkMode}
                className="text-2xl"
                whileTap={{ scale: 0.9 }} // تأثير عند الضغط
              >
                <motion.div
                  key={isDarkMode} // يضمن تطبيق الانتقالات بين الأيقونات
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className=""
                >
                  {isDarkMode ? (
                    <LiaToggleOnSolid className="text-green-400 size-7" />
                  ) : (
                    <LiaToggleOffSolid className="text-red-400 size-7" />
                  )}
                </motion.div>
              </motion.button>
            </div>
            <FaTimes
              onClick={toggleSettings}
              className="absolute cursor-pointer rounded-md top-3 right-4 z-[99] text-red-400"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
