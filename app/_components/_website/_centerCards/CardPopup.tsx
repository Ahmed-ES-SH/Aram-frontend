"use client";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaCheck, FaTimes, FaImage, FaTrash } from "react-icons/fa";
import Img from "../../Img";
import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import Loading from "../../Loading";
import { MdErrorOutline } from "react-icons/md";

const CardPopup = ({
  card,
  onClose,
  setShowSuccessPopup,
  setSelectedCard,
}: any) => {
  const { language } = UseVariables();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<any>(card);
  const [image, setImage] = useState<any>(editedCard.image);
  const [loading, setLoading] = useState(false);
  const openInput = useRef<any>(null);

  const handleChange = (e: any, field: any) => {
    setEditedCard((prev: any) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleFeatureChange = (e: any, index: any, lang: any) => {
    const updatedFeatures = [...editedCard[`features_${lang}`]];
    updatedFeatures[index] = e.target.value;
    setEditedCard((prev: any) => ({
      ...prev,
      [`features_${lang}`]: updatedFeatures,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("title_en", editedCard.title_en);
      formdata.append("title_ar", editedCard.title_ar);
      formdata.append("description_ar", editedCard.description_ar);
      formdata.append("description_en", editedCard.description_en);
      formdata.append("duration", editedCard.duration);
      formdata.append(
        "price_before_discount",
        editedCard.price_before_discount
      );
      formdata.append("price", editedCard.price);
      formdata.append("features_ar", JSON.stringify(editedCard.features_ar));
      formdata.append("features_en", JSON.stringify(editedCard.features_en));
      formdata.append("image", image);
      formdata.append("organization_id", editedCard.organization_id);
      formdata.append("active", "0");
      formdata.append("status", "under_review");
      const response = await instance.post(
        `/update-affiliate-card-type/${card.id}`,
        formdata
      );
      if (response.status == 200) {
        const data = response.data.data;
        setShowSuccessPopup(true);
        setSelectedCard({ ...data });
        onClose();
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveFeature_en = (index: number) => {
    setEditedCard((prev: any) => ({
      ...prev,
      features_en: prev.features_en.filter((_: any, i: any) => i !== index),
    }));
  };
  const handleRemoveFeature_ar = (index: number) => {
    setEditedCard((prev: any) => ({
      ...prev,
      features_ar: prev.features_ar.filter((_: any, i: any) => i !== index),
    }));
  };

  if (loading) return <Loading />;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center max-md:p-2 p-4"
      >
        <input
          hidden
          type="file"
          ref={openInput}
          onChange={handleImageChange}
        />
        <motion.div
          style={{ direction: language == "EN" ? "ltr" : "rtl" }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-white relative dark:bg-secend_dash  h-[75vh] overflow-y-auto rounded-lg shadow-2xl w-[90%] max-md:p-2 max-md:w-[98%] max-lg:w-[95%]  p-6"
        >
          {card && card.status != "allow" && (
            <div className="w-fit mb-6 p-4 rounded-lg shadow-lg bg-red-100 border-l-4 border-red-500  flex items-start gap-3">
              {/* أيقونة الخطأ */}
              <MdErrorOutline className="size-6 flex-shrink-0 text-red-500" />

              {/* النص */}
              <p className="text-sm  leading-relaxed">
                {language == "EN"
                  ? "Sorry, this Card is still under review and has not been approved for publication yet."
                  : "عفواً، هذه البطاقة لا تزال في طور المراجعة ولم يتم الموافقة على نشرها بعد."}
              </p>
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-secend_text">
              {isEditing
                ? language == "EN"
                  ? "Edit Card"
                  : "تعديل البطاقة"
                : language == "EN"
                ? "Card Detailes"
                : "تفاصيل البطاقة"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 absolute top-3 right-3 dark:text-white hover:text-gray-700  transition duration-200"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>

          <div
            className="cursor-pointer"
            onClick={() => openInput.current.click()}
          >
            <label className="block  text-sm font-medium text-gray-700 dark:text-secend_text mb-2">
              {language == "EN" ? "Card background" : "خلفية البطاقة"}
            </label>
            <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 transition duration-200 hover:border-blue-500">
              {image instanceof File ? (
                <Img
                  src={URL.createObjectURL(image)}
                  className="w-60 h-32 object-cover rounded-lg"
                />
              ) : image ? (
                <Img
                  src={image}
                  className="w-60 h-32 object-cover rounded-lg"
                />
              ) : (
                <FaImage className="text-gray-400 text-4xl" />
              )}
            </div>
          </div>

          <div className="space-y-4 mt-4">
            {/* العنوان (إنجليزي) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-secend_text mb-2">
                {language == "EN" ? "Title (English)" : "العنوان بالإنجليزية"}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCard.title_en}
                  onChange={(e) => handleChange(e, "title_en")}
                  className="w-full px-4 py-2 border dark:bg-main_dash dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              ) : (
                <p className="text-gray-900 dark:text-white text-lg">
                  {editedCard.title_en}
                </p>
              )}
            </div>

            {/* العنوان (عربي) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-secend_text mb-2">
                {language == "EN" ? "Title (Arabic)" : "العنوان بالعربية"}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCard.title_ar}
                  onChange={(e) => handleChange(e, "title_ar")}
                  className="w-full px-4 py-2 border dark:bg-main_dash dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              ) : (
                <p className="text-gray-900 dark:text-white text-lg">
                  {editedCard.title_ar}
                </p>
              )}
            </div>

            {/* الوصف (إنجليزي) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-secend_text mb-2">
                {language == "EN"
                  ? "Description (English)"
                  : "وصف البطاقة بالإنجليزية "}
              </label>
              {isEditing ? (
                <textarea
                  value={editedCard.description_en}
                  onChange={(e) => handleChange(e, "description_en")}
                  className="w-full px-4 py-2 border dark:bg-main_dash dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  rows={3}
                />
              ) : (
                <p className="text-gray-900 dark:text-white text-lg">
                  {editedCard.description_en}
                </p>
              )}
            </div>

            {/* الوصف (عربي) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-secend_text mb-2">
                {language == "EN"
                  ? "Description (Arabic)"
                  : "وصف البطاقة بالعربية "}
              </label>
              {isEditing ? (
                <textarea
                  value={editedCard.description_ar}
                  onChange={(e) => handleChange(e, "description_ar")}
                  className="w-full px-4 py-2 border dark:bg-main_dash dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  rows={3}
                />
              ) : (
                <p className="text-gray-900 dark:text-white text-lg">
                  {editedCard.description_ar}
                </p>
              )}
            </div>

            {/* السعر قبل الخصم */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-secend_text mb-2">
                {language == "EN" ? "Price before discount" : "السعر قبل الخصم"}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  min={0}
                  value={editedCard.price_before_discount}
                  onChange={(e) => handleChange(e, "price_before_discount")}
                  className="w-full px-4 py-2 border dark:bg-main_dash dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              ) : (
                <p className="text-gray-900 dark:text-white text-lg">
                  {editedCard.price_before_discount}
                </p>
              )}
            </div>

            {/* السعر بعد الخصم */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-secend_text mb-2">
                {language == "EN" ? "Price after discount" : "السعر بعد الخصم"}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  min={0}
                  value={editedCard.price}
                  onChange={(e) => handleChange(e, "price")}
                  className="w-full px-4 py-2 border dark:bg-main_dash dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              ) : (
                <p className="text-gray-900 dark:text-white text-lg">
                  {editedCard.price}
                </p>
              )}
            </div>

            {/*  المدة الخاصة بالبطاقة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-secend_text mb-2">
                {language == "EN"
                  ? "Card duration in months"
                  : "مدة البطاقة بالشهور"}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="duration"
                  min={0}
                  value={editedCard.duration}
                  onChange={(e) => handleChange(e, "duration")}
                  className="w-full px-4 py-2 border dark:bg-main_dash dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              ) : (
                <p className="text-gray-900 dark:text-white text-lg">
                  {editedCard.duration}
                </p>
              )}
            </div>

            {/* الميزات (إنجليزي) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-secend_text mb-2">
                {language == "EN"
                  ? "Features in (English)"
                  : "المميزات بالإنجليزية"}
              </label>
              {isEditing ? (
                editedCard.features_en.map((feature: any, index: number) => (
                  <div
                    style={{ direction: "ltr" }}
                    key={index}
                    className="relative "
                  >
                    <input
                      key={index}
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(e, index, "en")}
                      className="w-full px-4 py-2 border dark:bg-main_dash dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 transition duration-200"
                    />
                    <FaTrash
                      onClick={() => handleRemoveFeature_en(index)}
                      className="size-5 text-red-500 absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                    />
                  </div>
                ))
              ) : (
                <ul className="list-disc pl-5">
                  {editedCard.features_en.map((feature: any, index: number) => (
                    <li
                      key={index}
                      className="text-gray-900 dark:text-white text-lg"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* الميزات (عربي) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-secend_text mb-2">
                {language == "EN"
                  ? "Features in (Arabic)"
                  : "المميزات بالعربية"}
              </label>
              {isEditing ? (
                editedCard.features_ar.map((feature: any, index: number) => (
                  <div
                    style={{ direction: "ltr" }}
                    key={index}
                    className="relative "
                  >
                    <input
                      key={index}
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(e, index, "ar")}
                      className="w-full px-4 py-2 border dark:bg-main_dash dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 transition duration-200"
                    />
                    <FaTrash
                      onClick={() => handleRemoveFeature_ar(index)}
                      className="size-5 text-red-500 absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                    />
                  </div>
                ))
              ) : (
                <ul className="list-disc pl-5">
                  {editedCard.features_ar.map((feature: any, index: number) => (
                    <li
                      key={index}
                      className="text-gray-900 dark:text-white text-lg"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* الصورة */}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CardPopup;
