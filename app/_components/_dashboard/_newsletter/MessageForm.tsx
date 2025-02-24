"use client";
import { instance } from "@/app/Api/axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import Loading from "../../Loading";
import SuccessPopup from "../SuccessPopup";

interface props {
  show: boolean;
  setshow: any;
  selectedMembers: any;
  setSelectedMembers: any;
}

export default function MessageForm({
  show,
  setshow,
  selectedMembers,
  setSelectedMembers,
}: props) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await instance.post("/send-newsletter", {
        subject,
        content,
        members_ids: JSON.stringify(selectedMembers),
      });
      if (response.status == 200) {
        setSubject("");
        setContent("");
        setshow(false);
    setShowSuccessPopup(true);
        setSelectedMembers([]);
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleshow = () => {
    setshow((prev: any) => !prev);
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className=" w-fit mr-auto">
        <button
          onClick={handleshow}
          className="w-fit p-2 outline-none  rounded-md shadow-md border border-transparent bg-green-400 text-white hover:bg-white hover:border-green-400 hover:text-black dark:hover:text-white duration-200 text-center  flex items-center  gap-2"
        >
          <p>رسالة جديدة</p>
          <FaMessage />
        </button>
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white dark:bg-gray-800 w-1/2 max-md:w-[95%] rounded-lg shadow-lg p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                إرسال النشرة البريدية
              </h1>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="الموضوع"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="المحتوى"
                  rows={5}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                ></textarea>
                <button
                  disabled={selectedMembers.length === 0}
                  type="submit"
                  className="w-full bg-green-400 text-white disabled:bg-gray-300 disabled:cursor-not-allowed py-2 rounded-md hover:bg-green-500 transition"
                >
                  إرسال
                </button>
              </form>
              {message && (
                <p className="text-center text-green-600 font-semibold mt-4">
                  {message}
                </p>
              )}
              <button
                onClick={handleshow}
                className="absolute top-2 left-2 text-red-500  p-2 rounded-full "
              >
                <FaTimes />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {showSuccessPopup && (
        <SuccessPopup
          message="تم إرسال النشرة البريدية بنجاح !"
          onClose={setShowSuccessPopup}
        />
      )}
    </>
  );
}
