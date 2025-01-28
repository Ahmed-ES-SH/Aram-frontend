"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { instance } from "@/app/Api/axios";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Img from "@/app/_components/Img";
import Loading from "@/app/_components/Loading";
import { useRouter } from "next/navigation";

export default function AddService() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [image, setImage] = useState<File | null>(null);
  const [featureInput, setFeatureInput] = useState<any>("");
  const [features, setFeatures] = useState<any>([]);
  const [icon, seticon] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    image: "",
    status: 1,
    category_id: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const openInput = useRef<any>(null);
  const openIconInput = useRef<any>(null);
  const router = useRouter();

  // جلب الأقسام
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instance.get("/all-service-categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      seticon(files[0]);
    }
  };

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: [] }); // إزالة الأخطاء عند الكتابة
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // تصفير الأخطاء
    setLoading(true);

    const formData = new FormData();
    formData.append("title_en", form.title_en);
    formData.append("title_ar", form.title_ar);
    formData.append("description_en", form.description_en);
    formData.append("description_ar", form.description_ar);
    formData.append("features", JSON.stringify(features));
    formData.append("status", form.status.toString());
    formData.append("category_id", form.category_id);
    if (image) formData.append("image", image);
    if (icon) formData.append("icon", icon);

    try {
      const response = await instance.post("/add-service", formData);

      if (response.status === 201) {
        setIsPopupVisible(true);
        setForm({
          title_en: "",
          title_ar: "",
          description_en: "",
          description_ar: "",
          image: "",
          status: 1,
          category_id: "",
        });
        setImage(null);
        seticon(null);
        setTimeout(() => {
          router.push("/dashboard/services"); // التوجيه إلى صفحة الخدمات بعد الإضافة
        }, 2000);
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

  const handelDeleteFeature = (featureToDelete: string) => {
    setFeatures((prev: any) =>
      prev.filter((feature: any) => feature !== featureToDelete)
    );
  };

  const handleFeatureAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && featureInput.trim() !== "") {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput(""); // Reset input field
      e.preventDefault(); // Prevent form submission
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
                إضافة خدمة جديدة
              </h2>
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                transition={{ duration: 0.5 }}
              >
                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    (EN) اسم الخدمة
                  </label>
                  <input
                    name="title_en"
                    value={form.title_en}
                    onChange={onChange}
                    type="text"
                    placeholder="أدخل اسم الخدمة"
                    className={inputStyle}
                  />
                  {errors.title_en && (
                    <p className={errorStyle}>{errors.title_en[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    (AR) اسم الخدمة
                  </label>
                  <input
                    name="title_ar"
                    value={form.title_ar}
                    onChange={onChange}
                    type="text"
                    placeholder="أدخل اسم الخدمة"
                    className={inputStyle}
                  />
                  {errors.title_ar && (
                    <p className={errorStyle}>{errors.title_ar[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    (EN) وصف الخدمة
                  </label>
                  <textarea
                    name="description_en"
                    value={form.description_en}
                    onChange={onChange}
                    placeholder="أدخل وصف الخدمة باللغة الإنجليزية"
                    className={inputStyle}
                  />
                  {errors.description_en && (
                    <p className={errorStyle}>{errors.description_en[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    (AR) وصف الخدمة
                  </label>
                  <textarea
                    name="description_ar"
                    value={form.description_ar}
                    onChange={onChange}
                    placeholder="أدخل وصف الخدمة باللغة العربية"
                    className={inputStyle}
                  />
                  {errors.description_ar && (
                    <p className={errorStyle}>{errors.description_ar[0]}</p>
                  )}
                </div>

                <>
                  <input
                    id="features"
                    className={inputStyle}
                    placeholder="Add a feature and press Enter"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={handleFeatureAdd}
                  />

                  <div className="flex items-center gap-3 flex-wrap mt-4">
                    {features &&
                      features.length > 0 &&
                      features.map((feature: any, idx: number) => (
                        <motion.div
                          key={idx}
                          className="p-3 bg-main_orange hover:bg-red-500 duration-300 cursor-pointer w-fit text-white rounded-md shadow-sm text-sm font-medium flex items-center justify-between"
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 50 }}
                          onClick={() => handelDeleteFeature(feature)}
                        >
                          {feature}
                        </motion.div>
                      ))}
                  </div>
                </>

                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    أيقونة الخدمة
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      name="icon"
                      ref={openIconInput}
                      type="file"
                      onChange={handleIconChange}
                      className="hidden"
                    />
                    {icon ? (
                      <div
                        onClick={() => openIconInput.current.click()}
                        className="w-fit shadow-md cursor-pointer rounded-md flex items-center justify-center"
                      >
                        <Img
                          src={URL.createObjectURL(icon)}
                          className="w-[150px]"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => openIconInput.current.click()}
                        className="w-full cursor-pointer h-[20vh] border-2 border-dashed flex items-center justify-center"
                      >
                        <Img src="/dashboard/add.png" className="w-[50px]" />
                      </div>
                    )}
                  </div>
                  {errors.icon && (
                    <p className={errorStyle}>{errors.icon[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    صورة الخدمة
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

                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    القسم
                  </label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={onChange}
                    className={inputStyle}
                  >
                    <option value="">اختر قسم</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    الحالة
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={onChange}
                    className={inputStyle}
                  >
                    <option value={1}>نشط</option>
                    <option value={0}>غير نشط</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 shadow-lg hover:bg-white border border-transparent hover:border-blue-500 hover:text-black duration-200"
                >
                  إضافة الخدمة
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </div>
      </div>

      {isPopupVisible && (
        <SuccessPopup
          message="تمت إضافة الخدمة بنجاح!"
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </>
  );
}
