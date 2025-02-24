"use client";
import React, { useEffect, useState } from "react";
import { FaWhatsapp, FaArrowUp, FaChevronUp } from "react-icons/fa";
import { instance } from "@/app/Api/axios";
import { usePathname, useRouter } from "next/navigation";
import CheckCurrentUserPopup from "./_website/_Auth/CheckCurrentUserPopup";
import Img from "./Img";

const ContactButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUserCheck, setCurrentUserCheck] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(""); // حالة لتخزين رقم الواتساب
  const [type, settype] = useState(""); // حالة لتخزين رقم الواتساب
  const [isExpanded, setIsExpanded] = useState(false); // حالة لتحديد إذا كان المحتوى مفتوحًا
  const [currentuser, setCurrentUser] = useState<any>(null);
  const userId = currentuser && currentuser.id;
  // جلب رقم الواتساب من الـ API
  const fetchContactInfo = async () => {
    try {
      const response = await instance.get("/get-whatsapp-number");
      const data = response.data.data;
      setWhatsappNumber(data.whatsapp_number);
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await instance.get("/currentuser");
        if (response.status == 200) {
          setCurrentUser(response.data.data);
          settype(response.data.user_type);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchContactInfo();
    getUser();
  }, []);

  const startConversation = async () => {
    try {
      if (!currentuser) {
        return setCurrentUserCheck(true);
      }
      const formdata = new FormData();
      formdata.append("participant_one_type", type);
      formdata.append("participant_one_id", userId);
      formdata.append("participant_two_id", "1");
      formdata.append("participant_two_type", "User");
      const response = await instance.post(`/make-conversation`, formdata);
      if (response.status == 200) {
        const data = response.data.data;
        router.push(
          `/conversations/${data.id}?conversationId=${data.id}&account_type=${type}&userId=${userId}`
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  // فتح رابط الواتساب
  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  // تبديل حالة المحتوى (مفتوح/مغلق)
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const dashboard = pathname.split("/")[1];

  if (dashboard == "dashboard") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 flex flex-col items-center gap-2 z-[9999]">
      {/* زر "تواصل معنا" وأيقونة السهم */}

      {/* الأزرار التي تظهر عند النقر */}
      <div
        className={`flex flex-col gap-2 transition-all duration-300 ${
          isExpanded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* زر الواتساب */}
        <button
          onClick={handleWhatsAppClick}
          className="flex items-center justify-center w-[50px] h-[50px] bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
        >
          <FaWhatsapp size={24} />
        </button>

        {/* زر الشعار */}
        <button
          onClick={startConversation}
          className="flex items-center justify-center w-[50px] h-[50px] bg-white text-white rounded-full shadow-lg  transition-all duration-300"
        >
          <Img
            src="/logo.png" // استبدل هذا بمسار شعار الموقع
            className="w-8 h-8"
          />
        </button>
      </div>
      <button
        onClick={toggleExpand}
        className="flex items-center gap-2 bg-main_orange text-white px-4 py-2 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300"
      >
        <span>تواصل معنا</span>
        <FaChevronUp
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {
        <CheckCurrentUserPopup
          isOpen={currentUserCheck}
          onClose={() => setCurrentUserCheck((prev) => !prev)}
          language="AR"
        />
      }
    </div>
  );
};

export default ContactButton;
