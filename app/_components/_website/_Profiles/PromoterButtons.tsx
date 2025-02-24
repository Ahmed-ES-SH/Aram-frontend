"ise client";
import { UseVariables } from "@/app/context/VariablesContext";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { RiAdvertisementFill, RiNumbersLine } from "react-icons/ri";
import StatsPopup from "./StatsPopup";
import { FaCheck, FaCopy } from "react-icons/fa";
import { useDataContext } from "@/app/context/DataContext";

export default function PromoterButtons() {
  const { language } = UseVariables();
  const { currentuser } = useDataContext();
  const [showPromotional, setShowPromotional] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [copied, setCopied] = useState<{ code: boolean; link: boolean }>({
    code: false,
    link: false,
  });
  const handleCopy = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [type]: true });
      setTimeout(() => setCopied({ ...copied, [type]: false }), 1500);
    });
  };
  const currentURL =
    typeof window !== "undefined" ? window.location.origin : "";
  return (
    <>
      {currentuser && currentuser.is_promoter && (
        <div
          className={`flex items-center max-md:w-full gap-2 max-md:relative max-md:flex-col  max-md:mx-auto max-md:mb-6 absolute top-2 ${
            language == "EN" ? "right-2" : "left-2"
          }`}
        >
          <div
            onClick={() => setShowPromotional(true)}
            className={`px-3 max-md:w-full py-4 text-white hover:text-black hover:bg-white hover:border-main_orange border border-transparent duration-200 hover:scale-110 cursor-pointer rounded-md shadow-md  bg-main_orange flex items-center justify-between gap-2`}
          >
            <p className="whitespace-nowrap max-md:text-[12px]">
              {language == "EN"
                ? "Promotional information"
                : "المعلومات الدعائية"}
            </p>
            <RiAdvertisementFill className="size-5" />
          </div>
          <div
            onClick={() => setShowStats(true)}
            className={`px-3 max-md:w-full py-4 text-white hover:text-black hover:bg-white hover:border-green-400 border border-transparent duration-200 hover:scale-110 cursor-pointer rounded-md shadow-md  bg-green-400 flex items-center justify-between gap-2`}
          >
            <p className="whitespace-nowrap max-md:text-[12px]">
              {language == "EN" ? "Your statistics" : "إحصائياتك"}
            </p>
            <RiNumbersLine className="size-5" />
          </div>
        </div>
      )}
      <AnimatePresence>
        {showPromotional && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0 }}
            className="fixed bg-black/50 z-50 inset-0 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              exit={{ scale: 0.7 }}
              className="w-1/2 max-md:w-[95%] max-lg:w-[80%] py-8 px-2 bg-white dark:bg-secend_dash dark:text-white rounded-md shadow-sm"
            >
              {/* كود الدعوة */}
              <div className="flex items-start relative flex-col gap-2">
                <label className="pb-2 border-b border-main_orange">
                  {language === "EN"
                    ? "Your promo code"
                    : "الكود الدعائي الخاص بك"}
                </label>
                <div className="border dark:border-gray-700 px-4 py-2 relative w-full flex items-center justify-between">
                  <p className="w-full">{currentuser?.user_code}</p>
                  <button
                    onClick={() =>
                      handleCopy(currentuser?.user_code || "", "code")
                    }
                    className="px-4 py-2 text-center rounded-md hover:scale-110 duration-300 shadow-md bg-main_orange text-white cursor-pointer flex items-center gap-2"
                  >
                    {copied.code ? <FaCheck /> : <FaCopy />}
                    {language === "EN" ? "Copy" : "نسخ"}
                  </button>
                </div>
              </div>

              {/* رابط الدعوة */}
              <div className="flex mt-4 items-start relative flex-col gap-2">
                <label className="pb-2 border-b border-main_orange">
                  {language === "EN"
                    ? "Your promo Link"
                    : "الرابط الدعائي الخاص بك"}
                </label>
                <div className="border dark:border-gray-700 px-4 py-2  relative w-full flex items-center justify-between">
                  <p className="w-full truncate">
                    {currentURL &&
                      `${currentURL}/membership?currentCode=${
                        currentuser && btoa(currentuser.user_code)
                      }`}
                  </p>
                  <button
                    onClick={() =>
                      handleCopy(
                        `${currentURL}/membership?currentCode=${
                          currentuser && btoa(currentuser.user_code)
                        }`,
                        "link"
                      )
                    }
                    className="px-4 py-2 rounded-md shadow-md hover:scale-110 duration-300 text-center bg-main_orange text-white cursor-pointer flex items-center gap-2"
                  >
                    {copied.link ? <FaCheck /> : <FaCopy />}
                    {language === "EN" ? "Copy" : "نسخ"}
                  </button>
                </div>
              </div>

              {/* زر الإغلاق */}
              <div
                onClick={() => setShowPromotional(false)}
                className="px-4 py-2 text-center mt-6 cursor-pointer text-white rounded-md shadow-md bg-red-300"
              >
                {language === "EN" ? "Close" : "إغلاق"}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showStats && (
          <StatsPopup onClose={() => setShowStats((prev) => !prev)} />
        )}
      </AnimatePresence>
    </>
  );
}
