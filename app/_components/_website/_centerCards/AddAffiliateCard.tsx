"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaUpload, FaDollarSign, FaClock, FaHeading } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { UseVariables } from "@/app/context/VariablesContext";
import Img from "../../Img";
import { CiCalendarDate } from "react-icons/ci";
import { instance } from "@/app/Api/axios";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import { useDataContext } from "@/app/context/DataContext";
import Loading from "../../Loading";

export default function AddAffiliateCard() {
  const { language } = UseVariables();
  const { currentuser } = useDataContext();
  const orgId = currentuser && currentuser.id;
  const openinput = useRef<any>(null);
  const [cardData, setCardData] = useState<any>({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    price_before_discount: "",
    price: "",
    features_ar: ["", "", ""],
    features_en: ["", "", ""],
    duration: "",
  });
  const [durationerror, setdurationerror] = useState<string | null>(null);

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (value > 12) {
      setdurationerror(
        language === "EN"
          ? "Duration cannot exceed 12 months"
          : "لا يمكن أن تتجاوز المدة 12 شهرًا"
      );
    } else {
      setdurationerror(null);
    }

    handleChange(e); // استدعاء الدالة الأصلية لتحديث البيانات
  };
  const [image, setImage] = useState<null | File>(null);
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index: any, lang: any, value: any) => {
    const updatedFeatures = [...cardData[lang]];
    updatedFeatures[index] = value;
    setCardData({ ...cardData, [lang]: updatedFeatures });
  };

  const addFeature = (lang: any) => {
    if (cardData[lang].length >= 5) {
      setError("لا يمكنك إضافة أكثر من 5 ميزات");
      return;
    }
    setError("");
    setCardData({ ...cardData, [lang]: [...cardData[lang], ""] });
  };

  const removeFeature = (index: any, lang: any) => {
    if (cardData[lang].length <= 3) {
      setError("يجب أن تحتوي البطاقة على 3 ميزات على الأقل");
      return;
    }
    const updatedFeatures = cardData[lang].filter(
      (_: any, i: any) => i !== index
    );
    setCardData({ ...cardData, [lang]: updatedFeatures });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const handlesubmit = async () => {
    try {
      if (cardData.duration > 12) {
        return null;
      }
      const formdata: any = new FormData();
      formdata.append("title_en", cardData.title_en);
      formdata.append("title_ar", cardData.title_ar);
      formdata.append("description_ar", cardData.description_ar);
      formdata.append("description_en", cardData.description_en);
      formdata.append("duration", cardData.duration);
      formdata.append("price_before_discount", cardData.price_before_discount);
      formdata.append("price", cardData.price);
      formdata.append("features_ar", JSON.stringify(cardData.features_ar));
      formdata.append("features_en", JSON.stringify(cardData.features_en));
      formdata.append("image", image);
      formdata.append("organization_id", Number(orgId));
      formdata.append("active", "0");
      formdata.append("status", "not_allow");

      const response = await instance.post(
        `/add-affiliate-card-type`,
        formdata
      );
      if (response.status == 201) {
        setShowSuccessPopup(true);
        setCardData({
          title_en: "",
          title_ar: "",
          description_en: "",
          description_ar: "",
          price_before_discount: "",
          price: "",
          features_ar: ["", "", ""],
          features_en: ["", "", ""],
          duration: "",
        });
        setImage(null);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <motion.div
      style={{ direction: language == "EN" ? "ltr" : "rtl" }}
      className="p-6 w-[90%] max-lg:w-[95%] max-md:w-[98%] mt-24 mb-4 mx-auto bg-white rounded-xl shadow-md space-y-4 border-main_orange border-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold pb-2 border-b border-main_blue w-fit mx-auto text-main_orange text-center">
        {language == "EN" ? "Add New Card" : "إضافة بطاقة جديدة"}
      </h2>

      <div
        onClick={() => openinput.current.click()}
        className="flex items-center text-orange-300 hover:text-main_orange justify-center border-2 border-dashed w-full h-52 border-orange-300 duration-200 cursor-pointer hover:border-orange-500 group"
      >
        {image instanceof File ? (
          <Img
            src={URL.createObjectURL(image)}
            className="w-72 h-40 rounded-md object-cover shadow-md"
          />
        ) : (
          <FaUpload className="size-7 group-hover:scale-150 duration-300" />
        )}
      </div>
      <input
        ref={openinput}
        type="file"
        className="hidden"
        onChange={handleImageChange}
      />

      <div className="space-y-2">
        <div className="flex items-center border pl-1 rounded bg-orange-100">
          <FaHeading className="text-orange-500 mr-2" />
          <input
            type="text"
            name="title_en"
            placeholder={
              language == "EN" ? "Title (English)" : "العنوان بالإنجليزية"
            }
            value={cardData.title_en}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200 "
          />
        </div>

        <div className="flex items-center border pl-1 rounded bg-orange-100">
          <FaHeading className="text-orange-500 mr-2" />
          <input
            type="text"
            name="title_ar"
            placeholder={
              language == "EN" ? "Title (Arabic)" : "العنوان بالعربية"
            }
            value={cardData.title_ar}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200 "
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center border pl-1 rounded bg-orange-100">
          <FaInfoCircle className="text-orange-500 mr-2" />
          <textarea
            name="description_en"
            placeholder={
              language == "EN"
                ? "Description (English)"
                : "وصف البطاقة بالإنجليزية "
            }
            value={cardData.description_en}
            onChange={handleChange}
            className="w-full bg-transparent leading-5 focus:outline-none focus:bg-white p-2 duration-200 "
          ></textarea>
        </div>
      </div>

      <div className="flex items-center border pl-1 rounded bg-orange-100">
        <FaInfoCircle className="text-orange-500 mr-2" />
        <textarea
          name="description_ar"
          placeholder={
            language == "EN" ? "Description (Arabic)" : "وصف البطاقة بالعربية "
          }
          value={cardData.description_ar}
          onChange={handleChange}
          className="w-full leading-5 bg-transparent focus:outline-none focus:bg-white p-2 duration-200 "
        ></textarea>
      </div>

      <div className="flex gap-2">
        <div className="flex items-center border pl-1 rounded bg-orange-100 w-full">
          <FaDollarSign className="text-orange-500 mr-2" />
          <input
            type="number"
            min={0}
            name="price_before_discount"
            placeholder={
              language == "EN" ? "Price before discount" : "السعر قبل الخصم"
            }
            value={cardData.price_before_discount}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200"
          />
        </div>
      </div>
      <div className="flex items-center border pl-1 rounded bg-orange-100 w-full">
        <FaDollarSign className="text-orange-500 mr-2" />
        <input
          type="number"
          name="price"
          min={0}
          placeholder={
            language == "EN" ? "Price after discount" : "السعر بعد الخصم"
          }
          value={cardData.price}
          onChange={handleChange}
          className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200"
        />
      </div>
      <div className="w-full">
        <div className="flex items-center border pl-1 rounded bg-orange-100 w-full">
          <CiCalendarDate className="text-orange-500 size-5 mr-2" />
          <input
            type="number"
            name="duration"
            placeholder={
              language == "EN"
                ? "Card duration in months"
                : "مدة البطاقة بالشهور"
            }
            value={cardData.duration}
            min={1}
            onChange={handleDurationChange}
            className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200"
          />
        </div>

        {durationerror && (
          <p className="text-red-500 text-sm mt-1">{durationerror}</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg pb-1 border-b border-main_blue w-fit ">
          {language == "EN" ? "Features in (Arabic)" : "المميزات بالعربية"}
        </h3>
        {cardData.features_ar.map((feature: any, index: any) => (
          <div
            key={index}
            className="flex gap-2 items-center border p-2 rounded bg-orange-100"
          >
            <input
              type="text"
              value={feature}
              onChange={(e) =>
                handleFeatureChange(index, "features_ar", e.target.value)
              }
              className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200"
            />
            <button
              onClick={() => removeFeature(index, "features_ar")}
              className="text-red-500"
            >
              <AiOutlineMinus />
            </button>
          </div>
        ))}
        <button
          onClick={() => addFeature("features_ar")}
          className="text-orange-500 flex items-center gap-1"
        >
          <AiOutlinePlus /> {language == "EN" ? "Add Feature" : "إضافة ميزة"}
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg pb-1 border-b border-main_blue w-fit">
          {language == "EN" ? "Features in (English)" : "المميزات بالإنجليزية"}
        </h3>
        {cardData.features_en.map((feature: any, index: any) => (
          <div
            key={index}
            className="flex gap-2 items-center border p-2 rounded bg-orange-100"
          >
            <input
              type="text"
              value={feature}
              onChange={(e) =>
                handleFeatureChange(index, "features_en", e.target.value)
              }
              className="w-full bg-transparent focus:outline-none focus:bg-white p-2 duration-200"
            />
            <button
              onClick={() => removeFeature(index, "features_en")}
              className="text-red-500"
            >
              <AiOutlineMinus />
            </button>
          </div>
        ))}
        <button
          onClick={() => addFeature("features_en")}
          className="text-orange-500 flex items-center gap-1"
        >
          <AiOutlinePlus /> {language == "EN" ? "Add Feature" : "إضافة ميزة"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handlesubmit}
        className="bg-main_orange outline-none hover:scale-105 duration-150 hover:bg-white hover:text-black hover:border-main_orange border border-transparent text-white px-4 py-2 rounded-lg w-[90%] mx-auto block mt-4"
      >
        {language == "EN" ? "Send" : "إرسال الطلب"}
      </button>

      {showSuccessPopup && (
        <SuccessPopup
          message={
            language == "EN"
              ? "The card application has been sent. It will be reviewed and you will be notified as soon as possible."
              : "تم إرسال الطلب الخاص بالبطاقة سيتم مراجعتة وإبلاغك فى أقرب وقت ."
          }
          onClose={() => setShowSuccessPopup((prev) => !prev)}
        />
      )}
    </motion.div>
  );
}
