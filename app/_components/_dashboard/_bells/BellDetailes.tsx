"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaClinicMedical,
  FaCalendarAlt,
  FaReceipt,
} from "react-icons/fa";

export default function BellDetails({ bellData }: any) {
  if (!bellData) {
    return <p className="text-center text-red-500">لا توجد بيانات للعرض</p>;
  }

  const { id, bell_items, bell_type, amount, created_at, user } = bellData;

  const items =
    typeof bell_items === "string" ? JSON.parse(bell_items) : bell_items;
  const location = user.location ? JSON.parse(user.location) : null;

  return (
    <div className="w-full min-h-[90vh] py-4 overflow-y-auto max-md:p-2 max-md:h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl max-md:mt-[350px] w-full min-h-[70vh] h-fit mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8"
      >
        {/* Invoice Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <FaReceipt className="text-blue-500 text-4xl" />
            تفاصيل الفاتورة
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>رقم الفاتورة:</strong> {id}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>نوع الفاتورة:</strong>{" "}
                {bell_type === "cards_bell" ? "بطاقات" : "حجز موعد"}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>المبلغ:</strong> {amount} دولار
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>تاريخ الإنشاء:</strong>{" "}
                {new Date(created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        {bell_type !== "confirm_booked" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="border-b border-gray-200 dark:border-gray-700 py-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              عناصر الفاتورة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                >
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>اسم البطاقة:</strong> {item.title}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>السعر:</strong> {item.price} ريال
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>الكمية:</strong> {item.quantity}
                  </p>
                  {item.duration && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>المدة:</strong> {item.duration}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Booking Details */}
        {bell_type === "confirm_booked" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="border-b border-gray-200 dark:border-gray-700 py-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center gap-3 mb-6">
              <FaCalendarAlt className="text-green-500 text-3xl" />
              تفاصيل الحجز
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>تاريخ الحجز:</strong> {items.book_day}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>وقت الحجز:</strong> {items.book_time}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>ينتهي في:</strong> {items.expire_in}
                </p>
              </div>
              {items.additional_notes && (
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg col-span-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>ملاحظات إضافية:</strong> {items.additional_notes}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* User/Clinic Details */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
            {user.account_type === "User" ? (
              <FaUser className="text-purple-500 text-3xl" />
            ) : (
              <FaClinicMedical className="text-red-500 text-3xl" />
            )}
            تفاصيل {user.account_type === "User" ? "المستخدم" : "المركز الطبي"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.account_type === "User" ? (
              <>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>اسم المستخدم:</strong> {user.name}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>البريد الإلكتروني:</strong> {user.email}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>رقم الهاتف:</strong> {user.phone_number}
                  </p>
                </div>
                {location && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg md:col-span-2">
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>العنوان:</strong> {location.address}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>اسم المركز:</strong>{" "}
                    {user.title_en + " / " + user.title_ar}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>البريد الإلكتروني:</strong> {user.email}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>رقم الهاتف:</strong> {user.phone_number}
                  </p>
                </div>
                {location && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg md:col-span-2">
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>العنوان:</strong> {location.address}
                    </p>
                  </div>
                )}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg md:col-span-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>الوصف:</strong>{" "}
                    {user.description_ar &&
                      user.description_ar.slice(0, 90) + "..."}
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
