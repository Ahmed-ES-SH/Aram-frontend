"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaImage,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaTimesCircle,
  FaCheckCircle,
  FaPlusSquare,
  FaPen,
} from "react-icons/fa";
import { instance } from "@/app/Api/axios";
import { useDataContext } from "@/app/context/DataContext";
import { UseVariables } from "@/app/context/VariablesContext";
import { TfiSettings } from "react-icons/tfi";
import { MdCheck, MdErrorOutline } from "react-icons/md";
import { Updatetexts } from "@/app/constants/website";
import Img from "@/app/_components/Img";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Loading from "@/app/_components/Loading";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { GiTireIronCross } from "react-icons/gi";
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
  organization_id: number | string;
}

export default function AffilateService({ searchParams }: any) {
  const serviceId = searchParams.serviceId;
  const decodeSeviceId = atob(serviceId);
  const { allCategories } = useDataContext();
  const { language } = UseVariables();
  const openInput = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [form, setForm] = useState<formType>({
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
    organization_id: "",
  });
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [editNotification, setEditNotification] = useState(false);

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await instance.get(
          `/get-affiliate-service/${decodeSeviceId}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          setServiceStatus(data.status == 1 ? true : false);
          setForm({
            ...data,
            confirmation_status: data.confirmation_status == 1 ? true : false, // تأكد من تعيين القيمة الصحيحة
          });
          setSelectedCategories([data.category_id]);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getdata();
  }, [decodeSeviceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    const formData = new FormData();
    formData.append("status", serviceStatus ? "1" : "0");
    const notificationData = {
      message: notification,
      account_type: "Organization",
      user_id: form.organization_id,
    };
    try {
      const response = await instance.post(
        `/update-affiliate-service/${decodeSeviceId}`,
        formData
      );
      if (response.status === 200) {
        instance.post(`/notifications/send`, notificationData);
        const data = response.data.data;
        setServiceStatus(data.status == 1 ? true : false);
        setShowSuccessPopup(true);
      }
    } catch (error: any) {
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // الانتقال إلى أعلى الصفحة
  }, [updateLoading]);

  useEffect(() => {
    if (serviceStatus) {
      // حالة الموافقة على الخدمة
      setNotification(
        `تمت الموافقة على نشر الخدمة بعنوان ${form.title_en} بنجاح!`
      );
    } else {
      // حالة رفض الخدمة
      setNotification(
        ` عذرًا، تم رفض نشر الخدمة بعنوان ${form.title_en} للأسباب التالية :-`
      );
    }
  }, [serviceStatus]);

  const editToggle = () => {
    setEditNotification((prev) => !prev);
  };

  const onClose = () => {
    setShowSuccessPopup((prev) => !prev);
  };

  if (loading) return <Loading />;

  return (
    <>
      <motion.div
        style={{ direction: "rtl" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen mt-16 max-md:mt-20 bg-orange-50  max-md:p-2 p-6"
      >
        {updateLoading ? (
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
          <div className="w-[90%] max-md:w-full max-md:p-2 mx-auto bg-white rounded-lg shadow-xl p-8">
            {!serviceStatus ? (
              <div className="w-fit mb-6 p-4 rounded-lg shadow-lg bg-red-100 border-l-4 border-red-500  flex items-start gap-3">
                {/* أيقونة الخطأ */}
                <MdErrorOutline className="size-6 flex-shrink-0 text-red-500" />

                {/* النص */}
                <p className="text-sm  leading-relaxed">
                  {"لم يتم الموافقة على نشر الخدمة حتى الأن ."}
                </p>
              </div>
            ) : (
              <div className="w-fit mb-6 p-4 rounded-lg shadow-lg bg-green-100 border-l-4 border-green-500  flex items-start gap-3">
                {/* أيقونة الخطأ */}
                <MdCheck className="size-6 flex-shrink-0 text-green-500" />

                {/* النص */}
                <p className="text-sm  leading-relaxed">
                  {"تم الموافقة على نشر هذة الخدمة بالفعل ."}
                </p>
              </div>
            )}
            <h1 className="text-2xl w-fit mx-auto pb-3 border-b border-main_orange font-bold text-main_orange mb-8">
              {"تفاصيل الخدمة"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* صورة الخدمة */}
              <div>
                <input
                  type="file"
                  name="image"
                  hidden
                  ref={openInput}
                  disabled={true}
                />
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {Updatetexts["AR"].serviceImage}
                </label>
                <div className="mt-1 flex items-center gap-4">
                  {form.image ? (
                    <div className="relative w-full overflow-hidden group">
                      {/* عرض الصورة إذا كانت من نوع string (رابط) أو File (ملف محمل) */}
                      {typeof form.image === "string" ? (
                        <Img
                          src={
                            form.image ? form.image : "/services/service-03.jpg"
                          }
                          className="w-full h-[40vh] object-cover rounded-lg shadow-md"
                        />
                      ) : (
                        <Img
                          src={
                            form.image instanceof File
                              ? URL.createObjectURL(form.image)
                              : "/services/service-03.jpg"
                          }
                          className="w-full h-[40vh] object-cover rounded-lg shadow-md"
                        />
                      )}
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
                  {Updatetexts["AR"].titleAr}
                </label>
                <input
                  type="text"
                  name="title_ar"
                  value={form.title_ar}
                  disabled={true}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                />
              </div>

              {/* العنوان بالإنجليزية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {Updatetexts["AR"].titleEn}
                </label>
                <input
                  type="text"
                  name="title_en"
                  value={form.title_en}
                  disabled={true}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                />
              </div>

              {/* الوصف بالعربية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {Updatetexts["AR"].descriptionAr}
                </label>
                <textarea
                  name="description_ar"
                  value={form.description_ar}
                  disabled={true}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                  rows={4}
                />
              </div>

              {/* الوصف بالإنجليزية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {Updatetexts["AR"].descriptionEn}
                </label>
                <textarea
                  name="description_en"
                  value={form.description_en}
                  disabled={true}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {Updatetexts["AR"].discountPercent || ""}
                </label>
                <input
                  type="text"
                  name="discount_percent"
                  value={form.discount_percent}
                  disabled={true}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                />
              </div>

              {/* المميزات بالعربية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {Updatetexts["AR"].featuresAr}
                </label>
                <div className="mt-1">
                  {form.features_ar.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2"
                    >
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* المميزات بالإنجليزية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {Updatetexts["AR"].featuresEn}
                </label>
                <div className="mt-1">
                  {form.features_en.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2"
                    >
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* سعر التأكيد */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {Updatetexts["AR"].confirmationPrice}
                </label>
                <input
                  type="number"
                  name="confirmation_price"
                  value={form.confirmation_price}
                  disabled={true}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                />
              </div>

              {/* حالة التأكيد */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  {Updatetexts["AR"].confirmationStatus}
                </label>
                <div className="flex max-md:flex-col gap-4 mt-6">
                  {/* مربع الحالة "مفعل" */}
                  <div
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
                          {Updatetexts["AR"].active}
                        </span>
                      </div>
                      {form.confirmation_status === true && (
                        <div className="w-4 h-4 bg-main_orange rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* مربع الحالة "غير مفعل" */}
                  <div
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
                          {Updatetexts["AR"].inactive}
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
                  {Updatetexts["AR"].selectCategory}
                </label>

                {allCategories.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {allCategories.map((category: any, index: any) => (
                      <motion.div
                        key={category.id}
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
                          //////////////////////////////////////////////////////// */}

              <h1 className="pb-3 border-b border-main_orange w-fit mx-auto">
                تحديد حالة الخدمة
              </h1>

              <div className="flex max-md:flex-col gap-4 mt-6">
                {/* مربع الحالة "مفعل" */}
                <div
                  onClick={() => setServiceStatus(true)}
                  className={`flex-1 relative p-4 h-[20vh] flex  items-center justify-center  border-2  rounded-lg shadow-md cursor-pointer transition-all duration-300 ${
                    serviceStatus === true
                      ? "bg-green-100  border-green-400"
                      : "bg-gray-100 hover:bg-gray-200 border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col  items-center gap-2">
                      <IoIosCheckmarkCircleOutline
                        className={`size-10 ${
                          serviceStatus === true
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-lg font-medium">نشر</span>
                    </div>
                    {serviceStatus === true && (
                      <div className="w-4 h-4 absolute bottom-2 left-2 bg-green-400 rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* مربع الحالة "غير مفعل" */}
                <div
                  onClick={() => setServiceStatus(false)}
                  className={`flex-1 relative p-4 h-[20vh] flex  items-center justify-center  border-2  rounded-lg shadow-md cursor-pointer transition-all duration-300 ${
                    serviceStatus === false
                      ? "bg-red-100  border-red-400"
                      : "bg-gray-100 hover:bg-gray-200 border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col  items-center gap-2">
                      <GiTireIronCross
                        className={`size-10 ${
                          serviceStatus === false
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-lg font-medium">رفض النشر </span>
                    </div>
                    {serviceStatus === false && (
                      <div className="w-4 h-4 absolute bottom-2 left-2 bg-red-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>

              <div className=" relative group overflow-hidden w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-white pb-1 mb-2 border-b border-main_orange w-fit">
                  سيتم إرسال إشعار الى المركز صاحب الخدمة بالمحتوى التالى يمكنك
                  التعديل علية عن طريق الضغط على زر التعديل
                </label>
                <textarea
                  name="notification"
                  value={notification}
                  onChange={(e) => setNotification(e.target.value)}
                  className="mt-1 h-[20vh] block w-full disabled:bg-gray-500 disabled:text-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main_orange"
                  rows={4}
                  disabled={!editNotification}
                />
                {!editNotification && (
                  <div
                    onClick={editToggle} // استخدام ref لفتح input file
                    className="w-10 h-10 duration-300 hover:scale-125 hover:border-sky-600 border-4 border-transparent cursor-pointer flex items-center bg-sky-400 justify-center rounded-md shadow-md absolute bottom-3 -left-40 group-hover:left-4"
                  >
                    <FaPen className="size-5 text-white" />
                  </div>
                )}
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="flex items-center px-4 gap-2 py-2 hover:scale-110 duration-200 bg-main_orange text-white rounded-lg hover:bg-orange-400 transition "
                >
                  <FaSave className="mr-2" />
                  {Updatetexts["AR"].saveChanges}
                </button>
              </div>
            </form>
          </div>
        )}
        {showSuccessPopup && (
          <SuccessPopup
            message={
              language == "EN"
                ? "update Service Success ."
                : "تم تحديث الخدمة بنجاح ."
            }
            onClose={onClose}
          />
        )}
      </motion.div>
    </>
  );
}
