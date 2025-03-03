"use client";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Img from "@/app/_components/Img";
import Loading from "@/app/_components/Loading";
import LocationPicker from "@/app/_components/MapFile";
import SlectLocation from "@/app/_components/MapFile";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { RiAdvertisementFill, RiUser2Line } from "react-icons/ri";

export default function AddUser() {
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "",
    is_promoter: 0,
  });
  const [location, setlocation] = useState({
    latitude: 21.4735,
    longitude: 55.9754,
    address: "سلطنة عمان",
  });

  const openInput = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: [] }); // إزالة الأخطاء عند الكتابة
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // تصفير الأخطاء
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value as any)
      );

      if (image) formData.append("image", image);
      if (location) formData.append("location", JSON.stringify(location));

      const response = await instance.post("/register", formData);

      if (response.status === 201) {
        setIsPopupVisible(true);
        setForm({
          name: "",
          email: "",
          phone_number: "",
          password: "",
          role: "",
          is_promoter: 0,
        });
        setImage(null);
        setTimeout(() => {
          router.push("/dashboard/users");
        }, 1500);
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

  const inputStyle =
    "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 ";
  const errorStyle = "text-red-500 text-sm mt-1";

  const inputs = [
    {
      label: "الإسم",
      name: "name",
      type: "text",
      value: form.name,
      placeholder: "أدخل اسمك",
    },
    {
      label: "البريد الالكتروني",
      name: "email",
      type: "email",
      value: form.email,
      placeholder: "example@email.com",
    },
    {
      label: "رقم الهاتف",
      name: "phone_number",
      type: "tel",
      value: form.phone_number,
      placeholder: "رقم الهاتف",
    },
    {
      label: "كلمة المرور",
      name: "password",
      type: "password",
      value: form.password,
      placeholder: "********",
    },
  ];

  const onLocationSelect = (location: any) => {
    setlocation(location);
  };

  return (
    <>
      <div className="w-full ">
        <div className="min-h-screen  w-full flex items-center p-6 justify-center  dark:bg-main_dash">
          {loading ? (
            <Loading />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-secend_dash  p-8 rounded-xl shadow-lg  w-full"
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-700 dark:text-secend_text">
                إضافة مستخدم
              </h2>
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4 "
                transition={{ duration: 0.5 }}
              >
                <div>
                  <label className="block text-gray-600 dark:text-white mb-2">
                    صورة
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
                </div>
                {inputs.map((input, index) => (
                  <div key={index}>
                    <label className="block text-gray-600 dark:text-white mb-2">
                      {input.label}
                    </label>
                    <input
                      name={input.name}
                      value={input.value}
                      onChange={onChange}
                      type={input.type}
                      placeholder={input.placeholder}
                      className={inputStyle}
                    />
                    {errors[input.name] && (
                      <p className={errorStyle}>{errors[input.name][0]}</p>
                    )}
                  </div>
                ))}
                <div>
                  <label className="block text-gray-600 mb-2 dark:text-white">
                    الدور
                  </label>
                  <select
                    value={form.role}
                    name="role"
                    onChange={onChange}
                    className={inputStyle}
                  >
                    <option disabled value="">
                      اختر دور الحساب الجديد
                    </option>
                    <option value="user">مستخدم</option>
                    <option value="Admin">أدمن</option>
                  </select>
                  {errors.role && (
                    <p className={errorStyle}>{errors.role[0]}</p>
                  )}
                </div>

                <div className=" w-full h-fit">
                  <input
                    readOnly
                    value={location?.address}
                    className={`${inputStyle} bg-gray-300`}
                  />
                  <LocationPicker
                    location={location}
                    onLocationSelect={onLocationSelect}
                    setLocation={setlocation}
                  />
                </div>
                <div className="w-full mt-4">
                  <label className="block text-gray-600 dark:text-white mb-2">
                    حالة الترويج
                  </label>
                  <div className="flex items-center justify-between gap-2 max-md:flex-col w-full mt-2">
                    <div
                      onClick={() => setForm({ ...form, is_promoter: 1 })}
                      className={`flex-1 max-md:w-full py-4 px-2 rounded-md shadow-md flex items-center justify-center ${
                        form.is_promoter
                          ? "text-white bg-green-400"
                          : "bg-gray-50"
                      } duration-200 cursor-pointer`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <RiAdvertisementFill className="size-7 " />
                        <p>مروج</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setForm({ ...form, is_promoter: 0 })}
                      className={`flex-1 max-md:w-full py-4 px-2 rounded-md shadow-md flex items-center justify-center ${
                        !form.is_promoter
                          ? "text-white bg-green-400"
                          : "bg-gray-50"
                      } duration-200 cursor-pointer`}
                    >
                      <div className="flex items-center flex-col gap-2">
                        <RiUser2Line className="size-7 " />
                        <p>مستخدم</p>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 shadow-lg hover:bg-white border border-transparent hover:border-blue-500 hover:text-black duration-200"
                >
                  إضافة
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </div>
      </div>
      {isPopupVisible && (
        <SuccessPopup
          message="تمت العملية بنجاح!"
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </>
  );
}
