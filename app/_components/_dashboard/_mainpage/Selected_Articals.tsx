"use client";
import { instance } from "@/app/Api/axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Separator from "../../_website/Separator";
import Loading from "../../Loading";
import Img from "../../Img";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import Link from "next/link";

interface articaltype {
  id: number;
  title_en: string;
  image: string;
  created_at: string;
}

export default function SelectedArticals() {
  const [articals, setarticals] = useState<articaltype[]>([]);
  const [selectedarticals, setSelectedarticals] = useState<articaltype[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [lastPage, setLastPage] = useState(1);

  const handlePageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  // جلب البيانات
  useEffect(() => {
    const getarticals = async (
      page: number,
      api: string,
      set: React.Dispatch<React.SetStateAction<articaltype[]>>
    ) => {
      try {
        setLoading(true);
        const response = await instance.get(api, { params: { page } });
        set(response.data.data); // تخزين جميع الخدمات
        if (api == "/articals") {
          setCurrentPage(response.data.pagination.current_page);
          setLastPage(response.data.pagination.last_page);
        }
      } catch (error) {
        console.error("Error fetching articals:", error);
      } finally {
        setLoading(false);
      }
    };
    getarticals(currentPage, "/articals", setarticals);
    getarticals(currentPage, "/active-articals", setSelectedarticals);
  }, [currentPage]);

  // دالة لتحديث حالة الخدمة (تفعيل أو تعطيل)
  const updatearticalstate = async (
    articalId: number,
    activeState: boolean
  ) => {
    try {
      const response = await instance.get(
        `/update-active-artical/${articalId}/${activeState}`
      );
      console.log("Card state updated:", response.data);
    } catch (error) {
      console.error("Error updating artical state:", error);
      alert("حدث خطأ أثناء تحديث حالة الخدمة. حاول مرة أخرى.");
    }
  };

  // التعامل مع تفعيل أو تعطيل الخدمة
  const handlearticalAction = (artical: articaltype) => {
    const isarticalselected = selectedarticals.some(
      (selectedartical: articaltype) => selectedartical.id === artical.id
    );

    if (isarticalselected) {
      // إذا كانت الخدمة محددة، نزيلها من النشطة
      setSelectedarticals((prevSelectedarticals) =>
        prevSelectedarticals.filter(
          (selectedartical: articaltype) => selectedartical.id !== artical.id
        )
      );
      updatearticalstate(artical.id, false); // تعيين الحالة إلى false
    } else {
      // إذا لم تكن الخدمة محددة، نضيفها إلى النشطة
      setSelectedarticals((prevSelectedarticals) => [
        ...prevSelectedarticals,
        artical,
      ]);
      updatearticalstate(artical.id, true); // تعيين الحالة إلى true
    }
  };

  console.log(articals);

  return (
    <>
      <div className="w-full h-fit py-4">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex max-md:flex-col max-md:items-center items-start p-2 gap-2">
              <div className="w-full overflow-x-auto">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-300/20 dark:text-secend_text   dark:bg-secend_dash ">
                  <thead className="bg-gray-100 dark:bg-gray-500 dark:text-white text-left rounded-md">
                    <tr>
                      <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">
                        العنوان
                      </th>
                      <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">
                        صورة المقال
                      </th>
                      <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">
                        تاريخ الرفع
                      </th>
                      <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">
                        إختيار
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {articals.map((artical) => (
                      <tr
                        key={artical.id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-sky-400 duration-200 hover:dark:text-white"
                      >
                        <td className="px-6 py-4">{artical.title_en}</td>
                        <td className="px-6 py-4">
                          <Img src={artical.image} className="w-[80px]" />
                        </td>
                        <td className="px-6 py-4">{artical.created_at}</td>
                        <td className="px-6 py-4 text-center">
                          <motion.button
                            className={`relative inline-block w-10 h-6 transition duration-200 ${
                              selectedarticals.some(
                                (selectedartical) =>
                                  selectedartical.id === artical.id
                              )
                                ? "bg-green-400"
                                : "bg-gray-200"
                            } rounded-full`}
                            onClick={() => handlearticalAction(artical)} // التعامل مع إضافة أو إزالة البطاقة
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span
                              className={`dot w-4 h-4 ${
                                selectedarticals.some(
                                  (selectedartical) =>
                                    selectedartical.id === artical.id
                                )
                                  ? "left-1"
                                  : "right-1"
                              } rounded-full bg-white absolute top-1 transition-all duration-200 ease-in-out`}
                            ></span>
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <AnimatePresence>
                <div className="mt-4 max-h-[130vh] overflow-y-auto hidden-scrollbar py-2 w-[20%] max-md:w-full">
                  <Separator bg_dark="" text="المقالات المختارة" />
                  <div className="flex flex-col items-center max-md:flex-row max-md:justify-center max-md:flex-wrap max-md:w-full p-3 gap-3 h-fit">
                    {selectedarticals.map((artical, index) => (
                      <Link
                        className="w-full block"
                        key={index}
                        href={`/dashboard/articals/${artical.id}`}
                      >
                        <motion.div
                          className="w-full h-32  rounded-md bg-cover bg-center relative"
                          style={{ backgroundImage: `url(${artical.image})` }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h1 className=" absolute bottom-0 w-full rounded-b-md bg-black/50 text-white text-center">
                            {artical.title_en}
                          </h1>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimatePresence>
            </div>
            <div className="w-fit bg-sky-400 mr-4 mt-6 px-2 py-1 border border-gray-300 rounded-md">
              <ol className="flex justify-center gap-1 text-xs font-medium">
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
                  >
                    <span className="sr-only">Prev Page</span>
                    <FaChevronCircleLeft
                      className={
                        currentPage > 1 ? "cursor-pointer" : "text-gray-400"
                      }
                    />
                  </button>
                </li>

                {[...Array(lastPage)].map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handlePageChange(index + 1)}
                      className={`block size-8 rounded border text-center leading-8 ${
                        index + 1 === currentPage
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-100 bg-white text-gray-900"
                      }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                    className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
                  >
                    <span className="sr-only">Next Page</span>
                    <FaChevronCircleRight
                      className={
                        currentPage < lastPage
                          ? "cursor-pointer"
                          : "text-gray-400"
                      }
                    />
                  </button>
                </li>
              </ol>
            </div>
          </>
        )}
      </div>
    </>
  );
}
