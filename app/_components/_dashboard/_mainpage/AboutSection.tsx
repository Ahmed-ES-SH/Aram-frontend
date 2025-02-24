"use client";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Img from "../../Img";
import { instance } from "@/app/Api/axios";
import SuccessPopup from "../SuccessPopup";
import Loading from "../../Loading";
import { AnimatePresence, motion } from "framer-motion";

interface texttype {
  EN: string;
  AR: string;
}

export default function AboutSection({
  buttonTextEN = "Get Started Today",
  buttonTextAR = "ابدأ الآن",
  buttonLink = "/services",
}) {
  const { language }: any = UseVariables();
  const imageref = useRef<any>(null);
  const image_2ref = useRef<any>(null);
  const [image, setimage] = useState<File | string>("/services/service-03.jpg");
  const [image_2, setimage_2] = useState<File | string>("/test.png");
  const [maintext, setmaintext] = useState<texttype>({
    EN: "",
    AR: "",
  });
  const [secondtext, setsecondtext] = useState<texttype>({
    EN: "",
    AR: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  // حالات فتح وإغلاق الـ popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentText, setCurrentText] = useState({ EN: "", AR: "" });
  const [activeText, setActiveText] = useState<any>({ EN: "", AR: "" });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/about-dash");
        const data = response.data.data;

        // تخزين البيانات في الحالة
        if (data) {
          setmaintext({ EN: data.main_text_en, AR: data.main_text_ar });
          setsecondtext({ EN: data.second_text_en, AR: data.second_text_ar });
          setimage(data.image); // تأكد من أن لديك حقل للصورة في البيانات المسترجعة
          setimage_2(data.image_2); // تأكد من أن لديك حقل للصورة في البيانات المسترجعة

          console.log(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // دالة لفتح الـ popup مع النص والنص المحدد
  const openPopup = (text: texttype, setText: any) => {
    setCurrentText({ EN: text.EN, AR: text.AR }); // تعيين النصوص الحالية
    setActiveText(() => setText); // تخزين دالة setText
    setIsPopupOpen(true);
  };

  const handleSave = () => {
    if (currentText.EN.trim() !== "" || currentText.AR.trim() !== "") {
      activeText((prev: any) => ({
        EN: currentText.EN.trim() !== "" ? currentText.EN.trim() : prev.EN,
        AR: currentText.AR.trim() !== "" ? currentText.AR.trim() : prev.AR,
      }));
    }
    setIsPopupOpen(false); // إغلاق الـ popup
  };

  const handlesubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formdata = new FormData();

      // تحقق فقط من القيم التي تم تعديلها

      if (maintext.EN) formdata.append("main_text_en", maintext.EN);
      if (maintext.AR) formdata.append("main_text_ar", maintext.AR);
      if (secondtext.EN) formdata.append("second_text_en", secondtext.EN);
      if (secondtext.AR) formdata.append("second_text_ar", secondtext.AR);

      // تحقق من الصور
      if (typeof image != "string") {
        formdata.append("image", image);
      }
      if (typeof image_2 != "string") {
        formdata.append("image_2", image_2);
      }

      // إرسال الطلب
      const response = await instance.post("/update-about-dash", formdata);

      if (response.status === 200) {
        setIsPopupVisible(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleimagechange = (
    e: React.ChangeEvent<HTMLInputElement>,
    set: React.Dispatch<React.SetStateAction<File | string>>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      set(files[0]);
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <section className="w-full flex items-center justify-center">
        <div
          style={{ direction: language == "EN" ? "ltr" : "rtl" }}
          className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <motion.h1
            className="w-fit mb-5 mx-auto pb-2 text-xl border-b-2 whitespace-nowrap border-main_blue dark:text-secend_text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            صفحة التعديل
          </motion.h1>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <motion.div
              className="bg-main_orange dark:bg-secend_dash p-8 md:p-12 lg:px-16 lg:py-24"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mx-auto max-w-xl text-center">
                <motion.h2
                  onClick={() => openPopup(maintext, setmaintext)}
                  className={`text-2xl font-bold text-white md:text-3xl cursor-pointer border-2 border-transparent hover:border-sky-400 transition-all duration-300`}
                  whileHover={{ scale: 1.1 }}
                >
                  {language == "EN" ? maintext.EN : maintext.AR}
                </motion.h2>
                <motion.p
                  onClick={() => openPopup(secondtext, setsecondtext)}
                  className={`hidden text-white/80 sm:mt-4 sm:block cursor-pointer border-2 border-transparent hover:border-sky-400 transition-all duration-300`}
                  whileHover={{ scale: 1.05 }}
                >
                  {language == "EN" ? secondtext.EN : secondtext.AR}
                </motion.p>
                <motion.div
                  className="mt-4 md:mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link
                    href={buttonLink}
                    className={`inline-block rounded border border-white bg-white px-12 py-3 text-sm font-medium text-blue-500 text-center transition hover:bg-transparent hover:text-white focus:outline-none focus:ring focus:ring-yellow-400`}
                  >
                    {language == "EN" ? buttonTextEN : buttonTextAR}
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.div
                onClick={() => imageref.current.click()}
                className="w-full cursor-pointer border-2 border-transparent hover:border-sky-400 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                {typeof image == "string" ? (
                  <Img
                    src={image ? image : "/test.png"}
                    className="h-40 w-full object-cover sm:h-56 md:h-full rounded-sm"
                  />
                ) : (
                  <Img
                    src={
                      image instanceof File
                        ? URL.createObjectURL(image)
                        : "/test.png"
                    }
                    className="h-40 w-full object-cover sm:h-56 md:h-full rounded-sm"
                  />
                )}
                <input
                  type="file"
                  name="image"
                  onChange={(e) => handleimagechange(e, setimage)}
                  ref={imageref}
                  hidden
                />
              </motion.div>

              <motion.div
                onClick={() => image_2ref.current.click()}
                className="w-full cursor-pointer border-2 border-transparent hover:border-sky-400 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="file"
                  name="image_2"
                  onChange={(e) => handleimagechange(e, setimage_2)}
                  ref={image_2ref}
                  hidden
                />
                {typeof image_2 == "string" ? (
                  <Img
                    src={image_2 ? image_2 : "/test.png"}
                    className="h-40 w-full object-cover sm:h-56 md:h-full rounded-sm"
                  />
                ) : (
                  <Img
                    src={
                      image_2 instanceof File
                        ? URL.createObjectURL(image_2)
                        : "/test.png"
                    }
                    className="h-40 w-full object-cover sm:h-56 md:h-full rounded-sm"
                  />
                )}
              </motion.div>
            </motion.div>
          </div>
          <div className="w-fit mx-auto">
            <button
              onClick={handlesubmit}
              className="mt-8  px-6 py-2 rounded-md text-white  bg-main_orange border border-transparent shadow-md hover:bg-white hover:scale-105 hover:text-black hover:border-main_orange duration-200"
            >
              تعديل
            </button>
          </div>
        </div>
      </section>
      {/* الـ popup للتعديل على النصوص */}
      {isPopupOpen && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[9999999] bg-black bg-opacity-50"
            initial={{ opacity: 0 }} // يبدأ غير مرئي
            animate={{ opacity: 1 }} // يظهر تدريجياً
            exit={{ opacity: 0 }} // يختفي تدريجياً
            transition={{ duration: 0.3 }} // مدة التحول
          >
            <motion.div
              className="bg-white p-6 w-[80%] mx-auto h-fit rounded-md"
              initial={{ y: "-50%", scale: 0.8, opacity: 0 }} // يبدأ متقلصًا وغير مرئي
              animate={{ y: "0%", scale: 1, opacity: 1 }} // يظهر بشكل كامل
              exit={{ y: "50%", scale: 0.8, opacity: 0 }} // يختفي للأسفل تدريجياً
              transition={{ duration: 0.3 }} // مدة التحول
            >
              {/* حقل لإدخال النص العربي */}
              <div className="flex flex-col gap-2 w-full ">
                <label className="mb-2">الحقل بالعربية :</label>
                <textarea
                  value={currentText.AR}
                  onChange={(e) =>
                    setCurrentText((prev) => ({
                      ...prev,
                      AR: e.target.value,
                    }))
                  }
                  placeholder="Arabic text"
                  className="border border-gray-300 p-2 w-full h-[80px] mb-2"
                />
              </div>
              {/* حقل لإدخال النص الإنجليزي */}
              <div className="flex flex-col gap-2 w-full ">
                <label className="mb-2">الحقل بالانجليزية :</label>
                <textarea
                  value={currentText.EN}
                  onChange={(e) =>
                    setCurrentText((prev) => ({
                      ...prev,
                      EN: e.target.value,
                    }))
                  }
                  placeholder="English text"
                  className="border border-gray-300 p-2 w-full h-[80px] mb-4"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  حفظ
                </button>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      {isPopupVisible && (
        <SuccessPopup
          message="تمت العملية بنجاح!"
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </>
  );
}
