"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import Pagination from "../../PaginationComponent";

export default function Quations_Answers() {
  const { language } = UseVariables();
  const [activeIndex, setActiveIndex] = useState<unknown>(null);
  const [questions, setQuestions] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPgae] = useState(1);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const [currentimage, setcurrentimage] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/FAQImage");
        const data = response.data.FAQ_image;

        // تخزين البيانات في الحالة
        if (data) {
          setcurrentimage(data); // تأكد من أن لديك حقل للصورة في البيانات المسترجعة
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const handlePageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  // جلب الأسئلة من الـ API مع دعم التصفح
  const fetchdata = async (page: number) => {
    setLoading(true);
    try {
      const response = await instance.get(`/questions?page=${page}`);
      const allQuestions = response.data.data; // بيانات الأسئلة

      // التأكد من وجود بيانات قبل استخدام slice
      if (Array.isArray(allQuestions)) {
        setQuestions(allQuestions); // احتفظ بـ 5 أسئلة فقط
      } else {
        console.error("Expected an array of questions");
        setQuestions([]); // إذا لم تكن البيانات متوفرة، قم بتعيين الأسئلة إلى مصفوفة فارغة
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata(currentPage);
  }, [currentPage]);

  return (
    <section className="py-24">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between max-lg:max-w-2xl mx-auto max-w-full">
          {/* إزالة قسم الصورة */}

          {/* قسم الأسئلة (يأخذ كامل العرض) */}
          <div className="w-full">
            <div className="w-full mx-auto">
              <div className="mx-auto my-6 max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center head">
                <h1
                  style={{ overflowWrap: "anywhere" }}
                  className="pb-2 border-b border-b-main_orange w-fit lg:whitespace-nowrap mx-auto text-center font-manrope font-bold max-sm:text-lg text-3xl text-gray-900 dark:text-secend_text mb-5 md:text-4xl md:leading-normal"
                >
                  {language === "EN"
                    ? "Frequently Asked Questions"
                    : "الأسئلة الشائعة"}
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  {language === "EN"
                    ? "Find answers to the most common questions about our services, partnerships, and more."
                    : "ابحث عن إجابات لأكثر الأسئلة شيوعًا حول خدماتنا وشراكاتنا والمزيد."}
                </p>
              </div>

              <div style={{ direction: "rtl" }}>
                {questions.map((faq: any, index: number) => (
                  <div key={index} className="py-4 border-b border-gray-200">
                    <button
                      className="w-full flex justify-between items-center text-xl font-medium text-gray-600 hover:text-indigo-600 transition"
                      onClick={() => toggleAccordion(index)}
                    >
                      <h5>{faq.question}</h5>
                      <FiChevronDown
                        className={`transition-transform duration-300 ${
                          activeIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Motion for answer */}
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: activeIndex === index ? "auto" : 0,
                        opacity: activeIndex === index ? 1 : 0,
                      }}
                      transition={{
                        height: { duration: 0.5, ease: "easeInOut" },
                        opacity: { duration: 0.3, ease: "easeInOut" },
                      }}
                      className="overflow-hidden"
                    >
                      <motion.p className="text-base font-normal text-gray-600 mt-4">
                        {faq.answer}
                      </motion.p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={lastPage}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
