"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaImage, FaCalendarAlt, FaTag, FaPen } from "react-icons/fa";
import { CiDiscount1, CiText } from "react-icons/ci";
import { BsCursorText } from "react-icons/bs";
import { useDataContext } from "../context/DataContext";
import { UseVariables } from "../context/VariablesContext";
import { instance } from "../Api/axios";
import SuccessPopup from "../_components/_dashboard/SuccessPopup";
import Loading from "../_components/Loading";
import Img from "../_components/Img";

interface catgeorytype {
  id: any;
  title_en: string;
  title_ar: string;
}

export default function AddNewOffer() {
  const { language } = UseVariables();
  const { allCategories, currentuser } = useDataContext();
  const orgId = currentuser && currentuser.id;
  const openInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    title_ar: "",
    title_en: "",
    image: null,
    description_ar: "",
    description_en: "",
    discount_value: "",
    start_date: "",
    end_date: "",
    category_id: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errors, setErrors] = useState<any>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files && files.length > 0) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formdata = new FormData();
      formdata.append("title_ar", form.title_ar);
      formdata.append("title_en", form.title_en);
      formdata.append("image", form.image);
      formdata.append("description_ar", form.description_ar);
      formdata.append("description_en", form.description_en);
      formdata.append("discount_value", form.discount_value);
      formdata.append("start_date", form.start_date);
      formdata.append("end_date", form.end_date);
      formdata.append("category_id", selectedCategories[0]);
      formdata.append("organization_id", orgId);
      const response = await instance.post("/add-offer", formdata);
      if (response.status == 201) {
        setShowSuccessPopup(true);
        setForm({
          title_ar: "",
          title_en: "",
          image: "",
          description_ar: "",
          description_en: "",
          discount_value: "",
          start_date: "",
          end_date: "",
          category_id: "",
        });
        setSelectedCategories([]);
      }
    } catch (error: any) {
      setErrors(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: catgeorytype) => {
    if (selectedCategories.includes(category.id)) {
      // إزالة القسم إذا كان هو نفسه الذي تم تحديده
      setSelectedCategories([]);
    } else {
      // استبدال القسم الحالي بالقسم الجديد
      setSelectedCategories([category.id]);
    }
  };

  console.log(errors);

  if (loading) return <Loading />;

  return (
    <motion.div
      style={{ direction: language == "EN" ? "ltr" : "rtl" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen mt-12 flex items-center justify-center bg-gray-50 py-12 px-4 max-md:px-1 sm:px-6 lg:px-8"
    >
      <div className="min-w-2xl w-full space-y-8 bg-white border dark:border-gray-700 p-8 max-md:p-2 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {language === "EN" ? "Create New Offer" : "إنشاء عرض جديد"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {language === "EN"
              ? "Please fill out the form below to add a new offer"
              : "يرجى ملء النموذج أدناه لإضافة عرض جديد"}
          </p>
        </div>
        <form className="mt-8 " onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm flex flex-col gap-3">
            {/* صورة */}
            {form.image ? (
              form.image instanceof File && (
                <div
                  onClick={() => openInput.current.click()}
                  className="flex items-center justify-center"
                >
                  <div className="flex flex-col  overflow-hidden group items-center justify-center w-full h-52 border-2 relative border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <Img
                      src={URL.createObjectURL(form.image)}
                      className="w-full h-full object-cover"
                    />
                    <div className="w-8 h-8 absolute bottom-2 group-hover:left-2 -left-40 text-white bg-sky-400 flex items-center justify-center rounded-md shadow-md cursor-pointer hover:scale-110 duration-150 hover:outline-sky-500">
                      <FaPen className="size-5" />
                    </div>
                  </div>
                </div>
              )
            ) : (
              <>
                <div
                  onClick={() => openInput.current.click()}
                  className="flex items-center justify-center"
                >
                  <div className="flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <FaImage className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {language == "EN" ? "Choose image" : "إختر صورة "}
                    </p>
                    <input
                      ref={openInput}
                      id="image"
                      name="image"
                      type="file"
                      className="hidden"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {errors && errors["image"] && (
                  <p className="text-red-400 my-3">
                    {errors["image"][0][language]}
                  </p>
                )}
              </>
            )}
            {/* عنوان بالعربية */}
            <div>
              <label
                htmlFor="title_ar"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {language == "EN" ? "Title in Arabic" : "العنوان بالعربية"}
              </label>
              <div className="flex items-center gap-2">
                <CiText className="w-5 h-5 text-gray-400 max-md:hidden " />
                <input
                  id="title_ar"
                  name="title_ar"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="العنوان بالعربية"
                  value={form.title_ar}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["title_ar"] && (
                <p className="text-red-400 my-3">
                  {errors["title_ar"][0][language]}
                </p>
              )}
            </div>

            {/* عنوان بالإنجليزية */}
            <div>
              <label
                htmlFor="title_en"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {language == "EN" ? "Title in English" : "العنوان بالإنجليزية"}
              </label>
              <div className="flex items-center gap-2">
                <CiText className="w-5 h-5 text-gray-400 max-md:hidden " />
                <input
                  id="title_en"
                  name="title_en"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="العنوان بالإنجليزية"
                  value={form.title_en}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["title_en"] && (
                <p className="text-red-400 my-3">
                  {errors["title_en"][0][language]}
                </p>
              )}
            </div>
            {/* وصف بالعربية */}
            <div>
              <label
                htmlFor="description_ar"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {language == "EN" ? "Description in Arabic" : "الوصف بالعربية"}
              </label>
              <div className="flex items-center gap-2">
                <BsCursorText className="w-5 h-5 text-gray-400 max-md:hidden " />
                <textarea
                  id="description_ar"
                  name="description_ar"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="الوصف بالعربية"
                  value={form.description_ar}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["description_ar"] && (
                <p className="text-red-400 my-3">
                  {errors["description_ar"][0][language]}
                </p>
              )}
            </div>
            {/* وصف بالإنجليزية */}
            <div>
              <label
                htmlFor="description_en"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {language == "EN"
                  ? "Description in English"
                  : "الوصف بالإنجليزية"}
              </label>
              <div className="flex items-center gap-2">
                <BsCursorText className="w-5 h-5 text-gray-400 max-md:hidden " />
                <textarea
                  id="description_en"
                  name="description_en"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="الوصف بالإنجليزية"
                  value={form.description_en}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["description_en"] && (
                <p className="text-red-400 my-3">
                  {errors["description_en"][0][language]}
                </p>
              )}
            </div>

            {/* قيمة الخصم */}
            <div>
              <label
                htmlFor="discount_value"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {language == "EN" ? "Discount value" : "قيمة الخصم"}
              </label>
              <div className="flex items-center gap-2">
                <CiDiscount1 className="w-5 h-5 text-gray-400 max-md:hidden " />
                <input
                  id="discount_value"
                  name="discount_value"
                  type="number"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="قيمة الخصم"
                  value={form.discount_value}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["discount_value"] && (
                <p className="text-red-400 my-3">
                  {errors["discount_value"][0][language]}
                </p>
              )}
            </div>
            {/* تاريخ البدء */}
            <div>
              <label
                htmlFor="start_date"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {language == "EN" ? "Start Date" : "تاريخ البدء"}
              </label>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5 text-gray-400 max-md:hidden " />
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={form.start_date}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["start_date"] && (
                <p className="text-red-400 my-3">
                  {errors["start_date"][0][language]}
                </p>
              )}
            </div>
            {/* تاريخ الانتهاء */}
            <div>
              <label
                htmlFor="end_date"
                className="my-2 block w-fit pb-2 border-b border-main_orange"
              >
                {language == "EN" ? "End Date" : "تاريخ الانتهاء"}
              </label>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5 text-gray-400 max-md:hidden " />
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={form.end_date}
                  onChange={handleChange}
                />
              </div>
              {errors && errors["end_date"] && (
                <p className="text-red-400 my-3">
                  {errors["end_date"][0][language]}
                </p>
              )}
            </div>
            {/* الفئة */}
            <div>
              <div className="flex items-center gap-2 my-2 w-fit pb-3 border-b border-main_orange">
                <FaTag className="w-5 h-5 text-gray-400 max-md:hidden " />
                <label htmlFor="category_id">
                  {language == "EN" ? "Category" : "الفئة"}
                </label>
              </div>
              {errors && errors["category_id"] && (
                <p className="text-red-400 my-3">
                  {errors["category_id"][0][language]}
                </p>
              )}
              {allCategories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allCategories.map((category: any, index: number) => (
                    <motion.div
                      key={category.id}
                      onClick={() => toggleCategory(category)}
                      className={`p-3 rounded-md  cursor-pointer border transition duration-200 ${
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
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="group mt-4 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-main_orange hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
            >
              {language == "EN" ? "Send" : "إرسال"}
            </motion.button>
          </div>
        </form>
      </div>
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => setShowSuccessPopup((prev) => !prev)}
          message={
            language == "EN"
              ? "Your offer publication request has been sent and will be reviewed and responded to as soon as possible."
              : "تم ارسال طلب نشر العرض الخاص بك وسيتم مراجعتة والرد عليك فى اسرع وقت ."
          }
        />
      )}
    </motion.div>
  );
}
