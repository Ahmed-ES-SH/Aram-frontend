"use client";
import { instance } from "@/app/Api/axios";
import React, { useState, useEffect, useRef } from "react";
import Loading from "../../Loading";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Img from "../../Img";
import SuccessPopup from "../SuccessPopup";
import { FaStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";

interface cardType {
  id: number;
  category_id: number;
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

export default function CardPageDash() {
  const params = useParams();
  const openinput = useRef<any>(null);
  const id = params.id;
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
    category_id: 0,
  });
  const [loading, setloading] = useState<boolean>(true);
  const [image, setimage] = useState<any>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(0);

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await instance.get(`/card-type/${id}`);
        const data = response.data.data;
        console.log(data);
        if (data.features_ar && data.features_en) {
          setCard({
            id: data.id,
            title_ar: data.title_ar || "",
            title_en: data.title_en || "",
            description_en: data.description_en || "",
            description_ar: data.description_ar || "",
            image: data.image || "",
            duration: data.duration || "",
            price: data.price || 0,
            price_before_discount: data.price_before_discount || 0,
            features_ar: Array.isArray(data.features_ar)
              ? data.features_ar
              : JSON.parse(data.features_ar),
            features_en: Array.isArray(data.features_en)
              ? data.features_en
              : JSON.parse(data.features_en),
            category_id: data.category_id,
          });
          setSelectedCategory(data.category_id);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setloading(false);
      }
    };
    getdata();
  }, []);
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

  const handleCategoryCahnge = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      setloading(true);
      const formdata = new FormData();
      formdata.append("title_ar", card?.title_ar);
      formdata.append("title_en", card?.title_en);
      formdata.append("description_en", card?.description_en);
      formdata.append("description_ar", card?.description_ar);
      formdata.append("features_ar", JSON.stringify(card?.features_ar));
      formdata.append("features_en", JSON.stringify(card?.features_en));
      formdata.append("price", card?.price);
      formdata.append("duration", card?.duration);
      formdata.append("category_id", selectedCategory);
      if (image) formdata.append("image", image);

      const response = await instance.post(`/update-card-type/${id}`, formdata);
      const data = response.data.data;
      if (response.status == 200) {
        if (data.features_ar && data.features_en) {
          setIsPopupVisible(true);
          setCard({
            id: data.id,
            title_ar: data.title_ar || "",
            title_en: data.title_en || "",
            description_en: data.description_en || "",
            description_ar: data.description_ar || "",
            image: data.image || "",
            duration: data.duration || "",
            price: data.price || 0,
            price_before_discount: data.price_before_discount || 0,
            features_ar: Array.isArray(data.features_ar)
              ? data.features_ar
              : JSON.parse(data.features_ar),
            features_en: Array.isArray(data.features_en)
              ? data.features_en
              : JSON.parse(data.features_en),
            category_id: data.category_id,
          });
        }
      }
    } catch (error: any) {
      console.log(error);
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

  if (loading) return <Loading />;

  return (
    <>
      <div className="p-6 max-md:p-2 bg-gray-100 dark:bg-main_dash min-h-screen">
        <div className="w-full mx-auto bg-white dark:bg-secend_dash shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold dark:text-white text-gray-800 mb-6 pb-2 border-b border-sky-400 w-fit mx-auto ">
            بيانات البطاقة
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
              <div>
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  المميزات (Arabic)
                </label>
                <ul className="flex items-start  flex-col gap-2 ">
                  {card &&
                    card.features_ar &&
                    Array.isArray(card.features_ar) &&
                    card.features_ar.map((feature, idx) => (
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
                  placeholder="Add feature"
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

              <div>
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  المميزات (English)
                </label>
                <ul className="flex flex-col items-start gap-2 ">
                  {card &&
                    card.features_en &&
                    Array.isArray(card.features_en) &&
                    card.features_en.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 group">
                        <FaStarHalfStroke className="text-main_blue group-hover:text-red-400" />
                        <motion.li
                          className="bg-blue-500  group-hover:bg-red-400 duration-200 text-white px-3 py-1 rounded-md shadow-md cursor-pointer"
                          onClick={() =>
                            handleEdit(
                              "features_en",
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
                  placeholder="Add feature"
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
                  <Img
                    src={card.image ? card.image : "/public"}
                    className="w-44 h-32 rounded-md"
                  />
                )}
              </div>

              <div className="w-full my-4">
                <label className="block text-gray-700 dark:text-secend_text font-medium mb-2">
                  حدد القسم الخاص بالبطاقة
                </label>
                <select
                  value={selectedCategory}
                  className="w-full px-2 py-4 border shadow-md rounded-md outline-none"
                  onChange={handleCategoryCahnge}
                >
                  {categories &&
                    categories.length > 0 &&
                    categories.map((cat: any, index) => (
                      <option value={cat.id} key={index}>
                        {`${cat.title_en} / ${cat.title_ar} `}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
                  onClick={() => handleUpdate()}
                >
                  حفظ التغييرات
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
