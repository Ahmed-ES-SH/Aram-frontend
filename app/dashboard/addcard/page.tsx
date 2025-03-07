"use client";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Img from "@/app/_components/Img";
import Loading from "@/app/_components/Loading";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { FaStarHalfStroke } from "react-icons/fa6";

interface cardType {
  id: number;
  title_ar: string;
  title_en: string;
  description_en: string;
  description_ar: string;
  features_ar: string[];
  features_en: string[];
  image: string;
  price_before_discount: any;
  price: any;
  duration: string;
}

export default function Page() {
  const openinput = useRef<any>(null);
  const [card, setCard] = useState<cardType>({
    id: 0,
    title_ar: "",
    title_en: "",
    description_en: "",
    description_ar: "",
    features_ar: [],
    features_en: [],
    image: "",
    duration: "",
    price_before_discount: 0,
    price: 0,
  });
  const [loading, setloading] = useState<boolean>(false);
  const [image, setimage] = useState<any>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(0);
  const [categories, setCategories] = useState([]);
  const [errors, seterrors] = useState<any>([]);

  const handleEdit = (
    field: keyof cardType,
    value: string | number | string[]
  ) => {
    if (!card) return;
    setCard({ ...card, [field]: value });
  };

  const handleimagechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setimage(files[0]);
    }
  };

  const handlesubmit = async () => {
    try {
      setloading(true);
      const formdata = new FormData();
      formdata.append("title_ar", card?.title_ar);
      formdata.append("title_en", card?.title_en);
      formdata.append("description_en", card?.description_en);
      formdata.append("description_ar", card?.description_ar);
      if (card.features_ar.length > 0)
        formdata.append("features_ar", JSON.stringify(card?.features_ar));
      if (card.features_en.length > 0)
        formdata.append("features_en", JSON.stringify(card?.features_en));
      if (card.price_before_discount > 0)
        formdata.append("price_before_discount", card?.price_before_discount);
      if (card.price > 0) formdata.append("price", card?.price);
      formdata.append("duration", card?.duration);
      formdata.append("category_id", selectedCategory);
      if (image) formdata.append("image", image);
      const response = await instance.post("/add-card-type", formdata);
      if (response.status == 200) {
        setIsPopupVisible(true);
        setCard({
          id: 0,
          title_ar: "",
          title_en: "",
          description_en: "",
          description_ar: "",
          features_ar: [],
          features_en: [],
          image: "",
          duration: "",
          price: 0,
          price_before_discount: 0,
        });
        setimage(null);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.status === 422) {
        seterrors(error.response.data.errors || {});
      }
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get(`/all-card-type-categories`);
        if (response.status == 200) {
          const data = response.data.data;
          setCategories(data);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const handleCategoryCahnge = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="p-6 max-md:p-2 bg-gray-100 dark:bg-main_dash min-h-screen">
        <div className="w-full mx-auto bg-white dark:bg-secend_dash shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-sky-400 w-fit mx-auto ">
            بطاقة جديدة
          </h1>

          {card && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  العنوان (Arabic)
                </label>
                <input
                  type="text"
                  value={card.title_ar}
                  onChange={(e) => handleEdit("title_ar", e.target.value)}
                  className="w-full p-3 dark:bg-white/40 dark:text-white border border-gray-300 rounded-md focus:outline-none  focus:outline-sky-300 focus:border-transparent duration-150"
                />
              </div>
              {errors && errors["title_ar"] && (
                <p className="text-red-400 my-2 text-[16px]">
                  {errors["title_ar"]}
                </p>
              )}
              <div>
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  العنوان (English)
                </label>
                <input
                  type="text"
                  value={card.title_en}
                  onChange={(e) => handleEdit("title_en", e.target.value)}
                  className="w-full p-3 dark:bg-white/40 dark:text-white border border-gray-300 rounded-md focus:outline-none  focus:outline-sky-300 focus:border-transparent duration-150"
                />
              </div>
              {errors && errors["title_en"] && (
                <p className="text-red-400 my-2 text-[16px]">
                  {errors["title_en"]}
                </p>
              )}
              <div>
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  الوصف (Arabic)
                </label>
                <textarea
                  value={card.description_ar}
                  onChange={(e) => handleEdit("description_ar", e.target.value)}
                  className="w-full p-3 dark:bg-white/40 dark:text-white border border-gray-300 rounded-md focus:outline-none  focus:outline-sky-300 focus:border-transparent duration-150"
                ></textarea>
              </div>
              {errors && errors["description_ar"] && (
                <p className="text-red-400 my-2 text-[16px]">
                  {errors["description_ar"]}
                </p>
              )}
              <div>
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  الوصف (English)
                </label>
                <textarea
                  value={card.description_en}
                  onChange={(e) => handleEdit("description_en", e.target.value)}
                  className="w-full p-3 dark:bg-white/40 dark:text-white border border-gray-300 rounded-md focus:outline-none  focus:outline-sky-300 focus:border-transparent duration-150"
                ></textarea>
              </div>
              {errors && errors["description_en"] && (
                <p className="text-red-400 my-2 text-[16px]">
                  {errors["description_en"]}
                </p>
              )}
              <div>
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  السعر قبل الخصم
                </label>
                <input
                  type="number"
                  value={card.price_before_discount}
                  onChange={(e) =>
                    handleEdit(
                      "price_before_discount",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full p-3 dark:bg-white/40 dark:text-white border border-gray-300 rounded-md focus:outline-none  focus:outline-sky-300 focus:border-transparent duration-150"
                />
              </div>
              {errors && errors["price_before_discount"] && (
                <p className="text-red-400 my-2 text-[16px]">
                  {errors["price_before_discount"]}
                </p>
              )}
              <div>
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  السعر
                </label>
                <input
                  type="number"
                  value={card.price}
                  onChange={(e) =>
                    handleEdit("price", parseFloat(e.target.value))
                  }
                  className="w-full p-3 dark:bg-white/40 dark:text-white border border-gray-300 rounded-md focus:outline-none  focus:outline-sky-300 focus:border-transparent duration-150"
                />
              </div>
              {errors && errors["price"] && (
                <p className="text-red-400 my-2 text-[16px]">
                  {errors["price"]}
                </p>
              )}
              <div>
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  المدة بالشهور
                </label>
                <input
                  max={12}
                  min={0}
                  type="number"
                  value={card.duration}
                  onChange={(e) =>
                    handleEdit("duration", parseFloat(e.target.value))
                  }
                  className="w-full p-3 dark:bg-white/40 dark:text-white border border-gray-300 rounded-md focus:outline-none  focus:outline-sky-300 focus:border-transparent duration-150"
                />
              </div>
              {errors && errors["duration"] && (
                <p className="text-red-400 my-2 text-[16px]">
                  {errors["duration"]}
                </p>
              )}
              <div>
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  المميزات (Arabic)
                </label>
                <ul className="flex items-start  flex-col gap-2 ">
                  {card.features_ar.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <FaStarHalfStroke className="text-main_blue group-hover:text-red-400" />
                      <motion.li
                        className="bg-blue-500  group-hover:bg-red-400 duration-200 text-white px-3 py-1 rounded-md shadow-md cursor-pointer"
                        onClick={() =>
                          handleEdit(
                            "features_ar",
                            card.features_ar.filter((f) => f !== feature)
                          )
                        }
                      >
                        <p>{feature}</p>
                      </motion.li>
                    </div>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="قم بكتاية الميزة ثم اضغط على Enter ."
                  className="w-full p-3 dark:bg-white/40 dark:text-white mt-2 border border-gray-300 rounded-md focus:outline-none  focus:outline-sky-300 focus:border-transparent duration-150"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handleEdit("features_ar", [
                        ...card.features_ar,
                        e.currentTarget.value.trim(),
                      ]);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
              {errors && errors["features_ar"] && (
                <p className="text-red-400 my-2 text-[16px]">
                  {errors["features_ar"]}
                </p>
              )}
              <div>
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  المميزات (English)
                </label>
                <ul className="flex flex-col items-start gap-2 ">
                  {card.features_en.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <FaStarHalfStroke className="text-main_blue group-hover:text-red-400" />
                      <motion.li
                        className="bg-blue-500  group-hover:bg-red-400 duration-200 text-white px-3 py-1 rounded-md shadow-md cursor-pointer"
                        onClick={() =>
                          handleEdit(
                            "features_ar",
                            card.features_ar.filter((f) => f !== feature)
                          )
                        }
                      >
                        <p>{feature}</p>
                      </motion.li>
                    </div>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="قم بكتاية الميزة ثم اضغط على Enter ."
                  className="w-full p-3 dark:bg-white/40 dark:text-white mt-2 border border-gray-300 rounded-md focus:outline-none  focus:outline-sky-300 focus:border-transparent duration-150"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handleEdit("features_en", [
                        ...card.features_en,
                        e.currentTarget.value.trim(),
                      ]);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>

              {errors && errors["features_en"] && (
                <p className="text-red-400 my-2 text-[16px]">
                  {errors["features_en"]}
                </p>
              )}

              <input
                type="file"
                hidden
                onChange={handleimagechange}
                ref={openinput}
                name="image"
              />
              <div
                className=" cursor-pointer"
                onClick={() => openinput.current.click()}
              >
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  صورة خلفية البطاقة
                </label>
                {image instanceof File ? (
                  <Img
                    src={URL.createObjectURL(image)}
                    className="w-44 h-32 rounded-md"
                  />
                ) : (
                  <div className="w-full h-[20vh] border-dashed border-2 border-sky-300 flex items-center justify-center">
                    <Img src={"/dashboard/add.png"} className="w-12" />
                  </div>
                )}
              </div>

              {errors && errors["image"] && (
                <p className="text-red-400 my-2 text-[16px]">
                  {errors["image"]}
                </p>
              )}

              <div className="w-full my-4">
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  حدد القسم الخاص بالبطاقة
                </label>
                <select
                  className="w-full px-2 py-4 border shadow-md rounded-md outline-none"
                  onChange={handleCategoryCahnge}
                  defaultValue=""
                >
                  <option value="" disabled>
                    حدد القسم الخاص بالبطاقة ----
                  </option>
                  {categories?.length > 0 &&
                    categories.map((cat: any, index) => (
                      <option value={cat.id} key={index}>
                        {`${cat.title_en} / ${cat.title_ar}`}
                      </option>
                    ))}
                </select>
              </div>

              {errors && errors["category_id"] && (
                <p className="text-red-400 my-2 text-[16px]">
                  {errors["category_id"]}
                </p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
                  onClick={() => handlesubmit()}
                >
                  إضافة
                </button>
              </div>
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
