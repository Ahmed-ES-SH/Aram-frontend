/* eslint-disable react/no-unescaped-entities */

"use client";
import React, { useEffect, useRef, useState } from "react";
import Img from "../../Img";
import { instance } from "@/app/Api/axios";
// import Cookie from "cookie-universal";
// import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import Loading from "../../Loading";
import SlectLocation from "../../MapFile";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import { useDataContext } from "@/app/context/DataContext";
import UserAlreadyIn from "../../UserAlreadyIn";
import PasswordInput from "../../PasswordInput";
import LocationPicker from "../../MapFile";
import { MdEmail } from "react-icons/md";
// const DynamicMapComponent = dynamic(() => import("../../Map"), {
//   ssr: false, // إيقاف الـ SSR لهذا المكون
// });

interface catgeorytype {
  id: any;
  title_en: string;
  title_ar: string;
}

interface locationtype {
  address: string;
}

export default function AddOrganizationForm() {
  const { language }: any = UseVariables();
  const { currentuser } = useDataContext();

  const texts = {
    EN: {
      title: "Verify Your Email 📧",
      message: "We have sent a verification link to the following email:",
      instruction:
        "Please check your inbox and follow the instructions to activate your account.",
      retry: "Retry",
    },
    AR: {
      title: "تحقق من بريدك الإلكتروني 📧",
      message: "لقد أرسلنا رابط التفعيل إلى البريد الإلكتروني التالي:",
      instruction:
        "يرجى التحقق من بريدك الإلكتروني واتباع التعليمات لتفعيل حسابك.",
      retry: "إعادة المحاولة",
    },
  };

  const t = texts[language as "EN" | "AR"];

  const searchParams = useSearchParams();
  const promoCode: any = searchParams.get("currentCode");
  const decodeCode = atob(promoCode);
  {
    /* 
////////////////////////////////////////////////////////////
----------------------------------refs for catch inputs file  
////////////////////////////////////////////////////////////
*/
  }
  const imageref = useRef<any>(null);
  const iconref = useRef<any>(null);

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
    category_id: "",
    phone_number: "",
    url: "",
    open_at: "",
    close_at: "",
  });
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errors, seterrors] = useState<any>([]);
  const [location, setlocation] = useState({
    latitude: 21.4735,
    longitude: 55.9754,
    address: "سلطنة عمان",
  });

  const [image, setimage] = useState<File | null>(null);
  const [icon, seticon] = useState<File | null>(null);
  const [categories, setcategories] = useState<catgeorytype[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onLocationSelect = (location: any) => {
    setlocation(location);
  };

  {
    /* 
///////////////////////////////////////////////////////
----------------------------------end stats lines
////////////////////////////////////////////////////////
*/
  }

  {
    /* 
//////////////////////////////////////////////////////////
----------------------------------get categories from API
//////////////////////////////////////////////////////////
*/
  }
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instance.get("/all-service-categories");
        setcategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (category: catgeorytype) => {
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  {
    /* 
///////////////////////////////////////////////////////
---------------------------------- submit function
////////////////////////////////////////////////////////
*/
  }

  const checkCode = async (newOrgId: any) => {
    try {
      const response = await instance.post(`/promoter-new-member`, {
        promoter_code: decodeCode,
        new_account_id: newOrgId,
        new_account_type: "Organization",
      });
      if (response.status == 200) {
        console.log("vistor tracor");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("title_ar", form.title_ar);
      formData.append("title_en", form.title_en);
      formData.append("description_ar", form.description_ar);
      formData.append("description_en", form.description_en);
      location.address && formData.append("location", JSON.stringify(location));
      if (selectedCategories.length > 0) {
        for (let i = 0; i < selectedCategories.length; i++) {
          formData.append("categories_ids[]", selectedCategories[i]);
        }
      }
      // formData.append("category_id", "4");
      formData.append("phone_number", form.phone_number);
      formData.append("url", form.url);
      formData.append("open_at", form.open_at);
      formData.append("close_at", form.close_at);
      if (image) formData.append("image", image);
      if (icon) formData.append("icon", icon);

      const response = await instance.post("/add-organization", formData);
      if (response.status === 201) {
        setStep(2);
        await instance.post(`/resend-verification-email/Organization`, {
          email: form.email,
        });
        setIsPopupVisible(true);
        const neworg = response.data.data;
        if (decodeCode) checkCode(neworg?.id);
        setimage(null);
        seticon(null);
        setlocation({
          latitude: 21.4735,
          longitude: 55.9754,
          address: "سلطنة عمان",
        });
        setSelectedCategories([]);
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
      label_ar: "من فضلك أدخل البريد الإلكترونى    ",
      label_en: "Enter Email",
      value: form.email,
      type: "text",
    },
    {
      name: "password",
      label_ar: "من فضلك أدخل  كلمة السر ",
      label_en: "Enter organization Password",
      value: form.password,
      type: "password",
    },
    {
      name: "title_ar",
      label_ar: "من فضلك أدخل اسم المركز باللغة العربية ",
      label_en: "Enter organization name in Arabic",
      value: form.title_ar,
      type: "text",
    },
    {
      name: "title_en",
      label_ar: "من فضلك أدخل اسم المركز باللغة الإنجليزية ",
      label_en: "Enter organization name in English",
      value: form.title_en,
      type: "text",
    },
    {
      name: "description_ar",
      label_ar: "من فضلك أدخل وصف المركز باللغة العربية ",
      label_en: "Enter organization description in Arabic",
      value: form.description_ar,
      type: "textarea",
    },
    {
      name: "description_en",
      label_ar: "من فضلك أدخل وصف المركز باللغة الإنجليزية ",
      label_en: "Enter organization description in English",
      value: form.description_en,
      type: "textarea",
    },
    {
      name: "phone_number",
      label_ar: "من فضلك أدخل رقم الهاتف ",
      label_en: "Please enter the phone number",
      value: form.phone_number,
      type: "text",
    },
    {
      name: "url",
      label_ar: "(إختيارى) من فضلك أدخل رابط الموقع الإلكتروني ",
      label_en: "Please enter the website URL",
      value: form.url,
      type: "text",
    },
  ];

  useEffect(() => {
    setInterval(() => {
      setLoading(false);
    }, 1000);
  }, []);

  {
    /* 
//////////////////////////////////////////////////////////
---------------------------------- Add loading to the page
//////////////////////////////////////////////////////////
*/
  }

  if (loading) return <Loading />;

  if (currentuser) return <UserAlreadyIn />;

  return (
    <>
      {step == 1 && (
        <>
          {/* 
///////////////////////////////////////////////////////
----------------------------------head of page 
////////////////////////////////////////////////////////
*/}
          <div className="p-6 mt-20 pb-2 border-b border-main_orange w-fit mx-auto mb-6">
            <motion.h1
              className="text-3xl w-fit mx-auto font-bold text-blue-700 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {language === "EN"
                ? "Welcome to Aram Platform"
                : "مرحبًا بك في منصة آرام"}
            </motion.h1>
            <motion.p
              className="text-gray-700 dark:text-secend_text text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {language === "EN"
                ? "Here you can add a new organization, define its specializations, and customize its data easily. Enjoy a flexible and efficient experience to manage your organization's data and achieve the best results."
                : "هنا يمكنك إضافة منظمة جديدة، تحديد تخصصاتها، وتخصيص بياناتها بسهولة. استمتع بتجربة مرنة وفعّالة لإدارة بيانات منظمتك وتحقيق أفضل النتائج."}
            </motion.p>
          </div>

          {/* 
///////////////////////////////////////////////////////
----------------------------------start form part
////////////////////////////////////////////////////////
*/}
          <div
            style={{ direction: "rtl" }}
            className="w-full h-full max-md:p-3 p-6 flex items-start gap-2 max-xl:flex-col max-xl:items-center"
          >
            <div className="form xl:w-3/4 w-full h-full">
              <motion.form
                className="flex flex-col items-start  h-full py-6 overflow-y-auto gap-6 p-6 bg-white dark:bg-secend_dash dark:text-white rounded-lg shadow-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                {inputs.map((input: any, index: any) => (
                  <motion.div
                    key={index}
                    className="w-full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {input.name != "password" && (
                      <label className={labelstyle}>
                        {input.label_ar} / {input.label_en}
                      </label>
                    )}
                    {input.type === "textarea" ? (
                      <textarea
                        name={input.name}
                        className={inputstyle}
                        value={input.value}
                        onChange={handleChange}
                        rows={4}
                      />
                    ) : input.name === "password" ? ( // التحقق من أن الحقل هو كلمة المرور
                      <PasswordInput
                        language={language}
                        value={form.password}
                        handlechange={handleChange}
                        errorpassword={
                          errors && errors["password"] && errors["password"]
                        }
                        setPasswordStrengthProps={undefined}
                      />
                    ) : (
                      <input
                        type={input.type}
                        name={input.name}
                        className={inputstyle}
                        value={input.value}
                        onChange={handleChange}
                      />
                    )}
                    {input.name !== "password" &&
                      errors &&
                      errors[input.name] && (
                        <p className="text-red-400 mt-3 underline underline-red-400">
                          {errors[input.name]}
                        </p>
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
                      <p className="text-red-400 mt-3 underline underline-red-400">
                        {errors["open_at"]}
                      </p>
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
                      <p className="text-red-400 mt-3 underline underline-red-400">
                        {errors["close_at"]}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* 
/////////////////////////////////////////////////
----------------------------------start map part
////////////////////////////////////////////////
*/}

                <motion.div
                  className="w-full relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <label className={labelstyle}>
                    من فضلك حدد موقع المركز بدقة على الخريطة / Enter the
                    location of the organization on the map
                  </label>
                  <input
                    type="text"
                    className={`${inputstyle} bg-gray-400 text-white`}
                    readOnly
                    value={location?.address}
                  />
                  {errors && errors["location"] && (
                    <p className="text-red-400 my-3 underline underline-red-400">
                      {errors["location"]}
                    </p>
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
                  className="p-6 my-8 cursor-pointer bg-gray-50 dark:bg-main_dash  rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                    من فضلك حدد تخصصات المركز / Please select the center's
                    specialties
                  </h2>
                  {errors && errors["categories_ids"] && (
                    <p className="text-red-400 my-3 underline underline-red-400">
                      {errors["categories_ids"]}
                    </p>
                  )}
                  {categories.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {categories.map((category: any, index) => (
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
                      {language === "EN"
                        ? "Categories Loading ...."
                        : "تحميل الأقسام ..."}
                    </motion.p>
                  )}

                  <div className="mt-6">
                    <h3 className="text-md font-semibold text-gray-700 dark:text-white">
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
                        {selectedCategories.map((id: any, index: number) => {
                          const category = categories.find(
                            (cat) => cat.id == id
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
              </motion.form>
              {/* 
///////////////////////////////////////////////////////
----------------------------------end form part
////////////////////////////////////////////////////////
*/}
            </div>

            <motion.div
              className="images h-full w-1/4 max-xl:w-full flex flex-col gap-4 items-start dark:bg-secend_dash dark:text-white p-6 py-6 rounded-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-full">
                <h2 className="text-[12px] pb-1 border-b border-main_blue font-semibold text-gray-700 dark:text-white mb-2">
                  من فضلك حدد صورة رئيسية للمركز / Please select a main image of
                  the center
                </h2>
                <div
                  onClick={() => imageref.current.click()}
                  className={`relative w-full h-[40vh] overflow-hidden cursor-pointer hover:border-main_orange duration-200 border-2 border-dashed flex items-center justify-center mb-4 ${
                    errors && errors["image"] ? "border-red-400" : ""
                  }`}
                >
                  <input
                    onChange={handleimage}
                    type="file"
                    name="image"
                    hidden
                    ref={imageref}
                  />
                  {image ? (
                    <Img
                      src={URL.createObjectURL(image)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Img src="/main_image.png" className="w-[80px]" />
                  )}
                </div>
              </div>
              {errors && errors["image"] && (
                <p className="text-red-400 my-3 underline underline-red-400">
                  {errors["image"]}
                </p>
              )}
              <div className="w-full">
                <h2 className="text-[12px] pb-1 border-b border-main_blue font-semibold text-gray-700 dark:text-white mb-2">
                  من فضلك حدد شعار للمركز / Please select a main image of the
                  center
                </h2>
                <div
                  onClick={() => iconref.current.click()}
                  className={`relative w-full h-[40vh] cursor-pointer hover:border-main_orange duration-200 border-2 border-dashed flex items-center justify-center mb-4 ${
                    errors && errors["icon"] ? "border-red-400" : ""
                  }`}
                >
                  <input
                    onChange={handleicon}
                    type="file"
                    name="icon"
                    hidden
                    ref={iconref}
                  />
                  {icon ? (
                    <Img src={URL.createObjectURL(icon)} className="w-[80px]" />
                  ) : (
                    <Img src="/main_logo.png" className="w-[80px]" />
                  )}
                </div>
              </div>
              {errors && errors["icon"] && (
                <p className="text-red-400 my-3 underline underline-red-400">
                  {errors["icon"]}
                </p>
              )}
              <motion.div
                className="col-span-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                style={{ direction: language == "EN" ? "ltr" : "rtl" }}
              >
                <label htmlFor="MarketingAccept" className=" flex gap-4">
                  <input
                    type="checkbox"
                    id="MarketingAccept"
                    name="marketing_accept"
                    className="size-5 rounded-md border-gray-200  shadow-sm active:bg-main_orange cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {language == "EN"
                      ? "I want to receive emails about events, updates, and announcements."
                      : "أريد استلام رسائل بريدية حول الفعاليات، التحديثات، والإعلانات."}
                  </span>
                </label>
              </motion.div>

              <motion.div
                className="col-span-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <p className="text-sm text-gray-500">
                  {language === "AR" ? (
                    <>
                      من خلال إنشاء حساب، أنت توافق على{" "}
                      <Link
                        href="/termsconditionsorganizations"
                        className="text-gray-700 dark:text-gray-300 underline"
                      >
                        الشروط والأحكام{" "}
                      </Link>
                      و
                      <Link
                        href="/privacypolicyorganizations"
                        className="text-gray-700 dark:text-gray-300 underline"
                      >
                        سياسة الخصوصية{" "}
                      </Link>
                      و
                      <Link
                        href="/cooperateorganizations"
                        className="text-gray-700 dark:text-gray-300 underline"
                      >
                        إتفاقية التعاون{" "}
                      </Link>
                      .
                    </>
                  ) : (
                    <>
                      By creating an account, you agree to our{" "}
                      <Link
                        href="/termsconditionsorganizations"
                        className="text-gray-700 dark:text-gray-300 underline"
                      >
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacypolicyorganizations"
                        className="text-gray-700 dark:text-gray-300 underline"
                      >
                        Privacy Policy
                      </Link>
                      and{" "}
                      <Link
                        href="/cooperateorganizations"
                        className="text-gray-700 dark:text-gray-300 underline"
                      >
                        Cooperation Agreement
                      </Link>
                      .
                    </>
                  )}
                </p>
              </motion.div>
              <motion.div
                onClick={(e: any) => handleSubmit(e)}
                className="w-[95%] mx-auto py-2 px-4 mt-6 text-white text-center cursor-pointer rounded-md bg-main_orange border border-transparent hover:bg-white hover:text-black hover:border-main_orange duration-200 "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {"إنشاء حساب"}
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
      {step == 2 && (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-white p-8 rounded-2xl shadow-lg text-center max-w-md ${
              language === "AR" ? "rtl" : "ltr"
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="flex justify-center mb-4 text-main_orange text-5xl"
            >
              <MdEmail />
            </motion.div>

            <h2 className="text-2xl font-semibold text-gray-800">{t.title}</h2>
            <p className="text-gray-600 mt-4">{t.message}</p>

            <p className="text-lg font-medium text-main_orange mt-2">
              {form.email}
            </p>
            <p className="text-gray-500 mt-4">{t.instruction}</p>
          </motion.div>
        </div>
      )}
      {isPopupVisible && (
        <SuccessPopup
          message={
            language === "EN"
              ? "Your request has been submitted. It will be reviewed, and we will get back to you as soon as possible. Thank you for your understanding!"
              : "لقد تم إرسال الطلب الخاص بكم سيتم مراجعته والرد في أسرع وقت. شكرًا لتفهمكم!"
          }
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </>
  );
}
