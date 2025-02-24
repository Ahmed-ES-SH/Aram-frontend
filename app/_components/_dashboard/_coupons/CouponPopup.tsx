"use client";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaEdit, FaSave, FaPen, FaTrash } from "react-icons/fa";
import { instance } from "@/app/Api/axios";
import Img from "../../Img";

interface props {
  coupon: any;
  onClose: any;
  setShowSuccessPopoup: any;
  setCoupon: any;
  handleDelete: any;
}

export default function CouponPopup({
  coupon,
  onClose,
  setShowSuccessPopoup,
  setCoupon,
  handleDelete,
}: props) {
  const openIpnut = useRef<any>(null);
  const couponId = coupon && coupon.id;
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [image, setImage] = useState<null | File>(null);
  const [editedCoupon, setEditedCoupon] = useState({ ...coupon });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditedCoupon({ ...editedCoupon, [e.target.name]: e.target.value });
  };

  const handleFileChage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      // إضافة جميع البيانات النصية إلى FormData
      const filteredCoupon = { ...editedCoupon };
      delete filteredCoupon.created_at;
      delete filteredCoupon.updated_at;
      delete filteredCoupon.organization;
      delete filteredCoupon.category;
      delete filteredCoupon.image;

      // إضافة البيانات النصية إلى FormData
      Object.keys(filteredCoupon).forEach((key) => {
        formData.append(key, filteredCoupon[key]);
      });
      // إضافة الصورة إذا كانت موجودة
      if (image) {
        formData.append("image", image);
      }
      const response = await instance.post(
        `/update-copone/${couponId}`,
        formData
      );
      if (response.status == 200) {
        const data = response.data.data;
        setCoupon({ ...data });
        setShowSuccessPopoup(true);
        onClose();
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setConfirmDelete(false);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 h-[80vh] overflow-y-auto rounded-lg shadow-lg w-1/2 max-md:w-[90%] max-md:p-2 relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-main_orange w-fit">
          تفاصيل الكوبون
        </h2>
        <div className="w-full h-64 group overflow-hidden rounded-md relative">
          {image instanceof File ? (
            <Img
              src={URL.createObjectURL(image)}
              className="w-full h-full object-cover rounded-md shadow-sm"
            />
          ) : (
            <Img
              src={coupon.image ? coupon.image : "/public"}
              className="w-full h-full object-cover rounded-md shadow-sm"
            />
          )}
          <div
            onClick={() => openIpnut.current.click()}
            className="w-8 h-8 absolute duration-200 group-hover:left-2 bottom-2 -left-52 cursor-pointer bg-sky-400 flex items-center justify-center rounded-md shadow-sm text-white"
          >
            <FaPen className="size-4" />
          </div>
        </div>
        <div className="space-y-2">
          {/* الحقول */}
          {[
            { label: "العنوان (عربي)", name: "title_ar" },
            { label: "العنوان (إنجليزي)", name: "title_en" },
            { label: "الوصف (عربي)", name: "description_ar" },
            { label: "الوصف (إنجليزي)", name: "description_en" },
            { label: "نسبة الخصم", name: "discount_value" },
            { label: "تاريخ البدء", name: "start_date", type: "date" },
            { label: "تاريخ الانتهاء", name: "end_date", type: "date" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="text-sm font-medium text-gray-700">
                {label}
              </label>
              {isEditing ? (
                <input
                  type={type}
                  name={name}
                  value={editedCoupon[name] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                />
              ) : (
                <p className="p-2 bg-gray-100 rounded">{coupon[name]}</p>
              )}
            </div>
          ))}

          {/* اختيار الحالة */}
          <div>
            <label className="text-sm font-medium text-gray-700">الحالة</label>
            {isEditing ? (
              <select
                name="status"
                value={editedCoupon.status}
                onChange={handleChange}
                className="w-full outline-none p-2 border rounded mt-1"
              >
                <option value="waiting">قيد الانتظار</option>
                <option value="active">نشط</option>
                <option value="expired">منتهي</option>
              </select>
            ) : (
              <p className="p-2 bg-gray-100 rounded">{coupon.status}</p>
            )}
          </div>
          <input
            type="file"
            hidden
            ref={openIpnut}
            onChange={handleFileChage}
          />
        </div>

        {/* أزرار التحكم */}
        <div className="mt-4 flex justify-end gap-2">
          {isEditing ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
              >
                <FaSave className="size-5" /> حفظ
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
              >
                <FaTrash className="size-5" /> حذف
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
            >
              <FaEdit className="size-5" /> تعديل
            </button>
          )}
        </div>
      </motion.div>
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center fixed inset-0 bg-black/50  backdrop-blur-md"
          >
            <div className="w-1/4 max-md:w-3/4 max-sm:w-[90%] rounded-md bg-white py-8 px-2 roudned-md shadow-md flex items-center flex-col justify-center gap-3 ">
              <p>هل أنت متأكد سيتم مسح هذا العنصر بشكل نهائى !</p>
              <div className="flex items-center gap-4 w-fit mx-auto">
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-[18px] text-white rounded-md shadow-sm text-center bg-green-400"
                >
                  تأكيد
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 text-[18px] text-white rounded-md shadow-sm text-center bg-red-400"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
