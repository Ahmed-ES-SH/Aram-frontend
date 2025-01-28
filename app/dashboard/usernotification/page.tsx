"use client";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Img from "@/app/_components/Img";
import Loading from "@/app/_components/Loading";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/Api/axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { CiTablets1 } from "react-icons/ci";
import { FaSearch, FaTimes, FaPaperPlane } from "react-icons/fa";
import { LuMousePointerClick } from "react-icons/lu";

export default function UserNotification() {
  const [datausers, setdatausers] = useState<any[]>([]);
  const [messageuser, setmessageuser] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [mainError, setMainError] = useState<string>("");
  const [done, setDone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  const handlesearch = async (page: number) => {
    try {
      if (!searchQuery.trim()) {
        setError("يرجى إدخال اسم للبحث");
        return;
      }

      setError("");
      setLoading(true);
      const response = await instance.post(
        `/search-for-user-by-name/${searchQuery}?page=${page}`
      );
      if (response.status == 200) {
        const data = response.data;
        setdatausers(data.data);
        setCurrentPage(data.pagination.current_page);
        setLastPage(data.pagination.last_page);
      }
    } catch (error: any) {
      setError(
        "لا يوجد مستخدم بهذا الاسم. يرجى التحقق من الاسم وإعادة المحاولة."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage); // تحديث الصفحة الحالية
      handlesearch(newPage); // استدعاء البحث مع الصفحة الجديدة
    }
  };

  const onClose = () => {
    setShowSuccessPopup(false);
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setdatausers([]);
    setSearchQuery("");
    setStep(2);
  };

  const handleSendNotification = async () => {
    if (!messageuser.trim()) {
      setMainError("يرجى إدخال نص الإشعار");
      return;
    }

    try {
      setMainError("");
      setLoading(true);

      const formData = new FormData();
      formData.append("user_id", selectedUser.id);
      formData.append("account_type", selectedUser.account_type);
      formData.append("message", messageuser);
      const response = await instance.post("/notifications/send", formData);
      if (response.status == 200) {
        setmessageuser("");
        setShowSuccessPopup(true);
        setSelectedUser(null);
        setDone("تم الإرسال بنجاح!");
        setLoading(false);
        setStep(1);
      }
    } catch (error: any) {
      setLoading(false);
      setMainError("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="w-full bg-gray-50 min-h-screen py-6 px-4 max-md:px-2">
        <h1 className="text-2xl w-fit mx-auto pb-2 border-b border-sky-400 dark:text-secend_text font-bold mb-4 text-gray-800">
          إرسال إشعار الى مستخدم !
        </h1>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white h-screen ${
              datausers.length > 0 ? "overflow-y-auto" : "overflow-hidden"
            } shadow rounded-lg p-6`}
          >
            {datausers.length == 0 && (
              <div className="flex flex-col w-full h-full">
                <div className="flex items-center self-start w-full gap-2 mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن مستخدم بالاسم..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handlesearch(currentPage)}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FaSearch />
                    بحث
                  </button>
                </div>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <CiTablets1 className="size-80 mb-3 text-gray-400" />
                  <p>يمكنك البحث عن المستخدم عن طريق اقرب الحروف الى اسمه .</p>
                </div>
              </div>
            )}

            {datausers.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <table className="w-full border rounded-lg overflow-auto">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-right p-3">الصورة</th>
                      <th className="text-right p-3">الاسم</th>
                      <th className="text-right p-3">تحديد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datausers.map((user, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="p-3 text-right">
                          <Img
                            src={
                              user.image
                                ? user.image
                                : "/avatars/avatar_male.png"
                            }
                            className="w-[50px] rounded-full"
                          />
                        </td>
                        <td className="p-3 text-right">{user.name}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleSelectUser(user)}
                            className="bg-sky-400 outline-none hover:bg-white hover:text-black text-white border border-transparent hover:border-sky-400 duration-200 p-2 rounded-md shadow-md hover:underline flex items-center justify-center gap-2"
                          >
                            <LuMousePointerClick className="size-5" />
                            <p>تحديد</p>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={lastPage}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center mt-10"
              >
                <FaSearch className="text-gray-400 text-6xl mb-4" />
                <p className="text-gray-500 text-lg">
                  لا توجد نتائج مطابقة لبحثك.
                </p>
                <p className="text-gray-400 text-sm">
                  يرجى التحقق من الاسم والمحاولة مرة أخرى.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {step === 2 && selectedUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white shadow rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-main_orange">
              <h2 className="text-xl max-md:text-sm">المستخدم المحدد</h2>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setStep(1);
                }}
                className="hover:text-red-500 hover:bg-white hover:border-red-400 border text-sm border-transparent duration-150 text-white bg-red-400 rounded-md shadow-md text-center px-4 py-2 max-md:px-2 max-md:py-1 flex items-center gap-2"
              >
                <FaTimes />
                إزالة
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6 border-b border-gray-300 pb-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-200"
              >
                {/* صورة المستخدم */}
                <Img
                  src={selectedUser?.image || "/avatars/avatar_male.png"}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="text-sm">
                <div>
                  <strong>اسم المستخدم:</strong>
                  <p>{selectedUser?.name || "غير متاح"}</p>
                </div>
              </div>
            </div>

            <textarea
              value={messageuser}
              onChange={(e) => setmessageuser(e.target.value)}
              placeholder="أدخل نص الإشعار..."
              className="w-full h-[50vh] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>

            <button
              onClick={handleSendNotification}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <FaPaperPlane />
              إرسال
            </button>

            {mainError && (
              <p className="text-red-500 w-fit mx-auto underline underline-red-300 mt-2">
                {mainError}
              </p>
            )}
          </motion.div>
        )}
      </div>
      {showSuccessPopup && <SuccessPopup message={done} onClose={onClose} />}
    </>
  );
}
