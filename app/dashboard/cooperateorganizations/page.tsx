"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { instance } from "@/app/Api/axios";
import {
  FaFile,
  FaFilePdf,
  FaFileUpload,
  FaPen,
  FaPlus,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import Loading from "@/app/_components/Loading";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";

interface PrivacyPolicy {
  id: number;
  content_ar: string;
  content_en: string;
}

export default function CooperateOrganizations() {
  const pdfRef = useRef<any>(null);
  const [policies, setPolicies] = useState<PrivacyPolicy[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deletedId, setdeletedId] = useState<number>(0);
  const [showconfirm, setshowconfirm] = useState(false);
  const [loading, setloading] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [showpdfPopup, setshowpdfPopup] = useState(false);
  const [showsuccessPopup, setshowsuccessPopup] = useState(false);
  const [error, setError] = useState("");
  const [editingPolicy, setEditingPolicy] = useState<PrivacyPolicy | null>(
    null
  );
  const [newPolicy, setNewPolicy] = useState<{
    content_ar: string;
    content_en: string;
  }>({
    content_ar: "",
    content_en: "",
  });

  // Fetch policies
  const fetchPolicies = async () => {
    try {
      const response = await instance.get("/points-cooperation");
      setPolicies(response.data.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Add or Edit policy
  const handleSave = async () => {
    try {
      if (editingPolicy) {
        // Edit existing policy
        await instance.post(
          `/update-point-cooperation/${editingPolicy.id}`,
          newPolicy
        );
      } else {
        // Add new policy
        await instance.post("/add-point-cooperation", newPolicy);
      }
      fetchPolicies();
      setShowModal(false);
      setEditingPolicy(null);
      setNewPolicy({ content_ar: "", content_en: "" });
    } catch (error) {
      console.error("Error saving policy:", error);
    }
  };

  // Delete policy
  const handleDelete = async (id: number) => {
    try {
      await instance.delete(`/point-cooperation/${id}`);
      fetchPolicies();
      setshowconfirm(false);
    } catch (error) {
      console.error("Error deleting policy:", error);
    }
  };

  const handleUploadFile = async () => {
    if (!pdfFile) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setError("");
      const formData = new FormData();
      formData.append("file", pdfFile);

      const response = await instance.post(
        "/upload-cooperation-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setshowpdfPopup(false);
        setPdfFile(null);
        setshowsuccessPopup(true);
      }
    } catch (error: any) {
      console.error("❌ Error uploading PDF:", error);
      if (error && error.response && error.response.status === 400) {
        setError(error.response.data.message);
      }
    }
  };

  const handleClosePopup = () => {
    setshowpdfPopup(false);
    setError("");
    setPdfFile(null);
  };

  // ✅ دالة التقاط الملف
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setPdfFile(selectedFile);
      // استدعاء رفع الملف بعد تحديث الحالة مباشرة
    }
  };

  const confirmtoggle = (id: number) => {
    setshowconfirm((prev) => !prev);
    setdeletedId(id);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl pb-3 border-b w-fit mx-auto border-sky-400 font-bold mb-4 text-center">
        الشروط الخاصة بصفحة اتفاقية التعاون للمراكز الطبية
      </h2>
      <div className="flex items-center gap-6">
        <button
          onClick={() => {
            setEditingPolicy(null);
            setNewPolicy({ content_ar: "", content_en: "" });
            setShowModal(true);
          }}
          className="my-6 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 flex items-center gap-2"
        >
          <p>أضف قاعدة جديدة</p>
          <FaPlus />
        </button>
        <button
          onClick={() => setshowpdfPopup(true)}
          className="flex  items-center gap-1 bg-main_orange text-white cursor-pointer rounded-md shadow-md max-md:px-2 px-12 py-2 hover:bg-white hover:border-main_orange hover:scale-110 hover:text-black duration-150 border border-transparent "
        >
          <FaFileUpload className="size-5" />
          <p className=" whitespace-nowrap max-md:text-[14px]">
            {"رفع ملف اتفاقية التعاون"}
          </p>
        </button>
      </div>

      <input
        type="file"
        name=""
        hidden
        ref={pdfRef}
        onChange={handlePdfChange}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {policies.map((policy) => (
          <motion.div
            key={policy.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-between items-center bg-white dark:bg-gray-700 p-4 rounded shadow"
          >
            <div>
              <p className="text-sm text-right block mb-4 font-medium text-gray-700 dark:text-gray-300">
                العربية: {policy.content_ar}
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                English: {policy.content_en}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingPolicy(policy);
                  setNewPolicy({
                    content_ar: policy.content_ar,
                    content_en: policy.content_en,
                  });
                  setShowModal(true);
                }}
                className="p-2 text-sm bg-blue-500 text-white rounded shadow hover:bg-blue-600"
              >
                <FaPen />
              </button>
              <button
                onClick={() => confirmtoggle(policy.id)}
                className="p-2 text-sm bg-red-500 text-white rounded shadow hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-1/2 max-md:w-[95%]">
            <h3 className="text-xl font-bold mb-4">
              {editingPolicy ? "تعديل قاعدة " : "أضف قاعدة جديدة"}
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="content_ar"
                  className="block mb-2 text-sm font-medium"
                >
                  النص بالعربية
                </label>
                <textarea
                  id="content_ar"
                  value={newPolicy.content_ar}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, content_ar: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded dark:text-black outline-none"
                  placeholder="Enter Arabic content"
                />
              </div>
              <div>
                <label
                  htmlFor="content_en"
                  className="block mb-2 text-sm font-medium"
                >
                  النص بالانجليزية
                </label>
                <textarea
                  id="content_en"
                  value={newPolicy.content_en}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, content_en: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded dark:text-black outline-none"
                  placeholder="Enter English content"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {showconfirm && (
        <div className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-black/50 z-[9999999]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-1/4 h-auto max-md:w-[95%] p-6 flex flex-col items-center justify-between rounded-lg shadow-lg bg-white dark:bg-main_dash dark:text-white"
          >
            <p className="text-lg text-center font-semibold mb-6">
              هل أنت متأكد؟ سيتم الحذف بشكل نهائي!
            </p>
            <div className="flex items-center justify-center gap-4 w-full">
              <button
                onClick={() => handleDelete(deletedId)}
                className="text-center rounded-md text-white bg-red-500 hover:bg-red-600 px-6 py-2 transition-colors duration-300"
              >
                حذف
              </button>
              <button
                onClick={() => confirmtoggle(0)}
                className="text-center rounded-md text-white bg-gray-500 hover:bg-gray-600 px-6 py-2 transition-colors duration-300"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {showpdfPopup && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black/50 flex items-center justify-center z-[9999999]">
          <div className="w-[50%] max-lg:w-1/2 max-md:w-3/4 max-sm:w-[95%] bg-white shadow-md rounded-md px-3 py-2 ">
            <FaTimes
              className="size-6 my-2 text-red-400 cursor-pointer ml-2"
              onClick={handleClosePopup}
            />
            <div
              onClick={() => pdfRef.current.click()}
              className={`w-full min-h-[20vh] flex cursor-pointer hover:bg-orange-200 hover:text-white hover:border-main_orange duration-200 items-center justify-center border-2 border-dashed  ${
                pdfFile
                  ? "border-green-300 bg-green-200 text-white"
                  : "border-gray-300"
              }`}
            >
              <FaFilePdf size={60} />
            </div>
            {pdfFile && (
              <p className="text-green-400 text-center my-4 ">
                {pdfFile?.name}
              </p>
            )}
            <button
              onClick={handleUploadFile}
              className="flex my-2 mx-auto max-md:w-1/2 max-2xl:w-1/4 text-center  justify-center  items-center gap-1 bg-main_orange text-white cursor-pointer rounded-md shadow-md max-md:px-2 px-12 py-2 hover:bg-white hover:border-main_orange hover:scale-110 hover:text-black duration-150 border border-transparent "
            >
              <FaFileUpload className="size-5" />
              <p className=" whitespace-nowrap max-md:text-[14px]">{"رفع"}</p>
            </button>
            {error && (
              <p className="text-red-400 my-3 text-[16px] text-center underline underline-red-400">
                {error}
              </p>
            )}
          </div>
        </div>
      )}
      {showsuccessPopup && (
        <SuccessPopup
          message="تم رفع الملف بنجاح"
          onClose={() => setshowsuccessPopup(false)}
        />
      )}
    </div>
  );
}
