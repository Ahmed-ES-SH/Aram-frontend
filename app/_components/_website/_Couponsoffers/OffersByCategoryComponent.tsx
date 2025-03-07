"use client";
import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import React, { useEffect, useState } from "react";
import Loading from "../../Loading";
import OfferCard from "./OfferCard";
import Pagination from "../../PaginationComponent";
import { MdSignalCellularNodata } from "react-icons/md";
import Img from "../../Img";
import Breadcrumb from "../Breadcrumb";
import OfferPopup from "./OfferPopup";

interface props {
  categoryId: number | string;
}

interface categoryType {
  title_en: string;
  title_ar: string;
  image: string;
}

export default function OffersByCategoryComponent({ categoryId }: props) {
  const { language } = UseVariables();

  const [offers, setOffers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});
  const [currentCategory, setCurrentCategory] = useState<categoryType>({
    title_ar: "",
    title_en: "",
    image: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const onClose = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleOpen = (offer: any) => {
    setIsOpen(true);
    setSelectedOffer(offer);
    console.log("click");
  };

  useEffect(() => {
    const getdata = async (page: number) => {
      try {
        const response = await instance.get(
          `/offers-by-category/${categoryId}?page=${page}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setOffers(data);
          setCurrentCategory(data[0]?.category);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getdata(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <div className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center head mt-20">
        <h1
          style={{ overflowWrap: "anywhere" }}
          className="pb-2 border-b border-b-main_orange w-fit lg:whitespace-nowrap mx-auto text-center font-manrope font-bold max-sm:text-lg text-3xl text-gray-900 dark:text-secend_text mb-5 md:text-4xl md:leading-normal"
        >
          {language === "EN"
            ? "Discover Exclusive Deals and Offers from"
            : "استكشف العروض الحصرية المقدمة من"}
          <br />
          <span className="text-main_orange">
            {language === "EN"
              ? "Our Partner Organizations"
              : "شركائنا الموثوقين"}
          </span>
        </h1>
      </div>
      {currentCategory && currentCategory.title_en.length > 1 && (
        <div className="w-full my-4">
          <div className="w-fit mx-auto flex flex-col items-center justify-center">
            <Img
              src={currentCategory.image ? currentCategory?.image : "/public"}
              className="w-32 h-32 rounded-full object-contain shadow-md"
            />
            <p className="my-2">
              {language == "EN"
                ? currentCategory?.title_en
                : currentCategory?.title_ar}
            </p>
          </div>
        </div>
      )}

      <div className="w-fit mx-auto">
        <Breadcrumb />
      </div>
      {offers.length > 0 ? (
        <div className="w-[95%] mx-auto min-h-screen p-6 grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-8 max-md:gap-4 max-md:p-2">
          {offers &&
            offers.length > 0 &&
            offers.map((offer, index) => (
              <OfferCard
                toggleOpen={toggleOpen}
                key={index}
                offer={offer}
                index={index}
              />
            ))}
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center w-full">
          <div className="flex flex-col items-center gap-4">
            <MdSignalCellularNodata className="text-gray-400 size-64" />
            <p>
              {language == "EN"
                ? "Sorry, there are no offers or coupons for this Category at the moment."
                : "عفوا لا توجد عروض او كوبونات لهذا القسم  فى الوقت الحالى"}
            </p>
          </div>
        </div>
      )}
      {offers.length > 25 && (
        <Pagination
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={handlePageChange}
        />
      )}
      <OfferPopup isOpen={isOpen} onClose={onClose} offer={selectedOffer} />
    </>
  );
}
