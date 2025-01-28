"use client";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Img from "@/app/_components/Img";
import Loading from "@/app/_components/Loading";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

export default function AddArticle() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
    content_en: "",
    content_ar: "",
    published_at: "", // الحقل الجديد لتحديد التاريخ
  });

  const openInput = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      formData.append("title_en", form.title_en);
      formData.append("title_ar", form.title_ar);
      formData.append("content_en", form.content_en);
      formData.append("content_ar", form.content_ar);
      formData.append("published_at", form.published_at);
      formData.append("category_id", "3");
      formData.append("author_id", "6");
      if (image) formData.append("image", image);

      const response = await instance.post("/add-artical", formData);

      if (response.status === 201) {
        setIsPopupVisible(true);
        setForm({
          title_en: "",
          title_ar: "",
          content_en: "",
          content_ar: "",
          published_at: "",
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
                إضافة مقال جديد
              </h2>
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                transition={{ duration: 0.5 }}
              >
                {/* Title EN */}
                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    (EN) عنوان المقال
                  </label>
                  <input
                    name="title_en"
                    value={form.title_en}
                    onChange={onChange}
                    type="text"
                    placeholder="أدخل عنوان المقال"
                    className={inputStyle}
                  />
                  {errors.title_en && (
                    <p className={errorStyle}>{errors.title_en[0]}</p>
                  )}
                </div>
                {/* Title AR */}
                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    (AR) عنوان المقال
                  </label>
                  <input
                    name="title_ar"
                    value={form.title_ar}
                    onChange={onChange}
                    type="text"
                    placeholder="أدخل عنوان المقال"
                    className={inputStyle}
                  />
                  {errors.title_ar && (
                    <p className={errorStyle}>{errors.title_ar[0]}</p>
                  )}
                </div>
                {/* Content EN */}
                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    (EN) محتوى المقال
                  </label>
                  <textarea
                    name="content_en"
                    value={form.content_en}
                    onChange={onChange}
                    placeholder="أدخل محتوى المقال"
                    className={`${inputStyle} h-28`}
                  ></textarea>
                  {errors.content_en && (
                    <p className={errorStyle}>{errors.content_en[0]}</p>
                  )}
                </div>
                {/* Content AR */}
                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    (AR) محتوى المقال
                  </label>
                  <textarea
                    name="content_ar"
                    value={form.content_ar}
                    onChange={onChange}
                    placeholder="أدخل محتوى المقال"
                    className={`${inputStyle} h-28`}
                  ></textarea>
                  {errors.content_ar && (
                    <p className={errorStyle}>{errors.content_ar[0]}</p>
                  )}
                </div>
                {/* Published At */}
                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    تاريخ النشر
                  </label>
                  <input
                    name="published_at"
                    value={form.published_at}
                    onChange={onChange}
                    type="date"
                    className={inputStyle}
                  />
                  {errors.published_at && (
                    <p className={errorStyle}>{errors.published_at[0]}</p>
                  )}
                </div>
                {/* Image */}
                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    صورة المقال
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
                  إضافة المقال
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </div>
      </div>
      {isPopupVisible && (
        <SuccessPopup
          message="تمت إضافة المقال بنجاح!"
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </>
  );
}
