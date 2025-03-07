"use client";
import { useDataContext } from "@/app/context/DataContext";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { MdNotificationsActive } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { UseVariables } from "@/app/context/VariablesContext";

export default function Notificationpopup() {
  const { language } = UseVariables();
  const { newNotification, currentuser, setnewNotification } = useDataContext();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100); // نسبة التقدم في الخط

  const clearnewnot = () => {
    setIsVisible(false);
    setnewNotification(null); // إعادة تعيين الإشعار بعد إغلاقه
    setProgress(100);
  };

  // عند وصول إشعار جديد، نظهر الـ popup
  useEffect(() => {
    if (newNotification) {
      setIsVisible(true);
      // تقليص الخط تدريجياً
      let timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress <= 0) {
            clearInterval(timer);
            clearnewnot(); // إغلاق الإشعار بعد انتهاء الوقت
            return 0;
          }
          return prevProgress - 1;
        });
      }, 30); // تقليص الخط بنسبة 1% كل 30 مللي ثانية

      // إخفاء الـ popup بعد 3 ثوانٍ إذا لم يتم إغلاقه
      const timeout = setTimeout(clearnewnot, 3000);

      // تنظيف التايمر عند إنهاء التفاعل
      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }
  }, [newNotification]); // يعتمد على newNotification فقط

  // التحقق إذا كان `newNotification` موجودًا
  useEffect(() => {
    if (newNotification) {
      setIsVisible(true);
    }
  }, [newNotification]);

  if (
    currentuser && // تأكد من وجود currentuser
    currentuser.id && // تأكد من أن currentuser.id موجود
    newNotification && // تأكد من وجود newNotification
    newNotification.user_id && // تأكد من أن newNotification.user_id موجود
    currentuser.id != newNotification.user_id
  ) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {currentuser && newNotification && isVisible && (
          <motion.div
            className={`fixed top-20 ${
              language == "EN" ? "right-4" : "left-4"
            } bg-main_orange text-white p-4 rounded-lg shadow-lg w-72`}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MdNotificationsActive className="text-xl mr-2" />
                <p className="text-sm">
                  {newNotification.message &&
                    newNotification.message.slice(0, 60) + "..."}
                </p>
              </div>
              <AiOutlineClose
                className="text-xl cursor-pointer"
                onClick={clearnewnot}
              />
            </div>
            {/* خط يتناقص تدريجياً */}
            <div className="w-full mt-2 h-1 bg-white">
              <motion.div
                className="h-full bg-yellow-400"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
