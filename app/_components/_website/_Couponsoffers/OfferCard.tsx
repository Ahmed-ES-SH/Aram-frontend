import { motion } from "framer-motion";
import React from "react";
import { FcOrganization } from "react-icons/fc";
import { FaArrowRight, FaTag } from "react-icons/fa";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";

interface Props {
  offer: any;
  index: number;
  toggleOpen: any;
}

export default function OfferCard({ toggleOpen, offer, index }: Props) {
  const { language } = UseVariables();
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { delay: index * 0.2 } },
  };
  return (
    <motion.div
      className="w-full max-md:w-[92%] mx-auto h-[300px] cursor-pointer max-lg:min-h-[450px] max-lg:h-fit group relative border rounded-md shadow-md flex flex-col lg:flex-row items-start bg-white dark:bg-secend_dash dark:border-gray-700 overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.08 }}
    >
      {/* صورة العرض */}
      <div className="image w-full lg:w-[40%] h-[200px] lg:h-full flex-shrink-0">
        <Img
          src={offer.image ? offer.image : "/public"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* محتوى العرض */}
      <div className="content  flex flex-col flex-grow p-4">
        {/* عنوان العرض */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {language == "EN" ? offer.title_en : offer.title_ar}
        </h2>
        <p className="text-gray-700 dark:text-secend_text mb-4">
          {language == "EN"
            ? offer.description_en.slice(0, 80) + "..."
            : offer.description_ar.slice(0, 80) + "..."}
        </p>

        {/* التفاصيل */}
        <div className="details flex flex-col gap-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-white">
            <span className="font-bold mr-2">
              {language == "EN" ? "Offer Start:" : "بداية العرض :"}
            </span>
            <span>{offer.start_date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-white">
            <span className="font-bold mr-2">
              {language == "EN" ? "Offer end:" : "نهاية العرض :"}
            </span>
            <span>{offer.end_date}</span>
          </div>
        </div>
        <div
          onClick={() => toggleOpen(offer)}
          className=" absolute bottom-4 right-4 rounded-full dark:border-gray-400 dark:text-gray-500 hover:dark:text-white w-12 h-12 hover:bg-sky-400 duration-200 cursor-pointer hover:text-white hover:scale-125 flex items-center justify-center border"
        >
          <FaArrowRight className="size-5" />
        </div>
      </div>
      {/* دائرة نسبة الخصم */}
      {offer.discount_value > 0 && (
        <motion.div
          className="absolute top-2 right-2  duration-200 bg-red-400 border  border-dashed text-white text-lg px-1 font-bold rounded-full w-16 h-16 flex items-center justify-center z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {offer.discount_value}%
        </motion.div>
      )}
      <motion.div
        className="absolute bottom-2 left-2  duration-200 bg-white border  border-dashed text-white text-xs font-bold rounded-full w-12 h-12 flex items-center justify-center z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Img
          src={
            offer.organization && offer.organization.icon
              ? offer.organization.icon
              : "/public"
          }
          className="w-8 h-8 rounded-full"
        />
      </motion.div>
    </motion.div>
  );
}
