"use client";
import React, { useEffect, useState } from "react";
import { useDataContext } from "@/app/context/DataContext";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import {
  MdNotificationsActive,
  MdOutlineNotificationImportant,
} from "react-icons/md";
import { UseVariables } from "@/app/context/VariablesContext";
import { IoCheckmarkDoneSharp, IoNotificationsCircle } from "react-icons/io5";
import Link from "next/link";

export default function NotificationsComponent() {
  const { notifications, makeAllasRead, currentuser } = useDataContext();
  const { language } = UseVariables();

  return (
    <div>
      <div className="flex items-start justify-between p-1">
        <div className="flex items-center mb-3 pb-2 border-b-2 border-main_orange w-fit ">
          <MdNotificationsActive className="text-xl text-main_orange mr-2" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-secend_text">
            {language == "EN" ? "Notifications" : "الإشعارات"}
          </h3>
        </div>
        <div
          onClick={makeAllasRead}
          className="group w-[35px] h-[35px] cursor-pointer  shadow-md flex items-center justify-center border dark:border-gray-700 rounded-full hover:bg-main_orange"
        >
          <IoCheckmarkDoneSharp className="size-6 text-main_orange  group-hover:text-white duration-200" />
        </div>
      </div>

      <ul className="space-y-2 min-h-[20vh] h-fit">
        {notifications.length > 0 ? (
          notifications.map((notification: any) => (
            <motion.li
              style={{ direction: "rtl" }}
              key={notification.id}
              className={`p-3  rounded-lg shadow-sm hover:bg-gray-100  text-white transition ${
                notification.is_read === 0
                  ? "bg-orange-100 border-l-4 border-orange-500 "
                  : "bg-gray-50 dark:bg-gray-300"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700  whitespace-normal">
                  {notification.message.slice(0, 60) + "..."}
                </p>
                {notification.is_read === 0 && (
                  <div className="w-3 h-3 flex items-center justify-center">
                    <IoNotificationsCircle className="size-4 text-main_orange" />
                  </div>
                )}
              </div>
            </motion.li>
          ))
        ) : (
          <div className="w-full h-[50vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <MdOutlineNotificationImportant className="size-6 text-main_orange" />
              <p className="text-sm text-gray-500">
                {language == "EN"
                  ? "No notifications available."
                  : "لا يوجد اشعارات حتى الأن"}
              </p>
            </div>
          </div>
        )}
      </ul>
      {currentuser && (
        <Link
          href={`/allnotifications?profile_name=${
            currentuser.name ? currentuser.name : currentuser.title_en
          }&profileId=${currentuser.id}`}
          className="text-center text-white  rounded-md bg-main_orange w-[98%] h-[40px] mt-5 flex items-center justify-center hover:bg-white hover:border-main_orange border border-transparent hover:text-black hover:scale-105 duration-200   mx-auto"
        >
          {language == "EN" ? "All Notifications" : "جميع الإشعارات"}
        </Link>
      )}
    </div>
  );
}
