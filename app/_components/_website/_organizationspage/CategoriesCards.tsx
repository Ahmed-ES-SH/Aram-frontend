"use client";
import { UseVariables } from "@/app/context/VariablesContext";
import React, { useEffect, useState } from "react";
import Separator from "../Separator";
import { useDataContext } from "@/app/context/DataContext";
import Img from "../../Img";
import { BiCategory } from "react-icons/bi";
import { instance } from "@/app/Api/axios";
import { FcOrganization } from "react-icons/fc";
import Pagination from "../../PaginationComponent";
import Loading from "../../Loading";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CategoriesCards() {
  const { language } = UseVariables();

  const [Categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const fetchCategories = async (page: number) => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/get-organization-categories?page=${page}`
        );
        if (response.status == 200) {
          const data = response.data.data.categories;
          const pagination = response.data.data.pagination;
          setCategories(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories(currentPage);
  }, [currentPage]);


  

  if (loading) return <Loading />;

  return (
    <>
      <div
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        className="mt-20 min-h-screen w-full"
      >
        <Separator
          bg_dark="dark:bg-main_dash"
          text={language === "EN" ? "Aram Organizations" : "منظمات آرام"}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center head">
          <h1 className="pb-2 border-b border-b-main_orange w-fit lg:whitespace-nowrap mx-auto text-center font-manrope font-bold max-sm:text-lg text-3xl text-gray-900 dark:text-secend_text mb-5 md:text-4xl md:leading-normal">
            {language === "EN"
              ? "Explore Categories and Connect with"
              : "استكشف الأقسام وتواصل مع"}
            <span className="text-main_orange">
              {language === "EN"
                ? " Partner Organizations"
                : " المنظمات الشريكة"}
            </span>
          </h1>
        </div>

        {Categories && Categories.length > 0 ? (
          <div className="w-full px-6 max-md:px-2 py-2 grid grid-cols-4 justify-items-center max-lg:grid-cols-2 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-y-6 gap-x-4 ">
            {Categories.map((cat: any, index: number) => (
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
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={lastPage}
        onPageChange={handlePageChange}
      />
    </>
  );
}
