"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaBuilding,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaLink,
  FaImage,
  FaTrash,
} from "react-icons/fa";

import Img from "@/app/_components/Img";
import { useDataContext } from "@/app/context/DataContext";
import { instance } from "@/app/Api/axios";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import dynamic from "next/dynamic";
import Loading from "@/app/_components/Loading";
import LocationPicker from "@/app/_components/MapFile";

const DynamicLocationPicker = dynamic(
  () => import("@/app/_components/MapFile"),
  {
    ssr: false,
  }
);

export default function Page() {
  const { allCategories } = useDataContext();
  const openImageInput = useRef<any>(null);
  const openIconInput = useRef<any>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errors, seterrors] = useState<any>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  // حالة الحقول
  const [formData, setFormData] = useState<any>({
    email: "",
    password: "",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    accaptable_message: "",
    unaccaptable_message: "",
    confirmation_price: "",
    confirmation_status: false, // حالة التأكيد
    phone_number: "",
    open_at: "",
    close_at: "",
    url: "",
    active: false, // حالة النشاط
  });

  const [location, setlocation] = useState<any>({
    latitude: 21.4735,
    longitude: 55.9754,
    address: "سلطنة عمان",
  });
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<any>([]);
  const [icon, setIcon] = useState<any>(null);
  const [newFeature, setNewFeature] = useState("");

  // دالة لتحديث الحقول
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    // إذا كان الحقل من نوع checkbox
    if (type === "checkbox") {
      setFormData((prev: any) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    }
    // إذا كان الحقل من نوع text أو number أو textarea أو select
    else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const toggleCategory = (category: any) => {
    if (selectedCategories.includes(category.id)) {
      // إزالة القسم إذا كان موجودًا بالفعل
      setSelectedCategories((prev: any) =>
        prev.filter((id: number) => id !== category.id)
      );
    } else {
      // إضافة القسم إذا لم يكن موجودًا
      setSelectedCategories((prev: any) => [...prev, category.id]);
    }
  };

  const handleFilechange = (e: any) => {
    setImage(e.target.files[0]);
  };
  const handleIconchange = (e: any) => {
    setIcon(e.target.files[0]);
  };

  // دالة لتحديث حالة التأكيد والنشاط
  const toggleStatus = (field: "confirmation_status" | "active") => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // دالة لإرسال النموذج
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    seterrors([]);
    setLoading(true);
    try {
      const Formdata = new FormData();
      Formdata.append("email", formData.email);
      Formdata.append("password", formData.password);
      Formdata.append("title_ar", formData.title_ar);
      Formdata.append("title_en", formData.title_en);
      Formdata.append("description_ar", formData.description_ar);
      Formdata.append("description_en", formData.description_en);
      Formdata.append("accaptable_message", formData.accaptable_message);
      Formdata.append("unaccaptable_message", formData.unaccaptable_message);
      Formdata.append("confirmation_price", formData.confirmation_price);
      if (features.length > 0)
        Formdata.append("features", JSON.stringify(features));
      Formdata.append(
        "confirmation_status",
        formData.confirmation_status ? "1" : "0"
      );
      location.address && Formdata.append("location", JSON.stringify(location));
      if (selectedCategories.length > 0) {
        for (let i = 0; i < selectedCategories.length; i++) {
          Formdata.append("categories_ids[]", selectedCategories[i]);
        }
      }

      Formdata.append("phone_number", formData.phone_number);
      Formdata.append("url", formData.url);
      Formdata.append("open_at", formData.open_at);
      Formdata.append("close_at", formData.close_at);
      if (image) Formdata.append("image", image);
      if (icon) Formdata.append("icon", icon);

      const response = await instance.post("/add-organization", Formdata);
      if (response.status === 201) {
        // if (typeof window !== undefined) {
        //   window.location.pathname = "/organizations";
        // }
        setIsPopupVisible(true);
        setFormData({
          email: "",
          password: "",
          title_ar: "",
          title_en: "",
          description_ar: "",
          description_en: "",
          category_id: "",
          phone_number: "",
          accaptable_message: "",
          unaccaptable_message: "",
          confirmation_price: "",
          confirmation_status: false,
          url: "",
          open_at: "",
          close_at: "",
        });
        setImage(null);
        setIcon(null);
        setSelectedCategories([]);
        setlocation({
          latitude: 21.4735,
          longitude: 55.9754,
          address: "سلطنة عمان",
        });
      }
    } catch (error: any) {
      console.error(error);
      if (error && error.response) {
        seterrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const onLocationSelect = (location: any) => {
    setlocation(location);
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

  if (loading) return <Loading />;

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className=" max-md:w-full w-[90%] max-lg:w-[95%] bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl pb-3 border-b border-main_orange w-fit mx-auto font-bold text-gray-900 mb-8 text-center">
          إضافة مركز جديدة
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <div className="mt-1 relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
            </div>
          </div>

          {errors && errors["email"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["email"]}
            </p>
          )}

          {/* كلمة المرور */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              كلمة المرور
            </label>
            <div className="mt-1 relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
            </div>
          </div>

          {errors && errors["password"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["password"]}
            </p>
          )}

          {/* العنوان (عربي) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              العنوان (عربي)
            </label>
            <div className="mt-1 relative">
              <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="title_ar"
                value={formData.title_ar}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
            </div>
          </div>

          {errors && errors["title_ar"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["title_ar"]}
            </p>
          )}

          {/* العنوان (إنجليزي) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              العنوان (إنجليزي)
            </label>
            <div className="mt-1 relative">
              <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
            </div>
          </div>

          {errors && errors["title_en"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["title_en"]}
            </p>
          )}

          {/* الوصف (عربي) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              الوصف (عربي)
            </label>
            <div className="mt-1">
              <textarea
                name="description_ar"
                value={formData.description_ar}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
                rows={4}
              />
            </div>
          </div>

          {errors && errors["description_ar"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["description_ar"]}
            </p>
          )}

          {/* الوصف (إنجليزي) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              الوصف (إنجليزي)
            </label>
            <div className="mt-1">
              <textarea
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
                rows={4}
              />
            </div>
          </div>

          {errors && errors["description_en"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["description_en"]}
            </p>
          )}

          {/* الموقع */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              الموقع
            </label>
            <div className="mt-1 relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="location"
                value={location?.address}
                onChange={handleChange}
                className="pl-10 w-full disabled:bg-gray-400 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
                disabled={true}
              />
              <div className=" w-full h-fit">
                <DynamicLocationPicker
                  location={location}
                  onLocationSelect={onLocationSelect}
                  setLocation={setlocation}
                />
              </div>
            </div>
          </div>

          {errors && errors["location"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["location"]}
            </p>
          )}

          <h1 className="w-fit mx-auto pb-2 border-b border-main_orange">
            يجب اضافة بعض المميزات الى المركز
          </h1>

          {/* الميزات */}
          <div className="mt-1">
            {features && Array.isArray(features) && features.length > 0 ? (
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
              <div className="w-full min-h-[20vh] flex items-center justify-center">
                <p>لم يتم اضافة اى مميزات حتى الأن</p>
              </div>
            )}
            <label
              className="py-2 mb-2 border-b border-main_blue"
              htmlFor="feature"
            >
              قم بكتاية الميزة من هنا{" "}
            </label>
            <div className="flex gap-2 mt-4">
              <input
                placeholder="قم بكتاية الميزة من هنا ثم اضغط على أضف الميزة"
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
              <button
                type="button"
                onClick={addFeature}
                className={`px-4 py-2 duration-300 bg-main_orange text-white rounded-lg hover:bg-indigo-700 ${
                  newFeature.length > 0 ? "opacity-100 z-1" : "opacity-0 -z-20"
                }`}
              >
                {"أضف الميزة"}
              </button>
            </div>
          </div>

          {errors && errors["features"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["features"]}
            </p>
          )}

          {/* رسالة القبول */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              رسالة القبول
            </label>
            <div className="mt-1">
              <textarea
                name="accaptable_message"
                value={formData.accaptable_message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
                rows={4}
              />
            </div>
          </div>
          {errors && errors["accaptable_message"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["accaptable_message"]}
            </p>
          )}

          {/* رسالة الرفض */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              رسالة الرفض
            </label>
            <div className="mt-1">
              <textarea
                name="unaccaptable_message"
                value={formData.unaccaptable_message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
                rows={4}
              />
            </div>
          </div>

          {errors && errors["unaccaptable_message"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["unaccaptable_message"]}
            </p>
          )}

          {/* سعر التأكيد */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              سعر التأكيد
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="confirmation_price"
                value={formData.confirmation_price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
            </div>
          </div>

          {errors && errors["confirmation_price"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["confirmation_price"]}
            </p>
          )}

          {/* حالة التأكيد */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              حالة التأكيد
            </label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <motion.div
                className={`p-4 rounded-lg cursor-pointer flex flex-col items-center justify-center ${
                  formData.confirmation_status
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-gray-100 border-2 border-gray-300"
                }`}
                onClick={() => toggleStatus("confirmation_status")}
                whileHover={{ scale: 1.05 }}
              >
                <FaCheck className="text-green-500 text-2xl" />
                <span className="mt-2 text-sm text-gray-700">تم التأكيد</span>
              </motion.div>
              <motion.div
                className={`p-4 rounded-lg cursor-pointer flex flex-col items-center justify-center ${
                  !formData.confirmation_status
                    ? "bg-red-100 border-2 border-red-500"
                    : "bg-gray-100 border-2 border-gray-300"
                }`}
                onClick={() => toggleStatus("confirmation_status")}
                whileHover={{ scale: 1.05 }}
              >
                <FaTimes className="text-red-500 text-2xl" />
                <span className="mt-2 text-sm text-gray-700">غير مؤكد</span>
              </motion.div>
            </div>
          </div>
          {errors && errors["confirmation_status"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["confirmation_status"]}
            </p>
          )}

          {/* رقم الهاتف */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              رقم الهاتف
            </label>
            <div className="mt-1 relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
            </div>
          </div>

          {errors && errors["phone_number"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["phone_number"]}
            </p>
          )}

          {/* وقت الفتح */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              وقت الفتح
            </label>
            <div className="mt-1 relative">
              <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="time"
                name="open_at"
                value={formData.open_at}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
            </div>
          </div>

          {errors && errors["open_at"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["open_at"]}
            </p>
          )}

          {/* وقت الإغلاق */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              وقت الإغلاق
            </label>
            <div className="mt-1 relative">
              <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="time"
                name="close_at"
                value={formData.close_at}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
            </div>
          </div>

          {errors && errors["close_at"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["close_at"]}
            </p>
          )}

          {/* الرابط */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              الرابط
            </label>
            <div className="mt-1 relative">
              <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
              />
            </div>
          </div>

          {errors && errors["url"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["url"]}
            </p>
          )}

          <div className="flex items-center gap-3">
            {/* صورة */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                الصورة الرئيسية
              </label>
              <div
                onClick={() => openImageInput.current.click()}
                className="mt-1 relative h-[15vh] cursor-pointer flex items-center justify-center border-2 border-dashed border-sky-400"
              >
                {image instanceof File ? (
                  <Img
                    src={URL.createObjectURL(image)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaImage className="size-7 text-gray-400" />
                )}
                <input
                  ref={openImageInput}
                  type="file"
                  name="image"
                  onChange={handleFilechange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
                  hidden
                />
              </div>
            </div>

            {/* الأيقونة */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                الشعار
              </label>
              <div
                onClick={() => openIconInput.current.click()}
                className="mt-1 relative h-[15vh] cursor-pointer flex items-center justify-center border-2 border-dashed border-sky-400"
              >
                {icon instanceof File ? (
                  <Img src={URL.createObjectURL(icon)} className="w-12 h-12" />
                ) : (
                  <FaImage className="size-7 text-gray-400" />
                )}
                <input
                  ref={openIconInput}
                  type="file"
                  name="icon"
                  onChange={handleIconchange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
                  hidden
                />
              </div>
            </div>
          </div>
          {errors && errors["image"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["image"]}
            </p>
          )}
          {errors && errors["icon"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["icon"]}
            </p>
          )}
          {/* 
          ///////////////////////////////////////////////////////
          ----------------------------------start categories part
          ////////////////////////////////////////////////////////
          */}

          <motion.div
            className="p-6 my-8 cursor-pointer bg-gray-50 dark:bg-main_dash  rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
              من فضلك حدد تخصصات المركز / Please select the centers specialties
            </h2>

            {allCategories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {allCategories.map((category: any, index: number) => (
                  <motion.div
                    key={category.id}
                    onClick={() => toggleCategory(category)}
                    className={`p-3 rounded-md border transition duration-200 ${
                      selectedCategories.includes(category.id)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-white"
                    } hover:shadow-md`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {category.title_ar} / {category.title_en}
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p
                className="text-gray-500 dark:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {"تحميل الأقسام ..."}
              </motion.p>
            )}

            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-700 dark:text-white">
                {"التخصصات المختارة:"}
              </h3>
              {selectedCategories.length > 0 ? (
                <motion.ul
                  className="list-disc pl-5 text-gray-600 dark:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {selectedCategories.map((id: any, index: number) => {
                    const category = allCategories.find(
                      (cat: any) => cat.id == id
                    );
                    return (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        {category?.title_ar} / {category?.title_en}
                      </motion.li>
                    );
                  })}
                </motion.ul>
              ) : (
                <motion.p
                  className="text-gray-500  dark:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {"لا تخصصات مختارة حتى الآن."}
                </motion.p>
              )}
            </div>
          </motion.div>
          {errors && errors["categories_ids"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["categories_ids"]}
            </p>
          )}

          {/* 
          ///////////////////////////////////////////////////////
          ----------------------------------end categories part
          ////////////////////////////////////////////////////////
          */}

          {/* حالة النشاط */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              حالة النشاط
            </label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <motion.div
                className={`p-4 rounded-lg cursor-pointer flex flex-col items-center justify-center ${
                  formData.active
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-gray-100 border-2 border-gray-300"
                }`}
                onClick={() => toggleStatus("active")}
                whileHover={{ scale: 1.05 }}
              >
                <FaCheck className="text-green-500 text-2xl" />
                <span className="mt-2 text-sm text-gray-700">نشط</span>
              </motion.div>
              <motion.div
                className={`p-4 rounded-lg cursor-pointer flex flex-col items-center justify-center ${
                  !formData.active
                    ? "bg-red-100 border-2 border-red-500"
                    : "bg-gray-100 border-2 border-gray-300"
                }`}
                onClick={() => toggleStatus("active")}
                whileHover={{ scale: 1.05 }}
              >
                <FaTimes className="text-red-500 text-2xl" />
                <span className="mt-2 text-sm text-gray-700">غير نشط</span>
              </motion.div>
            </div>
          </div>

          {errors && errors["status"] && (
            <p className="text-red-400 my-2 text-[16px] underline underline-red-400">
              {errors["status"]}
            </p>
          )}

          {/* زر الإرسال */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-main_orange hover:bg-orange-500 duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main_orange"
            >
              إضافة المنظمة
            </button>
          </div>
        </form>
      </div>
      {isPopupVisible && (
        <SuccessPopup
          message={"تمة اضافة المركز بنجاح."}
          onClose={() => setIsPopupVisible((prev) => !prev)}
        />
      )}
    </motion.div>
  );
}
