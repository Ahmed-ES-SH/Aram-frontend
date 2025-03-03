"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UseVariables } from "@/app/context/VariablesContext";
import Img from "../../Img";
import {
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStarHalf,
} from "react-icons/fa";
import Slider_cards from "../_cardspage/Slider_cards";
import { instance } from "@/app/Api/axios";
import { useParams, useRouter } from "next/navigation";
import Loading from "../../Loading";
import { useDataContext } from "@/app/context/DataContext";
import { IoIosTime } from "react-icons/io";
import MapComponent from "../../MapVariable";
import BookPopup from "../BookPopup";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import CheckCurrentUserPopup from "../_Auth/CheckCurrentUserPopup";
import { BiMessage } from "react-icons/bi";
import { FaStar } from "react-icons/fa6";
import SidebarAffiliateServices from "../_affiliate_services/SidebarAffiliateServices";
import ReviewsNumbersCard from "./ReviewsNumbersCard";

interface OrganizationType {
  id: number;
  email: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  location: string;
  categories: { title_en: string; title_ar: string; [key: string]: string }[];
  phone_number: string;
  open_at: string;
  close_at: string;
  url: string;
  image: string;
  icon: string;
}

interface currentlocationType {
  address: string;
  latitude: number;
  longitude: number;
}

export default function OrganizationDetails() {
  const { language }: any = UseVariables();
  const { currentuser, type } = useDataContext();
  const defaultLocation = {
    latitude: 21.4735,
    longitude: 55.9754,
    address: "سلطنة عمان",
  };
  const params = useParams();
  const router = useRouter();
  const id = params.organizationid;
  const userId = currentuser && currentuser.id;
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [CurrentUserCheck, setCurrentUserCheck] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  const [organization, setOrganization] = useState<any>({
    id: 0,
    email: "",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    location: "",
    categories: [],
    phone_number: "",
    open_at: "",
    close_at: "",
    url: "",
    image: "",
    icon: "",
  });
  const [loading, setLoading] = useState(true);
  const [currentlocation, setcurrentlocation] = useState<currentlocationType>({
    address: "",
    latitude: 0,
    longitude: 0,
  });
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get(`/organization/${id}`);
        const data = response.data.data;
        setOrganization(data);
        setcurrentlocation(
          typeof data.location == "string"
            ? JSON.parse(data.location)
            : data.location || defaultLocation
        );
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

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

  const startConversation = async () => {
    try {
      if (!currentuser) {
        return setCurrentUserCheck(true);
      }
      const formdata = new FormData();
      formdata.append("participant_one_type", type);
      formdata.append("participant_one_id", userId);
      formdata.append("participant_two_id", organization.id);
      formdata.append("participant_two_type", organization.account_type);
      const response = await instance.post(`/make-conversation`, formdata);
      if (response.status == 200) {
        const data = response.data.data;
        router.push(
          `/conversations/${data.id}?conversationId=${data.id}&account_type=${type}&userId=${userId}`
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      {organization ? (
        <div className="flex max-xl:flex-col items-start justify-between gap-3 w-full p-3 max-md:p-1 mt-20 dark:bg-main_dash">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[75%] max-xl:w-full shadow-md border dark:border-gray-600  rounded-lg dark:bg-secend_dash text-gray-800 dark:text-secend_text flex flex-col h-full"
          >
            {/* Fullscreen Image Section */}
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-[50vh] rounded-t-lg w-full overflow-hidden"
            >
              <Img
                src={
                  organization.image
                    ? organization.image
                    : "/services/service-02.jpg"
                }
                className="object-cover object-center w-full h-full rounded-t-lg  "
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"></div>
            </motion.div>

            {/* Organization Details */}
            <div className="px-6 py-12 w-full mx-auto space-y-12">
              {/* Department */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-lg font-medium text-main_blue">
                  {language === "EN" ? "Department" : "القسم"}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {organization.categories.length > 0
                    ? language == "EN"
                      ? organization?.categories[0].title_en
                      : organization?.categories[0].title_ar
                    : language == "EN"
                    ? "unknown Department"
                    : "تصنيف غير محدد"}
                </p>
              </motion.div>

              {/* Logo and Name */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <Img
                  src={"/logo.png"}
                  className="rounded-full w-12 h-12 shadow-lg"
                />
                <h3 className="text-2xl font-bold text-teal-400 dark:text-white">
                  {language == "EN"
                    ? organization?.title_en
                    : organization?.title_ar}
                </h3>
              </motion.div>

              {/* Long Description */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 text-justify"
              >
                <h2 className="text-xl font-semibold text-gray-800 w-full whitespace-normal dark:text-white">
                  {language === "EN" ? "About the Organization" : "عن المنظمة"}
                </h2>
                <p
                  style={{ overflowWrap: "anywhere" }}
                  className="text-gray-700 dark:text-gray-300 text-base leading-7"
                >
                  {language === "EN"
                    ? organization?.description_en
                    : organization?.description_ar}
                </p>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex  justify-between w-full flex-col items-start gap-6 "
              >
                {/* Address */}
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-main_blue" size={24} />
                  <p className="text-gray-700 dark:text-gray-300">
                    {currentlocation && currentlocation.address}
                  </p>
                </div>

                {/* Contact Number */}
                {organization.phone_number && (
                  <div className="flex items-center gap-3">
                    <FaPhoneAlt className="text-main_blue" size={24} />
                    <p className="text-gray-700 dark:text-gray-300">
                      {organization?.phone_number}
                    </p>
                  </div>
                )}

                {/* Working Hours */}
                {organization.open_at && organization.close_at && (
                  <div className="flex items-center gap-3">
                    <FaClock className="text-main_blue" size={24} />
                    <p className="text-gray-700 dark:text-gray-300 tracking-[3px] ">
                      {organization?.open_at +
                        "AM" +
                        "-" +
                        organization?.close_at +
                        "PM"}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="w-full h-[60vh] max-md:h-[35vh] rounded-lg overflow-hidden shadow-lg z-[50]"
              >
                <MapComponent
                  location={currentlocation ? currentlocation : defaultLocation}
                />
              </motion.div>
            </div>
            <div className="button flex flex-col items-center gap-2 w-full mt-8 mx-auto">
              {organization?.booking_status && (
                <button
                  onClick={popupToggle}
                  className="w-[30%] max-lg:w-1/2 max-md:w-[90%]  mx-auto h-[40px] flex items-center gap-4 duration-200 justify-center rounded-md shadow-md my-2 bg-main_orange text-white border border-transparent hover:border-main_orange hover:bg-white hover:text-black"
                >
                  <IoIosTime className="size-4 " />
                  <p>{language == "EN" ? "Book Now" : "إحجز الأن"}</p>
                </button>
              )}
              <button
                onClick={startConversation}
                className="w-[30%] max-lg:w-1/2 max-md:w-[90%]  mx-auto h-[40px] flex items-center gap-4 duration-200 justify-center rounded-md shadow-md my-2 bg-main_blue text-white border border-transparent hover:border-main_blue hover:bg-white hover:text-black"
              >
                <BiMessage className="size-4 " />
                <p>{language == "EN" ? "Contact Us" : "تواصل معنا"}</p>
              </button>
            </div>

            <ReviewsNumbersCard orgId={Number(id)} />

            {/* slider Cards Section */}
            <Slider_cards />
          </motion.div>
          <SidebarAffiliateServices />
          {showPopup && (
            <BookPopup
              successToggle={successToggle}
              selectedOrg={selectedOrg}
              onClose={popupToggle}
              priceState="org"
              service={null}
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
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
