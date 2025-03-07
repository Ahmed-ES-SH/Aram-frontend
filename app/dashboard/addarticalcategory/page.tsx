"use client";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Img from "@/app/_components/Img";
import Loading from "@/app/_components/Loading";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

export default function AddServiceCategory() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
  });

  const openInput = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: [] }); // إزالة الأخطاء عند الكتابة
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // تصفير الأخطاء
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title_en", form.title_en);
      formData.append("title_ar", form.title_ar);
      if (image) formData.append("image", image);

      const response = await instance.post("/artical-category", formData);

      if (response.status === 201) {
        setIsPopupVisible(true);
        setForm({
          title_en: "",
          title_ar: "",
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

  const inputStyle =
    "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 ";
  const errorStyle = "text-red-500 text-sm mt-1";

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
                إضافة قسم جديد
              </h2>
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                transition={{ duration: 0.5 }}
              >
                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    (EN) اسم القسم
                  </label>
                  <input
                    name="title_en"
                    value={form.title_en}
                    onChange={onChange}
                    type="text"
                    placeholder="أدخل اسم القسم"
                    className={inputStyle}
                  />
                  {errors.title_en && (
                    <p className={errorStyle}>{errors.title_en[0]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    (AR) اسم القسم
                  </label>
                  <input
                    name="title_ar"
                    value={form.title_ar}
                    onChange={onChange}
                    type="text"
                    placeholder="أدخل اسم القسم"
                    className={inputStyle}
                  />
                  {errors.title_ar && (
                    <p className={errorStyle}>{errors.title_ar[0]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    صورة القسم
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
                  {errors.image && (
                    <p className={errorStyle}>{errors.image[0]}</p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 shadow-lg hover:bg-white border border-transparent hover:border-blue-500 hover:text-black duration-200"
                >
                  إضافة القسم
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </div>
      </div>
      {isPopupVisible && (
        <SuccessPopup
          message="تمت إضافة القسم بنجاح!"
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </>
  );
}
