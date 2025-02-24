import { useDataContext } from "@/app/context/DataContext";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import Img from "../../Img";
import { FaComments, FaRegObjectUngroup } from "react-icons/fa";

export default function RandomArticlesSidebar({ length }: { length: number }) {
  const { randomArticles } = useDataContext();
  const { language } = UseVariables();
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
          {language == "EN" ? "Selected Articles" : "مقالات مرشحة"}
        </h2>
        <div className="w-full ">
          <ul className="space-y-4 w-full flex flex-col items-baseline max-xl:flex-row max-xl:flex-wrap  gap-4 justify-center max-xl:justify-start">
            {randomArticles
              .slice(0, length)
              .map((article: any, index: number) => (
                <Link
                  className="block  overflow-hidden w-full max-xl:w-[48%] max-md:w-full"
                  key={index}
                  href={`/blog/${formatTitle(article.title_en)}/?id=${
                    article.id
                  }`}
                >
                  <motion.div
                    className="relative h-[250px] w-full  bg-cover bg-center group cursor-pointer rounded-lg dark:bg-main_dash overflow-hidden"
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
                          src={
                            article.author.image
                              ? article.author.image
                              : "/logo.png"
                          }
                          className="w-[30px] h-[30px] rounded-full"
                        />
                      </div>
                      <p className="text-white font-semibold text-[12px]">
                        {article.author.name || "author name"}
                      </p>
                    </div>
                    <div className="group-hover:bottom-6 gap-4 absolute -bottom-40 left-6 duration-200">
                      <div className="content flex flex-col items-start">
                        <h2 className="text-left font-bold mb-1 text-white dark:text-white">
                          {language == "EN"
                            ? article.title_en
                            : article.title_ar}
                        </h2>
                        <h3 className="text-[12px] text-left font-semibold text-teal-400">
                          {language == "EN"
                            ? article.content_en.slice(0, 40) + "..."
                            : article.content_ar.slice(0, 40) + "..."}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2  absolute top-2 group-hover:right-3 duration-200 text-white -right-[200px]">
                      <FaComments />
                      <p>{article.comments_count}</p>
                    </div>
                    <div className="flex items-center gap-2  absolute bottom-2 group-hover:right-3 duration-200 text-white -right-[200px]">
                      <FaRegObjectUngroup />
                      <p>{article.reactions_count}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
          </ul>
        </div>
      </motion.div>
    </>
  );
}
