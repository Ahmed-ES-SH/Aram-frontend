/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useRef, useState } from "react";
import Img from "../../Img";
import { instance } from "@/app/Api/axios";
import { AnimatePresence, motion } from "framer-motion";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import Loading from "../../Loading";
import { UseVariables } from "@/app/context/VariablesContext";
import { FaFile, FaFileUpload, FaPen, FaTimes, FaTrash } from "react-icons/fa";
import { useDataContext } from "@/app/context/DataContext";
import ForbiddenPage from "@/app/forbiddenpage/page";
import { LuClock10, LuFileCheck } from "react-icons/lu";
import OrganizationBooksystem from "./OrganizationBooksystem";
import LocationPicker from "../../MapFile";
// const DynamicMapComponent = dynamic(() => import("../../Map"), {
//   ssr: false, // إيقاف الـ SSR لهذا المكون
// });

interface catgeorytype {
  id: any;
  title_en: string;
  title_ar: string;
}

export default function OrganizationProfile({ id }: any) {
  const { language }: any = UseVariables();
  const { currentuser, allCategories, type } = useDataContext();
  const defaultLocation = {
    latitude: 21.4735,
    longitude: 55.9754,
    address: "سلطنة عمان",
  };
  {
    /* 
////////////////////////////////////////////////////////////
----------------------------------refs for catch inputs file  
////////////////////////////////////////////////////////////
*/
  }
  const imageref = useRef<any>(null);
  const iconref = useRef<any>(null);
  const filePdfref = useRef<any>(null);

  {
    /* 
///////////////////////////////////////////////////////
----------------------------------start stats lines
////////////////////////////////////////////////////////
*/
  }
  const [form, setForm] = useState({
    email: "",
    password: "",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    accaptable_message: "",
    unaccaptable_message: "",
    confirmation_status: "",
    confirmation_price: "",
    phone_number: "",
    url: "",
    open_at: "",
    close_at: "",
  });
  const [location, setlocation] = useState(defaultLocation);
  const [ogrSatus, setOgrStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showBokkingPopup, setShowBokkingPopup] = useState(false);
  const [showPopupVerificationPopup, setshowPopupVerificationPopup] =
    useState(false);
  const [showFileUploadPopup, setShowFileUploadPopup] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState(false);
  const [errors, seterrors] = useState<any>([]);

  const ConfirmToggle = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setshowConfirmPasswordPopup((prev) => !prev);
  };

  const checkPassword = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await instance.post(`/check-org-password/${id}`, {
        password: confirmPassword,
      });
      if (response.status == 200) {
        handleSubmit(e);
        setshowConfirmPasswordPopup(false);
      }
    } catch (error: any) {
      setConfirmPasswordError(
        language == "EN"
          ? "Sorry , You Can Check Password Agin ."
          : "عفوا كلمة السر غير صحيحة تأكد من كلمة السر وأعد المحاولة ."
      );
      console.log(error);
    }
  };
  const [showConfirmPasswordPopup, setshowConfirmPasswordPopup] =
    useState(false);
  const [confirmPassword, setConfirmPassword] = useState(""); // لحفظ الحقل الذي تم اختياره للتعديل
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); // لحفظ الحقل الذي تم اختياره للتعديل
  const [cooperationFile, setcooperationFile] = useState<any>(null);
  const [image, setimage] = useState<File | null>(null);
  const [icon, seticon] = useState<File | null>(null);
  const [features, setFeatures] = useState<any>([]);
  const [newFeature, setNewFeature] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<catgeorytype[]>(
    []
  );
  const [fileError, setFileError] = useState("");
  const onLocationSelect = (location: any) => {
    setlocation(location);
  };

  const handlecloseFileUploadPopup = () => {
    setFileError("");
    setShowFileUploadPopup(false);
    if (typeof cooperationFile != "string") {
      setcooperationFile(null);
    }
  };

  {
    /* 
///////////////////////////////////////////////////////
----------------------------------end stats lines
////////////////////////////////////////////////////////
*/
  }

  const CloseShowBookingPopup = () => {
    setShowBokkingPopup(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setcooperationFile(files[0]);
    }
  };

  {
    /* 
//////////////////////////////////////////////////////////
----------------------------------get categories from API
//////////////////////////////////////////////////////////
*/
  }
  useEffect(() => {
    const fetchdata = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/organization/${id}`);
        if (response.status == 200) {
          const data = response.data.data;
          const orgCategoriesIds =
            typeof data.categories_ids == "string"
              ? JSON.parse(data.categories_ids)
              : data.categories_ids || [];
          setForm({
            email: data.email,
            password: data.password,
            title_ar: data.title_ar,
            title_en: data.title_en,
            description_ar: data.description_ar,
            description_en: data.description_en,
            accaptable_message: data?.accaptable_message,
            confirmation_price: data?.confirmation_price,
            confirmation_status: data?.confirmation_status,
            unaccaptable_message: data?.unaccaptable_message,
            phone_number: data.phone_number,
            url: data.url,
            open_at: data.open_at,
            close_at: data.close_at,
          });
          setOgrStatus(data.status);
          setimage(data.image);
          seticon(data.icon);
          setEmailVerificationStatus(data.email_verified_at ? false : true);
          setcooperationFile(
            data.cooperation_file ? data.cooperation_file : null
          );
          setSelectedCategories([...orgCategoriesIds]);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, []);
  const toggleCategory = (category: catgeorytype) => {
    if (selectedCategories.includes(category.id)) {
      // إزالة القسم إذا كان موجودًا بالفعل
      setSelectedCategories((prev) => prev.filter((id) => id !== category.id));
    } else {
      // إضافة القسم إذا لم يكن موجودًا
      setSelectedCategories((prev) => [...prev, category.id]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleVerifyEmail = async () => {
    try {
      setLoading(true);
      const response = await instance.post(
        `/resend-verification-email/${type}`,
        { email: currentuser.email }
      );
      if (response.status == 200) {
        setEmailVerificationStatus(false);
        setshowPopupVerificationPopup(true);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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

  {
    /* 
///////////////////////////////////////////////////////
---------------------------------- get data function
////////////////////////////////////////////////////////
*/
  }
  {
    /* 
///////////////////////////////////////////////////////
---------------------------------- submit function
////////////////////////////////////////////////////////
*/
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      // إضافة الحقول الموجودة في الكائن form بشكل ديناميكي
      Object.entries(form).forEach(([key, value]) => {
        if (value) {
          if (key === "confirmation_status") return;
          formData.append(key, value);
        }
      });
      formData.append(
        "confirmation_status",
        form.confirmation_status ? "1" : "0"
      );
      // إضافة الحقول الخاصة
      if (location.address) {
        formData.append("location", JSON.stringify(location));
      }
      if (selectedCategories.length > 0) {
        formData.append("categories_ids", JSON.stringify(selectedCategories));
      }
      if (features.length > 0)
        formData.append("features", JSON.stringify(features));
      if (image) {
        formData.append("image", image);
      }
      if (icon) {
        formData.append("icon", icon);
      }

      const response = await instance.post(
        `/update-organization/${id}`,
        formData
      );
      if (response.status === 201) {
        setIsPopupVisible(true);
        const data = response.data.data;
        const orgCategoriesIds =
          typeof data.categories_ids == "string"
            ? JSON.parse(data.categories_ids)
            : data.categories_ids;
        const location = JSON.parse(data.location);
        setForm({
          email: data.email,
          password: data.password,
          title_ar: data.title_ar,
          title_en: data.title_en,
          description_ar: data.description_ar,
          description_en: data.description_en,
          accaptable_message: data.accaptable_message,
          unaccaptable_message: data.unaccaptable_message,
          confirmation_price: data?.confirmation_price,
          confirmation_status: data?.confirmation_status,
          phone_number: data.phone_number,
          url: data.url,
          open_at: data.open_at,
          close_at: data.close_at,
        });
        setimage(data.image);
        seticon(data.icon);
        setSelectedCategories([...orgCategoriesIds]);
        setlocation(location);
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

  const handleUploadFile = async () => {
    try {
      setFileError("");
      const formData = new FormData();
      formData.append("cooperation_file", cooperationFile);
      const response = await instance.post(
        `/upload-cooperation-file/${id}`,
        formData
      );
      if (response.status === 200) {
        setIsPopupVisible(true);
        const data = response.data.data;
        setcooperationFile(null);
        setShowFileUploadPopup(false);
      }
    } catch (error: any) {
      console.log(error);
      if (error && error.response) {
        setFileError(error.response.data.message);
      }
    }
  };

  const handleDownloadFile = async () => {
    try {
      const response = await instance.get(`/download-cooperation-file/${id}`, {
        responseType: "blob", // تحديد نوع الاستجابة كـ blob (ملف)
      });

      // إنشاء رابط URL للملف
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "cooperation_agreement.pdf"; // اسم الملف عند التحميل
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.log(error);
    }
  };

  {
    /* 
////////////////////////////////////////////////////////
---------------------------------- catch logo and image
////////////////////////////////////////////////////////
*/
  }

  const handleimage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setimage(files[0]);
    }
  };
  const handleicon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      seticon(files[0]);
    }
  };

  const labelstyle =
    "block text-sm font-medium text-gray-700  dark:text-gray-300";
  const inputstyle =
    "dark:bg-main_dash dark:text-white  mt-1 py-2 outline-transparent focus:outline-main_orange duration-200 px-2 border  w-full rounded-md border-gray-200  text-sm text-gray-700 dark:text-gray-300 shadow-sm";

  const inputs: any = [
    {
      name: "email",
      label_ar: "  البريد الإلكترونى    ",
      label_en: " Email",
      value: form.email,
      type: "text",
    },
    {
      name: "password",
      label_ar: "   كلمة السر ",
      label_en: " organization name in Arabic",
      value: form.password,
      type: "password",
    },
    {
      name: "title_ar",
      label_ar: "  اسم المركز باللغة العربية ",
      label_en: " organization name in Arabic",
      value: form.title_ar,
      type: "text",
    },
    {
      name: "title_en",
      label_ar: "  اسم المركز باللغة الإنجليزية ",
      label_en: " organization name in English",
      value: form.title_en,
      type: "text",
    },
    {
      name: "description_ar",
      label_ar: "  وصف المركز باللغة العربية ",
      label_en: " organization description in Arabic",
      value: form.description_ar,
      type: "textarea",
    },
    {
      name: "description_en",
      label_ar: "  وصف المركز باللغة الإنجليزية ",
      label_en: " organization description in English",
      value: form.description_en,
      type: "textarea",
    },
    {
      name: "unaccaptable_message",
      label_ar: "رسالة رفض طلب الحجز",
      label_en: "Reservation Request Rejection Letter",
      value: form.unaccaptable_message,
      type: "textarea",
    },
    {
      name: "accaptable_message",
      label_ar: "رسالة الموافقة على طلب الحجز",
      label_en: "Booking Request Approval Letter",
      value: form.accaptable_message,
      type: "textarea",
    },

    {
      name: "phone_number",
      label_ar: "  رقم الهاتف ",
      label_en: "  the phone number",
      value: form.phone_number,
      type: "text",
    },
    {
      name: "url",
      label_ar: "(إختيارى)   رابط الموقع الإلكتروني ",
      label_en: "  the website URL",
      value: form.url,
      type: "text",
    },
  ];

  {
    /* 
//////////////////////////////////////////////////////////
---------------------------------- Add loading to the page
//////////////////////////////////////////////////////////
*/
  }

  if (loading) return <Loading />;

  if (!currentuser) {
    window.location.replace("/login");
    return null; // تأكد من عدم إعادة أي عنصر إضافي
  }

  if (id != currentuser.id) return <ForbiddenPage />;

  return (
    <>
      <div
        style={{ direction: "rtl" }}
        className="w-full h-full  max-md:p-2 p-6 flex items-center justify-center gap-2 bg-white dark:bg-main_dash max-md:mt-20  mt-16"
      >
        <div className="h-fit flex flex-col gap-3 items-start w-[95%] max-md:w-full hidden-scrollbar rounded-md bg-gray-100 dark:bg-secend_dash shadow-md">
          {ogrSatus !== "published" && (
            <div
              style={{ direction: language === "EN" ? "ltr" : "rtl" }}
              className="w-full px-4 py-2 bg-red-300  rounded-t-md text-white"
            >
              <h1 className="my-2 pb-2 border-b border-b-white">
                {language === "EN"
                  ? "Your account has not been activated yet. Please check the following points:"
                  : "لم يتم تفعيل الحساب الخاص بكم حتى الآن، الرجاء التأكد من النقاط التالية:"}
              </h1>
              <ul className="list-disc px-5 text-sm text-gray-600 dark:text-white ">
                {language === "EN" ? (
                  <>
                    <li>Check your email for the activation link.</li>
                    <li>
                      If you haven't received the activation email, please check
                      your spam folder or try again later.
                    </li>
                    <li>
                      Make sure to send the cooperation agreement file after
                      filling out the requirements.
                    </li>
                  </>
                ) : (
                  <>
                    <li>تحقق من بريدك الإلكتروني للحصول على رابط التفعيل.</li>
                    <li>
                      إذا لم تتلقَ رسالة التفعيل، الرجاء التحقق من مجلد البريد
                      العشوائي أو المحاولة مرة أخرى لاحقًا.
                    </li>
                    <li>
                      تأكد من إرسال ملف اتفاقية التعاون بعد استكمال المتطلبات.
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}

          <motion.div
            className="images h-full  w-full flex flex-col gap-4 items-start dark:bg-secend_dash dark:text-white p-6 py-6 rounded-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-full relative">
              <h2 className="text-[12px] pb-1 border-b border-main_blue font-semibold text-gray-700 dark:text-white mb-2">
                صورة رئيسية للمركز / main image of the center
              </h2>
              <div className="relative group overflow-hidden w-full h-[40vh] cursor-pointer bg-gray-200 border border-sky-400 rounded-md shadow-md flex items-center justify-center duration-200 mb-4 hover:shadow-lg ">
                <input
                  onChange={handleimage}
                  type="file"
                  name="image"
                  hidden
                  ref={imageref}
                />
                {image ? (
                  typeof image != "string" ? (
                    <Img
                      src={URL.createObjectURL(image)}
                      className="object-cover object-center w-full h-full rounded-t-md"
                    />
                  ) : (
                    <Img
                      src={image}
                      className="object-cover object-center w-full h-full rounded-t-md"
                    />
                  )
                ) : (
                  <div onClick={() => imageref.current.click()}>
                    <Img src="/main_image.png" className="w-[80px]" />
                  </div>
                )}
                {image && (
                  <div
                    onClick={() => imageref.current.click()}
                    className="w-[30px] h-[30px] group-hover:bottom-2 hover:bg-sky-600 cursor-pointer absolute -bottom-40 duration-200 left-4 rounded-md flex items-center justify-center  shadow-md bg-sky-400"
                  >
                    <FaPen className="size-4  text-white" />
                  </div>
                )}
              </div>
              <div
                onClick={() => iconref.current.click()}
                className=" absolute right-3 bottom-6 w-[50px] h-[50px] rounded-full overflow-hidden bg-white hover:border-sky-500 border-2 border-transparent hover:bg-sky-300 cursor-pointer  duration-200   flex items-center justify-center "
              >
                <input
                  onChange={handleicon}
                  type="file"
                  name="icon"
                  hidden
                  ref={iconref}
                />
                {icon ? (
                  typeof icon != "string" ? (
                    <Img
                      src={URL.createObjectURL(icon)}
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <Img src={icon} className="w-full h-full rounded-full" />
                  )
                ) : (
                  <Img src="/main_logo.png" className="w-[30px]" />
                )}
              </div>
            </div>
          </motion.div>
          <div className="flex items-center gap-2 justify-center max-md:flex-col w-fit m-auto ">
            <div
              onClick={() => setShowBokkingPopup((prev) => !prev)}
              className="min-w-[200px] w-fit max-md:w-full mx-auto py-2 px-4 text-center rounded-md shadow-md flex items-center justify-center gap-3 bg-green-400 text-white border border-transparent hover:bg-white hover:border-green-400 hover:text-black duration-150 cursor-pointer my-2"
            >
              <p>{language == "EN" ? "Booking System" : "نظام الحجز"}</p>
              <LuClock10 className=" size-6" />
            </div>
            <div
              onClick={() => setShowFileUploadPopup((prev) => !prev)}
              className="min-w-[200px] w-fit max-md:w-full mx-auto py-2 px-4 text-center rounded-md shadow-md flex items-center justify-center gap-3 bg-main_orange text-white border border-transparent hover:bg-white hover:border-main_orange hover:text-black duration-150 cursor-pointer my-2"
            >
              <p>
                {language == "EN"
                  ? "Cooperation Agreement File"
                  : "ملف اتفاقية التعاون"}
              </p>
              <FaFileUpload className=" size-6" />
            </div>
          </div>
          <motion.h1
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pb-3 border-b border-main_blue w-fit mx-auto text-2xl max-md:text-lg dark:text-white"
          >
            {language == "EN" ? "Center Detailes" : "بيانات المركز"}
          </motion.h1>
          <div className="form  w-full h-full">
            <motion.form
              onSubmit={ConfirmToggle}
              className="flex flex-col items-start  h-fit py-6  gap-6 p-6 max-md:p-1 bg-gray-100 dark:bg-secend_dash hidden-scrollbar dark:text-white rounded-lg shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              {inputs.map((input: any, index: number) => (
                <motion.div
                  key={index}
                  className="w-full"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <label className={labelstyle}>
                    {input.label_ar} / {input.label_en}
                  </label>
                  {input.type === "textarea" ? (
                    <textarea
                      name={input.name}
                      className={inputstyle}
                      value={input.value}
                      onChange={handleChange}
                      rows={4}
                    />
                  ) : input.name == "email" ? (
                    <div className="flex items-center gap-1 w-full">
                      <input
                        type={input.type}
                        name={input.name}
                        className={inputstyle}
                        value={input.value}
                        onChange={handleChange}
                      />
                      {emailVerificationStatus && (
                        <button
                          onClick={handleVerifyEmail}
                          className="px-4 py-2 text-white bg-red-300 shadow-md rounded-md text-center"
                        >
                          {language == "EN" ? "Verify" : "تفعيل"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <input
                      type={input.type}
                      name={input.name}
                      className={inputstyle}
                      value={input.value}
                      onChange={handleChange}
                    />
                  )}
                  {errors && errors[input.name] && (
                    <p className="text-red-400 mt-3">{errors[input.name]}</p>
                  )}
                </motion.div>
              ))}

              {/* أوقات الفتح والغلق */}
              <motion.div
                className="flex flex-col w-full space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    أوقات العمل / Opening Hours
                  </label>
                  <input
                    type="time"
                    name="open_at"
                    value={form.open_at}
                    className="w-full px-4 py-2 border rounded-md bg-white dark:bg-main_dash dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={handleChange} // استبدل هذا بـ setState
                  />
                  {errors && errors["open_at"] && (
                    <p className="text-red-400 mt-3">{errors["open_at"]}</p>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium  text-gray-700 dark:text-white mb-2">
                    أوقات الإغلاق / Closing Hours
                  </label>
                  <input
                    value={form.close_at}
                    type="time"
                    name="close_at"
                    className="w-full px-4 py-2 border rounded-md bg-white dark:bg-main_dash dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={handleChange} // استبدل هذا بـ setState
                  />
                  {errors && errors["close_at"] && (
                    <p className="text-red-400 mt-3">{errors["close_at"]}</p>
                  )}
                </div>
              </motion.div>

              {/* 
/////////////////////////////////////////////////
----------------------------------start map part
////////////////////////////////////////////////
*/}
              {/* الميزات */}
              <label> المميزات / Features </label>
              <div className="mt-1 w-full bg-white py-2 px-1 rounded-md shadow-md">
                {features && Array.isArray(features) && features.length > 0 ? (
                  features.map((feature: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 bg-gray-100 p-2 rounded-lg mb-2"
                    >
                      <h2
                        style={{ overflowWrap: "anywhere" }}
                        className="block"
                      >
                        {feature}
                      </h2>
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
                    className={`px-4 py-2 duration-300 bg-main_orange text-white rounded-lg hover:bg-indigo-700 `}
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

              <motion.div
                className="w-full relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <label className={labelstyle}>
                  حدد موقع المركز بدقة على الخريطة / Enter the location of the
                  organization on the map
                </label>
                <input
                  type="text"
                  className={`${inputstyle} bg-gray-400 text-white`}
                  readOnly
                  value={location?.address}
                />
                {errors && errors["location"] && (
                  <p className="text-red-400 my-3">{errors["location"]}</p>
                )}
                <div className=" w-full h-fit">
                  <LocationPicker
                    location={location}
                    onLocationSelect={onLocationSelect}
                    setLocation={setlocation}
                  />
                </div>
              </motion.div>

              {/* 
/////////////////////////////////////////////////
----------------------------------end map part
////////////////////////////////////////////////
*/}

              {/* 
///////////////////////////////////////////////////////
----------------------------------start categories part
////////////////////////////////////////////////////////
*/}

              <motion.div
                style={{ direction: language == "EN" ? "ltr" : "rtl" }}
                className="p-6 my-8 w-full cursor-pointer bg-gray-50 dark:bg-main_dash  rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                  حدد تخصصات المركز / select the center's specialties
                </h2>
                {errors && errors["categorys_ids"] && (
                  <p className="text-red-400 my-3">{errors["categorys_ids"]}</p>
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

                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-700 dark:text-white tracking-wide border-b border-main_blue pb-3 w-fit">
                    {language == "EN"
                      ? "selectedCategories"
                      : "التخصصات المختارة:"}
                  </h3>
                  {selectedCategories.length > 0 ? (
                    <motion.ul
                      className="list-disc pl-5 text-gray-600 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {selectedCategories.map((id: any, index) => {
                        const category = allCategories.find(
                          (cat: any) => cat.id == id
                        );
                        return (
                          <motion.li
                            key={id}
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
                      {language == "EN"
                        ? "NO categories selected yet ."
                        : "لا تخصصات مختارة حتى الآن."}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              {/* 
///////////////////////////////////////////////////////
----------------------------------end categories part
////////////////////////////////////////////////////////
*/}
              <input
                className="px-6 py-2 mt-4 w-1/4 max-lg:w-1/2 max-md:w-3/4 max-sm:w-[95%] mx-auto  bg-green-400 text-white rounded-md cursor-pointer hover:bg-green-600 duration-200"
                type="submit"
                value={language == "EN" ? "Save" : "حفظ التغييرات"}
              />
            </motion.form>
            {/* 
///////////////////////////////////////////////////////
----------------------------------end form part
////////////////////////////////////////////////////////
*/}
          </div>
        </div>
      </div>
      {isPopupVisible && (
        <SuccessPopup
          message={
            language == "EN"
              ? '"The operation was successful!"'
              : "تمت العملية بنجاح!"
          }
          onClose={() => setIsPopupVisible(false)}
        />
      )}
      {showConfirmPasswordPopup && (
        <div className="w-full h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center">
          <div className="p-2 w-[30%] max-lg:w-1/2 max-md:w-3/4 max-sm:w-[95%] relative bg-white dark:bg-secend_dash rounded-md ">
            <h1 className="pb-2 border-b border-main_blue dark:text-white mx-auto w-fit">
              {language == "EN" ? "Confirm Password" : "تأكيد كلمة السر"}
            </h1>
            <form className="w-full" onSubmit={checkPassword}>
              <label className={labelstyle}>
                {language == "EN" ? "Confirem Password" : "تأكيد كلمة السر"}
              </label>
              <input
                type="password"
                name="confirm_password"
                className={inputstyle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
              />
              <p className="mt-4 text-red-400 text-sm">
                {confirmPasswordError}
              </p>
              <input
                className=" block px-6 py-2 mt-4 w-fit mx-auto  bg-green-400 text-white rounded-md cursor-pointer hover:bg-green-600 duration-200"
                type="submit"
                value={language == "EN" ? "Check" : "تأكيد"}
              />

              <FaTimes
                onClick={() => setshowConfirmPasswordPopup(false)}
                className="text-red-400 cursor-pointer size-3 absolute top-3 right-4"
              />
            </form>
          </div>
        </div>
      )}
      {
        <AnimatePresence>
          {showBokkingPopup && (
            <OrganizationBooksystem
              form={form && form}
              setForm={setForm}
              onClose={CloseShowBookingPopup}
            />
          )}
        </AnimatePresence>
      }
      {showFileUploadPopup && (
        <div className="w-full h-screen fixed z-[99999] top-0 left-0 bg-black/50  flex items-center justify-center">
          <input
            onChange={handleFileChange}
            type="file"
            name="pdf-file"
            hidden
            ref={filePdfref}
          />

          <div className="px-4 py-2 dark:bg-main_dash dark:text-white w-1/2 rounded-md shadow-md max-lg:w-3/4 max-md:w-[95%] flex items-center bg-white justify-center flex-col gap-3">
            <FaTimes
              className="size-6 text-red-400 cursor-pointer self-end "
              onClick={handlecloseFileUploadPopup}
            />
            <h1 className="my-3 text-center pb-3 border-b border-main_orange ">
              {language == "EN"
                ? "Select The Cooperation File ."
                : "حدد ملف اتفاقية التعاون ."}
            </h1>
            <div
              onClick={() => filePdfref.current.click()}
              className={`w-full h-[20vh] duration-200 border-2 border-gray-50 bg-gray-100 border-dashed flex items-center justify-center hover:bg-orange-200  cursor-pointer ${
                cooperationFile
                  ? "bg-green-400 text-white"
                  : "bg-gray-100 text-black"
              } `}
            >
              {cooperationFile ? (
                <LuFileCheck className="size-24" />
              ) : (
                <FaFile className="size-24" />
              )}
            </div>
            {cooperationFile instanceof File && cooperationFile && (
              <p className="my-3 text-center text-green-300 w-fit mx-auto">
                {cooperationFile?.name}
              </p>
            )}
            <div className="flex items-center gap-3 justify-center max-md:flex-col max-md:w-full w-fit">
              <button
                onClick={handleUploadFile}
                className="px-12 max-md:px-2 bg-main_orange max-md:w-full hover:bg-orange-400 duration-100 py-2 text-center rounded-md shadow-sm text-white"
              >
                {language == "EN" ? "Upload" : "رفع"}
              </button>
              {cooperationFile && typeof cooperationFile == "string" && (
                <button
                  onClick={handleDownloadFile}
                  className="px-12 max-md:px-2 bg-green-400  max-md:w-full  hover:bg-green-500 duration-100 py-2 text-center rounded-md shadow-sm text-white"
                >
                  {language == "EN" ? "Download" : "تحميل"}
                </button>
              )}
            </div>
            {fileError && (
              <p className="text-center my-3 text-red-400 underline underline-red-400">
                {language == "EN" ? fileError : "ملفات PDF فقط ."}
              </p>
            )}
          </div>
        </div>
      )}
      {showPopupVerificationPopup && (
        <SuccessPopup
          message={
            language == "EN"
              ? "Please Check Your Email To Verify Your Account"
              : "الرجاء التحقق من بريدك الالكترونى لتفعيل الحساب الخاص بك ."
          }
          onClose={() => setshowPopupVerificationPopup(false)}
        />
      )}
    </>
  );
}
