"use client";
import { instance } from "@/app/Api/axios";
import { useDataContext } from "@/app/context/DataContext";
import { UseVariables } from "@/app/context/VariablesContext";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaMicrophone, FaBan, FaTimes } from "react-icons/fa";
import Img from "../../Img";
import { SlLocationPin } from "react-icons/sl";
import { MdBlock, MdOutlineAttachFile } from "react-icons/md";
import FilePreview from "./FilePreview";
import Loading from "../../Loading";
import Pusher from "pusher-js";
import MapRouting from "../../MapRouting";
import { LuMessageSquareReply } from "react-icons/lu";
import CheckCurrentUserLocationnPopup from "../_Auth/CheckCurrentUserLocation";
import { CgUnblock } from "react-icons/cg";
import { CiWarning } from "react-icons/ci";

interface Props {
  conversationId: number;
}

export default function ConversationComponent({ conversationId }: Props) {
  const { currentuser, type } = useDataContext();
  const { language } = UseVariables();
  const messagesEndRef = useRef<any>(null); // ref لآخر رسالة لتركز عليها
  const OpenInput = useRef<any>(null);
  const userId = currentuser && currentuser.id;
  const [currentPage, setCurrentPage] = useState(1);
  const [messages, setMessages] = useState<any[]>([]);
  const [otherParty, setOtherParty] = useState<any>({});
  const [otherPartyLocation, setOtherPartyLocation] = useState<any>({});
  const [currentUserLocation, setCurrentUserLocation] = useState<any>({});
  const [file, setFile] = useState<any>("");
  const [content, setContent] = useState<any>("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isStartRecording, setIsStartRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [checkCurrentuser, setCheckCurrentUser] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [blockState, setBlockState] = useState("");

  const showMapToggle = () => {
    if (!currentUserLocation) {
      setCheckCurrentUser(true);
      return;
    }
    setShowMap((prev) => !prev);
  };

  const onClose = () => {
    setCheckCurrentUser(false);
  };

  const formatDate = (date: any) => {
    const inputDate = new Date(date);
    const today = new Date();

    // مقارنة التواريخ بدون الوقت
    const isToday =
      inputDate.getFullYear() === today.getFullYear() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getDate() === today.getDate();

    if (isToday) {
      // إذا كان اليوم
      return inputDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // إذا كان في يوم مختلف
      return (
        inputDate.toLocaleDateString([], {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }) +
        " " +
        inputDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };

  useEffect(() => {
    const getConversations = async () => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/get-conversations-messages/${conversationId}/${userId}/${type}?page=${currentPage}`
        );

        if (response.status === 200) {
          const data = response.data.messages;
          const otherPartylocation =
            JSON.parse(response.data.conversation.other_party.location) ||
            "العنوان غير موجود";
          const other_party = response.data.conversation.other_party;
          await instance.post(`/Converstion-messages-readed/${conversationId}`);
          setMessages((prevMessages) => {
            // دمج الرسائل الجديدة مع القديمة مع التأكد من عدم التكرار
            const uniqueMessages = [...data, ...prevMessages].reduce(
              (acc, msg) => {
                if (!acc.some((m: any) => m.id === msg.id)) acc.push(msg); // حذف الرسائل المتكررة بناءً على `id`
                return acc;
              },
              []
            );
            return uniqueMessages;
          });
          setOtherParty(other_party);
          setOtherPartyLocation(otherPartylocation);

          // التحقق من الحظر
          try {
            // التحقق من حالة الحظر
            const checkBlockResponse = await instance.post(
              `/check-blocked-conversation/${conversationId}/${userId}/${type}`
            );

            if (checkBlockResponse.status == 200) {
              const { blocker, blocked } = checkBlockResponse.data;

              // التحقق من حالة الحظر بالنسبة للمستخدم الحالي
              if (blocker.id == userId && blocker.type == type) {
                setIsBlocked(true); // المستخدم الحالي قام بحظر الطرف الآخر
                setBlockState("you_blocker"); // حالة أنك قمت بالحظر
              } else if (blocked.id == userId && blocked.type == type) {
                setIsBlocked(true); // المستخدم الحالي تم حظره
                setBlockState("you_are_blocked"); // حالة أنك محظور
              }
            }
          } catch (blockError: any) {
            console.error(blockError);
            if (blockError?.response?.status == 403) {
              const { blocker, blocked } = blockError.response.data;
              // التحقق من حالة الحظر بالنسبة للمستخدم الحالي
              if (blocked.id == userId && blocked.type == type) {
                setIsBlocked(true);
                setBlockState("you_are_blocked");
              }
            }
          }

          if (data.length === 0) {
            setHasMore(false); // إذا لم تكن هناك رسائل أخرى
          }
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && conversationId) getConversations();
    if (userId) setCurrentUserLocation(JSON.parse(currentuser.location));
  }, [userId, currentPage, conversationId]);

  useEffect(() => {
    // التمرير التلقائي إلى آخر رسالة بعد إضافة الرسائل الجديدة
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // تابع لتحميل المزيد من الرسائل عند الضغط على الزر
  const loadOlderMessages = () => {
    if (!loading && hasMore) {
      setCurrentPage((prevPage) => prevPage + 1); // زيادة الصفحة
    }
  };

  const handleSendMessage = async () => {
    try {
      const formdata = new FormData();

      // تحديد نوع الرسالة بناءً على البيانات المتوفرة
      let messageType = "";
      if (file) {
        const fileType = file.type.split("/")[0]; // استخراج النوع (image, audio)
        if (fileType === "image" || fileType === "audio") {
          messageType = fileType;
        } else {
          console.error("Unsupported file type");
          return;
        }
      } else if (content) {
        messageType = "text";
      } else {
        console.error("No valid message content provided");
        return;
      }

      // إعداد البيانات
      formdata.append("message_type", messageType);
      formdata.append("sender_id", currentuser.id);
      formdata.append("sender_type", type);

      if (content) formdata.append("content", content);
      if (file) formdata.append("file_path", file);

      // إرسال الرسالة
      const response = await instance.post(
        `/send-message/${conversationId}`,
        formdata
      );

      if (response.status == 201) {
        setContent("");
        setFile(null);
        setIsStartRecording(false);
      }
    } catch (error: any) {
      console.log("Error sending message:", error);
    }
  };

  const handleContent = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const startRecording = async () => {
    try {
      // إذا كان التسجيل جاريًا، قم بإيقافه
      if (isStartRecording && mediaRecorder) {
        mediaRecorder.stop(); // إيقاف التسجيل
        setIsStartRecording(false); // تحديث الحالة
        console.log("Recording stopped...");
        return;
      }

      // طلب إذن للوصول إلى الميكروفون
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // إنشاء MediaRecorder لتسجيل الصوت
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const file = new File([audioBlob], "recording.webm", {
          type: "audio/webm",
        });

        // إرسال الملف باستخدام handleSendMessage
        setFile(file);
        // تنظيف الموارد
        stream.getTracks().forEach((track) => track.stop());
        setMediaRecorder(null);
        setIsStartRecording(false);
      };

      recorder.start();
      setMediaRecorder(recorder); // حفظ MediaRecorder في الحالة
      setIsStartRecording(true);

      console.log("Recording started...");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  useEffect(() => {
    // تحقق من أن currentuser و newNotification موجودين

    // إعداد Pusher
    const pusher = new Pusher("9d93c335f5f356eeeed6", { cluster: "ap2" });
    const channel = pusher.subscribe("chat");

    // استلام الإشعار الجديد
    channel.bind("ChatEvent", (datachat: any) => {
      // إضافة الإشعار الجديد إلى الحالة
      if (datachat) {
        console.log(datachat);
        setMessages((prevdata: any) =>
          [...prevdata, datachat].sort((a: any, b: any) => {
            // Ensure a.created_at and b.created_at are valid Date objects
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);

            // Now subtract the timestamps to compare them
            return dateA.getTime() - dateB.getTime(); // using getTime() to get the timestamp
          })
        );
      }
    });

    // تنظيف القناة عند إنهاء التفاعل أو عند الخروج من المكون
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const blockOtherParty = async () => {
    try {
      const response = await instance.post(
        `/blocked-conversation-from-one-side/${conversationId}/${currentuser.id}/${type}`
      );
      try {
        // التحقق من حالة الحظر بعد محاولة الإلغاء
        const checkBlockResponse = await instance.post(
          `/check-blocked-conversation/${conversationId}/${userId}/${type}`
        );

        if (checkBlockResponse.status === 200) {
          const { blocker, blocked } = checkBlockResponse.data;

          // التحقق من حالة الحظر بالنسبة للمستخدم الحالي
          if (blocker.id == userId && blocker.type == type) {
            setIsBlocked(true); // المستخدم الحالي قام بحظر الطرف الآخر
            setBlockState("you_blocker");
          } else {
            setIsBlocked(false); // لا يوجد حظر
            setBlockState(""); // حالة خالية
          }
        } else {
          setIsBlocked(false); // لا يوجد حظر
          setBlockState(""); // حالة خالية
        }
      } catch (blockError: any) {
        console.error("Error while checking block state:", blockError);
        if (blockError.response?.status === 403) {
          const { blocker, blocked } = blockError.response.data;

          // التحقق من حالة الحظر بالنسبة للمستخدم الحالي
          if (blocker.id === userId && blocker.type === type) {
            setIsBlocked(true);
            setBlockState("you_blocked");
          } else if (blocked.id === userId && blocked.type === type) {
            setIsBlocked(true);
            setBlockState("you_are_blocked");
          } else {
            setIsBlocked(false); // لا يوجد حظر
            setBlockState(""); // حالة خالية
          }
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const unblockOtherParty = async () => {
    try {
      // طلب إلغاء الحظر
      const response = await instance.post(
        `/unblocked-conversation-from-one-side/${conversationId}/${currentuser.id}/${type}`
      );

      if (response.status === 200) {
        console.log("Unblock successful");

        try {
          // التحقق من حالة الحظر بعد محاولة الإلغاء
          const checkBlockResponse = await instance.post(
            `/check-blocked-conversation/${conversationId}/${userId}/${type}`
          );

          if (checkBlockResponse.status === 201) {
            const { blocker, blocked } = checkBlockResponse.data;

            // التحقق من حالة الحظر بالنسبة للمستخدم الحالي
            if (blocker.id == userId && blocker.type == type) {
              setIsBlocked(true); // المستخدم الحالي قام بحظر الطرف الآخر
              setBlockState("you_blocker");
            } else {
              setIsBlocked(false); // لا يوجد حظر
              setBlockState(""); // حالة خالية
            }
          } else {
            setIsBlocked(false); // لا يوجد حظر
            setBlockState(""); // حالة خالية
          }
        } catch (blockError: any) {
          console.error("Error while checking block state:", blockError);
          if (blockError.response?.status === 403) {
            const { blocker, blocked } = blockError.response.data;

            // التحقق من حالة الحظر بالنسبة للمستخدم الحالي
            if (blocker.id === userId && blocker.type === type) {
              setIsBlocked(true);
              setBlockState("you_blocked");
            } else if (blocked.id === userId && blocked.type === type) {
              setIsBlocked(true);
              setBlockState("you_are_blocked");
            } else {
              setIsBlocked(false); // لا يوجد حظر
              setBlockState(""); // حالة خالية
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error while unblocking:", error);
    }
  };

  const handleConfirmBlock = () => {
    if (blockState === "you_blocker") {
      unblockOtherParty();
      setConfirmBlock(false);
    } else {
      blockOtherParty();
      setConfirmBlock(false);
    }
  };

  useEffect(() => {
    const checkBlockedParty = async () => {
      try {
      } catch (error: any) {
        console.log(error);
      }
    };
    if (otherParty && otherParty.id) {
      checkBlockedParty();
    }
  }, [otherParty]);

  if (loading) return <Loading />;

  return (
    <>
      <div className="w-full pt-8 h-screen  overflow-hidden   max-md:w-[98%] max-md:mx-auto   max-md:h-fit  flex items-start  rounded-t-md relative ">
        <div className="w-full h-full relative  flex-grow">
          <div className=" md:hidden flex items-center justify-between w-full  rounded-t-md py-2 px-2 bg-main_orange text-white mb-4">
            <motion.div className="cursor-pointer flex items-end gap-4 relative w-fit mr-auto">
              <div className="w-[52px] h-[52px] relative flex items-center justify-center rounded-full bg-white ">
                <Img
                  src={
                    otherParty.icon
                      ? otherParty.icon
                      : otherParty.image
                      ? otherParty.image
                      : "/avatars/4.jpg"
                  }
                  className="w-[50px] rounded-full"
                />
                <span className="w-[10px] h-[10px] rounded-full  absolute bottom-0 right-2 bg-green-500 animate-pulse"></span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-md">
                  {otherParty.title_en ? otherParty.title_en : otherParty.name}
                </p>
                <p className="text-white/50 text-sm"> {otherParty.email}</p>
              </div>
            </motion.div>
            {isBlocked ? (
              <div
                onClick={() => setConfirmBlock(true)}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 hover:scale-110 duration-150  rounded-full border flex items-center justify-center text-white cursor-pointer"
              >
                <CgUnblock className="size-8 " />
              </div>
            ) : (
              <div
                onClick={() => setConfirmBlock(true)}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 hover:scale-110 duration-150  rounded-full border flex items-center justify-center text-white cursor-pointer"
              >
                <MdBlock className="size-8 " />
              </div>
            )}
          </div>
          <div
            ref={messagesEndRef}
            className="space-y-4  p-6 h-[82.2%]  dark:bg-secend_dash overflow-y-auto hidden-scrollbar"
          >
            {hasMore && (
              <div
                onClick={loadOlderMessages}
                className="w-fit mx-auto flex items-center gap-1 my-2 text-sky-400 hover:underline hover:underline-sky-400 duration-100 cursor-pointer"
              >
                <LuMessageSquareReply className="size-5" />
                <p>
                  {language == "EN"
                    ? "Show older messages"
                    : "عرض الرسائل الأقدم"}
                </p>
              </div>
            )}
            {messages.length > 0 &&
              messages.map((message, index) => {
                const isUserMessage = message.sender_id == userId;
                const avatarSrc = isUserMessage
                  ? currentuser.icon || currentuser.image
                  : otherParty.icon || otherParty.image;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isUserMessage ? 100 : -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isUserMessage ? -100 : 100 }}
                    transition={{ duration: 0.5 }}
                    className={`flex ${
                      isUserMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!isUserMessage && (
                        <Img
                          src={
                            avatarSrc ? avatarSrc : "/avatars/avatar_male.png"
                          }
                          className="w-8 h-8 rounded-full border"
                        />
                      )}
                      <div
                        className={`relative min-w-[250px] px-4 py-2 rounded-lg shadow-md ${
                          message.message_type == "text"
                            ? isUserMessage
                              ? "bg-main_orange text-white  rounded-tr-none border border-main_orange"
                              : "bg-gray-200 text-gray-800 rounded-tl-none border border-gray-300"
                            : ""
                        }`}
                      >
                        {message.message_type === "text" ? (
                          <p
                            className={`text-sm ${
                              isUserMessage ? "text-white" : "text-gray-800"
                            } `}
                          >
                            {message.content}
                          </p>
                        ) : message.message_type === "image" ? (
                          <Img
                            src={message.file_path}
                            className="w-[150px] h-auto "
                          />
                        ) : message.message_type === "audio" ? (
                          <audio
                            controls
                            src={message.file_path}
                            className="w-full mt-2 rounded-lg"
                          />
                        ) : (
                          <p className="text-sm text-red-500">
                            Unsupported message type
                          </p>
                        )}

                        <div
                          className={`text-[9px] mt-1 flex items-center justify-end`}
                        >
                          <span className={` pt-2 dark:text-white  `}>
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                      </div>
                      {isUserMessage && (
                        <Img
                          src={
                            avatarSrc ? avatarSrc : "/avatars/avatar_male.png"
                          }
                          className="w-9 h-9 rounded-full border"
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
          </div>
          {isBlocked ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center min-h-[140px] absolute bottom-0 justify-center w-full mt-6 p-4 bg-red-100 text-red-700 border border-red-300"
            >
              <FaBan size={20} className="mr-2" />
              <span>
                {blockState === "you_blocker"
                  ? language === "EN"
                    ? "You have blocked this user."
                    : "لقد قمت بحظر هذا المستخدم."
                  : language === "EN"
                  ? "You are blocked from communicating with this user."
                  : "تم حظرك من التواصل مع هذا المستخدم."}
              </span>
            </motion.div>
          ) : (
            <div className="flex flex-col  w-full justify-center  p-2 bg-gray-300 dark:bg-main_dash ">
              {/* منطقة إدخال النص */}
              <textarea
                name="content"
                value={content}
                onChange={handleContent}
                placeholder="Type a message..."
                className="w-full p-2 border rounded-lg outline-none resize-none"
                rows={3} // يمكنك تعديل عدد الأسطر الافتراضية
                style={{
                  minHeight: "100px",
                  maxHeight: "200px",
                  overflowY: "auto",
                }} // تحديد ارتفاع ديناميكي
              />

              {/* صف الأيقونات */}
              <div className="flex items-center justify-center   mt-2 space-x-2">
                {/* زر تسجيل الصوت */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="bg-gray-200 relative text-gray-600 p-2 h-10 w-10 flex items-center justify-center rounded-full hover:bg-red-400 hover:text-white duration-150"
                  onClick={startRecording} // استبدل هذه الوظيفة بما يناسبك
                >
                  <FaMicrophone className="size-6" />
                  {isStartRecording && (
                    <div
                      className="w-12 h-12 bg-orange-300 rounded-md shadow-md flex items-center justify-center absolute -top-16 -left-1 
                    after:content-[''] 
                    after:w-0 after:h-0 after:absolute after:-bottom-[15px] after:border-x-transparent 
                    after:border-b-transparent after:border-t-orange-300 after:border-[8px] after:left-1/2 after:-translate-x-1/2"
                    >
                      <div className="w-6 h-6 bg-red-500 animate-bounce rounded-full"></div>
                    </div>
                  )}
                </motion.button>

                {/* زر إرسال الصور */}
                <input
                  type="file"
                  name="file"
                  hidden
                  ref={OpenInput}
                  onChange={handleFileChange}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={` ${
                    file
                      ? "bg-green-300 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-sky-300 hover:text-white"
                  }  p-2 h-10 w-10 flex items-center justify-center rounded-full  duration-150 `}
                  onClick={() => OpenInput.current.click()} // استبدل هذه الوظيفة بما يناسبك
                >
                  <MdOutlineAttachFile className="size-6" />
                </motion.button>

                {/* زر إستعراض الخريطة */}
                {type == "User" && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="bg-gray-200 text-gray-600 p-2 h-10 w-10 flex items-center justify-center rounded-full hover:bg-green-300 hover:text-white duration-150"
                    onClick={showMapToggle} // استبدل هذه الوظيفة بما يناسبك
                  >
                    <SlLocationPin className="size-6" />
                  </motion.button>
                )}

                {/* زر إرسال الرسالة */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="bg-blue-500 text-white p-2 h-10 w-10 flex items-center justify-center rounded-full hover:bg-white hover:text-black duration-150"
                  onClick={handleSendMessage} // استبدل هذه الوظيفة بما يناسبك
                >
                  <FaPaperPlane className="size-6" />
                </motion.button>
              </div>

              {/* معاينة الملف */}
            </div>
          )}
          {file && (
            <FilePreview language={language} setFile={setFile} file={file} />
          )}
        </div>
        <div className="w-[30%]  h-screen bg-white dark:bg-main_dash dark:border-gray-700 border-l max-md:hidden">
          {/* صورة الطرف الآخر */}
          <div className="w-[122px] h-[122px] bg-gray-100 dark:bg-secend_dash  rounded-full mt-16 mx-auto flex items-center justify-center">
            <Img
              className="w-[120px] rounded-full"
              src={
                otherParty.icon
                  ? otherParty.icon
                  : otherParty.image
                  ? otherParty.image
                  : "/avatars/avatar_male.png"
              }
            />
          </div>

          {/* اسم الطرف الآخر */}
          <p className="my-3 w-fit mx-auto text-secend_text text-center">
            {otherParty.title_en ? otherParty.title_en : otherParty.name}
          </p>

          {/* الحالة */}
          <div className="flex items-center gap-2 w-fit mx-auto">
            <span className="w-[16px] h-[16px] rounded-full bg-green-400 animate-pulse"></span>
            <p className="dark:text-white">
              {language == "EN" ? "Active Now" : "نشط الأن"}
            </p>
          </div>

          {/* البريد الإلكتروني */}
          <div className="flex flex-col gap-2 items-start p-2 mt-20">
            <p className="text-secend_text dark:text-white">
              {language == "EN" ? "Email:" : "البريد الاإلكترونى :"}
            </p>
            <p className="text-black/80 dark:text-secend_text">
              {otherParty.email}
            </p>
          </div>

          {/* رقم الهاتف */}
          <div className="flex flex-col gap-2 items-start p-2 mt-6">
            <p className="text-secend_text dark:text-white">
              {language == "EN" ? "Phone:" : "رقم الهاتف : "}
            </p>
            <p className="text-black/80 dark:text-secend_text">
              {otherParty.phone_number}
            </p>
          </div>

          {/* العنوان */}
          <div className="flex flex-col gap-2 items-start p-2 mt-6">
            <p className="text-secend_text dark:text-white">
              {language == "EN" ? "Address:" : "العنوان:"}
            </p>
            <p className="text-black/80 dark:text-secend_text">
              {(otherPartyLocation.address &&
                otherPartyLocation.address.slice(0, 40) + "...") ||
                "Not Provided"}
            </p>
          </div>

          {/* زر الحظر */}
          <div className="w-full mt-6 p-2 flex justify-center">
            <button
              className={`${
                blockState === "you_blocker"
                  ? "bg-green-300"
                  : blockState === "you_blocked"
                  ? "bg-red-300"
                  : "bg-red-300"
              } text-white px-6 py-2 rounded-lg hover:bg-white hover:text-red-500 hover:border-red-500 duration-150 border border-transparent hover:scale-105`}
              onClick={() => setConfirmBlock(true)} // استبدل هذه الوظيفة بما يناسبك
            >
              {blockState === "you_blocker"
                ? "unBlock"
                : blockState === "you_blocked"
                ? "Block"
                : "Block"}
            </button>
          </div>
        </div>
      </div>
      {showMap && (
        <MapRouting
          setCheckCurrentUserLocation={setCheckCurrentUser}
          location1={currentUserLocation}
          location2={otherPartyLocation}
          onClose={showMapToggle}
        />
      )}
      {checkCurrentuser && <CheckCurrentUserLocationnPopup onClose={onClose} />}
      {confirmBlock && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black/50 dark:bg-white/50  backdrop-blur-md z-50 flex items-center justify-center">
          <div className="w-1/3 max-lg:w-3/4 max-md:w-[65%] py-6 px-2 flex flex-col items-center blur-0 justify-center relative dark:bg-main_dash dark:text-white bg-white rounded-md shadow-md">
            <CiWarning className="size-20 text-red-400 " />
            <span className="text-center">
              {isBlocked
                ? language === "EN"
                  ? "You have already blocked this user. Are you sure you want to unblock them ?"
                  : "لقد قمت بحظر هذا المستخدم بالفعل هل انت متأكد من إلغاء الحظر "
                : language === "EN"
                ? "The current conversation will be blocked. Are you ok with that?"
                : "سيتم حظر المحادثة الحالية هل انت موافق على ذلك ؟ "}
            </span>
            <div className="flex items-center justify-between w-1/4 max-lg:w-1/2 max-md:w-[65%] mx-auto mt-4">
              <button
                onClick={handleConfirmBlock}
                className="px-6 py-2 rounded-md shadow-md text-white bg-green-300 text-center border border-transparent hover:scale-110 hover:bg-white hover:border-green-300 hover:text-black duration-200"
              >
                {language == "EN" ? "yes" : "نعم"}
              </button>
              <button
                onClick={() => setConfirmBlock(false)}
                className="px-6 py-2 rounded-md shadow-md text-white bg-red-300 text-center border border-transparent hover:scale-110 hover:bg-white hover:border-red-300 hover:text-black duration-200"
              >
                {language == "EN" ? "no" : "لا"}
              </button>
            </div>
            <FaTimes
              onClick={() => setConfirmBlock(false)}
              className="text-red-300 absolute top-2 right-2 cursor-pointer size-7"
            />
          </div>
        </div>
      )}
    </>
  );
}
