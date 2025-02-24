"use client";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import React from "react";
import ProductCard from "../ProductCard";
import Separator from "../Separator";
import Loading from "../../Loading";
import { useDataContext } from "@/app/context/DataContext";
import { motion, useInView } from "framer-motion";

interface cardType {
  id: number;
  title_ar: string;
  title_en: string;
  description_en: string;
  description_ar: string;
  features_ar: string[];
  features_en: string[];
  image: string;
  price: number;
  quantity: number;
}

export default function Cards_section() {
  const { language }: any = UseVariables();
  const { activeCards, loading }: any = useDataContext();

  // استخدام InView لتتبع ظهور العناصر
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  // تأثيرات Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // تأخير ظهور العناصر الفرعية
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const description_ar =
    "تقدم شركتنا بطاقات مميزة تمنح حامليها امتيازات حصرية تشمل خصومات على الخدمات، أولوية في الحجز، وعروض خاصة مصممة لتلبية احتياجاتك. هذه البطاقات تمثل استثمارًا قيّمًا للحصول على تجربة أفضل وأكثر تميزًا.";
  const description_en =
    "Our company offers exclusive cards that provide holders with special privileges, including discounts on services, priority booking, and tailored offers. These cards are a valuable investment for a superior and more distinguished experience.";

  if (loading) return <Loading />;

  return (
    <>
      <div style={{ direction: language == "EN" ? "ltr" : "rtl" }}>
        <Separator
          bg_dark="dark:bg-main_dash"
          text={language == "EN" ? "Aram Cards" : "بطاقات آرام"}
        />
        <section ref={ref}>
          <div className="mx-auto max-w-screen-2xl max-md:w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <motion.header
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.h2
                className="text-xl font-bold text-gray-900 pb-2 border-b border-main_orange w-fit dark:text-secend_text sm:text-3xl"
                variants={itemVariants}
              >
                {language == "EN" ? "Selected Cards" : "بطاقات مختارة"}
              </motion.h2>

              <motion.p
                className="mt-4 max-w-lg text-gray-500"
                variants={itemVariants}
              >
                {language == "EN" ? description_en : description_ar}
              </motion.p>
            </motion.header>

            <motion.ul
              className="mt-8 grid justify-items-center gap-4 max-lg:gap-x-10 max-sm:gap-8 max-sm:grid-cols-1 sm:grid-cols-2 max-lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {activeCards.slice(0, 8).map((card: any, index: number) => (
                <motion.li
                  className="w-full"
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.5, delay: index * 0.2 }} // تأخير بناءً على الترتيب
                  whileHover={{ scale: 1.05 }} // تأثير تكبير عند التمرير
                >
                  <ProductCard direct="cards" card={card} />
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>
        <motion.div
          className="button w-full mx-auto"
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Link
            className="w-[30%] max-lg:w-1/2 max-md:w-[90%] mx-auto h-[40px] flex items-center duration-200 justify-center rounded-md shadow-md my-2 bg-main_orange text-white border border-transparent hover:border-main_orange hover:bg-white hover:text-black"
            href={"/cards"}
          >
            <p>{language == "EN" ? "Show More" : "شاهد المزيد"}</p>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
