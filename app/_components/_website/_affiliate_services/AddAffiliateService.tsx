"use client";
import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { TfiSettings } from "react-icons/tfi";
import Img from "../../Img";
import {
  FaCheckCircle,
  FaImage,
  FaPlusSquare,
  FaSave,
  FaTimes,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { useDataContext } from "@/app/context/DataContext";
import SuccessPopup from "../../_dashboard/SuccessPopup";

interface formType {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  features_en: string[];
  features_ar: string[];
  image: string | File;
  icon: string | File;
  discount_percent: number;
  confirmation_price: string;
  confirmation_status: boolean | null;
  category_id: any;
}

export default function AddAffiliateService() {
  // كائن النصوص الثابتة لكل لغة
  const texts: any = {
    EN: {
      addService: "Add Service",
      titleAr: "Title in Arabic",
      titleEn: "Title in English",
      descriptionAr: "Description in Arabic",
      descriptionEn: "Description in English",
      discountPercent: "Discount",
      serviceImage: "Service Image",
      chooseImage: "Choose Image",
      removeImage: "Remove Image",
      confirmationPrice: "Confirmation Price",
      confirmationStatus: "Confirmation Price Status",
      chooseStatus: "Choose Status",
      active: "Active",
      inactive: "Inactive",
      cancel: "Cancel",
      saveChanges: "Save ",
      featuresAr: "Features in Arabic",
      featuresEn: "Features in English",
      addFeature: "Add Feature",
      featurePlaceholder: "Enter a new feature",
      selectCategory: "Select Category",
    },
    AR: {
      addService: "إضافة خدمة",
      titleAr: "العنوان بالعربية",
      titleEn: "العنوان بالإنجليزية",
      descriptionAr: "الوصف بالعربية",
      descriptionEn: "الوصف بالإنجليزية",
      discountPercent: "نسبة الخصم",
      serviceImage: "صورة الخدمة",
      chooseImage: "اختر صورة",
      removeImage: "إزالة الصورة",
      confirmationPrice: "سعر التأكيد",
      confirmationStatus: "حالة التأكيد",
      chooseStatus: "اختر الحالة",
      active: "مفعل",
      inactive: "غير مفعل",
      cancel: "إلغاء",
      saveChanges: "حفظ ",
      featuresAr: "المميزات بالعربية",
      featuresEn: "المميزات بالإنجليزية",
      addFeature: "إضافة ميزة",
      featurePlaceholder: "أدخل ميزة جديدة",
      selectCategory: "إختر قسم خاص بالخدمة",
    },
  };

  const { language } = UseVariables();
  const { currentuser, allCategories } = useDataContext();
  const orgId = currentuser && currentuser.id;
  const openInput = useRef<any>(null);
  const [features_en_error, setfeatures_en_error] = useState<any>({
    AR: "",
    EN: "",
  });
  const [features_ar_error, setfeatures_ar_error] = useState<any>({
    AR: "",
    EN: "",
  });
  const [form, setForm] = useState<formType>({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    features_en: [],
    features_ar: [],
    image: "",
    discount_percent: 0,
    icon: "",
    confirmation_price: "",
    confirmation_status: false,
    category_id: "",
  });
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [newFeatureAr, setNewFeatureAr] = useState(""); // ميزة جديدة بالعربية
  const [newFeatureEn, setNewFeatureEn] = useState(""); // ميزة جديدة بالإنجليزية
  const [errors, seterrors] = useState<any>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files && files.length > 0) {
      const file = files[0];
      if (name === "image") {
        setForm((prevForm) => ({
          ...prevForm,
          image: file,
        }));
      } else if (name === "icon") {
        setForm((prevForm) => ({
          ...prevForm,
          icon: file,
        }));
      }
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    seterrors([]);

    setLoading(true);
    if (form.features_en.length < 3 && form.features_ar.length < 3) {
      // إذا كان طول إحدى المصفوفتين أكبر من 3، قم بتعيين رسائل الخطأ
      setfeatures_ar_error({
        AR: "يجب أن تحتوي المميزات بالعربية على أكثر من 3 عناصر.",
        EN: "Arabic features must contain more than 3 items.",
      });
      setfeatures_en_error({
        AR: "يجب أن تحتوي المميزات بالإنجليزية على أكثر من 3 عناصر.",
        EN: "English features must contain more than 3 items.",
      });
      setLoading(false);
      return;
    } else {
      // إذا كان طول المصفوفتين أقل من أو يساوي 3، قم بإفراغ رسائل الخطأ
      setfeatures_ar_error({ AR: "", EN: "" });
      setfeatures_en_error({ AR: "", EN: "" });
    }
    const formData = new FormData();
    formData.append("title_en", form.title_en);
    formData.append("title_ar", form.title_ar);
    formData.append("description_en", form.description_en);
    formData.append("description_ar", form.description_ar);
    formData.append("image", form.image);
    formData.append("category_id", selectedCategories[0]);
    formData.append("status", "0");
    if (form.discount_percent > 0)
      formData.append("discount_percent", form.discount_percent.toString());
    formData.append("organization_id", orgId);
    formData.append("features_en", JSON.stringify(form.features_en));
    formData.append("features_ar", JSON.stringify(form.features_ar));
    formData.append("confirmation_price", form.confirmation_price);
    formData.append(
      "confirmation_status",
      form.confirmation_status ? "1" : "0"
    );
    try {
      const response = await instance.post(`/add-affiliate-services`, formData);
      if (response.status === 201) {
        setShowSuccessPopup(true);
        setForm({
          title_ar: "",
          title_en: "",
          description_ar: "",
          description_en: "",
          features_en: [],
          features_ar: [],
          image: "",
          icon: "",
          discount_percent: 0,
          confirmation_price: "",
          confirmation_status: null,
          category_id: "",
        });
        seterrors([]);
        setSelectedCategories([]);
      }
    } catch (error: any) {
      seterrors(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  // إضافة ميزة جديدة بالعربية
  const addFeatureAr = () => {
    if (newFeatureAr.trim()) {
      setForm((prevForm) => ({
        ...prevForm,
        features_ar: [...prevForm.features_ar, newFeatureAr],
      }));
      setNewFeatureAr(""); // مسح حقل الإدخال بعد الإضافة
    }
  };

  // إضافة ميزة جديدة بالإنجليزية
  const addFeatureEn = () => {
    if (newFeatureEn.trim()) {
      setForm((prevForm) => ({
        ...prevForm,
        features_en: [...prevForm.features_en, newFeatureEn],
      }));
      setNewFeatureEn(""); // مسح حقل الإدخال بعد الإضافة
    }
  };

  // حذف ميزة بالعربية
  const removeFeatureAr = (index: number) => {
    setForm((prevForm) => ({
      ...prevForm,
      features_ar: prevForm.features_ar.filter((_, i) => i !== index),
    }));
  };

  const toggleCategory = (category: any) => {
    // إذا كان القسم المحدد هو نفسه المختار حاليًا، قم بإلغاء التحديد
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories([]); // إفراغ المصفوفة
    } else {
      // تحديد القسم الجديد فقط
      setSelectedCategories([category.id]);
    }
  };

  // حذف ميزة بالإنجليزية
  const removeFeatureEn = (index: number) => {
    setForm((prevForm) => ({
      ...prevForm,
      features_en: prevForm.features_en.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0); // الانتقال إلى أعلى الصفحة
  }, [loading]);

  const onClose = () => {
    setShowSuccessPopup((prev) => !prev);
  };

  return (
    <>
      <motion.div
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen mt-16 max-md:mt-20  max-md:p-2 p-6"
      >
        {loading ? (
          <div
            className="min-h-screen flex flex-col items-center justify-center w-full"
            aria-busy="true"
            tabIndex={0}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.4 }}
              aria-live="polite"
            >
              <TfiSettings className="size-44 text-main_orange" />
            </motion.div>
            <p className="mt-4 text-lg text-gray-700">
              {language === "EN" ? "Loading..." : "جاري التحميل..."}
            </p>
          </div>
        ) : (
          <div className="w-[95%] max-md:w-full max-md:p-2 mx-auto bg-white rounded-lg shadow-xl p-8">
            {!serviceStatus && (
              <div className="w-fit mb-6 p-4 rounded-lg shadow-lg bg-yellow-100 border-l-4 border-yellow-300  flex items-start gap-3">
                {/* أيقونة الخطأ */}
                <MdErrorOutline className="size-6 flex-shrink-0 text-yellow-400" />

                {/* النص */}
                <p className="text-sm  leading-relaxed">
                  {language == "EN"
                    ? "The service will be available for publication after it is reviewed."
                    : "ستكون الخدمة متاحة للنشر بعد ان يتم مراجعتها ."}
                </p>
              </div>
            )}
            <h1 className="text-2xl w-fit mx-auto pb-3 border-b border-main_orange font-bold text-main_orange mb-8">
              {texts[language].addService}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* صورة الخدمة */}
              <div>
                <input
                  type="file"
                  name="image"
                  hidden
                  ref={openInput}
                  onChange={handleChange}
                />
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {texts[language].serviceImage}
                </label>
                {errors &&
                  errors["image"] &&
                  errors["image"][0] &&
                  errors["image"][0][language] && (
                    <p className="text-red-400 my-3">
                      {errors["image"][0][language]}
                    </p>
                  )}
                <div className="mt-1 flex items-center gap-4">
                  {form.image ? (
                    <div className="relative w-full overflow-hidden group">
                      {/* عرض الصورة إذا كانت من نوع string (رابط) أو File (ملف محمل) */}
                      {typeof form.image === "string" ? (
                        <Img
                          src={form.image}
                          className="w-full h-[40vh] object-cover rounded-lg shadow-md"
                        />
                      ) : (
                        <Img
                          src={URL.createObjectURL(form.image)}
                          className="w-full h-[40vh] object-cover rounded-lg shadow-md"
                        />
                      )}
                      {/* زر تغيير الصورة */}
                      <div
                        onClick={() => openInput.current?.click()} // استخدام ref لفتح input file
                        className="w-10 h-10 duration-300 hover:scale-125 hover:border-sky-600 border-4 border-transparent cursor-pointer flex items-center bg-sky-400 justify-center rounded-md shadow-md absolute bottom-3 -left-40 group-hover:left-4"
                      >
                        <FaImage className="size-5 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => openInput.current?.click()} // فتح نافذة اختيار الملف عند النقر
                      className="h-[40vh] w-full border-dashed border-2 border-sky-400 flex items-center justify-center cursor-pointer hover:bg-sky-50 transition-colors duration-300"
                    >
                      <FaPlusSquare className="size-8 text-sky-400" />
                    </div>
                  )}
                </div>
              </div>
              {/* العنوان بالعربية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {texts[language].titleAr}
                </label>
                {errors &&
                  errors["title_ar"] &&
                  errors["title_ar"][0] &&
                  errors["title_ar"][0][language] && (
                    <p className="text-red-400 my-3">
                      {errors["title_ar"][0][language]}
                    </p>
                  )}
                <input
                  type="text"
                  name="title_ar"
                  value={form.title_ar}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                />
              </div>

              {/* العنوان بالإنجليزية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {texts[language].titleEn}
                </label>
                {errors &&
                  errors["title_en"] &&
                  errors["title_en"][0] &&
                  errors["title_en"][0][language] && (
                    <p className="text-red-400 my-3">
                      {errors["title_en"][0][language]}
                    </p>
                  )}
                <input
                  type="text"
                  name="title_en"
                  value={form.title_en}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                />
              </div>

              {/* الوصف بالعربية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {texts[language].descriptionAr}
                </label>
                {errors &&
                  errors["description_ar"] &&
                  errors["description_ar"][0] &&
                  errors["description_ar"][0][language] && (
                    <p className="text-red-400 my-3">
                      {errors["description_ar"][0][language]}
                    </p>
                  )}
                <textarea
                  name="description_ar"
                  value={form.description_ar}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                  rows={4}
                />
              </div>

              {/* الوصف بالإنجليزية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {texts[language].descriptionEn}
                </label>
                {errors &&
                  errors["description_en"] &&
                  errors["description_en"][0] &&
                  errors["description_en"][0][language] && (
                    <p className="text-red-400 my-3">
                      {errors["description_en"][0][language]}
                    </p>
                  )}
                <textarea
                  name="description_en"
                  value={form.description_en}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                  rows={4}
                />
              </div>

              {/*  نسبة الخصم */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {texts[language].discountPercent}
                </label>
                {errors &&
                  errors["discount_percent"] &&
                  errors["discount_percent"][0] &&
                  errors["discount_percent"][0][language] && (
                    <p className="text-red-400 my-3">
                      {errors["discount_percent"][0][language]}
                    </p>
                  )}
                <input
                  type="text"
                  name="discount_percent"
                  value={form.discount_percent}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                />
              </div>

              {/* المميزات بالعربية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {texts[language].featuresAr}
                </label>
                {features_ar_error && (
                  <p className="text-red-400 my-3">
                    {features_ar_error[language]}
                  </p>
                )}
                <div className="mt-1">
                  {form.features_ar.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeatureAr(index)}
                        className="text-red-500 hover:text-red-600 hover:scale-110 duration-200"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      value={newFeatureAr}
                      onChange={(e) => setNewFeatureAr(e.target.value)}
                      placeholder={texts[language].featurePlaceholder}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                    />
                    <button
                      type="button"
                      onClick={addFeatureAr}
                      className={`px-4 py-2 duration-300 bg-main_orange text-white rounded-lg hover:bg-indigo-700 ${
                        newFeatureAr.length > 0
                          ? "opacity-100 z-1"
                          : "opacity-0 -z-20"
                      }`}
                    >
                      {texts[language].addFeature}
                    </button>
                  </div>
                </div>
              </div>

              {/* المميزات بالإنجليزية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {texts[language].featuresEn}
                </label>
                {features_en_error && (
                  <p className="text-red-400 my-3">
                    {features_en_error[language]}
                  </p>
                )}
                <div className="mt-1">
                  {form.features_en.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeatureEn(index)}
                        className="text-red-500 hover:text-red-600 hover:scale-110 duration-200"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      value={newFeatureEn}
                      onChange={(e) => setNewFeatureEn(e.target.value)}
                      placeholder={texts[language].featurePlaceholder}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                    />
                    {
                      <button
                        type="button"
                        onClick={addFeatureEn}
                        className={`px-4 py-2 duration-300 bg-main_orange text-white rounded-lg hover:bg-indigo-700 ${
                          newFeatureEn.length > 0
                            ? "opacity-100 z-1"
                            : "opacity-0 -z-20"
                        }`}
                      >
                        {texts[language].addFeature}
                      </button>
                    }
                  </div>
                </div>
              </div>

              {/* سعر التأكيد */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {texts[language].confirmationPrice}
                </label>
                {errors &&
                  errors["confirmation_price"] &&
                  errors["confirmation_price"][0] &&
                  errors["confirmation_price"][0][language] && (
                    <p className="text-red-400 my-3">
                      {errors["confirmation_price"][0][language]}
                    </p>
                  )}
                <input
                  type="number"
                  name="confirmation_price"
                  value={form.confirmation_price}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                />
              </div>

              {/* حالة التأكيد */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {texts[language].confirmationStatus}
                </label>
                {errors &&
                  errors["confirmation_status"] &&
                  errors["confirmation_status"][0] &&
                  errors["confirmation_status"][0][language] && (
                    <p className="text-red-400 my-3">
                      {errors["confirmation_status"][0][language]}
                    </p>
                  )}
                <div className="flex max-md:flex-col gap-4 mt-6">
                  {/* مربع الحالة "مفعل" */}
                  <div
                    onClick={() =>
                      setForm({
                        ...form,
                        confirmation_status: true,
                      })
                    }
                    className={`flex-1 p-4 h-24 border-2  rounded-lg shadow-md cursor-pointer transition-all duration-300 ${
                      form.confirmation_status === true
                        ? "bg-orange-100  border-main_orange"
                        : "bg-gray-100 hover:bg-gray-200 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaCheckCircle
                          className={`text-2xl ${
                            form.confirmation_status === true
                              ? "text-main_orange"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="text-lg font-medium">
                          {texts[language].active}
                        </span>
                      </div>
                      {form.confirmation_status === true && (
                        <div className="w-4 h-4 bg-main_orange rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* مربع الحالة "غير مفعل" */}
                  <div
                    onClick={() =>
                      setForm({
                        ...form,
                        confirmation_status: false,
                      })
                    }
                    className={`flex-1 p-4 h-24 border-2  rounded-lg shadow-md cursor-pointer transition-all duration-300 ${
                      form.confirmation_status === false
                        ? "bg-red-100  border-red-500"
                        : "bg-gray-100 hover:bg-gray-200 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaTimesCircle
                          className={`text-2xl ${
                            form.confirmation_status === false
                              ? "text-red-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="text-lg font-medium">
                          {texts[language].inactive}
                        </span>
                      </div>
                      {form.confirmation_status === false && (
                        <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 
              ///////////////////////////////////////////////////////
              ----------------------------------start categories part
              ////////////////////////////////////////////////////////
              */}

              <motion.div
                style={{ direction: language == "EN" ? "ltr" : "rtl" }}
                className=" my-8 w-full cursor-pointer  dark:bg-main_dash  rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {texts[language].selectCategory}
                </label>
                {errors &&
                  errors["category_id"] &&
                  errors["category_id"][0] &&
                  errors["category_id"][0][language] && (
                    <p className="text-red-400 my-3">
                      {errors["category_id"][0][language]}
                    </p>
                  )}
                {allCategories.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {allCategories.map((category: any, index: any) => (
                      <motion.div
                        key={category.id}
                        onClick={() => toggleCategory(category)}
                        className={`p-3 rounded-md border transition duration-200 ${
                          selectedCategories
                            .map(String)
                            .includes(category.id.toString())
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
                    {language === "EN"
                      ? "Categories Loading ...."
                      : "تحميل الأقسام ..."}
                  </motion.p>
                )}
              </motion.div>

              {/* 
              ///////////////////////////////////////////////////////
              ----------------------------------end categories part
              ////////////////////////////////////////////////////////

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="flex items-center px-4 hover:scale-110 duration-200 gap-2 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition "
                >
                  <FaTimes className="mr-2" />
                  {texts[language].cancel}
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 gap-2 py-2 hover:scale-110 duration-200 bg-main_orange text-white rounded-lg hover:bg-orange-400 transition "
                >
                  <FaSave className="mr-2" />
                  {texts[language].saveChanges}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
      {showSuccessPopup && (
        <SuccessPopup
          message={
            language == "EN"
              ? "The service is currently being reviewed and you will be responded to as soon as possible."
              : "يتم مراجعة الخدمة حاليا سيتم الرد عليك فى اسرع وقت ."
          }
          onClose={onClose}
        />
      )}
    </>
  );
}
