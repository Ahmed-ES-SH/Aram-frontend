"use client";
import { useEffect, useRef, useState } from "react";
import { HiOutlineUserCircle, HiOutlineLogout } from "react-icons/hi";
import Img from "../../Img";
import { instance } from "@/app/Api/axios";
import {
  FaBell,
  FaCaretDown,
  FaCcMastercard,
  FaRegCalendarAlt,
} from "react-icons/fa";
import Cookie from "cookie-universal";
import Link from "next/link";
import { UseVariables } from "@/app/context/VariablesContext";
import { AnimatePresence, motion } from "framer-motion";
import { useDataContext } from "@/app/context/DataContext";
import Loading from "../../Loading";
import { CiBoxList, CiCreditCard2 } from "react-icons/ci";
import NotificationsComponent from "../_notifactions/NotifiticationsComponent";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { GrDashboard } from "react-icons/gr";
import {
  MdLocalOffer,
  MdOutlineAddToPhotos,
  MdOutlineDesignServices,
} from "react-icons/md";
import { LuBadgeDollarSign } from "react-icons/lu";
import { BiSolidOffer } from "react-icons/bi";
import { useRouter } from "next/navigation";

interface usertype {
  name: string;
  image: string;
  icon: string;
  title_en: string;
}

export default function UserButton() {
  const { language } = UseVariables();
  const router = useRouter();
  const { currentuser, type } = useDataContext();
  const id = currentuser && currentuser.id;
  const role = currentuser && currentuser.role;
  const prevUserRef = useRef(currentuser && currentuser.id);
  const cookie = Cookie();
  const token = cookie.get("aram_token");
  const [isOpen, setIsOpen] = useState(false);
  const [showNots, setShowNots] = useState(false);
  const [unReadNots, setUnReadNots] = useState(false);

  const logout = async () => {
    try {
      const response = await instance.post("/logout");
      if (response.status == 200) {
        cookie.remove("aram_token");
        if (typeof window !== undefined) {
          window.location.replace("/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkNots = async () => {
      try {
        const response = await instance.get(
          `/notifications-isunread/${currentuser.id}/${type}`
        );
        if (response.status === 200) {
          setUnReadNots(true);
        } else {
          setUnReadNots(false);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    // فحص إذا كانت القيمة قد تغيرت بالفعل
    if (id !== prevUserRef.current) {
      checkNots();
      prevUserRef.current = id; // تحديث القيمة المخزنة
    }
  }, [id, type]); // التفاعل مع `id` و `type`

  if (!currentuser) return <Loading />;

  const image =
    currentuser && type == "Organization"
      ? currentuser.icon
      : currentuser.image;
  const text =
    currentuser && type == "Organization"
      ? currentuser.title_en.length > 6
        ? currentuser.title_en.slice(0, 6) + "..."
        : currentuser.title_en
      : currentuser.name.length > 6
      ? currentuser.name.slice(0, 6) + "..."
      : currentuser.name;

  const currentusername =
    type == "Organization" ? currentuser.title_en : currentuser.name;

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  const links = [
    {
      href: `/myprofile?account_name=${formatTitle(
        currentusername
      )}&acouunt_type=${type}&id=${currentuser.id}`,
      icon: <HiOutlineUserCircle className="w-5 h-5" />,
      label: { EN: "My Profile", AR: "الملف الشخصي" },
    },
    {
      href: `/mycards?account_name=${formatTitle(
        currentusername
      )}&acouunt_type=${type}&userId=${currentuser.id}`,
      icon: <FaCcMastercard className="w-5 h-5" />,
      label: { EN: "My Cards", AR: "بطاقاتى" },
    },
    {
      href: `/Listofreservations?account_name=${formatTitle(
        currentusername
      )}&acouunt_type=${type}&userId=${currentuser.id}`,
      icon: <CiBoxList className="w-5 h-5" />,
      label: { EN: "List of reservations", AR: "قائمة الحجوزات" },
    },
    {
      href: `/conversations?account_name=${formatTitle(
        currentusername
      )}&acouunt_type=${type}&userId=${currentuser.id}`,
      icon: <IoChatbubbleEllipsesOutline className="w-5 h-5" />,
      label: { EN: "Conversations", AR: "قائمة المحادثات" },
    },
    {
      href: `/accountbalance?organizzation_name=${currentusername}&organization_Id=${id}`,
      icon: <LuBadgeDollarSign className="size-5" />,
      label: { EN: "Account balance", AR: "رصيد الحساب" },
    },
  ];

  const organizationLinks = [
    ...links,
    {
      href: `/myaffiliateservices?organizzation_name=${currentusername}&organization_Id=${id}`,
      icon: <MdOutlineDesignServices className="size-5" />,
      label: { EN: "organization Services", AR: "خدمات المنظمة" },
    },
    {
      href: `/addaffiliateservice?organizzation_name=${currentusername}`,
      icon: <MdOutlineAddToPhotos className="size-5" />,
      label: { EN: "Add new service", AR: "أضف خدمة جديدة" },
    },
    {
      href: `/centeroffers?organizzation_name=${currentusername}&organization_Id=${id}`,
      icon: <MdLocalOffer className="size-5" />,
      label: { EN: "organization offers", AR: "عروض المنظمة" },
    },
    {
      href: `/centerschedule?organizzation_name=${currentusername}&organization_Id=${id}`,
      icon: <FaRegCalendarAlt className="size-5" />,
      label: { EN: "organization Schedule", AR: "مواعيد المنظمة" },
    },
  ];

  const handleGo = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const currentLinks = type == "User" ? links : organizationLinks;

  return (
    <>
      {token && currentuser && (
        <div className="relative inline-block text-left w-fit">
          {/* زر المستخدم */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 w-[150px] max-md:w-[40px] max-md:h-[40px] overflow-hidden max-md:p-0 max-md:rounded-full max-md:border-2 max-md:border-main_orange  rounded-md  bg-main_orange dark:bg-gray-600 px-3 py-2 shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 duration-200"
            >
              <Img
                src={currentuser && image ? image : "/avatars/avatar_male.png"}
                className="w-8 h-8 max-md:w-full max-md:h-full rounded-full object-cover bg-white"
              />
              <div className="flex relative items-center gap-4">
                <span className=" max-md:hidden sm:inline-block text-sm whitespace-nowrap font-medium text-white dark:text-gray-300">
                  {currentuser && text}
                </span>
                <FaCaretDown className="  size-3 text-white" />
              </div>
            </button>
            <div
              onClick={() => setShowNots((prev) => !prev)}
              className="relative"
            >
              <FaBell className="size-6 text-main_orange cursor-pointer" />
              {unReadNots && (
                <div className="top-0 -right-2 absolute animate-ping w-1 h-1 rounded-full bg-orange-500"></div>
              )}
            </div>

            <AnimatePresence>
              {showNots && (
                <motion.div
                  className={`fixed top-28 ${
                    language == "EN" ? "right-4" : "left-4"
                  } max-md:right-1 w-96 max-md:w-[95%] h-fit max-h-[80vh] overflow-y-auto hidden-scrollbar bg-white dark:bg-secend_dash shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg p-4`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5 }}
                >
                  <NotificationsComponent />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* القائمة المنسدلة */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                style={{ direction: language == "EN" ? "ltr" : "rtl" }}
                className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="py-1" role="none">
                  {currentLinks.map((link, index) => (
                    <>
                      <p
                        key={index}
                        onClick={() => handleGo(link.href)}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 duration-200"
                        role="menuitem"
                      >
                        {link.icon}
                        {language === "EN" ? link.label.EN : link.label.AR}
                      </p>
                    </>
                  ))}

                  {
                    <p
                      onClick={() =>
                        handleGo(
                          `/couponesaccount?account_type=${type}&account_name=${text}`
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 duration-200"
                      role="menuitem"
                    >
                      <BiSolidOffer className="w-5 h-5" />
                      {language === "EN"
                        ? "Account Coupones"
                        : "كوبونات المستخدم"}
                    </p>
                  }
                  {role == "Admin" && (
                    <p
                      onClick={() =>
                        handleGo(
                          `/dashboard?account_type=${type}&account_name=${text}`
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 duration-200"
                      role="menuitem"
                    >
                      <GrDashboard className="w-5 h-5" />
                      {language === "EN" ? "Dashboard" : "لوحة التحكم"}
                    </p>
                  )}
                  {/* زر تسجيل الخروج */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-500 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 duration-200"
                    role="menuitem"
                  >
                    <HiOutlineLogout className="w-5 h-5" />
                    {language === "EN" ? "Logout" : "تسجيل الخروج"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
