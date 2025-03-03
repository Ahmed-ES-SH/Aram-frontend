"use client";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import RandomServicesSidebar from "../_servicespage/RandomServicesSidebar";
import { motion } from "framer-motion";
import OrganizationSlider from "../_servicespage/OrganizationSlider";
import { IoIosTime } from "react-icons/io";
import Link from "next/link";
import { GiBarbedStar } from "react-icons/gi";
import Img from "../../Img";
import Navbar from "../Navbar";
import { UseVariables } from "@/app/context/VariablesContext";
import Loading from "../../Loading";
import { useDataContext } from "@/app/context/DataContext";
import BookPopup from "../BookPopup";
import CheckCurrentUserPopup from "../_Auth/CheckCurrentUserPopup";
import SuccessPopup from "../../_dashboard/SuccessPopup";

interface props {
  serviceId: any;
}

export default function Affiliate_service({ serviceId }: props) {
  const { language } = UseVariables();
  const { currentuser } = useDataContext();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>({}); // Replace `any` with a proper type if possible
  const [serviceFeaturesEN, setServiceFeaturesEN] = useState<any[]>([]); // Replace `any` with a proper type if possible
  const [serviceFeaturesAR, setServiceFeaturesAR] = useState<any[]>([]); // Replace `any` with a proper type if possible
  const [organization, setOrganization] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [CurrentUserCheck, setCurrentUserCheck] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!serviceId) return; // Exit if `serviceId` is not provided

      try {
        const response = await instance.get(
          `/get-affiliate-service/${serviceId}`
        );
        if (response.status === 200) {
          const data = response.data.data;
          const organization = data.organization;
          const features_ar =
            data.features_ar && typeof data.features_ar == "string"
              ? JSON.parse(data.features_ar)
              : data.features_ar;
          const features_en =
            data.features_en && typeof data.features_en == "string"
              ? JSON.parse(data.features_en)
              : data.features_en;
          // Update the service state
          setService(data);
          setServiceFeaturesEN(features_en);
          setServiceFeaturesAR(features_ar);
          setOrganization(organization);
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  if (loading) return <Loading />;

  const successToggle = () => {
    setShowSuccessPopup((prev) => !prev);
  };

  const popupToggle = () => {
    if (!currentuser) {
      return setCurrentUserCheck(true);
    }

    setSelectedOrg(organization);
    setShowPopup((prev) => !prev);
  };

  const CheckToggle = () => {
    setCurrentUserCheck((prev) => !prev);
  };

  return (
    <>
      <motion.div
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.7 }}
        className="w-[98%] pt-5  h-fit dark:bg-main_dash mx-auto p-2  flex items-start justify-between max-xl:flex-col gap-2 mt-16 max-lg:mt-20"
      >
        {/* محتوى الخدمة الرئيسي */}
        <div className="border dark:bg-secend_dash dark:border-gray-600 w-3/4  rounded-md shadow-md max-xl:w-full  h-full px-2 py-1">
          {/* قسم الصورة مع تأثير الحركة عند التمرير */}
          <motion.div
            className="w-full h-80 bg-cover relative bg-center rounded-lg shadow-md"
            style={{
              backgroundImage: service.image
                ? `url('${service.image}')`
                : `url('/services/service_2.jpg')`, // ضع مسار الصورة هنا
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Img
              src={service.icon ? service.icon : "/logo.png"}
              className="w-10 h-10 absolute bottom-2 left-2 rounded-full"
            />
            <motion.div
              className="absolute top-2 right-2  duration-200 bg-red-400 border  border-dashed text-white text-xl font-bold rounded-full w-16 h-16 flex items-center justify-center z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {service.discount_percent || 0} %
            </motion.div>
          </motion.div>

          {/* عنوان الخدمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 text-center mt-4"
          >
            <div className="w-fit pb-2 border-b border-main_red mx-auto">
              <div className="flex items-center gap-2">
                <h1
                  style={{ overflowWrap: "anywhere" }}
                  className="text-3xl  mx-auto w-fit font-semibold text-gray-800 dark:text-white"
                >
                  {language == "EN" ? service.title_en : service.title_ar}
                </h1>
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300">
              {language == "EN"
                ? service.description_en
                : service.description_ar}
            </p>
          </motion.div>

          {/* المزيد من المعلومات عن الخدمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <h2 className="text-2xl pb-2 border-b border-main_orange w-fit font-semibold text-gray-800 dark:text-white">
              {language == "EN" ? "Service Features" : "مميزات الخدمة"}
            </h2>
            <ul className="list-inside flex flex-col items-start gap-4 mt-4 text-lg text-gray-600 dark:text-gray-300">
              {service &&
                serviceFeaturesEN &&
                (language == "EN" ? serviceFeaturesEN : serviceFeaturesAR).map(
                  (feature: string, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="flex items-center gap-3"
                    >
                      <GiBarbedStar className="text-main_blue" />
                      {feature}
                    </motion.li>
                  )
                )}
            </ul>
          </motion.div>

          {/* قسم الأسئلة الشائعة */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-6"
          >
            <h2 className="text-xl pb-2 border-b border-main_orange w-fit font-semibold text-gray-800 dark:text-white">
              {language == "EN"
                ? "Frequently Asked Questions"
                : "الأسئلة الشائعة"}
            </h2>
            <div className="space-y-4 mt-6">
              <div className="text-gray-600 dark:text-gray-300">
                <h3 className="font-semibold">
                  {language == "EN"
                    ? "Can I make an appointment?"
                    : "هل يمكنني حجز موعد؟"}
                </h3>
                <p>
                  {language == "EN"
                    ? "Yes, you can book an appointment through our website or contact us directly."
                    : "نعم، يمكنك حجز موعد عبر موقعنا الإلكتروني أو الاتصال بنا مباشرة."}
                </p>
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                <h3 className="font-semibold text-sm">
                  {language == "EN"
                    ? "Are there any side effects?"
                    : "هل هناك أي تأثيرات جانبية؟"}
                </h3>
                <p>
                  {language == "EN"
                    ? "The services we offer are completely safe and there are no noticeable side effects."
                    : "الخدمات التي نقدمها آمنة تمامًا ولا توجد تأثيرات جانبية ملحوظة."}
                </p>
              </div>
            </div>
          </motion.div> */}

          {/* <div className="button w-full mt-8 mx-auto">
            <button
              onClick={popupToggle}
              className="w-[30%] max-lg:w-1/2 max-md:w-[90%]  mx-auto h-[40px] flex items-center gap-4 duration-200 justify-center rounded-md shadow-md my-2 bg-main_orange text-white border border-transparent hover:border-main_orange hover:bg-white hover:text-black"
            >
              <IoIosTime className="size-4 " />
              <p>{language == "EN" ? "Book Now" : "إحجز الأن"}</p>
            </button>
          </div> */}
          <OrganizationSlider />
        </div>

        {/* Sidebar مع الخدمات الأخرى */}
        {<RandomServicesSidebar />}
      </motion.div>
      {showPopup && (
        <BookPopup
          onClose={popupToggle}
          successToggle={successToggle}
          selectedOrg={organization}
          priceState="service"
          service={service}
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
  );
}
