"use client";
import Img from "@/app/_components/Img";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Loading from "@/app/_components/Loading";

interface slidertype {
  id: number;
  text_1_en: string;
  text_1_ar: string;
  text_2_en: string;
  text_2_ar: string;
  text_3_en: string;
  text_3_ar: string;
  image: string;
}

export default function Sliders() {
  const [form, setform] = useState({
    text_1_en: "",
    text_1_ar: "",
    text_2_ar: "",
    text_2_en: "",
    text_3_en: "",
    text_3_ar: "",
  });
  const [showdeletepopup, setshowdeletepopup] = useState(false);
  const [sliders, setSliders] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState<any>(null);
  const [image, setimage] = useState<File | null>(null);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await instance.get("/sliders");
        setSliders(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  const openModal = (slider: any) => {
    setSelectedSlider(slider);
    setform({
      text_1_en: slider.text_1_en,
      text_2_en: slider.text_2_en,
      text_3_en: slider.text_3_en,
      text_1_ar: slider.text_1_ar,
      text_2_ar: slider.text_2_ar,
      text_3_ar: slider.text_3_ar,
    });
    setimage(null); // Clear previous image selection
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlider(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSelectedSlider((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setimage(files[0]);
    }
  };

  const handleEdit = async (
    e: React.ChangeEvent<HTMLFormElement>,
    id: number
  ) => {
    e.preventDefault();

    if (!selectedSlider) {
      console.error("Selected slider is undefined");
      return;
    }

    try {
      setloading(true);
      const formdata = new FormData();
      formdata.append("text_1_en", selectedSlider.text_1_en || "");
      formdata.append("text_2_en", selectedSlider.text_2_en || "");
      formdata.append("text_3_en", selectedSlider.text_3_en || "");
      formdata.append("text_1_ar", selectedSlider.text_1_ar || "");
      formdata.append("text_2_ar", selectedSlider.text_2_ar || "");
      formdata.append("text_3_ar", selectedSlider.text_3_ar || "");
      if (image) {
        formdata.append("image", image);
      }

      const response = await instance.post(`/update-slider/${id}`, formdata);
      if (response.status === 200) {
        // استبدال السلايدر المحدد بالقيم المحدثة
        setSliders((prevSliders: any) =>
          prevSliders.map((slider: any) =>
            slider.id === selectedSlider.id
              ? { ...slider, ...selectedSlider }
              : slider
          )
        );

        setIsPopupVisible(true);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating slider:", error);
    } finally {
      setloading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setshowdeletepopup(true);
      const response = await instance.delete(`/slider/${id}`);
      if (response.status === 200) {
        setSliders(sliders.filter((slider: slidertype) => slider.id !== id));
      }
      setIsModalOpen(false);
      setshowdeletepopup(false);
      setIsPopupVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deletepopuptoggle = () => {
    setshowdeletepopup((prev) => !prev);
  };

  if (loading) {
    return <Loading />;
  }

  console.log(form);

  return (
    <>
      <div className="w-full h-fit overflow-y-auto p-6 max-md:p-2">
        {sliders.map((slider: slidertype, index: number) => (
          <div
            key={index}
            className="w-full group cursor-pointer mb-2 border rounded-md shadow-md p-2 h-[30vh] max-md:h-fit relative dark:bg-secend_dash overflow-y-auto dark:text-white flex max-md:flex-col items-center gap-3"
          >
            <Img src={slider.image || "/doctor_1.png"} className="w-[200px]" />
            <div className="content flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <h1 className="text-gray-700 dark:text-secend_text">
                  title_en :
                </h1>
                <p>{slider.text_1_en}</p>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-gray-700 dark:text-secend_text">
                  title_ar :
                </h1>
                <p>{slider.text_1_ar}</p>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-gray-700 dark:text-secend_text">
                  highlight_en :
                </h1>
                <p>{slider.text_2_en}</p>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-gray-700 dark:text-secend_text">
                  highlight_ar :
                </h1>
                <p>{slider.text_2_ar}</p>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-gray-700 dark:text-secend_text">
                  subtitle_en :
                </h1>
                <p>{slider.text_3_en}</p>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-gray-700 dark:text-secend_text">
                  subtitle_ar :
                </h1>
                <p>{slider.text_3_ar}</p>
              </div>
            </div>
            <div className="w-full h-0 overflow-hidden bg-black/50 flex items-center justify-center absolute top-0 left-0 group-hover:h-full duration-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openModal(slider)}
                  className="flex items-center gap-1 border rounded-md shadow-md bg-sky-400 text-white px-5 py-2"
                >
                  <FaPen />
                  <p>تعديل</p>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedSlider && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center"
        >
          <div className="bg-white relative h-[90vh] overflow-y-auto dark:bg-secend_dash p-6 rounded-md shadow-lg w-[90%] max-w-2xl">
            <h2 className="text-lg font-bold mb-4 dark:text-white">
              تعديل الشريحة
            </h2>

            <form
              onSubmit={(e: React.ChangeEvent<HTMLFormElement>) =>
                handleEdit(e, selectedSlider.id)
              }
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  العنوان (EN):
                </label>
                <input
                  name="text_1_en"
                  value={selectedSlider.text_1_en}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  العنوان (AR):
                </label>
                <input
                  name="text_1_ar"
                  value={selectedSlider.text_1_ar}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  العنوان المميز (EN):
                </label>
                <input
                  name="text_2_en"
                  value={selectedSlider.text_2_en}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  العنوان المميز (AR):
                </label>
                <input
                  name="text_2_ar"
                  value={selectedSlider.text_2_ar}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  الوصف (EN):
                </label>
                <textarea
                  name="text_3_en"
                  value={selectedSlider.text_3_en}
                  onChange={handleInputChange}
                  className="w-full h-20 px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  الوصف (AR):
                </label>
                <textarea
                  name="text_3_ar"
                  value={selectedSlider.text_3_ar}
                  onChange={handleInputChange}
                  className="w-full h-20 px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  الصورة:
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                {selectedSlider.image && (
                  <Img
                    src={
                      image
                        ? URL.createObjectURL(image)
                        : selectedSlider.image || "/doctor_1.png"
                    }
                    className="w-32 h-32 mt-2 object-cover"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  إغلاق
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  حفظ
                </button>
              </div>
            </form>
            <button
              onClick={deletepopuptoggle}
              className=" absolute top-3 left-4 flex items-center gap-2 rounded-md shadow-md text-white bg-red-400 px-3 py-1 hover:bg-red-500 duration-150"
            >
              <p>حذف</p>
              <FaTrash />
            </button>
          </div>
        </motion.div>
      )}
      {isPopupVisible && (
        <SuccessPopup
          message="تمت العملية بنجاح!"
          onClose={() => setIsPopupVisible(false)}
        />
      )}
      {showdeletepopup && (
        <div className="w-full h-screen bg-black/50 fixed top-0 left-0 z-[99999] flex items-center justify-center">
          <div className="w-[20%] h-fit rounded-md shadow-md py-6 flex flex-col gap-4 items-center justify-center bg-white dark:bg-secend_dash">
            <p>سيتم حذف العنصر بشكل نهائى هل انت متأكد ؟</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(selectedSlider.id)}
                className="px-3 py-1 text-white rounded-md border bg-red-400"
              >
                تأكيد
              </button>
              <button
                onClick={deletepopuptoggle}
                className="px-3 py-1 text-white rounded-md border bg-sky-400"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
