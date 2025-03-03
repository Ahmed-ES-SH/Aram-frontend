"use client";
import { instance } from "@/app/Api/axios";
import { useDataContext } from "@/app/context/DataContext";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns"; // لتنسيق الوقت إلى صيغة أكثر ملاءمة مثل "منذ 5 دقائق"
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import { RiChatOffLine } from "react-icons/ri";
import Link from "next/link";
import { GiConversation } from "react-icons/gi";
import Loading from "../../Loading";
import { CiImageOn, CiMicrophoneOn } from "react-icons/ci";
import { FcAbout } from "react-icons/fc";

export default function ConversationSidebar() {
  const { currentuser, type } = useDataContext();
  const { language } = UseVariables();
  const userId = currentuser && currentuser.id;
  const [conversations, setConversations] = useState<any[]>([]);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(0);

  const openToggle = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await instance.get(
          `/get-user-conversations-with-lastmessage/${userId}/${type}`
        );
        if (response.status === 200) {
          const data = response.data.data;
          setConversations(data);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) getConversations();
  }, [userId]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // إضافة مستمع الحدث
    window.addEventListener("resize", handleResize);

    // إزالة المستمع عند فك الارتباط
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (width >= 1020) {
      setOpen(true);
    }
  }, [width]);

  if (loading) return <Loading />;

  return (
    <>
      <div
        className={` h-screen overflow-y-auto   w-[350px] max-lg:fixed top-24 left-0 max-lg:z-[999] flex items-center ${
          open ? "w-[350px] p-1" : "w-fit p-0"
        }`}
      >
        <div
          className={` h-full  duration-300 overflow-x-hidden  overflow-y-auto bg-gray-100 dark:bg-main_dash  border-r border-gray-200 dark:border-gray-700 ${
            open ? "w-[300px] p-1" : "w-0 p-0"
          }`}
        >
          <div className="space-y-3 mt-1">
            {conversations.length === 0 ? (
              <div className="h-[90vh] flex items-center justify-center">
                <div className="flex flex-col gap-3 items-center justify-center">
                  <FcAbout className="size-56 text-gray-400" />
                  <p className="text-gray-500">
                    {language == "EN"
                      ? "There are no conversations currently."
                      : "لا توجد محادثات حالياً."}
                  </p>
                </div>
              </div>
            ) : (
              conversations.map((conversation) => {
                const otherParty = conversation.other_party;
                const lastMessage =
                  conversation.last_message || "لا توجد رسائل بعد.";
                const lastMessageTime = conversation.last_message_time;
                const lastMessageType = conversation.last_message_type;
                const unreadMessages = conversation.unread_messages_count;

                return (
                  <Link
                    href={`/conversations/${conversation.id}?conversationId=${conversation.id}&account_type=${type}&userId=${userId}`}
                    key={conversation.id}
                    className=" flex relative items-center space-x-3 mt-5   cursor-pointer hover:scale-105 duration-150 border-b bg-white dark:bg-secend_dash rounded-md shadow-md p-3 border-main_orange pb-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200">
                      {/* صورة الطرف الآخر */}
                      {otherParty?.icon ? (
                        <Img
                          src={
                            otherParty && otherParty.icon
                              ? otherParty.icon
                              : "/avatars/avatar_male.png"
                          }
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <Img
                          src={
                            otherParty && otherParty.image
                              ? otherParty.image
                              : "/avatars/avatar_male.jpg"
                          }
                          className="w-full h-full object-cover rounded-full"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold whitespace-nowrap max-lg:text-[8px] text-gray-800 dark:text-secend_text">
                        {otherParty?.title_en
                          ? otherParty?.title_en.slice(0, 10) + "..."
                          : otherParty?.name.slice(0, 10) + "..."}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {lastMessageType == "image" ? (
                          <CiImageOn className="size-5" />
                        ) : lastMessageType == "audio" ? (
                          <CiMicrophoneOn className="size-5" />
                        ) : (
                          lastMessage
                        )}
                      </p>
                    </div>
                    <div className="text-[8px] text-gray-400">
                      {/* عرض وقت آخر رسالة */}
                      {lastMessageTime
                        ? formatDistanceToNow(new Date(lastMessageTime), {
                            addSuffix: true,
                          })
                        : "لم يتم إرسال رسائل بعد"}
                    </div>
                    {unreadMessages > 0 && (
                      <div className="w-[15px] h-[15px] absolute top-2 right-1 text-[8px] bg-main_orange text-white rounded-full flex items-center justify-center">
                        {unreadMessages > 0 && unreadMessages}
                      </div>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </div>
        <div
          onClick={openToggle}
          className="w-[40px] h-[40px] lg:hidden flex items-center justify-center bg-sky-300 shadow-md rounded-r-md cursor-pointer group border border-transparent text-white hover:bg-sky-500 duration-150"
        >
          <GiConversation className=" size-6" />
        </div>
      </div>
    </>
  );
}
