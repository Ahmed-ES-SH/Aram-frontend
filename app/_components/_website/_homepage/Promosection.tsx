"use client";
import React, { useEffect, useState } from "react";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import Separator from "../Separator";
import Loading from "../../Loading";
import { instance } from "@/app/Api/axios";
import { motion, useInView } from "framer-motion";

interface texttype {
  EN: string;
  AR: string;
}

export default function PromoSection({
  buttonTextEN = "Get Started Today",
  buttonTextAR = "ابدأ الآن",
  buttonLink = "/services",
}) {
  const { language }: any = UseVariables();
  const [loading, setLoading] = useState<boolean>(true);
  const [image, setimage] = useState<string>("");
  const [image_2, setimage_2] = useState<string>("");
  const [maintext, setmaintext] = useState<texttype>({
    EN: "",
    AR: "",
  });
  const [secondtext, setsecondtext] = useState<texttype>({
    EN: "",
    AR: "",
  });
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/about-dash");
        const data = response.data.data;

        // تخزين البيانات في الحالة
        if (data) {
          setmaintext({ EN: data.main_text_en, AR: data.main_text_ar });
          setsecondtext({ EN: data.second_text_en, AR: data.second_text_ar });
          setimage(data.image); // تأكد من أن لديك حقل للصورة في البيانات المسترجعة
          setimage_2(data.image_2); // تأكد من أن لديك حقل للصورة في البيانات المسترجعة
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // تأثيرات Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // تأخير ظهور العناصر الفرعية
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  if (loading) return <Loading />;
  return (
    <div className="dark:bg-main_dash">
      <Separator
        bg_dark="dark:bg-main_dash"
        text={language == "EN" ? "About Aram" : "عن آرام"}
      />
      <section className="w-full flex items-center justify-center">
        <div
          style={{ direction: language == "EN" ? "ltr" : "rtl" }}
          className="mx-auto max-w-screen-3xl max-lg:w-full px-4 py-8 sm:px-6 lg:px-8"
        >
          <motion.div
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate={"visible"}
          >
            {/* الجزء الأيسر (النصوص والزر) */}
            <motion.div
              className="bg-main_orange dark:bg-secend_dash rounded-md shadow-sm p-8 md:p-12 lg:px-16 lg:py-24"
              variants={itemVariants}
            >
              <div className="mx-auto max-w-xl text-center">
                <motion.h2
                  className={`text-2xl font-bold text-white md:text-3xl cursor-pointer border-2 border-transparent transition-all duration-300`}
                  whileHover={{ scale: 1.1 }}
                >
                  {language == "EN" ? maintext.EN : maintext.AR}
                </motion.h2>
                <motion.p
                  className={`text-white/80 sm:mt-4 sm:block cursor-pointer border-2 border-transparent transition-all duration-300`}
                  whileHover={{ scale: 1.05 }}
                >
                  {language == "EN" ? secondtext.EN : secondtext.AR}
                </motion.p>
                <motion.div className="mt-4 md:mt-8" variants={itemVariants}>
                  <Link
                    href={buttonLink}
                    className={`inline-block rounded border border-white bg-white px-12 py-3 text-sm font-medium text-blue-500 text-center transition hover:bg-transparent hover:text-white focus:outline-none focus:ring focus:ring-yellow-400`}
                  >
                    {language == "EN" ? buttonTextEN : buttonTextAR}
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* الجزء الأيمن (الصور) */}
            <motion.div
              className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2"
              variants={containerVariants}
            >
              <motion.div
                className="w-full cursor-pointer border-2 border-transparent transition-all duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <Img
                  src={image || "/test.png"}
                  className="h-40 w-full object-cover sm:h-56 md:h-[40vh] rounded-sm"
                />
              </motion.div>

              <motion.div
                className="w-full cursor-pointer border-2 border-transparent transition-all duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <Img
                  src={image_2 || "/test.png"}
                  className="h-40 w-full object-cover sm:h-56 md:h-[40vh] rounded-sm"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
