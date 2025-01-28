/* eslint-disable react/no-unescaped-entities */

"use client";
import React, { useEffect, useRef, useState } from "react";
import Img from "../../Img";
import { instance } from "@/app/Api/axios";
// import Cookie from "cookie-universal";
// import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import Loading from "../../Loading";
import SlectLocation from "../../MapFile";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { FaPen, FaTimes } from "react-icons/fa";
import { useDataContext } from "@/app/context/DataContext";
import ForbiddenPage from "@/app/forbiddenpage/page";
import { LuClock10 } from "react-icons/lu";
import OrganizationBooksystem from "./OrganizationBooksystem";
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

export default function OrganizationProfile({ id }: any) {
  const { language }: any = UseVariables();
  const { currentuser, allCategories } = useDataContext();
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
    accaptable_message: "",
    unaccaptable_message: "",
    confirmation_status: "",
    confirmation_price: "",
    phone_number: "",
    url: "",
    open_at: "",
    close_at: "",
  });
  const [loading, setLoading] = useState(true);
  const [showBokkingPopup, setShowBokkingPopup] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
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
  const [location, setlocation] = useState<locationtype>({
    address: "",
  });
  const [image, setimage] = useState<File | null>(null);
  const [icon, seticon] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<catgeorytype[]>(
    []
  );

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
          const orgCategoriesIds = JSON.parse(data.categories_ids);
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
          setimage(data.image);
          seticon(data.icon);
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
        const orgCategoriesIds = JSON.parse(data.categories_ids);
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
        className="w-full h-full  max-md:p-2 p-6 flex items-center justify-center gap-2 bg-white dark:bg-main_dash  mt-16"
      >
        <div className="h-screen overflow-y-auto flex flex-col gap-3 items-start w-[95%] max-md:w-full hidden-scrollbar rounded-md bg-gray-100 dark:bg-secend_dash shadow-md">
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
          <div
            onClick={() => setShowBokkingPopup((prev) => !prev)}
            className="min-w-[200px] w-fit mx-auto py-2 px-4 text-center rounded-md shadow-md flex items-center justify-center gap-3 bg-green-400 text-white border border-transparent hover:bg-white hover:border-green-400 hover:text-black duration-150 cursor-pointer my-2"
          >
            <p>{language == "EN" ? "Booking System" : "نظام الحجز"}</p>
            <LuClock10 className=" size-6" />
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
                  <SlectLocation setLocation={setlocation} />
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
    </>
  );
}
