"use client";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import { motion } from "framer-motion";
import OrganiztionBookCard from "./_organizationspage/OrganizationBookCard";
import { UseVariables } from "@/app/context/VariablesContext";
import Separator from "./Separator";
import { AiOutlineSearch } from "react-icons/ai";
import Footer from "./Footer";
import Pagination from "../PaginationComponent";
import BookPopup from "./BookPopup";
import SuccessPopup from "../_dashboard/SuccessPopup";
import { useDataContext } from "@/app/context/DataContext";
import CheckCurrentUserPopup from "./_Auth/CheckCurrentUserPopup";

interface props {
  categoryId: number;
}

export default function BookServiceComponent({ categoryId }: props) {
  const { language }: any = UseVariables();
  const { currentuser }: any = useDataContext();
  const [organizations, setOrganizations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [CurrentUserCheck, setCurrentUserCheck] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  useEffect(() => {
    const getData = async (page: number) => {
      try {
        const response = await instance.get(
          `/organizations-by-service/${categoryId}?page=${page}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          setCurrentPage(response.data.pagination.current_page);
          setLastPage(response.data.pagination.last_page);
          setOrganizations(data);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData(currentPage);
  }, [categoryId, currentPage]);

  const handlePageChange = async (newPage: any) => {
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

  const successToggle = () => {
    setShowSuccessPopup((prev) => !prev);
  };

  const popupToggle = (org: any) => {
    if (!currentuser) {
      return setCurrentUserCheck(true);
    }

    setSelectedOrg(org);
    setShowPopup((prev) => !prev);
  };

  const CheckToggle = () => {
    setCurrentUserCheck((prev) => !prev);
  };

  if (loading) return <Loading />;

  return (
    <>
      <div
        className={`w-full min-h-screen h-fit p-6 mt-16 ${
          language === "AR" ? "text-right" : "text-left"
        }`}
        dir={language === "AR" ? "rtl" : "ltr"}
      >
        {/* نص توضيحي لمحتوى الصفحة */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Separator
            bg_dark="dark:bg-secend_dash"
            text={
              language === "EN"
                ? "Explore Our Trusted Organizations"
                : "استكشف المنظمات الموثوقة لدينا"
            }
          />
          <p className="mt-2 text-gray-600 dark:text-secend_text text-center w-1/2 max-md:w-[95%] max-md:text-sm mx-auto">
            {language === "EN"
              ? "Discover organizations that provide exceptional services tailored to your needs. Whether you're looking for professional assistance, specialized expertise, or community-focused initiatives, our trusted organizations are here to support you every step of the way."
              : "اكتشف المنظمات التي تقدم خدمات استثنائية تلبي احتياجاتك. سواء كنت تبحث عن مساعدة مهنية، خبرة متخصصة، أو مبادرات موجهة نحو المجتمع، فإن منظماتنا الموثوقة هنا لدعمك في كل خطوة."}
          </p>
        </motion.div>

        {/* عرض قائمة المؤسسات */}
        <div className="">
          {organizations.length > 0 ? (
            <>
              {organizations.map((organization, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <OrganiztionBookCard
                    onOpen={popupToggle}
                    organization={organization}
                  />
                </motion.div>
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={lastPage}
                onPageChange={handlePageChange}
              />
              {showPopup && (
                <BookPopup
                  successToggle={successToggle}
                  selectedOrg={selectedOrg}
                  onClose={popupToggle}
                  priceState="org"
                />
              )}
              {showSuccessPopup && (
                <SuccessPopup
                  message={
                    language == "EN"
                      ? "Your reservation request has been sent successfully"
                      : "تم إرسال طلب الحجز بنجاح"
                  }
                  onClose={successToggle}
                />
              )}
              {CurrentUserCheck && (
                <CheckCurrentUserPopup
                  isOpen={CheckCurrentUserPopup}
                  onClose={CheckToggle}
                  language={language}
                />
              )}
            </>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center h-[80vh] max-md:h-fit bg-gray-50 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AiOutlineSearch size={100} className="text-gray-400 mb-6" />
              <p className="text-2xl font-semibold">
                {language === "EN"
                  ? "No organizations found."
                  : "لم يتم العثور على منظمات."}
              </p>
              <p className="text-md mt-2">
                {language === "EN"
                  ? "Please try selecting another category or adjust your search criteria."
                  : "يرجى محاولة اختيار فئة أخرى أو تعديل معايير البحث الخاصة بك."}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
