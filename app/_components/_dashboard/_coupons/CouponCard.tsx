import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaTag,
  FaBuilding,
  FaLayerGroup,
  FaEye,
} from "react-icons/fa";
import Img from "../../Img";
import CouponPopup from "./CouponPopup";
import SuccessPopup from "../SuccessPopup";
import { instance } from "@/app/Api/axios";

interface OfferCardProps {
  coupone: {
    id: number;
    title_ar: string;
    title_en: string;
    image: string;
    description_ar: string;
    description_en: string;
    discount_value: string;
    start_date: string;
    end_date: string;
    organization: {
      title_ar: string;
      title_en: string;
      image: string;
      icon: string;
    };
    category: {
      title_ar: string;
      title_en: string;
      image: string;
    };
  };
  setCoupons: any;
}

export default function CouponCard({ coupone, setCoupons }: OfferCardProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCoupone, setSelectedCoupone] = useState({ ...coupone });
  const [showSuccessPopoup, setShowSuccessPopoup] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await instance.delete(
        `/destroy-copone/${selectedCoupone.id}`
      );

      if (response.status === 200) {
        setCoupons((prevData: any) =>
          prevData.filter((coupon: any) => coupon.id != coupone.id)
        );
        setShowSuccessPopoup(true);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <motion.div
        className="relative bg-white rounded-lg shadow-lg overflow-hidden w-full h-[480px]"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Img
          src={selectedCoupone.image ? selectedCoupone.image : "/public"}
          className="w-full h-48 object-cover"
        />

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {selectedCoupone.title_ar}
          </h2>
          <p className="text-gray-600 mb-4">
            {selectedCoupone.description_ar.length > 90
              ? selectedCoupone.description_ar.slice(0, 90) + "..."
              : selectedCoupone.description_ar}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <FaTag className="text-gray-500 mr-2" />
            <span className="text-gray-700">
              خصم: {selectedCoupone.discount_value}%
            </span>
          </div>

          <div className="flex items-center gap-2  mb-4">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <span className="text-gray-700">
              من {selectedCoupone.start_date} إلى {selectedCoupone.end_date}
            </span>
          </div>

          <div
            onClick={() => setIsPopupOpen(true)}
            className="flex items-center justify-center ml-auto rounded-full border bg-gray-100 hover:text-white hover:bg-sky-400 duration-200 cursor-pointer py-1 "
          >
            <FaEye className="size-6" />
          </div>

          <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md">
            <div className="flex items-center gap-2  mb-2">
              <Img
                src={
                  selectedCoupone.organization
                    ? selectedCoupone.organization.icon
                      ? selectedCoupone.organization.icon
                      : "/logo.png"
                    : "/logo.png"
                }
                className="w-5 h-5 rounded-full"
              />
              <span className="text-gray-700">
                {selectedCoupone.organization
                  ? selectedCoupone.organization.title_ar
                  : "Aram"}
              </span>
            </div>

            <div className="flex items-center gap-2 ">
              <Img
                src={
                  selectedCoupone.category
                    ? selectedCoupone.category.image
                      ? selectedCoupone.category.image
                      : "/logo.png"
                    : "/logo.png"
                }
                className="w-5 h-5 rounded-full"
              />
              <span className="text-gray-700">
                {selectedCoupone.category.title_ar
                  ? selectedCoupone.category.title_ar
                  : "لم يتم تحديد قسم لهذا الكوبون"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      {isPopupOpen && (
        <CouponPopup
          coupon={selectedCoupone}
          setCoupon={setSelectedCoupone}
          setShowSuccessPopoup={setShowSuccessPopoup}
          onClose={() => setIsPopupOpen(false)}
          handleDelete={handleDelete}
        />
      )}
      {showSuccessPopoup && (
        <SuccessPopup
          message="تم تحديث بيانات الكوبون بنجاح"
          onClose={() => setShowSuccessPopoup(false)}
        />
      )}
    </>
  );
}
