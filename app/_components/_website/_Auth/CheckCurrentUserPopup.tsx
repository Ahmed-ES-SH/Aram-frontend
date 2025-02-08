import React from "react";
import { motion } from "framer-motion";
import { MdErrorOutline } from "react-icons/md";

interface props {
  isOpen: any;
  onClose: () => void;
  language: string;
}

const CheckCurrentUserPopup = ({ isOpen = true, onClose, language }: props) => {
  const translations: any = {
    EN: {
      title: "User Not Registered",
      message:
        "It seems you haven't registered yet. Please sign up to access this feature.",
      close: "Close",
    },
    AR: {
      title: "المستخدم غير مسجل",
      message:
        "يبدو أنك لم تقم بالتسجيل بعد. يرجى التسجيل للوصول إلى هذه الميزة.",
      close: "إغلاق",
    },
  };

  const { title, message, close } = translations[language] || translations.EN;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-sm ${"text-left"}`}
          >
            <div className="flex flex-col items-center">
              <MdErrorOutline className="text-red-500 text-6xl mb-4" />
              <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={onClose}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              >
                {close}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default CheckCurrentUserPopup;
