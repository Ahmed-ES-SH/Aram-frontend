"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { instance } from "@/app/Api/axios";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Img from "@/app/_components/Img";
import Loading from "@/app/_components/Loading";
import { useRouter, useParams } from "next/navigation";
import { FaTrash } from "react-icons/fa";

export default function EditService() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [image, setImage] = useState<File | null>(null);
  const [featureInput, setFeatureInput] = useState<any>("");
  const [features, setFeatures] = useState<any>([]);
  const [icon, seticon] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [newFeature, setNewFeature] = useState("");
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
  const params = useParams();
  const serviceId = params.id;

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

  // جلب بيانات الخدمة
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await instance.get(`/service/${serviceId}`);
        const serviceData = response.data.data;
        setForm({
          title_en: serviceData.title_en,
          title_ar: serviceData.title_ar,
          description_en: serviceData.description_en,
          description_ar: serviceData.description_ar,
          image: serviceData.image,
          status: serviceData.status,
          category_id: serviceData.category_id,
        });
        setImage(serviceData.image);
        seticon(serviceData.icon);
        setFeatures(
          typeof serviceData.features === "string"
            ? JSON.parse(serviceData.features)
            : serviceData.features
        );
      } catch (error) {
        console.error("Error fetching service data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (serviceId) {
      fetchServiceData();
    }
  }, [serviceId]);

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

  const addFeature = () => {
    if (newFeature.trim()) {
      // التحقق من أن الحقل غير فارغ
      setFeatures((prevFeatures: any) => [...prevFeatures, newFeature]); // إضافة العنصر الجديد إلى المصفوفة
      setNewFeature(""); // مسح حقل الإدخال بعد الإضافة
    }
  };

  const removeFeature = (index: number) => {
    setFeatures((prevFeatures: any) =>
      prevFeatures.filter((_: any, i: any) => i !== index)
    );
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
      const response = await instance.post(
        `/update-service/${serviceId}`,
        formData
      );

      if (response.status === 200) {
        setIsPopupVisible(true);
        setTimeout(() => {
          router.push("/dashboard/services"); // التوجيه إلى صفحة الخدمات بعد التعديل
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

  if (loading) return <Loading />;

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
                تعديل الخدمة
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

                <div className="mt-1">
                  {features ? (
                    Array.isArray(features) &&
                    features.map((feature: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-600 hover:scale-110 duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="h-[20vh] w-full flex items-center justify-center">
                      <p>لم يتم إضافة مميزات الى هذا المركز حتى الأن</p>
                    </div>
                  )}
                  <label className="my-3">أضف ميزة من هنا </label>
                  <div className="flex gap-2 mt-4">
                    <input
                      placeholder="أضف الميزة من هنا"
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className={`px-4 py-2 duration-300 bg-main_orange text-white rounded-lg hover:bg-orange-300 ${
                        newFeature.length > 0
                          ? "opacity-100 z-1"
                          : "opacity-0 -z-20"
                      }`}
                    >
                      {"أضف الميزة"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    ايقونة الخدمة
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      name="icon"
                      ref={openIconInput}
                      type="file"
                      onChange={handleIconChange}
                      className="hidden"
                    />
                    {icon instanceof File ? (
                      <div
                        onClick={() => openIconInput.current.click()}
                        className="w-fit shadow-md cursor-pointer rounded-md flex items-center justify-center"
                      >
                        <Img
                          src={URL.createObjectURL(icon)}
                          className="w-[150px]"
                        />
                      </div>
                    ) : icon ? (
                      <div
                        onClick={() => openIconInput.current.click()}
                        className="w-full cursor-pointer h-[20vh] border-2 border-dashed flex items-center justify-center"
                      >
                        <Img
                          src={icon} // Assuming image is the URL of the image from the API
                          className="w-[150px] object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => openIconInput.current.click()}
                        className="w-full cursor-pointer h-[20vh] border-2 border-dashed flex items-center justify-center"
                      >
                        <Img
                          src="/dashboard/add.png" // Default placeholder image
                          className="w-[50px]"
                        />
                      </div>
                    )}
                  </div>
                  {errors.image && (
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
                    {image instanceof File ? (
                      <div
                        onClick={() => openInput.current.click()}
                        className="w-fit shadow-md cursor-pointer rounded-md flex items-center justify-center"
                      >
                        <Img
                          src={URL.createObjectURL(image)}
                          className="w-[150px]"
                        />
                      </div>
                    ) : image ? (
                      <div
                        onClick={() => openInput.current.click()}
                        className="w-full cursor-pointer h-[20vh] border-2 border-dashed flex items-center justify-center"
                      >
                        <Img
                          src={image} // Assuming image is the URL of the image from the API
                          className="w-[150px] object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => openInput.current.click()}
                        className="w-full cursor-pointer h-[20vh] border-2 border-dashed flex items-center justify-center"
                      >
                        <Img
                          src="/dashboard/addimage.png" // Default placeholder image
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
                  تعديل الخدمة
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </div>
      </div>

      {isPopupVisible && (
        <SuccessPopup
          message="تم تعديل الخدمة بنجاح!"
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </>
  );
}
