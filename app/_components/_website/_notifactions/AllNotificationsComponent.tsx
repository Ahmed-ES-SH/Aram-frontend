"use client";
import { instance } from "@/app/Api/axios";
import { useDataContext } from "@/app/context/DataContext";
import React, { useEffect, useState } from "react";
import Loading from "../../Loading";
import { motion } from "framer-motion";
import Pusher from "pusher-js";
import { UseVariables } from "@/app/context/VariablesContext";
import { IoNotificationsOffSharp, IoAlertCircleSharp } from "react-icons/io5";
import { MdDone, MdNotificationsActive } from "react-icons/md";
import Footer from "../Footer";

export default function AllNotificationsComponent() {
  const { currentuser, type } = useDataContext();
  const { language } = UseVariables();
  const id = currentuser && currentuser.id;
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await instance.get(`/notifications/${id}/${type}`);
        if (response.status === 200) {
          setNotifications(response.data.data);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getdata();
  }, [id, type]);

  useEffect(() => {
    const pusher = new Pusher("b28882360e35f7d42d06", { cluster: "eu" });
    const channel = pusher.subscribe("notifications");

    channel.bind("NotificationEvent", (datachat: any) => {
      setNotifications((prev) => [datachat, ...prev]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const getIcon = (is_read: boolean) =>
    is_read ? (
      <MdDone className="text-green-500 text-xl" />
    ) : (
      <MdNotificationsActive className="text-yellow-500 text-xl" />
    );

  if (loading) return <Loading />;

  return (
    <>
      <div style={{ direction: "rtl" }} className="w-full  px-4 pb-6 pt-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {language == "EN" ? "Notifications" : "الإشعارات"}
        </h1>
        <div className="space-y-4 w-full h-screen overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <motion.div
                key={index}
                className={`flex items-start p-4 bg-white dark:bg-secend_dash shadow-lg rounded-lg border ${
                  notification.read ? "border-gray-300" : "border-main_orange"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mr-4">{getIcon(notification.is_read)}</div>
                <div className="flex-grow">
                  <h2
                    style={{ overflowWrap: "anywhere" }}
                    className={`text-lg font-semibold pb-2 ${
                      notification.read
                        ? "text-gray-700 dark:text-secend_text"
                        : "text-main_orange"
                    }`}
                  >
                    {notification.message &&
                      notification.message.slice(0, 40) + "..."}
                  </h2>
                  <p
                    style={{ overflowWrap: "anywhere" }}
                    className="text-gray-600 dark:text-gray-300 text-sm"
                  >
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {new Date(notification.created_at).toLocaleString("ar-EG")}
                  </span>
                </div>
                {!notification.is_read && (
                  <span className="bg-main_orange text-white text-xs py-1 px-2 rounded-full">
                    {language == "EN" ? "New" : "جديد"}
                  </span>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center h-[90vh] flex items-center justify-center text-gray-500 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col gap-4 items-center justify-center">
                <IoNotificationsOffSharp className="text-4xl text-main_orange" />
                <p className="whitespace-nowrap">
                  {language === "EN"
                    ? "No Notifications Available."
                    : "لا توجد إشعارات جديدة."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
