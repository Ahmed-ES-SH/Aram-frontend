"use client";
import { useEffect, useState } from "react";
import {
  FaArrowDown,
  FaBars,
  FaChevronDown,
  FaMoon,
  FaRegSun,
  FaTimes,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Img from "../Img";
import { currencies, navbarlinks } from "@/app/constants/website";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import { CiLogin } from "react-icons/ci";
import { FaCartShopping } from "react-icons/fa6";
import UserButton from "./_Auth/UserButtton";
import Cookie from "cookie-universal";
import { Cardcontext } from "@/app/context/CartContext";
import Notificationpopup from "./_notifactions/Notificationpopup";
import { useDataContext } from "@/app/context/DataContext";
import { usePathname } from "next/navigation";
import Flag from "react-world-flags";
import { useRouter } from "next/navigation";
/////////////////////////////////////////
// end of import lines
/////////////////////////////////////////

export default function Navbar() {
  const { activeCurrency, setActiveCurrency } = useDataContext();
  const cookie = Cookie();
  const router = useRouter();
  const pathname = usePathname();
  const token = cookie.get("aram_token");
  const { language, setlanguage }: any = UseVariables();
  const { open_close }: any = Cardcontext();
  const { currentuser } = useDataContext();
  const role = currentuser && currentuser.role;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCardHovered, setCardIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<any>(false);
  const [width, setWidth] = useState<number>(0);
  const [openDropCurrency, setOpenDropCurrency] = useState(false);

  /////////////////////////////////////////
  // end of states lines
  /////////////////////////////////////////

  //----------------------------------------------------------------------------------------------------------------

  /////////////////////////////////////////
  // start of functions lines
  /////////////////////////////////////////

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleGo = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-main_dash");
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(width > 1025 && false); // Close the menu if width is greater than 1025
  }, [width]);

  const toggleDarkMode = () => {
    if (typeof document !== "undefined") {
      setIsDarkMode((prevMode: any) => {
        const newMode = !prevMode;
        localStorage.setItem("darkMode", newMode.toString());
        if (newMode) {
          document.documentElement.classList.add("dark");
          document.body.classList.add("bg-main_dash");
        } else {
          document.documentElement.classList.remove("dark");
          document.body.classList.remove("bg-main_dash");
        }
        return newMode;
      });
    }
  };

  const selectCurrency = (currency: any) => {
    setActiveCurrency(currency);
  };

  const ENToggle = () => setlanguage("EN");
  const ARToggle = () => setlanguage("AR");

  /////////////////////////////////////////
  // end of functions lines
  /////////////////////////////////////////

  const dashboard = pathname.split("/")[1];

  if (dashboard == "dashboard") {
    return null;
  }

  return (
    <div className="z-[99999] relative">
      <header className="bg-white dark:bg-secend_dash shadow-md fixed top-0 left-0 w-full">
        <div className="w-full h-fit py-1 bg-gray-100 dark:bg-gray-700 dark:text-white border-b border-gray-300">
          <div className="w-[90%] mx-auto ">
            <div className="w-fit ml-auto flex items-center gap-4 ">
              <div
                onClick={() => setOpenDropCurrency(!openDropCurrency)}
                className="flex items-center gap-1 cursor-pointer relative"
              >
                <p className="text-[12px]">{activeCurrency.name}</p>
                <div className="flex items-center gap-1">
                  <Flag code={activeCurrency.flag} className="size-4" />
                  <FaArrowDown className="size-3 text-gray-500 " />
                </div>
                {openDropCurrency && (
                  <div className=" z-[999999999999] w-[120px] bg-white dark:bg-main_dash py-1  border rounded-md shadow-sm dark:border-gray-700 absolute top-6 -left-5">
                    {currencies.map((currency, index) => (
                      <div
                        onClick={() => selectCurrency(currency)}
                        key={index}
                        className="flex items-center gap-2 pb-2  cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 duration-200 px-2 "
                      >
                        <Flag code={currency.flag} className="size-3" />
                        <p className="whitespace-nowrap">{currency.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p
                onClick={ENToggle}
                className="hover:underline underline-gray-300 cursor-pointer text-sm"
              >
                English
              </p>
              <p
                onClick={ARToggle}
                className="hover:underline underline-gray-300 cursor-pointer text-sm"
              >
                العربية
              </p>
              <div className="w-[25px] h-[25px] py-2 relative overflow-hidden dark:bg-secend_dash bg-white rounded-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaRegSun
                        onClick={toggleDarkMode}
                        className="size-5 cursor-pointer text-gray-500 dark:text-white"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaMoon
                        onClick={toggleDarkMode}
                        className="size-5 cursor-pointer text-gray-500 dark:text-white"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ direction: language == "EN" ? "ltr" : "rtl" }}
          className="mx-auto w-[90%] max-lg:w-[95%] max-md:w-[98%]  "
        >
          <div className="flex h-16 relative items-center justify-between">
            {/* Logo */}
            <Link className="outline-none" href={"/"}>
              <Img src="/logo.ico" className="w-[70px]" />
            </Link>

            {/* Desktop Navigation */}
            <nav aria-label="Global" className="flex items-center gap-7 ">
              <ul className="lg:flex hidden items-center gap-6 text-sm">
                {navbarlinks.map((link, index) => (
                  <li
                    className="relative group duration-300"
                    key={index}
                    onMouseEnter={() => {
                      if (link.title_en === "Services") {
                        setIsHovered(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (link.title_en === "Services") {
                        setIsHovered(false);
                      }
                    }}
                  >
                    <Link
                      className="text-gray-500 flex items-center gap-2 dark:text-secend_text dark:hover:text-main_orange transition hover:text-main_orange duration-200"
                      href={link.to == "/services" ? "#" : link.to}
                    >
                      <p>{language == "EN" ? link.title_en : link.title_ar}</p>
                      {/* {link.title_en == "Services" && (
                        <FaChevronDown className="text-[10px]" />
                      )} */}
                    </Link>
                    {/* {link.title_en == "Services" && (
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            className="submenu w-fit h-fit py-2 px-2 rounded-md bg-white shadow-md absolute -bottom-20 left-0"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ul className="flex flex-col items-start gap-3">
                              <Link
                                href={"/services"}
                                className="text-gray-500 whitespace-nowrap cursor-pointer flex items-center gap-2 dark:text-secend_text dark:hover:text-main_orange transition hover:text-main_orange duration-200"
                              >
                                {language == "EN"
                                  ? "Aram Services"
                                  : "خدمات آرام"}
                              </Link>
                              <Link
                                href={"/affiliateservices"}
                                className="text-gray-500 whitespace-nowrap cursor-pointer flex items-center gap-2 dark:text-secend_text dark:hover:text-main_orange transition hover:text-main_orange duration-200"
                              >
                                {language == "EN"
                                  ? "Affiliate Aram Services"
                                  : "خدمات التابعة لآرام"}
                              </Link>
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )} */}
                  </li>
                ))}
              </ul>

              {token ? (
                <div className="max-lg:hidden">
                  <UserButton />
                </div>
              ) : (
                <div className=" max-lg:hidden flex items-center gap-4">
                  <div className="sm:flex sm:gap-4">
                    <Link
                      className="rounded-md flex items-center gap-1 bg-main_orange hover:bg-white duration-200 hover:text-black px-5 py-2.5 text-sm font-medium text-white  shadow"
                      href="/login"
                    >
                      <p> {language == "EN" ? "Login" : "دخول"}</p>
                      <CiLogin className="size-5" />
                    </Link>
                    <div className="hidden sm:flex">
                      <Link
                        className="rounded-md bg-gray-100 text-gray-400 hover:bg-main_orange hover:text-white duration-200 px-5 py-2.5 text-sm font-medium "
                        href="/membership"
                      >
                        {language == "EN" ? "Register" : "إنضم الأن"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              <div className="max-lg:hidden flex items-center gap-6">
                <div
                  onClick={open_close}
                  className="flex flex-col items-center justify-center  cursor-pointer  duration-200 relative gap-2 text-main_orange  rounded-sm"
                >
                  <FaCartShopping className="size-6" />
                  <div className="top-0 -right-2 absolute animate-ping w-1 h-1 rounded-full bg-main_blue"></div>
                </div>
              </div>
              <Notificationpopup />
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 lg:hidden">
              {token && <UserButton />}
              <button
                onClick={toggleMenu}
                className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 "
              >
                <FaBars size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <AnimatePresence>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-64 bg-white dark:text-secend_text dark:bg-main_dash shadow-lg z-50"
            >
              <div className="p-4">
                <button
                  onClick={toggleMenu}
                  className="mb-4 block text-gray-600 hover:text-teal-600"
                >
                  <FaTimes className=" absolute top-2 right-3 cursor-pointer  ml-auto" />
                </button>
                <nav>
                  <ul className="flex flex-col gap-4 text-sm mt-5">
                    {navbarlinks.map((link, index) => (
                      <>
                        <li
                          className=" relative flex flex-col gap-2 group"
                          key={index}
                        >
                          <p
                            className="text-gray-500 cursor-pointer transition hover:text-gray-500/75 "
                            onClick={() => handleGo(link.to)}
                          >
                            {language == "EN" ? link.title_en : link.title_ar}
                          </p>
                          <div className="w-0 h-[1px] bg-main_orange group-hover:w-full duration-200"></div>
                        </li>
                        {link.title_en == "Services" && (
                          <li className=" relative flex flex-col gap-2 group">
                            <p
                              className="text-gray-500 transition hover:text-gray-500/75 "
                              onClick={() => handleGo("/affiliateservices")}
                            >
                              {language == "EN"
                                ? "Affiliate Services"
                                : "خدمات التابعة لآرام"}
                            </p>
                            <div className="w-0 h-[1px] bg-main_orange group-hover:w-full duration-200"></div>
                          </li>
                        )}
                      </>
                    ))}
                    {!token && (
                      <div className="w-full flex flex-col gap-4">
                        <li className="w-full">
                          <button
                            className="rounded-md w-full flex items-center gap-1 bg-main_orange hover:bg-white duration-200 hover:text-black px-5 py-2.5 text-sm font-medium text-white  shadow"
                            onClick={() => handleGo("/login")}
                          >
                            <p> {language == "EN" ? "Login" : "دخول"}</p>
                            <CiLogin className="size-5" />
                          </button>
                        </li>
                        <li className="w-full">
                          <button
                            className="rounded-md text-left w-full block bg-gray-200 text-gray-400 hover:bg-main_orange hover:text-white duration-200 px-5 py-2.5 text-sm font-medium "
                            onClick={() => handleGo("/membership")}
                          >
                            {language == "EN" ? "Register" : "إنضم الأن"}
                          </button>
                        </li>
                      </div>
                    )}
                  </ul>
                  <div
                    onClick={open_close}
                    className="flex flex-col items-center justify-center w-fit ml-auto mt-6 cursor-pointer  duration-200 relative gap-2 text-main_orange  rounded-sm"
                  >
                    <FaCartShopping className="size-6" />
                    <div className="top-0 -right-2 absolute animate-ping w-1 h-1 rounded-full bg-main_blue"></div>
                  </div>
                </nav>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </header>
    </div>
  );
}
