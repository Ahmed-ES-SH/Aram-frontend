"use client";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";
import OfferCard from "./OfferCard";
import Pagination from "../../PaginationComponent";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdSignalCellularNodata } from "react-icons/md";
import { UseVariables } from "@/app/context/VariablesContext";
import OfferPopup from "./OfferPopup";

export default function Offers() {
  const { language } = UseVariables();
  const [offers, setOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});

  const onClose = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleOpen = (offer: any) => {
    setIsOpen(true);
    setSelectedOffer(offer);
  };

  const handlePageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const [isFirstLoad, setIsFirstLoad] = useState(true); // تتبع أول تحميل

  useEffect(() => {
    const getOffers = async (page: number) => {
      try {
        setLoading(true);
        const response = await instance.get(`/active-offers?page=${page}`);
        if (response.status === 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setOffers(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
        setIsFirstLoad(false);
      }
    };

    getOffers(currentPage);
  }, [currentPage, isFirstLoad]);

  useEffect(() => {
    if (!isFirstLoad) {
      window.scrollTo(0, 590);
    }
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
      {offers.length > 0 ? (
        <div className="w-full overflow-hidden  max-md:p-2 mx-auto  p-6 grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1  max-xl:grid-cols-3 max-lg:gap-4 gap-8">
          {offers.map((offer, index) => (
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
                ? "Sorry, there are no offers or coupons at the moment."
                : "عفوا لا توجد عروض او كوبونات فى الوقت الحالى"}
            </p>
          </div>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={lastPage}
        onPageChange={handlePageChange}
      />

      <OfferPopup isOpen={isOpen} onClose={onClose} offer={selectedOffer} />
    </>
  );
}
