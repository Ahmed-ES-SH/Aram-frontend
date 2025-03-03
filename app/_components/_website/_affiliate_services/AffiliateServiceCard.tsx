import React from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaShoppingCart,
  FaBuilding,
  FaTags,
} from "react-icons/fa";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import { BiCategory } from "react-icons/bi";
import Link from "next/link";
import { useDataContext } from "@/app/context/DataContext";

export default function AffiliateServiceCard({ service, index, direct }: any) {
  const { currenciesValue, activeCurrency } = useDataContext();
  const { language } = UseVariables();
  // تأخير ظهور البطاقة بناءً على الترتيب (index)
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { delay: index * 0.2 } },
  };

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  const Currency = currenciesValue[activeCurrency.code] || 1;

  const encodedServiceId = btoa(service.id.toString());

  return (
    service && (
      <Link
        className="block w-full"
        href={`/${direct}/${encodedServiceId}?service=${formatTitle(
          service.title_en
        )}&serviceCategory=${formatTitle(
          service.category.title_en
        )}&organizatio=${formatTitle(
          service.organization.title_en
        )}&serviceId=${encodedServiceId}`}
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.1 }}
          className="w-full block min-h-[450px] h-fit relative group z-30 bg-white dark:bg-main_dash dark:text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300  cursor-pointer"
        >
          <motion.div
            className="absolute top-2 right-2  duration-200 bg-red-400 border  border-dashed text-white text-xl font-bold rounded-full w-16 h-16 flex items-center justify-center z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {service.discount_percent || 0} %
          </motion.div>
          {/* صورة الخدمة */}
          <Img
            src={service.image ? service.image : "/services/service-03.jpg"}
            className="w-full h-52 object-cover"
          />

          {/* محتوى البطاقة */}
          <div className="p-6">
            {/* عنوان الخدمة */}
            <h2 className="text-xl pb-2 border-b border-main_orange w-fit font-bold text-gray-800 dark:text-secend_text mb-2">
              {language == "EN"
                ? service.title_en.length > 40
                  ? service.title_en.slice(0, 40) + "..."
                  : service.title_en
                : service.title_ar.length > 40
                ? service.title_ar.slice(0, 40) + "..."
                : service.title_ar}
            </h2>

            {/* وصف الخدمة */}
            <p className="text-gray-600 dark:text-white mb-4">
              {language == "EN"
                ? service.description_en.slice(0, 50) + "..."
                : service.description_ar.slice(0, 50) + "..."}
            </p>

            {/* سعر التأكيد وعدد الطلبات */}
            {/* <div className="flex justify-between items-center mb-4">
              <div className="text-gray-700 flex items-center gap-2">
                <FaTags className="mr-2 text-blue-500" />
                <div className="px-2 py-1 flex items-center gap-1 rounded-md shadow-sm text-white text-center bg-green-300">
                  <span>
                    {service.confirmation_status ? activeCurrency.symbol : ""}
                  </span>
                  {service.confirmation_status
                    ? Number(service.confirmation_price * Currency).toFixed(2)
                    : "Free"}
                </div>
              </div>
              <span className="text-gray-700 flex items-center gap-2">
                <FaShoppingCart className="mr-2 text-purple-500" />
                {service.number_of_orders}
              </span>
            </div> */}

            {/* لوجو المنظمة واسمها */}
            <div className="flex items-center gap-2 mb-4">
              <FaBuilding className=" text-orange-500" />
              <p className="text-gray-800 dark:text-secend_text font-semibold flex items-center">
                {language == "EN"
                  ? service.organization.title_en
                  : service.organization.title_ar}
              </p>
            </div>

            {/* الفئة التابعة لها الخدمة */}
            <div className="flex w-full items-center gap-2">
              <BiCategory className="text-main_red" />
              <div className="text-gray-700">
                {language == "EN"
                  ? service.category.title_en
                  : service.category.title_ar}
              </div>
            </div>
          </div>
          <div className="w-12 h-12 flex absolute top-1/2 -translate-y-1/2 duration-150 -right-32 group-hover:right-2 bg-gray-50 items-center justify-center p-1 border rounded-full">
            <Img
              src={
                service.organization.icon
                  ? service.organization.icon
                  : "/logo.png"
              }
              className="w-10 h-10  rounded-full object-cover"
            />
          </div>
        </motion.div>
      </Link>
    )
  );
}
