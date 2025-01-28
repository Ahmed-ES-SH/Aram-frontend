import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCreditCard,
  FaCalendarAlt,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Img from "../../Img";
import ProductCard from "../ProductCard";
import CardComponent from "../Cardcomponent";
import { TbExclamationMark } from "react-icons/tb";
import { SiAwssecretsmanager } from "react-icons/si";

// واجهة البطاقة
interface Card {
  id: number;
  user_id: number;
  card_number: string;
  cardtype_id: number;
  cvv: number;
  issue_date: string;
  expiry_date: string;
  status: string;
  card_type: {
    title_en: string;
    duration: string;
    image: string;
  };
}

// Props للـ Popup
interface PopupProps {
  card: Card;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ card, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-br mt-10 from-purple-600 to-blue-500 rounded-lg shadow-2xl p-6 w-1/2 max-md:w-[95%] relative overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* زر الإغلاق */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition duration-300"
          >
            <FaTimes className="text-xl" />
          </button>

          {/* صورة البطاقة */}
          <motion.div
            className="flex justify-center mb-6 "
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <CardComponent
              bg_img={card.card_type.image || "/cards/card_2.png"}
              width="w-80"
              card={card}
            />
          </motion.div>

          {/* عنوان البطاقة */}
          <motion.h2
            className="text-2xl  font-bold text-center text-white mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {card.card_type.title_en}
          </motion.h2>

          {/* بيانات البطاقة */}
          <motion.div
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <div className="flex items-center justify-between bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center text-white">
                <FaCreditCard className="mr-2" />
                <span>رقم البطاقة:</span>
              </div>
              <span className="font-semibold text-white">
                {card.card_number}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center text-white">
                <FaCalendarAlt className="mr-2" />
                <span>تاريخ الإصدار:</span>
              </div>
              <span className="font-semibold text-white">
                {card.issue_date}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center text-white">
                <FaCalendarAlt className="mr-2" />
                <span>تاريخ الانتهاء:</span>
              </div>
              <span className="font-semibold text-white">
                {card.expiry_date}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center text-white">
                <SiAwssecretsmanager className="mr-2" />
                <span>CVV :</span>
              </div>
              <span className="font-semibold text-white">{card.cvv}</span>
            </div>
            <div className="flex items-center justify-between bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center text-white">
                {card.status === "active" ? (
                  <FaCheckCircle className="mr-2 text-green-300" />
                ) : card.status === "expired" ? (
                  <FaTimesCircle className="mr-2 text-red-300" />
                ) : (
                  <TbExclamationMark className="mr-2 text-yellow-300" />
                )}
                <span>الحالة:</span>
              </div>
              <span
                className={`font-semibold ${
                  card.status === "active" ? "text-green-300" : "text-red-300"
                }`}
              >
                {card.status === "active" ? "نشطة" : "غير نشطة"}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center text-white">
                <FaCalendarAlt className="mr-2" />
                <span>مدة الصلاحية:</span>
              </div>
              <span className="font-semibold text-white">
                {card.card_type.duration}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Popup;
