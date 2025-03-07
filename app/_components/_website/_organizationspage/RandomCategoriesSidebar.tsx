"use client";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Img from "../../Img";
import { FaComments, FaRegObjectUngroup } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { FcOrganization } from "react-icons/fc";
import { instance } from "@/app/Api/axios";
import { CiSettings } from "react-icons/ci";

export default function RandomCategoriesSidebar() {
  const { language } = UseVariables();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instance.get(`/get-organization-categories`);
        if (response.status == 200) {
          const data = response.data.data.categories;
          setCategories(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");
  return (
    <>
      <motion.div
        className="w-[25%] max-xl:w-full max-lg:p-2 shadow-lg bg-white dark:bg-secend_dash rounded-lg p-3  h-fit border dark:border-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl text-center text-teal-400 pb-2 border-b border-main_blue w-fit mx-auto font-semibold  dark:text-white mb-4">
          {language == "EN" ? "Browse other sections" : "تصفح أقسام أخرى"}
        </h2>
        {loading ? (
          <div className="w-full max-xl:w-full min-h-screen flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <CiSettings className="size-24 text-main_orange" />
            </motion.div>
          </div>
        ) : (
          <div className="w-full ">
            <ul className=" w-full grid grid-cols-1 max-xl:grid-cols-2 max-md:grid-cols-1 gap-y-6 gap-x-2 ">
              {categories.slice(0, 9).map((cat: any, index: number) => (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }} // تأخير بنا���� على الترتيب
                  key={index}
                  className="w-full h-[300px] group rounded-t-md hover:scale-105 hover:border-main_orange duration-200 border-transparent  border shadow-md"
                >
                  <Link
                    href={`/organizationsbycategory/${cat?.title_en}?category_id=${cat.id}`}
                    className="w-full h-full outline-none     flex flex-col "
                  >
                    <div className="flex-1 bg-main_orange group-hover:bg-gray-100 dark:group-hover:bg-gray-600 duration-200 cursor-pointer rounded-t-md flex items-center justify-center">
                      <Img
                        src={cat.image ? cat.image : "/logo.png"}
                        className="w-20 h-20 object-contain group-hover:scale-150 duration-200"
                      />
                    </div>
                    <div className="py-2 px-1 border-t border-t-transparent group-hover:border-main_orange duration-200 dark:bg-secend_dash">
                      <div className="flex items-center gap-3 my-2">
                        <BiCategory className="size-5 text-main_red" />
                        <p className="dark:text-white">
                          {language == "EN" ? cat.title_en : cat.title_ar}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 my-2 ">
                        <FcOrganization className="size-5 " />
                        <div className="dark:text-white flex items-center gap-2">
                          <p>
                            {language == "EN"
                              ? "Organizations Number :"
                              : "عدد المنطمات المصنفة : "}
                          </p>
                          <span>{cat.organizations_count}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </>
  );
}
