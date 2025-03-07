"use client";
import Loading from "@/app/_components/Loading";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaSave, FaImage, FaTimes } from "react-icons/fa";
import Img from "@/app/_components/Img";

export default function EditArticalPage({ params }: any) {
  const id = params.id;
  const openImageInput = useRef<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [artical, setArtical] = useState({
    title_ar: "",
    title_en: "",
    content_ar: "",
    content_en: "",
    category_id: "",
    image: "",
  });
  const [image, setImage] = useState<any>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getArtical = async () => {
      try {
        const response = await instance.get(`/artical/${id}`);
        if (response.status === 200) {
          const data = response.data.data.blog;
          setArtical(data);
          setImage(data.image);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getArtical();
  }, [id]);

  useEffect(() => {
    const getCatgories = async () => {
      try {
        const response = await instance.get(`/all-artical-categories`);
        if (response.status === 200) {
          const data = response.data.data;
          setCategories(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCatgories();
  }, []);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(artical).forEach(([key, value]) => {
        if (key !== "id" && key !== "image") formData.append(key, value);
      });
      if (image) formData.append("image", image);
      const response = await instance.post(`/update-artical/${id}`, formData);
      if (response.status === 200) {
        const newData = response.data.data;
        setArtical(newData);
        setImage(newData.image);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagechange = (e: any) => {
    setImage(e.target.files[0]);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setArtical((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold mb-4">تعديل المقال</h1>
      <form onSubmit={handleEdit} className="space-y-4">
        {/* صورة */}
        <div className="w-full ">
          <label className="block text-sm font-medium text-gray-700">
            الصورة الرئيسية
          </label>
          <div
            onClick={() => openImageInput.current.click()}
            className={`mt-1 relative h-[30vh] cursor-pointer  rounded-md shadow-lg shadow-transparent hover:shadow-sky-500 duration-200 ${
              !image
                ? "border-2 border-dashed border-sky-400 flex items-center justify-center"
                : ""
            } `}
          >
            {image instanceof File ? (
              <Img
                src={URL.createObjectURL(image)}
                className="w-full h-full object-cover  rounded-md shadow-md"
              />
            ) : image ? (
              <Img
                src={image}
                className="w-full h-full object-cover rounded-md shadow-md"
              />
            ) : (
              <FaImage className="size-7 text-gray-400" />
            )}
            <input
              ref={openImageInput}
              type="file"
              name="image"
              onChange={handleImagechange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main_orange"
              hidden
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            العنوان بالعربية
          </label>
          <input
            type="text"
            name="title_ar"
            value={artical.title_ar}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            العنوان بالإنجليزية
          </label>
          <input
            type="text"
            name="title_en"
            value={artical.title_en}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            المحتوى بالعربية
          </label>
          <textarea
            name="content_ar"
            value={artical.content_ar}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            المحتوى بالإنجليزية
          </label>
          <textarea
            name="content_en"
            value={artical.content_en}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            تصنيف المقال
          </label>
          <select
            name="category_id"
            value={artical.category_id}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">-- إختر تصنيف --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category?.title_en}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 w-fit mx-auto text-white p-2 rounded-md flex items-center gap-2  justify-center"
        >
          <FaSave className="mr-2" />
          <span className=" whitespace-nowrap">حفظ التعديلات</span>
        </button>
      </form>
    </motion.div>
  );
}
