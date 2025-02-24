"use client";
import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { LuLoaderCircle, LuNotebookPen } from "react-icons/lu";
import Img from "../../Img";
import { FaStar } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import PaginationWithoutNumbers from "../../paginationWithOutnumbers";
import { useDataContext } from "@/app/context/DataContext";
import CheckCurrentUserPopup from "../_Auth/CheckCurrentUserPopup";

interface props {
  orgId: number;
}

export default function ReviewsContent({ orgId }: props) {
  const { language }: any = UseVariables();
  const { currentuser } = useDataContext();
  const userId = currentuser && currentuser.id;
  const [userReacts, setUserReacts] = useState<any>([]);
  const [reviewsData, setReviewsData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [checkCurrentUser, setCheckCurrentUser] = useState(false);
  const [successMessage, setSuccessMessage] = useState<any>({
    AR: "",
    EN: "",
  });
  const [errorMessage, setErrorMessage] = useState<any>({
    AR: "",
    EN: "",
  });
  // حالة لتخزين عنوان المراجعة
  const [title, setTitle] = useState("");
  // حالة لتخزين محتوى المراجعة
  const [content, setContent] = useState("");
  // حالة لتخزين عدد النجوم المختار
  const [rating, setRating] = useState(0);

  const [expandedReviews, setExpandedReviews] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const getdata = async (api: string, set: any, page: number = 1) => {
      try {
        setLoading(true);
        const response = await instance.get(`${api}?page=${page}`);
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          set(data);
          if (set == setReviewsData) {
            setCurrentPage(pagination.current_page);
            setLastPage(pagination.last_page);
          }
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (orgId) getdata(`/org-reviews/${orgId}`, setReviewsData, currentPage);
    if (orgId) getdata(`/review-like-user/${orgId}/${userId}`, setUserReacts);
  }, [orgId, userId, currentPage]);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`cursor-pointer size-6 ${
            i <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => handleStarClick(i)}
        />
      );
    }
    return stars;
  };

  // دالة لإرسال المراجعة
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage({ AR: "", EN: "" });
    setSuccessMessage({ AR: "", EN: "" });

    if (!currentuser) {
      setCheckCurrentUser(true);
      return null;
    }

    if (title.trim() == "" && content.trim() == "" && rating > 0) {
      setErrorMessage({
        AR: "الرجاء التأكد من ملئ جميع الحقول ",
        EN: "Please make sure to fill in all fields.",
      });
      return null;
    }
    try {
      const data = {
        stars: rating,
        head_line: title,
        content: content,
        user_id: userId,
        organization_id: orgId,
      };
      const response = await instance.post(`/add-review`, data);
      if (response.status == 201) {
        const data = response.data.data;
        setTitle("");
        setContent("");
        setRating(0);
        setSuccessMessage({
          AR: "شكرا على وقتك تمت إضافة مراجعتك بنجاح",
          EN: "Thank you for your time. Your review has been added successfully.",
        });
        setReviewsData([...reviewsData, { ...data, like_counts: 0 }]);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // دالة لتحديث محتوى المراجعة
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // دالة لاختيار عدد النجوم عند الضغط على النجمة
  const handleStarClick = (stars: number) => {
    setRating(stars);
  };

  const handleUnReact = async (reviewId: number) => {
    try {
      const response = await instance.delete(
        `/review-like/${reviewId}/${userId}`
      );
      if (response.status === 200) {
        // تحديث حالة التفاعل
        setUserReacts((prev: any) => prev.filter((id: any) => id !== reviewId));

        // تحديث عدد الإعجابات مباشرة
        setReviewsData((prevReviews: any) =>
          prevReviews.map((review: any) =>
            review.id === reviewId
              ? { ...review, like_counts: review.like_counts - 1 }
              : review
          )
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleReact = async (reviewId: number) => {
    try {
      const data = {
        user_id: userId,
        review_id: reviewId,
        organization_id: orgId,
      };
      const response = await instance.post(`/react-review`, data);
      if (response.status === 201) {
        const newReaction = response.data.data;
        // تحديث حالة التفاعل
        setUserReacts((prev: any) => [...prev, newReaction.review_id]);

        // تحديث عدد الإعجابات مباشرة
        setReviewsData((prevReviews: any) =>
          prevReviews.map((review: any) =>
            review.id === reviewId
              ? { ...review, like_counts: review.like_counts + 1 }
              : review
          )
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    // حساب حالة التفاعل في كل مرة يتم فيها تحديث userReacts
  }, [userReacts]);

  function formatDate(dateString: any) {
    const date = new Date(dateString); // تحويل النص إلى كائن Date
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-GB", options as any); // تنسيق التاريخ بالشكل الذي تريده
  }

  if (loading)
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-transparent flex items-center justify-center"
        >
          <LuLoaderCircle className="size-32 text-main_orange" />
        </motion.div>
      </div>
    );

  return (
    <>
      <div className="w-full  py-2">
        {reviewsData && reviewsData.length > 0 ? (
          <div className="flex w-full  h-fit flex-col gap-4 items-start">
            {reviewsData.map((review: any, index: number) => {
              const isExpanded = expandedReviews[review.id] || false;
              const isuserReact = userReacts.includes(review?.id);
              const words = review.content.split(" ");
              const isLongText = words.length > 50;
              const displayedContent = isExpanded
                ? review.content
                : words.slice(0, 50).join(" ") + (isLongText ? "..." : "");

              return (
                <div
                  key={index}
                  className="w-full border-2 shadow-md flex flex-col items-start gap-3 py-1 px-2 rounded-md"
                >
                  <h1 className="tajawal-bold my-2">{review.head_line}</h1>
                  <p style={{ overflowWrap: "anywhere" }} className="mb-3">
                    {displayedContent}
                  </p>

                  {isLongText && (
                    <button
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() => toggleExpand(review.id)}
                    >
                      {isExpanded ? "إخفاء" : "قراءة المزيد"}
                    </button>
                  )}

                  <div className="w-full border-t border-gray-300 py-2 px-4 max-md:flex-col flex items-center justify-between">
                    <div className="flex items-center gap-2 justify-between">
                      <Img
                        src={
                          review?.user?.image
                            ? review?.user?.image
                            : "/avatars/avatar_male.png"
                        }
                        className="w-8 h-8 rounded-full"
                      />
                      <p>{review?.user?.name || "Unknown User"}</p>
                      <p>{formatDate(review.created_at)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 mx-2">
                        <FaStar className="size-5" color="gold" />
                        <p>{review?.stars} of 5</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {isuserReact ? (
                          <AiFillLike
                            onClick={() => handleUnReact(review?.id)}
                            className="size-7 text-sky-400 cursor-pointer hover:scale-125 duration-200"
                          />
                        ) : (
                          <AiOutlineLike
                            onClick={() => handleReact(review?.id)}
                            className="size-7 text-gray-300 cursor-pointer hover:scale-125 duration-200"
                          />
                        )}
                        <p>{review?.like_counts}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="w-fit mx-auto">
              <PaginationWithoutNumbers
                currentPage={currentPage}
                totalPages={lastPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        ) : (
          <div className="w-full min-h-[50vh] flex items-center justify-center">
            <div className="flex items-center flex-col gap-3">
              <LuNotebookPen className="size-32 text-gray-400" />
              <p>
                {language == "EN"
                  ? "Sorry, there are no reviews for this center yet."
                  : "عفوا , لا يوجد مراجعات لهذا المركز حتى الأن"}
              </p>
            </div>
          </div>
        )}
        <div
          style={{ direction: language == "EN" ? "ltr" : "rtl" }}
          className="w-full  mx-auto p-4 border rounded-md shadow-lg"
        >
          <h2 className="text-2xl   max-md:text-lg w-fit mx-auto pb-3 border-b border-main_orange tajawal-bold mb-4">
            {language === "AR" ? "إضافة مراجعة" : "Add Review"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* حقل عنوان المراجعة */}
            <div>
              <label
                htmlFor="title"
                className="block pb-2 border-b border-sky-300 w-fit text-sm font-semibold"
              >
                {language === "AR" ? "عنوان المراجعة" : "Review Title"}
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="w-full outline-none p-2 border rounded-md mt-2"
                placeholder={
                  language === "AR"
                    ? "أدخل عنوان المراجعة"
                    : "Enter the review title"
                }
              />
            </div>

            {/* حقل محتوى المراجعة */}
            <div>
              <label
                htmlFor="content"
                className="block pb-2 border-b border-sky-300 w-fit  text-sm font-semibold"
              >
                {language === "AR" ? "محتوى المراجعة" : "Review Content"}
              </label>
              <textarea
                id="content"
                value={content}
                onChange={handleContentChange}
                className="w-full outline-none p-2 border rounded-md mt-2"
                placeholder={
                  language === "AR"
                    ? "أدخل محتوى المراجعة"
                    : "Enter the review content"
                }
                rows={4}
              />
            </div>

            {/* اختيار النجوم */}
            <div>
              <label className="block pb-2 border-b border-sky-300 w-fit text-sm font-semibold">
                {language === "AR" ? "التقييم" : "Rating"}
              </label>
              <div className="flex mt-2 gap-2">{renderStars()}</div>
            </div>

            {/* زر الإرسال */}
            <button
              type="submit"
              className="w-full p-2 bg-main_orange text-white rounded-md hover:bg-orange-300 duration-150"
            >
              {language === "AR" ? "إرسال المراجعة" : "Submit Review"}
            </button>
            {errorMessage.EN.length > 0 && (
              <p className="w-fit mx-auto text-red-400 my-4 ">
                {errorMessage[language]}
              </p>
            )}
            {successMessage.EN.length > 0 && (
              <p className="w-fit mx-auto text-green-400 my-4 ">
                {successMessage[language]}
              </p>
            )}
          </form>
        </div>
      </div>
      {checkCurrentUser && (
        <CheckCurrentUserPopup
          isOpen={checkCurrentUser}
          language={language}
          onClose={() => setCheckCurrentUser(false)}
        />
      )}
    </>
  );
}
