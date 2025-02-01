import { motion } from "framer-motion";
import React from "react";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import { FaPenClip } from "react-icons/fa6";

interface Props {
  offer: any;
  index: number;
  toggleOpen: any;
}

export default function OfferCardDash({ toggleOpen, offer, index }: Props) {
  const { language } = UseVariables();
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { delay: index * 0.2 } },
  };

  const offerstatuses: any = {
    expired: {
      lable: "منتهى",
      color: "bg-red-400",
    },
    waiting: {
      lable: "فى حالة الانتظار",
      color: "bg-yellow-400",
    },
    active: {
      lable: "مفعل",
      color: "bg-green-400",
    },
  };

  return (
    <motion.div
      style={{ direction: language == "EN" ? "ltr" : "rtl" }}
      className="w-full max-md:w-[92%] mx-auto h-[300px] cursor-pointer max-lg:min-h-[450px] max-lg:h-fit group relative border rounded-md shadow-md flex flex-col lg:flex-row items-start bg-white overflow-hidden"
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
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          {language == "EN" ? offer.title_en : offer.title_ar}
        </h2>
        <p className="text-gray-700 mb-4">
          {language == "EN"
            ? offer.description_en.slice(0, 80) + "..."
            : offer.description_ar.slice(0, 80) + "..."}
        </p>

        {/* التفاصيل */}
        <div className="details flex flex-col gap-2">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-bold mr-2">
              {language == "EN" ? "Offer Start:" : "بداية العرض :"}
            </span>
            <span>{offer.start_date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-bold mr-2">
              {language == "EN" ? "Offer end:" : "نهاية العرض :"}
            </span>
            <span>{offer.end_date}</span>
          </div>
        </div>
        <div
          onClick={() => toggleOpen(offer)}
          className=" absolute bottom-4 right-4 rounded-full w-12 h-12 hover:bg-sky-400 duration-200 cursor-pointer hover:text-white hover:scale-125 flex items-center justify-center border"
        >
          <FaPenClip className="size-5" />
        </div>
      </div>
      <div
        className={`px-4 py-2 rounded-md shadow-md text-center absolute top-3 right-3  text-white ${
          offerstatuses[offer?.status].color
        }`}
      >
        {offer?.status}
      </div>
      <div
        className={`px-4 py-2 rounded-md shadow-md text-center absolute bottom-3 left-3  text-white ${
          offer?.is_active ? "bg-green-400" : "bg-red-300"
        }`}
      >
        {offer?.is_active ? "عام" : "خاص"}
      </div>
    </motion.div>
  );
}
