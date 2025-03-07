"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaCheckCircle, FaPen } from "react-icons/fa";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import { instance } from "@/app/Api/axios";

interface Props {
  selectedBooking: any;
  setLoading: any;
  onClose: any;
  setIsPopupVisible: any;
  setsuccessPopupMessage: any;
}

export default function AcceptedBooking({
  selectedBooking,
  setLoading,
  onClose,
  setIsPopupVisible,
  setsuccessPopupMessage,
}: Props) {
  const { language } = UseVariables();
  // النصوص حسب اللغة
  const translations: any = {
    AR: {
      confirmAcceptance: "تأكيد الحجز",
      bookingId: "رقم الحجز",
      date: "التاريخ",
      time: "الوقت",
      status: "الحالة",
      clientName: "اسم العميل",
      confirm: "تأكيد",
      cancel: "إلغاء",
    },
    EN: {
      confirmAcceptance: "Confirm Booking",
      bookingId: "Booking ID",
      date: "Date",
      time: "Time",
      status: "Status",
      clientName: "Client Name",
      confirm: "Confirm",
      cancel: "Cancel",
    },
  };
  const t = translations[language] || translations.EN;

  const [notification, setNotification] = useState(
    selectedBooking.organization.accaptable_message
  );
  const [editNotification, setEditNotification] = useState(false);

  const handleAccepted = async (selectedBook: any, book_status: string) => {
    try {
      setLoading(true);
      const response = await instance.post(
        `/update-book-status/${selectedBook.id}`,
        {
          status: book_status,
        }
      );
      if (response.status == 200) {
        const data = response.data.data;
        selectedBook.status = data.status;
      }
      const formData = new FormData();
      formData.append("message", notification);
      formData.append("account_type", "user");
      formData.append("book_day", selectedBook.book_day);
      formData.append("book_time", selectedBook.book_time);
      formData.append("additional_notes", selectedBook.additional_notes);
      const res = await instance.post(
        `/sendAccaptedNotification/${selectedBook.user.id}/${selectedBook.organization.id}`,
        formData
      );
      if (res.status == 200) {
        setIsPopupVisible(true);
        setsuccessPopupMessage({
          ar: "تم الموافقة على طلب الحجز وتم إرسال اشعار الى حساب المستخدم ",
          en: "The reservation request has been approved and a notification has been sent to the user's account",
        });
        setLoading(false);
      }

      onClose();
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-secend_dash dark:text-white rounded-lg shadow-2xl p-6 w-1/2 max-md:w-[95%] border dark:border-gray-700 border-gray-200"
        >
          {/* Header */}
          <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-green-500 w-fit mx-auto text-center">
            {t.confirmAcceptance}
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
                src={selectedBooking?.user?.image || "/avatars/avatar_male.png"}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="text-sm">
              <div>
                <strong>{t.clientName}:</strong>
                <p>{selectedBooking?.user?.name || "غير متاح"}</p>
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

          <div className="flex relative overflow-hidden group flex-col gap-2 my-2 w-full pt-2 border-t border-main_orange">
            <label className="block text-sm font-medium text-gray-700  dark:text-gray-300">
              {language == "EN"
                ? "A notification will be sent to the customer about the approval of his reservation request, the content of which is the approval text from the center’s profile. You can click on the edit mark to modify the content of the notification."
                : " سيتم إرسال إشعار الى العميل بالموافقة على طلب الحجز الخاص به محتواه نص الموافقة من الملف الشخصى الخاص بالمركز يمكنك الضغط على علامة التعديل لتعديل محتوى الإشعار ."}
            </label>
            <textarea
              placeholder={
                language == "EN" ? "Notification ...." : "نص الإشعار ...."
              }
              name="notification"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNotification(e.target.value)
              }
              value={
                selectedBooking &&
                selectedBooking?.organization?.accaptable_message
              }
              disabled={!editNotification}
              className="dark:bg-main_dash h-[15vh] bg-gray-100 disabled:bg-gray-400 disabled:placeholder:text-white disabled:cursor-not-allowed  mt-1 py-2 border-none duration-200 px-2  outline-none  w-full rounded-md border-gray-200 dark:border-gray-700  text-sm text-black  dark:text-gray-300  shadow-sm"
            />
            {!editNotification && (
              <div
                onClick={() => setEditNotification(true)}
                className="p-2 absolute text-white left-2 -bottom-80 group-hover:bottom-2 rounded-md bg-main_blue hover:scale-105 duration-150 cursor-pointer"
              >
                <FaPen className="size-5  " />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-4">
            <motion.button
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleAccepted(selectedBooking, "acceptable")}
              className="px-6 py-2 bg-green-500 text-white rounded-md border border-transparent flex items-center space-x-2 hover:bg-white hover:text-black hover:scale-110 hover:border-green-500 duration-200"
            >
              <FaCheckCircle />
              <span>{t.confirm}</span>
            </motion.button>
            <motion.button
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={onClose} // Close or cancel confirmation
              className="px-6 py-2 bg-gray-300 text-black rounded-md border border-transparent flex items-center space-x-2 hover:bg-white hover:text-black hover:scale-110 hover:border-gray-500 duration-200"
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
