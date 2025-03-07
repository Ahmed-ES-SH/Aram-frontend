"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaTrashAlt } from "react-icons/fa";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import { useDataContext } from "@/app/context/DataContext";

interface Props {
  selectedBooking: any;
  handleDelete: any;
  onClose: any;
}

export default function DeleteBooking({
  selectedBooking,
  handleDelete,
  onClose,
}: Props) {
  const { language } = UseVariables();
  const { type } = useDataContext();
  // النصوص حسب اللغة
  const translations: any = {
    AR: {
      confirmDelete: "تأكيد الحذف",
      bookingId: "رقم الحجز",
      date: "التاريخ",
      time: "الوقت",
      status: "الحالة",
      clientName: "اسم العميل",
      orgName: "اسم المركز",
      delete: "حذف",
      cancel: "إلغاء",
    },
    EN: {
      confirmDelete: "Confirm Deletion",
      bookingId: "Booking ID",
      date: "Date",
      time: "Time",
      status: "Status",
      clientName: "Client Name",
      orgName: "Organization Name",
      delete: "Delete",
      cancel: "Cancel",
    },
  };

  const t = translations[language] || translations.EN;

  return (
    <>
      <div className="w-full h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-secend_dash dark:text-white rounded-lg shadow-2xl p-6 w-3/4 sm:w-1/2 md:w-1/3 border dark:border-gray-700 border-gray-200"
        >
          {/* Header */}
          <h3 className="text-xl font-semibold mb-6 text-center pb-2 border-b border-red-600 w-fit mx-auto">
            {t.confirmDelete}
          </h3>

          {/* User Profile and Booking Information */}
          <div className="flex items-center space-x-4 mb-6 border-b border-gray-300 pb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-200"
            >
              {/* صورة المستخدم */}
              <Img
                src={
                  type != "Organization"
                    ? selectedBooking?.organization?.icon
                    : selectedBooking?.user?.image || "/avatars/avatar_male.png"
                }
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="text-sm">
              <div>
                <strong>
                  {type != "Organization" ? t.orgName : t.clientName}:
                </strong>
                <p>
                  {type != "Organization"
                    ? selectedBooking?.organization?.title_en
                    : selectedBooking?.user?.name || "Unavailable"}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <strong>{t.bookingId}:</strong>
              <p>{selectedBooking?.id}</p>
            </div>
            <div className="flex justify-between">
              <strong>{t.date}:</strong>
              <p>{selectedBooking?.book_day}</p>
            </div>
            <div className="flex justify-between">
              <strong>{t.time}:</strong>
              <p>{`${selectedBooking?.book_time} - ${selectedBooking?.expire_in}`}</p>
            </div>
            <div className="flex justify-between">
              <strong>{t.status}:</strong>
              <p>{selectedBooking?.status}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-4">
            <motion.button
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleDelete(selectedBooking)}
              className="px-6 py-2 bg-red-500 text-white rounded-md border border-transparent  flex items-center space-x-2 hover:bg-white hover:text-black hover:scale-110 hover:border-red-500 duration-200"
            >
              <FaTrashAlt />
              <span>{t.delete}</span>
            </motion.button>
            <motion.button
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={onClose} // Close or cancel delete
              className="px-6 py-2 bg-gray-300 text-black rounded-md border border-transparent  flex items-center space-x-2 hover:bg-white hover:text-black hover:scale-110 hover:border-gray-500 duration-200"
            >
              <FaUserCircle />
              <span>{t.cancel}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
