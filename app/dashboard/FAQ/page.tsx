"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPen, FaTrash } from "react-icons/fa";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { instance } from "@/app/Api/axios";
import { TfiSettings } from "react-icons/tfi";

export default function FAQ() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
  const [totalPages, setTotalPages] = useState(1); // عدد الصفحات الكلي

  // للتحكم في عرض الـ Popup
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);

  // للتحكم في popup الحذف
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<any>(null);

  // جلب الأسئلة من الـ API مع دعم التصفح
  const fetchdata = async (page = 1) => {
    setLoading(true);
    try {
      const response = await instance.get(`/questions?page=${page}`);
      setQuestions(response.data.data); // بيانات الأسئلة
      setCurrentPage(response.data.current_page); // الصفحة الحالية
      setTotalPages(response.data.last_page); // إجمالي عدد الصفحات
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata(currentPage);
  }, [currentPage]);

  // إضافة سؤال جديد
  const addQuestion = async () => {
    if (newQuestion && newAnswer) {
      try {
        setLoading(true);
        await instance.post("/questions", {
          question: newQuestion,
          answer: newAnswer,
          user_id: "1",
        });
        setNewQuestion("");
        setNewAnswer("");
        fetchdata(currentPage); // تحديث الأسئلة بعد الإضافة
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  };

  // تأكيد حذف السؤال
  const confirmDelete = async () => {
    try {
      await instance.delete(`/questions/${questionToDelete.id}`);
      setIsDeletePopupOpen(false); // إغلاق الـ popup
      fetchdata(currentPage); // تحديث الأسئلة بعد الحذف
    } catch (error) {
      console.log(error);
    }
  };

  // فتح popup الحذف
  const openDeletePopup = (question: any) => {
    setQuestionToDelete(question);
    setIsDeletePopupOpen(true);
  };

  // إغلاق popup الحذف
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setQuestionToDelete(null);
  };

  // فتح نافذة التعديل
  const openEditModal = (question: any) => {
    setCurrentQuestion(question);
    setIsEditing(true);
  };

  // حفظ التعديلات
  const saveEdit = async () => {
    try {
      setLoading(true);
      await instance.post(`/questions/${currentQuestion.id}`, {
        question: currentQuestion.question,
        answer: currentQuestion.answer,
      });
      setIsEditing(false);
      fetchdata(currentPage); // تحديث الأسئلة بعد التعديل
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // الانتقال إلى الصفحة التالية
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // الانتقال إلى الصفحة السابقة
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      {loading ? (
        <div
          className="min-h-screen flex flex-col items-center justify-center w-full"
          aria-busy="true"
          tabIndex={0}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.4 }}
            aria-live="polite"
          >
            <TfiSettings className="size-44 text-main_orange" />
          </motion.div>
          <p className="mt-4 text-lg text-gray-700">{"جاري التحميل..."}</p>
        </div>
      ) : (
        <div className="w-[95%] mt-16 mx-auto bg-gray-100 dark:bg-secend_dash dark:text-secend_text p-6">
          <div className="w-full mx-auto bg-white dark:bg-secend_dash dark:text-secend_text p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center mb-6">
              الأسئلة الشائعة
            </h1>

            {/* قائمة الأسئلة */}
            <AnimatePresence>
              {questions.map((q: any) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border-b border-gray-300 dark:border-gray-600 py-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">{q.question}</h3>
                      <p className="text-gray-600">{q.answer}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(q)}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() => openDeletePopup(q)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* التصفح (pagination) */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                الصفحة السابقة
              </button>
              <span className="text-xl">
                الصفحة {currentPage} من {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                الصفحة التالية
              </button>
            </div>

            {/* إضافة سؤال جديد */}
            <div className="mt-6">
              <div className="flex items-center gap-2">
                <span className="w-full h-[1px] bg-black "></span>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-xl font-semibold whitespace-nowrap mb-4">
                    إضافة سؤال جديد
                  </h2>
                  <MdOutlineBookmarkAdd className="size-6 pt-1" />
                </div>
                <span className="w-full h-[1px] bg-black"></span>
              </div>
              <div className="space-y-4">
                <textarea
                  placeholder="أدخل السؤال"
                  className="w-full p-2 border border-gray-300 dark:bg-secend_dash dark:text-secend_text dark:border-gray-600 outline-none focus:dark:border-main_blue focus:border-main_blue rounded"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <textarea
                  placeholder="أدخل الإجابة"
                  className="w-full p-2 border border-gray-300 dark:bg-secend_dash dark:text-secend_text dark:border-gray-600 outline-none focus:dark:border-main_blue focus:border-main_blue rounded"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                />
                <button
                  onClick={addQuestion}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  إضافة السؤال
                </button>
              </div>
            </div>
          </div>

          {/* نافذة التعديل المنبثقة */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                className="fixed w-full inset-0 bg-black dark:bg-secend_dash bg-opacity-50 flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white dark:bg-secend_dash dark:text-secend_text p-6 rounded-lg shadow-lg w-[80%] mx-auto"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <h2 className="text-xl font-semibold mb-4">تعديل السؤال</h2>
                  <textarea
                    className="w-full p-2 border border-gray-300 dark:text-black rounded mb-4"
                    value={currentQuestion?.question}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        question: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className="w-full p-2 border border-gray-300 dark:text-black rounded mb-4"
                    value={currentQuestion?.answer}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        answer: e.target.value,
                      })
                    }
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={saveEdit}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      حفظ
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* نافذة تأكيد الحذف */}
          <AnimatePresence>
            {isDeletePopupOpen && (
              <motion.div
                className="fixed w-full inset-0 bg-black dark:bg-secend_dash dark:text-secend_text bg-opacity-50 flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg w-fit mx-auto"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <h2 className="text-xl whitespace-nowrap font-semibold mb-4">
                    هل أنت متأكد من أنك تريد حذف هذا السؤال؟
                  </h2>
                  <div className="flex justify-between">
                    <button
                      onClick={closeDeletePopup}
                      className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      حذف
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
