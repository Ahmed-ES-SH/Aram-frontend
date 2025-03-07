"use client";
import React, { useEffect, useState } from "react";
import Loading from "../../Loading";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { UseVariables } from "@/app/context/VariablesContext";
import Separator from "../Separator";
import ProductCard from "../ProductCard";
import Pagination from "../../PaginationComponent";
import RandomOrganizationsSidebar from "../RandomOrganizationSidebar";
import OffersSlider from "../_Couponsoffers/OffersSlider";

export default function AffiliateCardsComponent() {
  const { language } = UseVariables();
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const handlePageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    const getData = async (page: number) => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/active-affiliate-card-types?page=${page}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setCards(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (loading)
    return (
      <div className="min-h-[90vh] h-full w-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <AiOutlineLoading3Quarters className="size-36 max-xl:size-24 text-main_orange animate-pulse" />
        </motion.div>
      </div>
    );
  return (
    <>
      <div className="flex max-xl:flex-col-reverse items-start justify-between w-full gap-3 p-6 max-md:p-2 mt-16 min-h-screen">
        <RandomOrganizationsSidebar length={5} />

        <div className="main-content dark:bg-secend_dash border dark:border-gray-700 shadow-lg rounded-lg flex-grow flex-1 min-h-screen max-xl:w-full">
          <Separator
            bg_dark="dark:bg-secend_dash"
            text={
              language === "EN" ? "Aram Affiliate Cards" : "بطاقات آرام التابعة"
            }
          />
          <div className="mx-auto my-6 max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center head">
            <h1
              style={{ overflowWrap: "anywhere" }}
              className="pb-2 border-b border-b-main_orange w-fit lg:whitespace-nowrap mx-auto text-center font-manrope font-bold max-sm:text-lg text-3xl text-gray-900 dark:text-secend_text mb-5 md:text-4xl md:leading-normal"
            >
              {language === "EN"
                ? "Discover Exclusive Deals with Our"
                : "اكتشف العروض الحصرية مع"}
              <br />
              <span className="text-main_orange">
                {language === "EN"
                  ? "Affiliate Card Partners"
                  : "شركاء بطاقاتنا التابعة"}
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {language === "EN"
                ? "Explore a wide range of benefits and exclusive offers brought to you by our trusted affiliate partners."
                : "استمتع بمجموعة واسعة من المزايا والعروض الحصرية التي يقدمها شركاؤنا الموثوقون."}
            </p>
          </div>

          <div className=" p-4 max-md:p-1 grid grid-cols-2 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-2 max-xl:grid-cols-3 2xl:grid-cols-4 gap-8 max-md:gap-3">
            {cards &&
              cards.length > 0 &&
              cards.map((card, index) => (
                <ProductCard direct="affiliatecards" card={card} key={index} />
              ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={lastPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <div className="slider my-4">
        <Separator
          bg_dark="dark:bg-main_dash"
          text={
            language == "EN"
              ? "Last Offers from Aram"
              : "أخر العروض والكوبونات من آرام"
          }
        />
        <OffersSlider />
      </div>
    </>
  );
}
