"use client";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaSnapchat,
  FaEnvelope,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Loading from "@/app/_components/Loading";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";

export default function EditSocialContactInfo() {
  const [data, setData] = useState({
    whatsapp_number: "",
    gmail_account: "",
    facebook_account: "",
    x_account: "",
    youtube_account: "",
    instgram_account: "",
    snapchat_account: "",
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  // مصفوفة تحتوي على معلومات الحقول
  const inputs = [
    {
      name: "whatsapp_number",
      icon: <FaWhatsapp className="text-green-500 text-xl" />,
      placeholder: "WhatsApp Number",
      type: "text",
    },
    {
      name: "gmail_account",
      icon: <FaEnvelope className="text-red-500 text-xl" />,
      placeholder: "Gmail Account",
      type: "email",
    },
    {
      name: "facebook_account",
      icon: <FaFacebook className="text-blue-700 text-xl" />,
      placeholder: "Facebook Account URL",
      type: "text",
    },
    {
      name: "x_account",
      icon: <FaTwitter className="text-blue-400 text-xl" />,
      placeholder: "X (Twitter) Account URL",
      type: "text",
    },
    {
      name: "youtube_account",
      icon: <FaYoutube className="text-red-600 text-xl" />,
      placeholder: "YouTube Account URL",
      type: "text",
    },
    {
      name: "instgram_account",
      icon: <FaInstagram className="text-pink-500 text-xl" />,
      placeholder: "Instagram Account URL",
      type: "text",
    },
    {
      name: "snapchat_account",
      icon: <FaSnapchat className="text-yellow-500 text-xl" />,
      placeholder: "Snapchat Account URL",
      type: "text",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get("/social-media-info");
        if (response.status === 200) {
          setData(response.data.data);
        }
      } catch (error: any) {
        console.error("Error fetching social media info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await instance.post("/update-detailes", data);
      if (response.status === 200) {
        setShowSuccessPopup(true);
      }
    } catch (error: any) {
      console.error("Error updating social media info:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      style={{ direction: "ltr" }}
      className="w-full h-screen my-3 flex items-center justify-center"
    >
      <div className="max-md:w-full min-w-[60%] h-fit mx-auto p-6 bg-white shadow-md rounded-lg">
        <motion.div
          style={{ direction: "rtl" }}
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">تعديل روابط التواصل الإجتماعى</h2>
          <p className="text-gray-600">
            قم بتحديث حسابات الوسائط الاجتماعية المرتبطة بموقعك.
          </p>
        </motion.div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {inputs.map((input, index) => (
            <div key={index} className="flex items-center gap-3">
              {input.icon}
              <input
                type={input.type}
                name={input.name}
                value={data[input.name as keyof typeof data]}
                onChange={handleInputChange}
                placeholder={input.placeholder}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="text-center mt-6">
            <motion.button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              حفظ التغييرات
            </motion.button>
          </div>
        </form>
      </div>
      {showSuccessPopup && (
        <SuccessPopup
          message="تم تعديل البيانات بنجاح !"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
}
