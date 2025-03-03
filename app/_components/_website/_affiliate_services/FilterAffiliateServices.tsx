import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";
import { CiDatabase } from "react-icons/ci";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import { IoLayersOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaTimesCircle } from "react-icons/fa";

interface props {
  selectedFilter: { title_en: string; title_ar: string };
  setSelectedFilter: React.Dispatch<any>;
  openToggle: () => void;
  isOpen: boolean;
}

export default function FilterAffiliateServices({
  selectedFilter,
  setSelectedFilter,
  openToggle,
  isOpen,
}: props) {
  const { language } = UseVariables();
  const [categories, setCategories] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const [total, setTotal] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get(
          "/count-affilate-services-categories"
        );
        if (response.status == 200) {
          const data = response.data.data;
          setCategories(data.categories);
          setTotal(data.total_classified_services);
        } else if (response.status == 404) {
          setCategories([]);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const selecteFilter = (category: any) => {
    setSelectedFilter(category);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
  };

  return (
    <div
      className={` ${
        isOpen
          ? "max-xl:w-[400px] opacity-100 z-[9999999] "
          : "max-xl:w-0 max-xl:-z-1 max-xl:opacity-0  "
      }   hidden-scrollbar duration-500 overflow-hidden shadow-md  max-xl:fixed top-0 right-0 xl:relative  xl:w-1/4  h-screen overflow-y-auto  `}
    >
      {loading ? (
        <div className="min-h-[90vh] h-full w-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <AiOutlineLoading3Quarters className="size-36 max-xl:size-24 text-main_orange animate-pulse" />
          </motion.div>
        </div>
      ) : (
        <div className="flex items-center  sidebar-filter  border-r-2  max-md:p-2 border-gray-300   ">
          <div className="w-full h-full bg-white  p-6 dark:bg-main_dash">
            <h1 className="my-4 w-fit pb-2 border-b border-main_orange flex items-center gap-2 mr-auto">
              <IoLayersOutline className="size-5 text-gray-400" />
              <p className="text-lg max-md:text-md dark:text-secend_text">
                {language == "EN" ? "Categories" : "الأقسام"}
              </p>
            </h1>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              onClick={() =>
                setSelectedFilter({ title_en: "All", title_ar: "الكل" })
              }
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
              className={`w-full ${
                selectedFilter.title_en == "All"
                  ? "bg-sky-200"
                  : "bg-white dark:bg-secend_dash"
              }  hover:bg-sky-200 duration-100 rounded-md p-1 min-h-[60px] my-3 cursor-pointer pb-2 border-b dark:border-gray-700 border-gray-200 flex items-center justify-between`}
            >
              <div className="flex items-center gap-2">
                <Img className="w-8 h-8 rounded-full" src={"/select-all.png"} />
                <p>{language == "EN" ? "All" : "الكل"}</p>
              </div>
              <div className=" px-3 py-1 text-white text-center bg-sky-400 rounded-md shadow-sm text-md w-10 h-fit flex items-center justify-center ">
                {total}
              </div>
            </motion.div>
            {categories.length > 0 ? (
              categories.map((category: any, index: number) => (
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.2 },
                  }}
                  onClick={() => selecteFilter(category)}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.1 }}
                  key={index}
                  className={`w-full ${
                    selectedFilter.title_en == category.title_en
                      ? "bg-sky-200"
                      : "bg-white dark:bg-secend_dash"
                  }  hover:bg-sky-200 duration-100 rounded-md p-1 min-h-[60px] my-3 cursor-pointer pb-2 border-b dark:border-gray-700 border-gray-200 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <Img
                      className="w-8 h-8 rounded-full"
                      src={category.image ? category.image : "/syringe.png"}
                    />
                    <p className="dark:text-white">
                      {language == "EN" ? category.title_en : category.title_ar}
                    </p>
                  </div>
                  <div className=" px-3 py-1 text-white text-center bg-sky-400 rounded-md shadow-sm text-md w-10 h-fit flex items-center justify-center ">
                    {category.services_count}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="min-h-[80vh] w-full flex items-center justify-center">
                <CiDatabase className="size-40 text-gray-400" />
              </div>
            )}
          </div>
          <div
            onClick={openToggle}
            className="w-10 h-10 xl:hidden absolute top-4 right-3 rounded-md cursor-pointer hover:bg-red-500 duration-150 hover:scale-110 shadow-md flex items-center justify-center text-white bg-red-400"
          >
            <FaTimesCircle className="size-5" />
          </div>
        </div>
      )}
    </div>
  );
}
