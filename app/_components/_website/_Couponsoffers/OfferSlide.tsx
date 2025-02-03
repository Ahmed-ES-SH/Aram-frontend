import React from "react";
import { motion } from "framer-motion";
import Img from "../../Img";
import { FcOrganization } from "react-icons/fc";
import { UseVariables } from "@/app/context/VariablesContext";
import { LiaArrowRightSolid } from "react-icons/lia";
import Link from "next/link";

interface Props {
  offer: any;
  toggleOpen: any;
}

export default function OfferSlide({ toggleOpen, offer }: Props) {
  const { language } = UseVariables();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group cursor-pointer w-full mx-auto bg-white dark:bg-secend_dash rounded-xl shadow-lg overflow-hidden"
    >
      {/* صورة العرض */}
      <div className="relative w-full h-[40vh]">
        <Img
          src={offer.image ? offer.image : "/public"}
          className="w-full h-full object-cover"
        />

        {/* طبقة Overlay لجعل النصوص أكثر وضوحًا */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <motion.div
          className={`absolute flex items-center justify-start p-2 w-[300px] max-md:w-[200px] max-md:left-2 overflow-hidden duration-300   left-10  rounded-b-md bg-sky-300 top-0 h-[38vh] `}
        >
          <div className="content">
            <div className="flex items-start gap-1 ">
              <h1 className="text-black  font-bold  whitespace-nowrap text-left text-xl max-md:text-md">
                {language == "EN" ? offer.title_en : offer.title_ar}
              </h1>
            </div>
            <p
              style={{ overflowWrap: "anywhere" }}
              className="text-left text-[14px] mt-4"
            >
              {language == "EN"
                ? offer.description_en.slice(0, 40) + "..."
                : offer.description_ar.slice(0, 40) + "..."}
            </p>
            <p className="text-white text-left flex items-center gap-2 mt-8">
              <FcOrganization className="size-5" />
              <span className=" font-bold">
                {language == "EN"
                  ? offer?.organization?.title_en
                  : offer?.organization?.title_ar}
              </span>
            </p>
            <p
              onClick={() => toggleOpen(offer)}
              className="flex items-center duration-200 hover:scale-110  underline absolute bottom-4 left-6 max-md:left-2 gap-2"
            >
              <p className="max-md:text-[14px] ">
                {language == "EN" ? "Get the Offer" : "إحصل على العرض الأن"}
              </p>
              <motion.div
                animate={{ translateX: "10px" }}
                transition={{ duration: 1.1, repeat: Infinity }}
              >
                <LiaArrowRightSolid className="size-6 max-md:size-4 text-indigo-800" />
              </motion.div>
            </p>
          </div>
        </motion.div>
        <div className="w-12 h-12 absolute top-2 right-2 bg-white rounded-full border flex items-center justify-center">
          <Img
            src={offer.organization.icon ? offer.organization.icon : "/public"}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex items-center gap-2 absolute right-2 group-hover:bottom-2 -bottom-8 duration-200">
          <p className=" text-white text-xl">
            {language == "EN"
              ? offer?.category?.title_en
              : offer?.category?.title_ar}
          </p>
          <Img
            src={offer?.category?.image ? offer?.category?.image : "/public"}
            className="w-7 h-7 rounded-full object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}
