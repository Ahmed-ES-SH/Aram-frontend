import { motion } from "framer-motion";
import React from "react";
import Img from "../../Img";
import { FaCalendarAlt, FaTag } from "react-icons/fa";

interface props {
  coupon: any;
  setSelectedCoupone: any;
  selectedCoupoe: any;
}

export default function CouponeCardSelect({
  coupon,
  setSelectedCoupone,
  selectedCoupoe,
}: props) {
  return (
    <>
      <motion.div
        onClick={() => setSelectedCoupone(coupon)}
        className={`relative  duration-150 rounded-lg shadow-lg overflow-hidden cursor-pointer w-full max-md:w-[95%] mx-auto h-[480px] ${
          coupon.id == selectedCoupoe.id ? "bg-sky-300 text-white" : "bg-white"
        } `}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="w-full h-48 relative">
          <Img src={coupon.image} className="w-full h-full object-cover" />
          <div className="flex items-center gap-2 absolute bottom-2 left-3 ">
            <p className="text-white text-sm">
              {coupon.organization ? coupon.organization.title_en : "Aram"}
            </p>
            <Img
              src={
                coupon.organization
                  ? coupon.organization.icon
                    ? coupon.organization.icon
                    : "/logo.png"
                  : "/logo.png"
              }
              className="w-12 h-12 border shadow-md bg-sky-200 rounded-full"
            />
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold  mb-2">{coupon.title_ar}</h2>
          <p className=" mb-4">
            {coupon.description_ar.length > 90
              ? coupon.description_ar.slice(0, 90) + "..."
              : coupon.description_ar.length}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <FaTag className=" mr-2" />
            <span className="">خصم: {coupon.discount_value}%</span>
          </div>

          <div className="flex items-center gap-2  mb-4">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <span className="">
              من {coupon.start_date} إلى {coupon.end_date}
            </span>
          </div>

          <div
            className={`flex items-center justify-center ml-auto rounded-full border bg-gray-100 w-8 h-8  duration-200 cursor-pointer py-1  absolute bottom-2 left-2  `}
          >
            <div
              className={`w-5 h-5 rounded-full  ${
                coupon.id == selectedCoupoe.id ? "bg-sky-400" : "bg-transparent"
              } `}
            ></div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
