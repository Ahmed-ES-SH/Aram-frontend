"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCamera,
  FaCheck,
  FaCopy,
  FaEdit,
  FaSave,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { useDataContext } from "@/app/context/DataContext";
import Img from "../../Img";
import Loading from "../../Loading";
import ForbiddenPage from "@/app/forbiddenpage/page";
import { UseVariables } from "@/app/context/VariablesContext";
import { instance } from "@/app/Api/axios";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import SlectLocation from "../../MapFile";
import { RiAdvertisementFill, RiNumbersLine } from "react-icons/ri";
import StatsPopup from "./StatsPopup";

export default function UserProfile({ id }: any) {
  const { currentuser } = useDataContext();
  const { language } = UseVariables();
  const openinput = useRef<any>(null);
  const [copied, setCopied] = useState<{ code: boolean; link: boolean }>({
    code: false,
    link: false,
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<any>("");
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState({
    address: "",
  });
  const [showPromotional, setShowPromotional] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showConfirmPasswordPopup, setshowConfirmPasswordPopup] =
    useState(false);
  const [confirmPassword, setConfirmPassword] = useState(""); // لحفظ الحقل الذي تم اختياره للتعديل
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); // لحفظ الحقل الذي تم اختياره للتعديل
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCopy = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [type]: true });
      setTimeout(() => setCopied({ ...copied, [type]: false }), 1500);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImagePreview(files[0]);
    }
  };

  useEffect(() => {
    if (currentuser) {
      setFormData({ ...currentuser });
      if (currentuser.location) {
        setLocation(JSON.parse(currentuser.location));
      }
    }
  }, [currentuser]);

  const ConfirmToggle = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setshowConfirmPasswordPopup((prev) => !prev);
  };

  const checkPassword = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await instance.post(`/check-password/${id}`, {
        password: confirmPassword,
      });
      if (response.status == 200) {
        handleSave(e);
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

  const mapToggle = () => {
    setShowMap((prev) => !prev);
  };

  const handleSave = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setConfirmPasswordError("");
      const form = new FormData();
      if (formData.name) form.append("name", formData.name);
      if (formData.email) form.append("email", formData.email);
      if (formData.password) form.append("password", formData.password);
      if (formData.phone_number)
        form.append("phone_number", formData.phone_number);
      if (imagePreview) form.append("image", imagePreview);
      if (location) form.append("location", JSON.stringify(location));
      const response = await instance.post(
        `/update-user/${currentuser.id}`,
        form
      );
      if (response.status == 200) {
        const data = response.data.data;
        setFormData({
          name: data.name,
          email: data.email,
          password: "",
          phone_number: data.phone_number,
          image: data.image,
        });
        setLocation(JSON.parse(data.location));
        setIsPopupVisible(true);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const labelStyle =
    "block text-sm font-medium my-2 text-gray-700 dark:text-gray-200 mb-1";
  const inputStyle = `
    block w-full px-3 py-2 text-sm border rounded-lg shadow-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200
    border-gray-300 dark:border-gray-700
    transition duration-200
  `;

  if (!currentuser) return <Loading />;

  if (currentuser.id != id) return <ForbiddenPage />;

  const inputs = [
    {
      label: { en: "Name", ar: "الإسم" },
      name: "name",
      type: "text",
      value: formData.name,
    },
    {
      label: { en: "Email", ar: "البريد الإلكترونى" },
      name: "email",
      type: "email",
      value: formData["email"],
    },

    {
      label: { en: "Password", ar: "كلمة السر" },
      name: "password",
      type: "password",
      value: formData.password,
    },
    {
      label: { en: "Phone Number", ar: "رقم الهاتف" },
      name: "phone_number",
      type: "tel",
      value: formData.phone_number,
    },
  ];

  const currentURL =
    typeof window !== "undefined" ? window.location.origin : "";

  return (
    <>
      <div
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        className="flex justify-center items-center min-h-screen dark:bg-main_dash max-md:mt-12 mt-8 bg-white"
      >
        <motion.div
          className="max-md:w-[98%] w-[90%] bg-gray-100 relative dark:bg-secend_dash rounded-lg shadow-lg p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className={`flex items-center gap-2 max-md:relative max-md:w-fit max-md:mx-auto max-md:mb-6 absolute top-2 ${
              language == "EN" ? "right-2" : "left-2"
            }`}
          >
            <div
              onClick={() => setShowPromotional(true)}
              className={`px-3 py-4 text-white hover:text-black hover:bg-white hover:border-main_orange border border-transparent duration-200 hover:scale-110 cursor-pointer rounded-md shadow-md  bg-main_orange flex items-center gap-2`}
            >
              <p>
                {language == "EN"
                  ? "Promotional information"
                  : "المعلومات الدعائية"}
              </p>
              <RiAdvertisementFill className="size-5" />
            </div>
            <div
              onClick={() => setShowStats(true)}
              className={`px-3 py-4 text-white hover:text-black hover:bg-white hover:border-green-400 border border-transparent duration-200 hover:scale-110 cursor-pointer rounded-md shadow-md  bg-green-400 flex items-center gap-2`}
            >
              <p>{language == "EN" ? "Your statistics" : "إحصائياتك"}</p>
              <RiNumbersLine className="size-5" />
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl border-b-2 pb-2  border-main_blue font-semibold text-gray-800 dark:text-white">
              {language == "EN" ? "Profile" : "الملف الشخصى"}
            </h1>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="w-full">
              <motion.div
                className="relative w-32 h-32 mx-auto rounded-full border-4 border-blue-500 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <input
                  ref={openinput}
                  type="file"
                  name="image"
                  hidden
                  onChange={handleImageChange}
                />
                <div className="w-full h-full relative">
                  {imagePreview || formData.image ? (
                    <Img
                      src={
                        imagePreview
                          ? URL.createObjectURL(imagePreview)
                          : formData.image
                      }
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-400 w-full h-full" />
                  )}
                  <div
                    onClick={() => openinput.current.click()}
                    className="absolute text-sky-400 hover:bg-sky-400 hover:text-white duration-200 cursor-pointer w-[25px] h-[25px] bottom-4 right-4 bg-white border rounded-full flex items-center justify-center"
                  >
                    <FaCamera className="size-4" />
                  </div>
                </div>
              </motion.div>
              <form onSubmit={ConfirmToggle} className="w-full">
                {inputs.map((input, index) => (
                  <div
                    key={index}
                    className="relative w-full  flex flex-col gap-1 items-start"
                  >
                    <label className={labelStyle}>
                      {language == "EN" ? input.label.en : input.label.ar}
                    </label>
                    <input
                      name={input.name}
                      type={input.type}
                      value={input.value}
                      className={inputStyle}
                      onChange={handleChange}
                    />
                  </div>
                ))}
                <div className="relative">
                  <label className={labelStyle}>
                    {language == "EN" ? "Location" : "الموقع"}
                  </label>
                  <input
                    type="text"
                    value={location.address && location.address}
                    disabled
                    className={`${inputStyle} bg-gray-300`}
                  />
                  <p
                    onClick={mapToggle}
                    className={` absolute  underline text-sky-400  cursor-pointer text-sm -bottom-6 ${
                      language == "EN" ? "right-0" : "left-0"
                    }`}
                  >
                    {language == "EN" ? "Edit Location" : "تعديل الموقع الحالى"}
                  </p>
                </div>
                {showMap && (
                  <div className=" w-full h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center">
                    <div className="w-3/4 max-md:w-full p-2 h-fit bg-white dark:bg-secend_dash rounded-md shadow-md">
                      <SlectLocation setLocation={setLocation} />
                      <div className="flex items-center gap-2 w-fit mr-auto">
                        <button
                          onClick={mapToggle}
                          className="px-6 py-2 mt-4  bg-green-400 text-white rounded-md cursor-pointer hover:bg-green-600 duration-200"
                        >
                          {language == "EN" ? "Save" : "حفظ"}
                        </button>
                        <button
                          onClick={mapToggle}
                          className="px-6 py-2 mt-4  bg-red-400 text-white rounded-md cursor-pointer hover:bg-red-600 duration-200"
                        >
                          {language == "EN" ? "Cancle" : "إلغاء"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  className="px-6 py-2 mt-4  bg-green-400 text-white rounded-md cursor-pointer hover:bg-green-600 duration-200"
                  type="submit"
                  value={language == "EN" ? "Save" : "حفظ التغييرات"}
                />
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {showConfirmPasswordPopup && (
        <div className="w-full h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center">
          <div className="p-2 w-[30%] max-lg:w-1/2 max-md:w-3/4 max-sm:w-[95%] relative bg-white dark:bg-secend_dash rounded-md ">
            <h1 className="pb-2 border-b border-main_blue dark:text-white mx-auto w-fit">
              {language == "EN" ? "Confirm Password" : "تأكيد كلمة السر"}
            </h1>
            <form className="w-full" onSubmit={checkPassword}>
              <label className={labelStyle}>
                {language == "EN" ? "Confirem Password" : "تأكيد كلمة السر"}
              </label>
              <input
                type="password"
                name="confirm_password"
                className={inputStyle}
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
      <AnimatePresence>
        {showPromotional && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0 }}
            className="fixed bg-black/50 z-50 inset-0 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              exit={{ scale: 0.7 }}
              className="w-1/2 max-md:w-[95%] max-lg:w-[80%] py-8 px-2 bg-white dark:bg-secend_dash dark:text-white rounded-md shadow-sm"
            >
              {/* كود الدعوة */}
              <div className="flex items-start relative flex-col gap-2">
                <label className="pb-2 border-b border-main_orange">
                  {language === "EN"
                    ? "Your promo code"
                    : "الكود الدعائي الخاص بك"}
                </label>
                <div className="border dark:border-gray-700 px-4 py-2 relative w-full flex items-center justify-between">
                  <p className="w-full">{currentuser?.user_code}</p>
                  <button
                    onClick={() =>
                      handleCopy(currentuser?.user_code || "", "code")
                    }
                    className="px-4 py-2 text-center rounded-md hover:scale-110 duration-300 shadow-md bg-main_orange text-white cursor-pointer flex items-center gap-2"
                  >
                    {copied.code ? <FaCheck /> : <FaCopy />}
                    {language === "EN" ? "Copy" : "نسخ"}
                  </button>
                </div>
              </div>

              {/* رابط الدعوة */}
              <div className="flex mt-4 items-start relative flex-col gap-2">
                <label className="pb-2 border-b border-main_orange">
                  {language === "EN"
                    ? "Your promo Link"
                    : "الرابط الدعائي الخاص بك"}
                </label>
                <div className="border dark:border-gray-700 px-4 py-2  relative w-full flex items-center justify-between">
                  <p className="w-full truncate">
                    {currentURL &&
                      `${currentURL}?currentCode=${
                        currentuser && btoa(currentuser.user_code)
                      }`}
                  </p>
                  <button
                    onClick={() =>
                      handleCopy(
                        `${currentURL}?currentCode=${
                          currentuser && btoa(currentuser.user_code)
                        }`,
                        "link"
                      )
                    }
                    className="px-4 py-2 rounded-md shadow-md hover:scale-110 duration-300 text-center bg-main_orange text-white cursor-pointer flex items-center gap-2"
                  >
                    {copied.link ? <FaCheck /> : <FaCopy />}
                    {language === "EN" ? "Copy" : "نسخ"}
                  </button>
                </div>
              </div>

              {/* زر الإغلاق */}
              <div
                onClick={() => setShowPromotional(false)}
                className="px-4 py-2 text-center mt-6 cursor-pointer text-white rounded-md shadow-md bg-red-300"
              >
                {language === "EN" ? "Close" : "إغلاق"}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showStats && (
          <StatsPopup onClose={() => setShowStats((prev) => !prev)} />
        )}
      </AnimatePresence>
    </>
  );
}
