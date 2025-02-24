"use client";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "@/app/_components/Loading";
import { useRouter } from "next/navigation";

export default function Problem({ params }: any) {
  const id = params.id;
  const router = useRouter();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get(`/problem/${id}`);
        setProblem(response.data.data);
        setStatus(response.data.data.status); // تعيين حالة المشكلة الحالية
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [id]);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
  };

  const updatestatus = async () => {
    try {
      setLoading(true);
      const response = await instance.post(`/update-problem/${id}`, {
        status: status,
      }); // تحديث الحالة في قاعدة البيانات
      if (response.status == 200) {
        router.push("/dashboard/problems");
      }
    } catch (error) {
      console.log("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      className={`w-[90%] max-md:w-[97%] mx-auto mt-20 p-8 bg-white dark:bg-secend_dash dark:text-secend_text rounded-xl shadow-lg ${"text-right"}`}
    >
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold text-blue-600">
          {"تفاصيل المشكلة"}
        </h2>
      </motion.div>

      <motion.div
        className="space-y-6 divide-y divide-gray-200 dark:divide-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-gray-800 pt-4">
          <span className="block font-semibold text-blue-500">{"الاسم"}</span>
          <p className="text-lg font-medium bg-gray-50 dark:bg-main_dash dark:text-white my-2 p-3 rounded-lg shadow-sm">
            {problem?.name || "غير متوفر"}
          </p>
        </div>

        <div className="text-gray-800 pt-4">
          <span className="block font-semibold text-blue-500">
            {"البريد الإلكتروني"}
          </span>
          <p className="text-lg font-medium bg-gray-50 dark:bg-main_dash dark:text-white my-2 p-3 rounded-lg shadow-sm">
            {problem?.email || "غير متوفر"}
          </p>
        </div>

        <div className="text-gray-800 pt-4">
          <span className="block font-semibold text-blue-500">
            {"رقم الهاتف"}
          </span>
          <p className="text-lg font-medium bg-gray-50 dark:bg-main_dash dark:text-white my-2 p-3 rounded-lg shadow-sm">
            {problem?.phone || "غير متوفر"}
          </p>
        </div>

        <div className="text-gray-800 pt-4">
          <span className="block font-semibold text-blue-500">{"الرسالة"}</span>
          <p className="text-lg font-medium bg-gray-50 dark:bg-main_dash dark:text-white my-2 p-3 rounded-lg shadow-sm">
            {problem?.message || "غير متوفرة"}
          </p>
        </div>

        {/* إضافة Select لتحديث الحالة */}
        <div className="text-gray-800 dark:text-white flex flex-col items-start gap-2 pt-4">
          <span className="block font-semibold text-blue-500">{"الحالة"}</span>
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full rounded-lg border-gray-400  outline-none p-3 text-sm bg-gray-50 dark:bg-main_dash dark:text-white"
          >
            <option value="pending">{"معلق"}</option>
            <option value="reviewed">{"تم الحل"}</option>
            <option value="closed">{"مغلق"}</option>
          </select>
        </div>
      </motion.div>
      <div onClick={updatestatus} className="flex items-center justify-center">
        <button className="w-1/4 max-md:w-[95%] p-2 text-white bg-green-400 rounded-md shadow-md text-center mt-6 border border-transparent hover:bg-white hover:text-black hover:border-green-400 duration-200">
          تحديث
        </button>
      </div>
    </div>
  );
}
