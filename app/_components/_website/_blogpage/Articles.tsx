"use client";
import { useEffect, useState } from "react";
import React from "react";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import Separator from "../Separator";
import { motion } from "framer-motion";
import Link from "next/link";
import { instance } from "@/app/Api/axios";
import Loading from "../../Loading";
import Pagination from "../../PaginationComponent";
import Footer from "../Footer";
import { FaComments, FaRegObjectUngroup, FaSadTear } from "react-icons/fa";
import { MdArticle, MdOutlineContentPasteSearch } from "react-icons/md";
import { LuSearchCode } from "react-icons/lu";
import SearchArticles from "./SearchArticles";

interface ArticleType {
  id: number;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  views: string;
  likes: string;
  published_at: string;
  comments_count: number;
  reactions_count: number;
  image: string;
  author: {
    image: string;
    name: string;
  };
  category: {
    title_en: string;
    title_ar: string;
  };
}

interface CategoryType {
  id: number; // إضافة id للتصنيفات
  title_en: string;
  title_ar: string;
  image: string;
}

export default function Articles() {
  const { language }: any = UseVariables();

  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showSearchpopup, setShowSearchpopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredArticles, setFilteredArticles] = useState<ArticleType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const getData = async (page: number) => {
      try {
        setLoading(true);
        const response = await instance.get("/articals", {
          params: { page },
        });
        const data: ArticleType[] = response.data.data;
        const pagination = response.data.pagination;
        setArticles(data);
        setFilteredArticles(data);
        setCurrentPage(pagination.current_page);
        setLastPage(pagination.last_page);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const getCategories = async () => {
      try {
        setLoading(true);
        const response = await instance.get("/artical-categories");
        setCategories(response.data.data);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getData(currentPage);
    getCategories();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const filterArticles = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      if (category === "All") {
        // عرض جميع المقالات
        const response = await instance.get("/articals", {
          params: { page: currentPage },
        });
        setFilteredArticles(response.data.data);
      } else {
        // جلب المقالات بناءً على التصنيف
        const categoryId = categories.find(
          (cat) => cat.title_en === category
        )?.id;
        if (categoryId) {
          const response = await instance.get(
            `/get-articles-by-category/${categoryId}`
          );
          setFilteredArticles(response.data.data);
        }
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  if (loading) return <Loading />;

  return (
    <>
      <Separator
        bg_dark="dark:bg-secend_dash"
        text={language === "EN" ? "All Articles" : "جميع المقالات"}
      />

      {/* Filter Section */}
      <div className="flex items-center flex-wrap justify-center gap-4 mt-4">
        <button
          onClick={() => setShowSearchpopup((prev) => !prev)}
          className={`px-4 py-2 rounded-md font-semibold text-sm bg-gray-200 text-gray-800 hover:bg-main_orange hover:text-white transition duration-300`}
        >
          <MdOutlineContentPasteSearch className="size-6 " />
        </button>
        <button
          onClick={() => filterArticles("All")}
          className={`px-4 py-2 rounded-md font-semibold text-sm ${
            selectedCategory === "All"
              ? "bg-main_orange text-white"
              : "bg-gray-200 text-gray-800"
          } hover:bg-main_orange hover:text-white transition duration-300`}
        >
          {language === "EN" ? "All" : "الكل"}
        </button>
        {categories.slice(0, 12).map((category, index) => (
          <button
            key={index}
            onClick={() => filterArticles(category.title_en)}
            className={`px-4 py-2 rounded-md font-semibold text-sm ${
              selectedCategory === category.title_en
                ? "bg-main_orange text-white"
                : "bg-gray-200 text-gray-800"
            } hover:bg-main_orange hover:text-white transition duration-300`}
          >
            {language === "EN" ? category.title_en : category.title_ar}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="w-[95%] mx-auto grid grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2 gap-4 justify-items-center mt-4">
          {filteredArticles.map((article, index) => (
            <Link
              className="h-[450px] w-full"
              key={index}
              href={`/blog/${formatTitle(article.title_en)}/?id=${article.id}`}
            >
              <motion.div
                className="relative w-full h-full bg-cover bg-center group cursor-pointer rounded-lg dark:bg-main_dash overflow-hidden"
                style={{ backgroundImage: `url(${article.image})` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>

                {/* Content */}
                <div className="flex items-center gap-3 absolute -top-40 left-4 duration-200 group-hover:top-3">
                  <div className="flex items-center justify-center w-[32px] h-[32px] border bg-gray-100 rounded-full">
                    <Img
                      src={article.author.image || "/logo.png"}
                      className="w-[30px] h-[30px] rounded-full"
                    />
                  </div>
                  <p className="text-white font-semibold text-[12px]">
                    {article.author.name}
                  </p>
                </div>
                <div className="group-hover:bottom-6 gap-4 absolute -bottom-40 left-6 duration-200">
                  <div className="content flex flex-col items-start">
                    <h2 className="text-left font-bold mb-1 text-white dark:text-white">
                      {language === "EN" ? article.title_en : article.title_ar}
                    </h2>
                    <h3 className="text-[12px] text-left font-semibold text-teal-400">
                      {language === "EN"
                        ? article.content_en.slice(0, 50) + "..."
                        : article.content_ar.slice(0, 50) + "..."}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 absolute top-2 group-hover:right-3 duration-200 text-white -right-[200px]">
                  <FaComments />
                  <p>{article.comments_count}</p>
                </div>
                <div className="flex items-center gap-2 absolute bottom-2 group-hover:right-3 duration-200 text-white -right-[200px]">
                  <FaRegObjectUngroup />
                  <p>{article.reactions_count || 0}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      ) : (
        // جزء عدم وجود مقالات
        <motion.div
          className="w-full h-[80vh] flex flex-col items-center justify-center dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex flex-col items-center justify-center gap-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaSadTear className="text-6xl text-main_orange" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {language === "EN"
                ? "No Articles Found"
                : "لم يتم العثور على مقالات"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {language === "EN"
                ? "Sorry, there are no articles available for this category."
                : "عذرًا، لا توجد مقالات متاحة لهذا التصنيف."}
            </p>
            <button
              onClick={() => filterArticles("All")}
              className="mt-4 px-6 py-2 bg-main_orange text-white rounded-lg hover:bg-orange-600 transition duration-300"
            >
              {language === "EN" ? "View All Articles" : "عرض جميع المقالات"}
            </button>
          </motion.div>
        </motion.div>
      )}

      <SearchArticles
        onClose={() => setShowSearchpopup((prev) => !prev)}
        showState={showSearchpopup}
      />

      {/* Pagination */}
      {filteredArticles.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
