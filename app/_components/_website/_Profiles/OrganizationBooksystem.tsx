"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import { UseVariables } from "@/app/context/VariablesContext";

interface Props {
  onClose: () => void;
  form: Record<string, any>;
  setForm: any;
}

export default function OrganizationBooksystem({
  onClose,
  form,
  setForm,
}: Props) {
  const { language } = UseVariables();
  const [isConfirmationEnabled, setIsConfirmationEnabled] = useState<boolean>(
    form.confirmation_status || false
  );
  const [bookingStatus, setBookingStatus] = useState(
    form.booking_status || false
  );
  const [confirmationPrice, setConfirmationPrice] = useState<string | number>(
    form.confirmation_price || 0
  );

  // نصوص اللغات
  const texts: any = {
    EN: {
      title: "Booking Confirmation System",
      enableBooking: "Enable Booking:",
      enableConfirmation: "Enable Confirmation:",
      confirmationPrice: "Confirmation Price:",
      placeholder: "Enter confirmation price",
      save: "Save",
    },
    AR: {
      title: "نظام تأكيد الحجز",
      enableBooking: "تفعيل الحجز:",
      enableConfirmation: "تفعيل التأكيد:",
      confirmationPrice: "سعر التأكيد:",
      placeholder: "أدخل سعر التأكيد",
      save: "حفظ",
    },
  };

  const t = texts[language];

  const handleSave = () => {
    setForm({
      ...form,
      booking_status: bookingStatus,
      confirmation_status: isConfirmationEnabled,
      confirmation_price: confirmationPrice,
    });
    onClose();
  };

  return (
    <div className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-black/50 z-50">
      <motion.div
        className={`w-1/2 max-md:w-full max-lg:w-3/4 max-md:p-2 p-6 bg-white rounded-md shadow-md relative ${
          language === "AR" ? "rtl text-right" : "ltr text-left"
        }`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        {/* زر الإغلاق */}
        <button
          className={`absolute top-4 ${
            language === "AR" ? "left-4" : "right-4"
          } text-gray-500 hover:text-red-500`}
          onClick={onClose}
        >
          <MdClose size={24} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">{t.title}</h2>

        {/* تفعيل الحجز */}
        <div className="flex items-center mb-6 pb-3 border-b border-main_blue">
          <span className="text-gray-700">{t.enableBooking}</span>
          <button
            onClick={() => setBookingStatus(!bookingStatus)}
            className={`w-16 h-8 rounded-full flex items-center mx-4 ${
              bookingStatus ? "bg-blue-500" : "bg-gray-300"
            } transition-colors duration-300`}
          >
            <motion.div
              className="w-6 h-6 bg-white rounded-full shadow-md"
              layout
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                marginLeft: bookingStatus ? "calc(100% - 28px)" : "4px",
              }}
            ></motion.div>
          </button>
        </div>

        {/* باقي المكون يصبح غير قابل للتفاعل عند إيقاف الحجز */}
        <div className={bookingStatus ? "" : "opacity-50 cursor-not-allowed"}>
          {/* تفعيل التأكيد */}
          <div className="flex items-center mb-4">
            <span className="text-gray-700">{t.enableConfirmation}</span>
            <button
              onClick={() =>
                bookingStatus &&
                setIsConfirmationEnabled(!isConfirmationEnabled)
              }
              className={`w-16 h-8 rounded-full flex items-center mx-4 ${
                isConfirmationEnabled ? "bg-blue-500" : "bg-gray-300"
              } transition-colors duration-300`}
              disabled={!bookingStatus}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                layout
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  marginLeft: isConfirmationEnabled
                    ? "calc(100% - 28px)"
                    : "4px",
                }}
              ></motion.div>
            </button>
          </div>

          {/* إدخال سعر التأكيد */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="price">
              {t.confirmationPrice}
            </label>
            <input
              type="number"
              id="price"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t.placeholder}
              value={confirmationPrice}
              onChange={(e) => setConfirmationPrice(e.target.value)}
              disabled={!bookingStatus}
            />
          </div>
        </div>
        {/* زر الحفظ */}
        <button
          onClick={handleSave}
          className={`w-full py-2 rounded-md  bg-blue-500 text-white hover:bg-blue-600`}
        >
          {t.save}
        </button>
      </motion.div>
    </div>
  );
}
