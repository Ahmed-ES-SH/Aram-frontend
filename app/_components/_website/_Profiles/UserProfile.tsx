"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCamera, FaTimes, FaUserCircle } from "react-icons/fa";
import { useDataContext } from "@/app/context/DataContext";
import Img from "../../Img";
import Loading from "../../Loading";
import ForbiddenPage from "@/app/forbiddenpage/page";
import { UseVariables } from "@/app/context/VariablesContext";
import { instance } from "@/app/Api/axios";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import PromoterButtons from "./PromoterButtons";
import LocationPicker from "../../MapFile";

export default function UserProfile({ id }: any) {
  const { currentuser, setcurrentuser, type } = useDataContext();
  const { language } = UseVariables();
  const openinput = useRef<any>(null);
  const Defaultlocation = {
    latitude: 21.4735,
    longitude: 55.9754,
    address: "سلطنة عمان",
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    image: "",
    user_birthdate: "",
    user_gender: "",
  });
  console.log(currentuser);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState(false);
  const [imagePreview, setImagePreview] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [location, setlocation] = useState(Defaultlocation);

  const [showConfirmPasswordPopup, setshowConfirmPasswordPopup] =
    useState(false);
  const [showPopupVerificationPopup, setshowPopupVerificationPopup] =
    useState(false);
  const [confirmPassword, setConfirmPassword] = useState(""); // لحفظ الحقل الذي تم اختياره للتعديل
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); // لحفظ الحقل الذي تم اختياره للتعديل
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        setlocation(
          typeof currentuser.location == "string"
            ? JSON.parse(currentuser.location)
            : currentuser.location
        );
      }
      setEmailVerificationStatus(currentuser.email_verified_at ? false : true);
    }
  }, [currentuser]);

  const ConfirmToggle = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setshowConfirmPasswordPopup((prev) => !prev);
  };

  const onLocationSelect = (location: any) => {
    setlocation(location);
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
      if (formData.user_birthdate)
        form.append("user_birthdate", formData.user_birthdate);
      if (formData.user_gender)
        form.append("user_gender", formData.user_gender);
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
          user_birthdate: data.user_birthdate,
          user_gender: data.user_gender,
        });
        setlocation(
          typeof data.location == "string"
            ? JSON.parse(data.location)
            : data.location
        );
        setcurrentuser({
          ...data,
          ...(data.location
            ? {
                location:
                  typeof data.location == "string"
                    ? JSON.parse(data.location)
                    : data.location,
              }
            : Defaultlocation),
        });

        setIsPopupVisible(true);
      }
    } catch (error: any) {
      console.log(error);
    }
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

  const handleGenderChange = (gender: string) => {
    setFormData((prev) => ({ ...prev, user_gender: gender }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, user_birthdate: e.target.value }));
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
  if (loading) return <Loading />;

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

  return (
    <>
      <div
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        className="flex justify-center items-center min-h-screen dark:bg-main_dash max-md:mt-12 mt-8 bg-white"
      >
        <motion.div
          className="max-md:w-[95%] w-[90%] bg-gray-100 my-12 max-md:p-2 relative dark:bg-secend_dash rounded-lg shadow-lg p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl border-b-2 pb-2  border-main_blue font-semibold text-gray-800 dark:text-white">
              {language == "EN" ? "Profile" : "الملف الشخصى"}
            </h1>
          </div>
          {currentuser && currentuser.is_promoter ? (
            <PromoterButtons />
          ) : (
            <div></div>
          )}

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
                    {input.name == "email" ? (
                      <div className="flex items-center w-full gap-1">
                        <input
                          type={input.type}
                          name={input.name}
                          className={inputStyle}
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
                        className={inputStyle}
                        value={input.value}
                        onChange={handleChange}
                      />
                    )}
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
                  <div className=" w-full h-screen fixed top-0 left-0 bg-black/50 z-[999999] flex items-center justify-center">
                    <div className="w-3/4 max-md:w-[98%] p-2 h-fit bg-white dark:bg-secend_dash rounded-md shadow-md">
                      <LocationPicker
                        location={location}
                        onLocationSelect={onLocationSelect}
                        setLocation={setlocation}
                      />
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

                <motion.div
                  className="col-span-6 mt-4 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === "EN" ? "Gender" : "الجنس"}
                  </label>
                  <div className="mt-2 flex gap-4">
                    {[
                      {
                        value: "male",
                        label: language === "EN" ? "Male" : "ذكر",
                      },
                      {
                        value: "female",
                        label: language === "EN" ? "Female" : "أنثى",
                      },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center cursor-pointer px-4 py-2 border rounded-md shadow-sm text-sm font-medium 
              ${
                formData.user_gender === option.value
                  ? "bg-main_orange text-white"
                  : "bg-white dark:bg-secend_dash text-gray-700 dark:text-gray-300 border-gray-200"
              }`}
                        onClick={() => handleGenderChange(option.value)}
                      >
                        <input
                          type="radio"
                          id={option.value}
                          name="user_gender"
                          value={option.value}
                          checked={formData.user_gender === option.value}
                          onChange={() => handleGenderChange(option.value)}
                          className="hidden"
                        />
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="col-span-6 my-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === "EN" ? "Date of Birth" : "تاريخ الميلاد"}
                  </label>
                  <input
                    type="date"
                    id="user_birthdate"
                    name="user_birthdate"
                    className="mt-1 py-2 px-2 outline-transparent dark:bg-secend_dash focus:outline-main_orange duration-200 border w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 dark:text-gray-300 shadow-sm"
                    value={formData.user_birthdate || ""}
                    onChange={handleDateChange}
                  />
                </motion.div>

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
