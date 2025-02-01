"use client";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../ProductCard";
import Separator from "../Separator";
import Footer from "../Footer";
import { instance } from "@/app/Api/axios";
import Loading from "../../Loading";
import RandomServicesSidebar from "../_servicespage/RandomServicesSidebar";
import Pagination from "../../PaginationComponent";
import OrganizationSlider from "../_servicespage/OrganizationSlider";

interface cardType {
  id: number;
  title_ar: string;
  title_en: string;
  description_en: string;
  description_ar: string;
  features_ar: string[];
  features_en: string[];
  price: number;
  quantity: number;
  image: string;
}

export default function CardsPage() {
  const { language }: any = UseVariables();
  const description_ar =
    "تقدم شركتنا بطاقات مميزة تمنح حامليها امتيازات حصرية تشمل خصومات على الخدمات، أولوية في الحجز، وعروض خاصة مصممة لتلبية احتياجاتك. هذه البطاقات تمثل استثمارًا قيّمًا للحصول على تجربة أفضل وأكثر تميزًا.";
  const description_en =
    "Our company offers exclusive cards that provide holders with special privileges, including discounts on services, priority booking, and tailored offers. These cards are a valuable investment for a superior and more distinguished experience.";

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const [cards, setcards] = useState<cardType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);

  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true);
      if (newPage > 0 && newPage <= lastPage) {
        setCurrentPage(newPage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await instance.get("/card-types");
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setcards(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getdata();
  }, []);

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  if (loading) return <Loading />;

  return (
    <>
      <div
        className="pt-16"
        style={{ direction: language === "EN" ? "ltr" : "rtl" }}
      >
        {/* Separator Component */}
        <Separator
          bg_dark="dark:bg-secend_dash"
          text={language === "EN" ? "Aram Cards" : "بطاقات آرام"}
        />

        {/* Main Section */}
        <motion.section
          className="w-full p-1"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {/* Header */}
          <header className="text-center">
            <h2 className="text-3xl max-md:text-xl font-bold text-gray-900 dark:text-secend_text">
              {language === "EN" ? "Selected Cards" : "بطاقات مختارة"}
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-gray-500">
              {language === "EN" ? description_en : description_ar}
            </p>
          </header>

          {/* Cards Section */}
          <div className="flex items-start gap-2 max-xl:flex-col w-full my-4">
            <div className="w-3/4 border rounded-md shadow-md max-xl:w-full pb-5  h-full">
              <ul className="grid justify-items-center p-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 ">
                {cards.map((card, index) => (
                  <motion.li
                    key={index}
                    className="w-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ProductCard direct="cards" card={card} />
                  </motion.li>
                ))}
              </ul>
              {/* Show More Button */}
              <Pagination
                currentPage={currentPage}
                totalPages={lastPage}
                onPageChange={handlePageChange}
              />
            </div>
            <RandomServicesSidebar />
          </div>
        </motion.section>
        <div className="w-full p-2 my-3">
          <OrganizationSlider />
        </div>
      </div>
    </>
  );
}
