"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { UseVariables } from "@/app/context/VariablesContext";
import Img from "../../Img";
import { useDataContext } from "@/app/context/DataContext";
import { motion } from "framer-motion";
import Separator from "../Separator";

const BlogSlider = () => {
  const { language } = UseVariables();
  const { activeArticles } = useDataContext();

  // تأثيرات Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // تأخير ظهور العناصر الفرعية
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <Separator
        bg_dark="dark:bg-main_dash"
        text={language == "EN" ? "Aram Articles" : "مقالات آرام"}
      />
      <motion.div
        className="w-[90%] max-xl:w-full max-xl:flex-col flex items-start justify-between px-4 py-10 sm:px-6  lg:py-14 mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* الجزء الأيسر (النصوص والأزرار) */}
        <motion.div
          className="w-full flex justify-between max-xl:items-center flex-col "
          variants={itemVariants}
        >
          <div
            className={`block ${
              language === "EN" ? "text-left" : "text-right"
            } max-xl:text-center`}
          >
            <div
              style={{ overflowWrap: "anywhere" }}
              className="flex items-baseline text-4xl"
            >
              <motion.h2
                className="font-bold cursor-pointer text-gray-900 dark:text-secend_text leading-[3.25rem] mb-5"
                variants={itemVariants}
              >
                {language === "EN"
                  ? "Discover the Latest Innovations at Aram"
                  : "اكتشف أحدث الابتكارات في آرام"}
              </motion.h2>
            </div>
            <motion.p
              className="text-gray-500 cursor-pointer mb-10 w-fit"
              variants={itemVariants}
            >
              {language === "EN"
                ? "Stay updated with our latest articles and news about technology, innovation, and industry trends."
                : "ابقَ على اطلاع بأحدث مقالاتنا وأخبارنا حول التكنولوجيا والابتكارات واتجاهات الصناعة."}
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                href="/blog"
                className="cursor-pointer max-xl:w-fit dark:hover:text-black  border border-gray-300 shadow-sm rounded-full py-3.5 px-7 w-52 lg:mx-0 mx-auto flex justify-center text-gray-900 dark:text-white dark:hover:text-main_text font-semibold transition-all duration-300 hover:bg-gray-100"
              >
                {language === "EN" ? "View All" : "شاهد الكل"}
              </Link>
            </motion.div>
          </div>
          <motion.div
            className=" relative h-[10vh] w-1/4 items-center flex mx-auto  max-md:h-[8vh] lg:mt-0 mt-16"
            variants={itemVariants}
          >
            <button
              id="slider-button-left"
              className="swiper-button-prev group   w-11 h-11 transition-all duration-500 rounded-full"
            ></button>
            <button
              id="slider-button-right"
              className="swiper-button-next group  w-11 h-11 transition-all duration-500 rounded-full"
            ></button>
          </motion.div>
        </motion.div>

        {/* الجزء الأيمن (Swiper) */}
        <motion.div
          style={{ direction: "ltr" }}
          className="xl:w-3/5 max-xl:w-full"
          variants={itemVariants}
        >
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: "#slider-button-left",
              nextEl: "#slider-button-right",
            }}
            modules={[Navigation]}
          >
            {activeArticles &&
              activeArticles.length > 0 &&
              activeArticles.map((post: any) => (
                <SwiperSlide
                  className="rounded-md dark:bg-secend_dash"
                  key={post.id}
                >
                  <Link
                    className="group relative block rounded-xl focus:outline-none"
                    href={`/blog/${post.id}`}
                  >
                    <motion.div
                      className="shrink-0 relative rounded-xl overflow-hidden w-full h-[350px] before:absolute before:inset-x-0 before:z-[1] before:size-full before:bg-gradient-to-t before:from-gray-900/70"
                      whileHover={{ scale: 1.02 }} // تأثير تكبير عند التمرير
                      transition={{ duration: 0.3 }}
                    >
                      <Img
                        className="size-full absolute top-0 start-0 object-cover"
                        src={post.image || "/portfoliosection/1.jpg"}
                      />
                    </motion.div>
                    <div className="absolute top-0 inset-x-0 z-10">
                      <div className="p-4 flex flex-col h-full sm:p-6">
                        <div className="flex items-center">
                          <div className="shrink-0 bg-white/50 rounded-full">
                            <Img
                              className="size-[46px] border-2 border-white rounded-full"
                              src={
                                post.author.image
                                  ? post.author.icon
                                    ? post.author.icon
                                    : post.author.image
                                  : "/logo.png"
                              }
                            />
                          </div>
                          <div className="ms-2.5 sm:ms-4">
                            <h4 className="font-semibold text-white">
                              {post.author.name
                                ? post.author.name
                                : post.author.title_en || "unKnow author"}
                            </h4>
                            <p className="text-xs text-white/80">
                              {format(new Date(post.created_at), "PPpp") ||
                                "Unknow date"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 z-10">
                      <div className="flex flex-col h-full p-4 sm:p-6">
                        <h3 className="text-lg sm:text-3xl font-semibold text-white group-hover:text-white/80 group-focus:text-white/80">
                          {language == "EN" ? post.title_en : post.title_ar}
                        </h3>
                        <p className="mt-2 text-white/80">
                          {language == "EN"
                            ? post.content_en.substring(0, 100)
                            : post.content_ar.substring(0, 100)}
                          ...
                        </p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
          </Swiper>
        </motion.div>
      </motion.div>
    </>
  );
};

export default BlogSlider;
