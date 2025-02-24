"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { AiOutlineClose, AiOutlineCopy } from "react-icons/ai";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import { FaCalendarAlt, FaTag } from "react-icons/fa";
import { instance } from "@/app/Api/axios";
import Loading from "../../Loading";

interface OfferPopupDashProps {
  offer: any;
  isOpen: boolean;
  onClose: any;
  setShowSuccessPopup: any;
}

export default function OfferPopupDash({
  offer,
  isOpen,
  onClose,
  setShowSuccessPopup,
}: OfferPopupDashProps) {
  const { language, setlanguage } = UseVariables();
  const orgId = offer.organization_id;
  const [isCopied, setIsCopied] = useState(false);
  const [notification, setNotification] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(offer.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleStatusChange = (newStatus: boolean) => {
    setIsActive(newStatus);
    setShowPopup(true);

    // إعداد محتوى الإشعار بناءً على الحالة المختارة
    if (!newStatus) {
      setNotification(
        `تم رفض طلب نشر العرض "${offer.title_ar}". يرجى التواصل مع الدعم لمزيد من التفاصيل.`
      );
    } else {
      setNotification(
        `تمت الموافقة على طلب نشر العرض "${offer.title_ar}" , تم نشر العرض ضمن العروض والكوبونات المعروضة `
      );
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const response = await instance.post(`/update-offer/${offer.id}`, {
        is_active: isActive ? "1" : "0",
      });
      if (response.status == 200) {
        await instance.post(`/notifications/send`, {
          account_type: "Organization",
          message: notification,
          user_id: orgId,
        });
        setShowSuccessPopup(true);
        setShowPopup(false);
        onClose();
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (loading) return <Loading />;

  return (
    <motion.div
      style={{ direction: language == "EN" ? "ltr" : "rtl" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-md:w-[95%] max-h-[90vh] overflow-y-auto max-w-lg rounded-2xl pb-4 pt-12 mt-12 max-md:mt-32 bg-white shadow-lg"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-gray-900"
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Content */}
        <div className="p-6">
          <div
            style={{ direction: "rtl" }}
            className="flex items-center rounded-md my-2 text-white text-center"
          >
            <p
              onClick={() => setlanguage("AR")}
              className={`flex-1 block py-4 rounded-r-md shadow-sm hover:bg-white hover:text-black duration-150 cursor-pointer ${
                language === "AR" ? "bg-sky-400" : "bg-gray-400"
              }`}
            >
              العربية
            </p>
            <p
              onClick={() => setlanguage("EN")}
              className={`flex-1 block py-4 rounded-l-md shadow-sm hover:bg-white hover:text-black duration-150 cursor-pointer ${
                language === "EN" ? "bg-indigo-400" : "bg-gray-400"
              }`}
            >
              English
            </p>
          </div>
          {/* Offer Image */}
          <div className=" relative h-fit w-full">
            <Img
              src={offer.image}
              className="w-full h-48 rounded-lg object-cover"
            />
            <Img
              src={
                offer?.organization && offer?.organization?.icon
                  ? offer?.organization.icon
                  : "/public"
              }
              className=" absolute bottom-2 right-2 border w-12 h-12 bg-white rounded-full shadow-sm  object-cover"
            />
          </div>

          {/* Offer Details */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {language == "EN" ? offer.title_en : offer.title_ar}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {language == "EN" ? offer.description_en : offer.description_en}
            </p>
          </div>

          {/* Discount Value */}
          <div className="mt-4 flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm">
            <FaTag className="text-yellow-500 text-xl" />
            <span className="text-lg font-semibold text-gray-800">
              {language == "EN" ? "Discount:" : "الخصم:"}
            </span>
            <span className="text-xl font-bold text-green-500">
              {offer.discount_value}%
            </span>
          </div>

          {/* Validity Dates */}
          <div className="mt-2 text-sm text-gray-700 bg-gray-100 p-3 rounded-lg shadow-sm">
            <p className="flex items-center gap-2">
              <FaCalendarAlt className="text-sky-500" />
              {language == "EN" ? "Valid from:" : "بداية التفعيل :"}
              <span className="font-semibold text-gray-800">
                {offer.start_date}
              </span>
            </p>
            <p className="flex items-center gap-2 mt-1">
              <FaCalendarAlt className="text-red-500" />
              {language == "EN" ? "Valid until:" : "نهاية التفعيل :"}
              <span className="font-semibold text-gray-800">
                {offer.end_date}
              </span>
            </p>
          </div>

          {/* Code Box */}
          {offer.status == "active" || offer.status == "expired" ? (
            <div className="mt-6">
              <div className="flex items-center justify-between rounded-lg border border-gray-300 p-4">
                <span className="font-mono text-lg text-gray-800">
                  {offer.code}
                </span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
                >
                  <AiOutlineCopy />
                  {isCopied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-center justify-center rounded-lg border bg-red-400/50 text-white text-center  p-4">
                لم يتم تفعيل العرض حتى الأن
              </div>
            </div>
          )}

          {!offer?.is_active ? (
            <div className="flex mt-4 items-center w-fit mx-auto gap-4  ">
              <button
                onClick={() => handleStatusChange(true)}
                className="px-12 max-md:px-4 hover:bg-white hover:text-black hover:border-green-400 border border-transparent duration-200 py-1 text-center text-white bg-green-400 rounded-md shadow-md"
              >
                نشر
              </button>
              <button
                onClick={() => handleStatusChange(false)}
                className="px-12 max-md:px-4 hover:bg-white hover:text-black hover:border-red-400 border border-transparent duration-200 py-1 text-center text-white bg-red-400 rounded-md shadow-md"
              >
                رفض
              </button>
            </div>
          ) : (
            <div className="flex mt-4 items-center w-fit mx-auto gap-4  ">
              <button
                onClick={() => handleStatusChange(false)}
                className="px-12 max-md:px-4 hover:bg-white hover:text-black hover:border-red-400 border border-transparent duration-200 py-1 text-center text-white bg-red-400 rounded-md shadow-md"
              >
                ايقاف النشر
              </button>
            </div>
          )}
        </div>
      </motion.div>
      {/* Popup لتأكيد الحالة */}
      {showPopup && (
        <div
          style={{ direction: "rtl" }}
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 max-w-md max-md:w-[96%] w-full mx-auto"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {"تأكيد تغيير الحالة"}
            </h3>
            <p className="text-gray-600 mb-4">
              {"سيتم إرسال الإشعار التالي إلى المركز الطبى :"}
            </p>
            <textarea
              style={{ direction: "rtl" }}
              className="w-full p-2 border border-gray-300 rounded-lg outline-none mb-4"
              rows={4}
              value={notification}
              name="notificationcontent"
              onChange={(e) => setNotification(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                {"إلغاء"}
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {"تأكيد"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
