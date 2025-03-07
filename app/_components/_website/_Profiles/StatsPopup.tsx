"use client";
import { instance } from "@/app/Api/axios";
import { useDataContext } from "@/app/context/DataContext";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaEye, FaShoppingCart } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";

interface Props {
  onClose: any;
}

export default function StatsPopup({ onClose }: Props) {
  const { language } = UseVariables();
  const { currentuser } = useDataContext();
  const userId = currentuser && currentuser.id;
  const userCode = currentuser && currentuser.user_code;
  const [visits, setVisits] = useState(0);
  const [cardVisits, setcardVisits] = useState(0);
  const [purchases, setPurchases] = useState(0);
  const [loading, setLoading] = useState(true);

  const translations: any = {
    AR: {
      title: "إحصائيات الحساب",
      visits: "عدد الحسابات الجديدة",
      cardvisits: "عدد زيارات البطاقات",
      purchases: "  عدد عمليات الشراء الترويجية",
      close: "إغلاق",
    },
    EN: {
      title: "Account Statistics",
      visits: "Number of new accounts",
      cardvisits: "Number of Card Visits",
      purchases: "Number of promotional purchases",
      close: "Close",
    },
  };

  useEffect(() => {
    const getStats = async (api: string, set: any) => {
      try {
        const response = await instance.get(api);
        if (response.status == 200) {
          const data = response.data;
          set(data.count);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getStats(`/new-members-count-by-promoter/${userId}`, setVisits);
    getStats(`/card-visits-count-user/${userId}`, setcardVisits);
    getStats(`/cards-statics-count-for-promoter/${encodeURIComponent(userCode)}`, setPurchases);
  }, [userId]);

  const t = translations[language] || translations.ar;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[50] bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white dark:bg-secend_dash rounded-2xl p-6 w-1/2 max-md:w-[95%] max-lg:w-[90%] max-xl:w-[70%] max-md:mt-20 shadow-lg text-center"
      >
        <h2 className="text-lg font-bold mb-4 dark:text-white">{t.title}</h2>
        {loading ? (
          <div className="min-h-[200px] flex items-center  justify-center w-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.3, repeat: Infinity }}
            >
              <LuLoader className="text-main_orange size-12" />
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1  gap-4">
            <div className="w-full flex flex-col items-center bg-gray-100 dark:bg-main_dash dark:text-white p-4 rounded-xl">
              <FaEye className="text-blue-500 text-3xl" />
              <p className="text-xl font-semibold mt-2">{visits}</p>
              <p className="text-gray-600 text-sm whitespace-nowrap">
                {t.visits}
              </p>
            </div>
            <div className="flex flex-col items-center bg-gray-100 dark:bg-main_dash dark:text-white p-4 rounded-xl">
              <FaEye className="text-yellow-500 text-3xl" />
              <p className="text-xl font-semibold mt-2">{cardVisits}</p>
              <p className="text-gray-600 text-sm whitespace-nowrap">
                {t.cardvisits}
              </p>
            </div>
            <div className="flex flex-col items-center bg-gray-100 dark:bg-main_dash dark:text-white p-4 rounded-xl">
              <FaShoppingCart className="text-green-500 text-3xl" />
              <p className="text-xl font-semibold mt-2">{purchases}</p>
              <p className="text-gray-600 text-sm whitespace-nowrap">
                {t.purchases}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          {t.close}
        </button>
      </motion.div>
    </div>
  );
}
