"use client";
import Img from "@/app/_components/Img";
import { instance } from "@/app/Api/axios";
import { useDataContext } from "@/app/context/DataContext";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { FaCrosshairs } from "react-icons/fa6";
import Loading from "../../Loading";

interface Props {
  data: any;
  onClose: () => void;
  setShowSuccessPopup: any;
}

const statuses: any = {
  allow: {
    label: "مسموح",
    color: "bg-green-500",
    hover: "hover:bg-green-500",
    icon: <FaCheckCircle />,
  },
  not_allow: {
    label: "غير مسموح",
    color: "bg-red-500",
    hover: "hover:bg-red-500",
    icon: <FaCrosshairs />,
  },
  under_review: {
    label: "قيد المراجعة",
    color: "bg-yellow-500",
    hover: "hover:bg-yellow-500",
    icon: <FaClock />,
  },
};

export default function CardPopup({
  data,
  onClose,
  setShowSuccessPopup,
}: Props) {
  const orgId = data && data.organization_id;
  const [status, setStatus] = useState("");
  const [lang, setLang] = useState("ar");
  const [notificationContent, setNotificationContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setShowPopup(true);

    // إعداد محتوى الإشعار بناءً على الحالة المختارة
    if (newStatus === "not_allow") {
      setNotificationContent(
        `تم رفض طلب البطاقة "${data.title_ar}". يرجى التواصل مع الدعم لمزيد من التفاصيل.`
      );
    } else if (newStatus === "under_review") {
      setNotificationContent(
        `طلب البطاقة "${data.title_ar}" قيد المراجعة. سنقوم بالتواصل معك قريبًا.`
      );
    } else {
      setNotificationContent(
        `تمت الموافقة على طلب البطاقة "${data.title_ar}" , تم نشر البطاقة ضمن البطاقات المعروضة `
      );
    }
  };

  const handleConfirm = async () => {
    try {
      if (status.trim() == "") {
        return;
      }
      setLoading(true);
      const response = await instance.post(
        `/update-affiliate-card-type/${data.id}`,
        {
          status: status,
        }
      );
      if (response.status == 200) {
        await instance.post(`/notifications/send`, {
          account_type: "Organization",
          message: notificationContent,
          user_id: orgId,
        });
        setShowSuccessPopup(true);
        onClose();
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full h-screen fixed top-0 left-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white relative shadow-lg rounded-2xl p-6"
      >
        <div className="flex items-center rounded-md my-2 text-white text-center">
          <p
            onClick={() => setLang("ar")}
            className={`flex-1 block py-4 rounded-r-md shadow-sm hover:bg-white hover:text-black duration-150 cursor-pointer ${
              lang === "ar" ? "bg-sky-400" : "bg-gray-400"
            }`}
          >
            العربية
          </p>
          <p
            onClick={() => setLang("en")}
            className={`flex-1 block py-4 rounded-l-md shadow-sm hover:bg-white hover:text-black duration-150 cursor-pointer ${
              lang === "en" ? "bg-indigo-400" : "bg-gray-400"
            }`}
          >
            English
          </p>
        </div>
        <div style={{ direction: lang === "en" ? "ltr" : "rtl" }}>
          <div className="w-full h-64 relative rounded-xl mb-4">
            <Img
              src={data.image ? data.image : "/public"}
              className="object-cover w-full h-full"
            />
            <div
              className={`absolute top-2 ${
                statuses[data?.status].color
              } left-3 w-fit my-4 px-8 py-1 text-center text-white  rounded-md shadow-md hover:bg-white hover:text-black hover:border-red-400 border border-transparent duration-200 cursor-pointer`}
            >
              {data.status && data.status}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {lang === "en" ? data.title_en : data.title_ar}
          </h2>
          <p className="text-gray-600 mb-4">
            {lang === "en" ? data.description_en : data.description_ar}
          </p>
          <div className="text-lg font-semibold text-gray-800 mb-2">
            {lang === "en" ? "Price" : "السعر"}:
            <span className="text-green-600">{data.price}$</span>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            {lang === "en" ? "duration" : "المدة"}: {data.duration}
            {lang === "en" ? " month" : " شهر"}
          </div>
          <ul className="list-disc pl-5 mb-4 text-gray-700">
            {(lang === "en" ? data.features_en : data.features_ar).map(
              (feature: any, index: number) => (
                <li key={index}>{feature}</li>
              )
            )}
          </ul>
        </div>
        <div className="flex items-center justify-between w-[90%] mx-auto gap-3">
          {Object.keys(statuses).map((key) => (
            <button
              key={key}
              onClick={() => handleStatusChange(key)}
              className={`flex ${
                statuses[key].hover
              } items-center gap-2 text-white px-4 py-2 rounded-lg transition-all ${
                status === key ? `${statuses[key].color}` : "bg-gray-400"
              }`}
            >
              {statuses[key].icon} {statuses[key].label}
            </button>
          ))}
        </div>
        <div
          onClick={onClose}
          className="my-4 px-2 py-1 text-center text-white bg-red-400 rounded-md shadow-md hover:bg-white hover:text-black hover:border-red-400 border border-transparent duration-200 cursor-pointer"
        >
          إغلاق
        </div>
      </motion.div>

      {/* Popup لتأكيد الحالة */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {lang === "en" ? "Confirm Status Change" : "تأكيد تغيير الحالة"}
            </h3>
            <p className="text-gray-600 mb-4">
              {lang === "en"
                ? "The following notification will be sent to the user:"
                : "سيتم إرسال الإشعار التالي إلى المركز الطبى :"}
            </p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg outline-none mb-4"
              rows={4}
              value={notificationContent}
              name="notificationcontent"
              onChange={(e) => setNotificationContent(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                {lang === "en" ? "Cancel" : "إلغاء"}
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {lang === "en" ? "Confirm" : "تأكيد"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
