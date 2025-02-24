"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { FaCheckCircle, FaPlus, FaTimes, FaVideo } from "react-icons/fa";
import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import Loading from "../../Loading";
import Img from "../../Img";
import { AnimatePresence, motion } from "framer-motion";
import SuccessPopup from "../SuccessPopup";

interface texttype {
  EN: string;
  AR: string;
}

export default function Hero_video_dash() {
  const { language }: any = UseVariables();
  const [video, setvideo] = useState<any>("");
  const [typevideopopup, settypevideopopup] = useState<boolean>(false);
  const [linkpopup, setlinkpopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [timer, setTimer] = useState(3);
  const [linkVideo, setLinkVideo] = useState("");
  const [text1, setText1] = useState<texttype>({
    EN: "Welcome to Your Trusted Medical Partner",
    AR: "مرحباً بكم في شريككم الطبي الموثوق",
  });
  const [text2, setText2] = useState<texttype>({
    EN: "Comprehensive Healthcare Solutions",
    AR: "حلول طبية شاملة",
  });
  const [text3, setText3] = useState<texttype>({
    EN: "Care Beyond Expectations",
    AR: "رعاية تتجاوز التوقعات",
  });
  const [text4, setText4] = useState<texttype>({
    EN: "Discover our services tailored to your needs.",
    AR: "اكتشف خدماتنا المصممة لتلبية احتياجاتك.",
  });

  const [loading, setloading] = useState(true);
  const chossevideoref = useRef<any>(null); // مرجع للفيديو

  // حالات فتح وإغلاق الـ popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentText, setCurrentText] = useState({
    EN: "",
    AR: "",
  });
  const [activeText, setActiveText] = useState<any>({ EN: "", AR: "" });

  // حالة الـ toggle لتحديد قيمة main_screen
  const [mainScreen, setMainScreen] = useState<any>(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/get-videoscreen");
        const data = response.data.data;

        if (data) {
          setText1({ EN: data.main_text_en, AR: data.main_text_ar });
          setText2({ EN: data.second_text_en, AR: data.second_text_ar });
          setText3({ EN: data.third_text_en, AR: data.third_text_ar });
          setText4({ EN: data.forth_text_en, AR: data.forth_text_ar });
          setvideo(data.video);
          setLinkVideo(data.link_video);
          setMainScreen(data.main_screen);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    getData();
  }, []);

  const onchangevideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setvideo(files[0]);
    }
  };

  // دالة لفتح الـ popup مع النص والنص المحدد
  const openPopup = (
    text: texttype,
    setText: React.Dispatch<React.SetStateAction<texttype>>
  ) => {
    setCurrentText({ EN: text.EN, AR: text.AR }); // تعيين النصوص الحالية
    setActiveText(() => setText); // تخزين دالة setText
    setIsPopupOpen(true);
  };

  // دالة لحفظ التعديلات وإغلاق الـ popup
  const handleSave = () => {
    if (currentText.EN.trim() !== "" || currentText.AR.trim() !== "") {
      activeText((prev: texttype) => ({
        EN: currentText.EN.trim() !== "" ? currentText.EN.trim() : prev?.EN,
        AR: currentText.AR.trim() !== "" ? currentText.AR.trim() : prev?.AR,
      }));

      console.log("تم تحديث النصوص:", currentText);
    } else {
      console.log("لا يوجد نص جديد ليتم حفظه.");
    }

    setIsPopupOpen(false); // إغلاق الـ popup
  };

  useEffect(() => {
    let countdown: any;
    if (showSuccessPopup && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowSuccessPopup(false);
      setTimer(3);
    }

    return () => clearInterval(countdown);
  }, [showSuccessPopup, timer]);

  const handleaddlink = () => {
    setlinkpopup((prev) => !prev);
    settypevideopopup((prev) => !prev);
  };
  const handleadddfile = () => {
    chossevideoref.current.click();
    settypevideopopup((prev) => !prev);
  };

  const toggleupdate = async () => {
    setMainScreen((prev: any) => !prev);
  };

  const handleUpdateVideoFile = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const formData: any = new FormData();
      if (linkVideo) {
        // استخراج معرف الفيديو من رابط يوتيوب
        const videoIdMatch = linkVideo.match(
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
        );

        if (!videoIdMatch || videoIdMatch.length < 2) {
          console.log("رابط يوتيوب غير صالح");
          return;
        }

        const videoId = videoIdMatch[1];

        // بناء رابط التشغيل المضمن بدون أي تفاصيل إضافية
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&fs=0`;
        formData.append("video", "");
        formData.append("link_video", embedUrl);
      } else {
        formData.append("video", video);
        formData.append("link_video", "");
      }
      const response = await instance.post(`/update-videoscreen`, formData);
      await instance.post(`/update-mainscreen/2`, {
        main_screen: mainScreen ? "1" : "0",
      });
      if (response.status === 200) {
        setvideo(response.data.data.video);
        setLinkVideo(response.data.data.link_video);
        setShowSuccessPopup(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (video) {
      setLinkVideo("");
    }
  }, [video]);

  if (loading) return <Loading />;

  return (
    <>
      <h1 className="pb-2 border-b border-sky-600 dark:text-white w-fit mx-auto text-xl pt-4 block">
        قسم واجهة الفيديو
      </h1>
      <motion.div
        className="w-full  p-6 mb-4   dark:text-white  border-b border-sky-400 flex items-center justify-between "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>حالة العرض </h1>
        {/* Toggle on the left */}
        <div
          onClick={
            () => toggleupdate() // التبديل بين القيم
          }
          className={`flex cursor-pointer items-center w-[80px] h-[40px] relative ${
            mainScreen ? "bg-green-400" : "bg-gray-300"
          } rounded-full duration-200 shadow-md border `}
        >
          <motion.span
            layout
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ scale: 1.1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
            className="w-[25px] h-[25px] rounded-full bg-white absolute"
            style={{
              left: mainScreen ? "10px" : "45px",
            }}
          ></motion.span>
        </div>
      </motion.div>
      <div
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        className="w-full p-4 max-md:p-1 flex flex-col items-center rounded-md "
      >
        <form
          onSubmit={handleUpdateVideoFile}
          className="w-full py-2 px-2ي dark:bg-secend_dash flex items-center justify-center flex-col"
        >
          <div className="flex flex-col gap-2 w-full">
            <label className="dark:text-white ml-auto pb-2 border-b border-sky-500 w-fit">
              {"اختر فيديو جديد"}
            </label>
            <input
              type="file"
              onChange={onchangevideo}
              ref={chossevideoref}
              id="video"
              className="peer hidden border-none px-4 h-[40px] bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
              placeholder="Username"
            />
            <div
              onClick={() => settypevideopopup(true)}
              className={`w-full cursor-pointer h-32 flex items-center justify-center border-2 border-dashed ${
                video || linkVideo
                  ? "bg-green-100 border-green-500"
                  : "bg-transparent border-sky-300"
              }`}
            >
              {video || linkVideo ? (
                <FaVideo className="text-green-500" />
              ) : (
                <FaPlus className="text-main_blue" />
              )}
            </div>
            {video && (
              <p className="mt-2 text-center text-green-500">
                {video instanceof File ? (
                  <p className="mt-2 text-center text-green-500">
                    {`اسم الملف: ${video?.name}`}
                  </p>
                ) : (
                  <p className="mt-2 text-center text-blue-500">
                    {`الرابط: ${video}`}
                  </p>
                )}
              </p>
            )}

            {linkVideo && (
              <p className="mt-2 text-center text-blue-500">
                {`الرابط: ${linkVideo}`}
              </p>
            )}
          </div>

          <input
            type="submit"
            value={"حفظ"}
            className="px-6 w-1/4 max-md:w-[90%] cursor-pointer border border-transparent hover:border-green-400 duration-200 hover:bg-transparent bg-green-400 mt-4 py-1 text-white hover:text-black dark:hover:text-white text-center rounded-md  mx-auto"
          />
        </form>
        <div className="relative   parantIframe overflow-hidden flex items-center justify-center w-full bg-black">
          {/* فيديو الخلفية */}
          {linkVideo && (
            <iframe
              src={linkVideo}
              allow="autoplay; encrypted-media"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}
          {video && (
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              src={video instanceof File ? URL.createObjectURL(video) : video}
              autoPlay
              loop
              muted
              playsInline
            ></video>
          )}

          {/* طبقة سوداء شفافة فوق الفيديو */}
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>

          {/* المحتوى النصي */}
          <motion.div
            className="z-10 flex flex-col items-center text-center gap-6 px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className={`${
                language === "EN"
                  ? "text-5xl max-md:text-3xl max-sm:text-xl"
                  : "text-3xl max-md:text-2xl max-sm:text-lg"
              } font-bold text-white cursor-pointer`}
              whileHover={{ scale: 1.05, color: "#38bdf8" }}
              transition={{ duration: 0.3 }}
              onClick={() => openPopup(text1, setText1)}
            >
              {text1["EN"]}
            </motion.h1>

            <motion.h2
              className={`${
                language === "EN"
                  ? "text-4xl max-md:text-2xl max-sm:text-lg"
                  : "text-3xl max-md:text-xl max-sm:text-md"
              } font-semibold text-main_orange cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => openPopup(text2, setText2)}
            >
              {text2["EN"]}
            </motion.h2>

            <motion.h3
              className={`${
                language === "EN"
                  ? "text-5xl max-md:text-2xl"
                  : "text-4xl max-md:text-xl"
              } font-medium text-gray-200 cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => openPopup(text3, setText3)}
            >
              {text3["EN"]}
            </motion.h3>
          </motion.div>
        </div>
        {/* الـ popup للتعديل على النصوص */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999999] bg-black bg-opacity-50">
            <div className="bg-white p-6 w-[80%] mx-auto  max-h-fit rounded-md">
              {/* حقل لإدخال النص العربي */}
              <textarea
                value={currentText.AR}
                onChange={(e) =>
                  setCurrentText((prev) => ({
                    ...prev,
                    AR: e.target.value,
                  }))
                }
                placeholder="Arabic text"
                className="border border-gray-300 p-2 w-full h-[50px] mb-2"
              />
              {/* حقل لإدخال النص الإنجليزي */}
              <textarea
                value={currentText.EN}
                onChange={(e) =>
                  setCurrentText((prev) => ({
                    ...prev,
                    EN: e.target.value,
                  }))
                }
                placeholder="English text"
                className="border border-gray-300 p-2 w-full h-[50px] mb-4"
              />
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-50">
            <div className="bg-white p-6 w-[90%] max-w-sm mx-auto rounded-lg shadow-lg flex flex-col items-center relative">
              {/* أيقونة التحقق */}
              <FaCheckCircle className="text-green-500 w-12 h-12 mb-4" />

              {/* نص رسالة النجاح */}
              <p className="text-green-600 text-lg font-semibold text-center mb-4">
                {language === "en" ? "Update Successful!" : "تم التحديث بنجاح!"}
              </p>

              {/* شريط التقدم */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(timer / 3) * 100}%` }} // تصحيح هنا
                ></div>
              </div>
            </div>
          </div>
        )}
        <AnimatePresence>
          {typevideopopup && (
            <motion.div
              initial={{ opacity: 0, y: -200 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ y: -200, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[999999999999999999] flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white dark:bg-secend_dash rounded-lg shadow-lg w-[90%] max-w-md p-6">
                <h2 className="text-xl font-semibold text-center mb-4 dark:text-white">
                  إختر نوع البيانات
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* خيار رفع ملف */}
                  <div
                    onClick={handleadddfile}
                    className="flex flex-col items-center justify-center border p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-secend_text dark:bg-main_dash dark:border-gray-700 cursor-pointer transition"
                  >
                    <Img
                      src="/dashboard/videofile.png"
                      className="w-16 h-16 mb-2"
                    />
                    <p className="text-gray-700 dark:text-secend_text font-medium">
                      ملف فيديو
                    </p>
                  </div>
                  {/* خيار إضافة رابط */}
                  <div
                    onClick={handleaddlink}
                    className="flex flex-col items-center justify-center border p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-secend_text dark:bg-main_dash dark:border-gray-700 cursor-pointer transition"
                  >
                    <Img src="/dashboard/link.png" className="w-16 h-16 mb-2" />
                    <p className="text-gray-700 dark:text-secend_text font-medium">
                      رابط فيديو
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => settypevideopopup(false)}
                  className="mt-6 w-full bg-main_orange text-white py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {linkpopup && (
          <motion.div
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: -200, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[999999999999999999] flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white relative overflow-hidden dark:bg-main_dash rounded-lg shadow-lg w-[90%] max-w-md p-6">
              <h2 className="text-xl font-semibold text-center mb-4 dark:text-white">
                أضف الرابط
              </h2>
              <form className="w-full flex flex-col items-center justify-center">
                <input
                  name="link_video"
                  value={typeof linkVideo == "string" ? linkVideo : ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLinkVideo(e.target.value)
                  }
                  type="text"
                  className="w-full outline-transparent dark:border-none border dark:text-white focus:outline-main_blue p-2 placeholder-shown:p-2 bg-white dark:bg-secend_dash rounded-md"
                />
                <div
                  onClick={() => {
                    setvideo(null);
                    setlinkpopup(false);
                  }}
                  className="w-1/2 cursor-pointer mt-6 max-md:w-[95%] p-2 text-white rounded-md text-center bg-main_orange"
                >
                  حفظ
                </div>
              </form>
              <button
                onClick={() => setlinkpopup(false)}
                className="px-2 absolute top-2 left-4 w-fit bg-main_blue text-white py-2 rounded-lg hover:bg-orange-600 transition"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </div>
      {/* عرض الـ Popup عند نجاح العملية */}
      {isPopupVisible && (
        <SuccessPopup
          message="تمت العملية بنجاح!"
          onClose={() => setIsPopupVisible(false)} // إغلاق الـ Popup عند الضغط على زر الإغلاق
        />
      )}
    </>
  );
}
