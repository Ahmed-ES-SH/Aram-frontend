"use client";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Img from "@/app/_components/Img";
import Loading from "@/app/_components/Loading";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

export default function AddSlider() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    text_1_en: "",
    text_1_ar: "",
    text_2_en: "",
    text_2_ar: "",
    text_3_en: "",
    text_3_ar: "",
  });

  const openInput = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: [] }); // إزالة الأخطاء عند الكتابة
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // تصفير الأخطاء
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (image) formData.append("image", image);

      const response = await instance.post("/add-slider", formData);

      if (response.status === 201) {
        setIsPopupVisible(true);
        setForm({
          text_1_en: "",
          text_1_ar: "",
          text_2_en: "",
          text_2_ar: "",
          text_3_en: "",
          text_3_ar: "",
        });
        setImage(null);
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  console.log(errors);

  const inputStyle =
    "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 ";
  const errorStyle = "text-red-500 text-sm mt-1";
  const inputs = [
    {
      label: "العنوان (EN)",
      name: "text_1_en",
      value: form.text_1_en,
    },
    {
      label: "العنوان (AR)",
      name: "text_1_ar",
      value: form.text_1_ar,
    },
    {
      label: "العنوان المميز (EN)",
      name: "text_2_en",
      value: form.text_2_en,
    },
    {
      label: "العنوان المميز (AR)",
      name: "text_2_ar",
      value: form.text_2_ar,
    },
    {
      label: " الوصف (EN)",
      name: "text_3_en",
      value: form.text_3_en,
    },
    {
      label: " الوصف (AR)",
      name: "text_3_ar",
      value: form.text_3_ar,
    },
  ];

  return (
    <>
      <div className="w-full">
        <div className="min-h-screen w-full flex items-center p-6 max-md:p-2 justify-center bg-gray-100 dark:bg-main_dash">
          {loading ? (
            <Loading />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-secend_dash p-8 rounded-xl shadow-lg w-full"
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-700 dark:text-secend_text">
                إضافة شريحة جديدة
              </h2>
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                transition={{ duration: 0.5 }}
              >
                {inputs.map((input, index) => (
                  <div key={index}>
                    <label className="block text-gray-600 dark:text-white mb-2">
                      {input.label}
                    </label>
                    <input
                      name={input.name}
                      value={input.value}
                      onChange={onChange}
                      type="text"
                      placeholder={`أدخل ${input.label}`}
                      className={inputStyle}
                    />
                    {errors[input.name] && (
                      <p className={errorStyle}>{errors[input.name][0]}</p>
                    )}
                  </div>
                ))}
                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    الصورة
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      name="image"
                      ref={openInput}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {image ? (
                      <div
                        onClick={() => openInput.current.click()}
                        className="w-fit shadow-md cursor-pointer rounded-md flex items-center justify-center"
                      >
                        <Img
                          src={URL.createObjectURL(image)}
                          className="w-[150px]"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => openInput.current.click()}
                        className="w-full cursor-pointer h-[20vh] border-2 border-dashed flex items-center justify-center"
                      >
                        <Img
                          src="/dashboard/addimage.png"
                          className="w-[50px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {errors["image"] && (
                  <p className={errorStyle}>{errors["image"][0]}</p>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 shadow-lg hover:bg-white border border-transparent hover:border-blue-500 hover:text-black duration-200"
                >
                  إضافة الشريحة
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </div>
      </div>
      {isPopupVisible && (
        <SuccessPopup
          message="تمت إضافة الشريحة بنجاح!"
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </>
  );
}
