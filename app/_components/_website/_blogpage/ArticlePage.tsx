"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaHeart,
  FaLaugh,
  FaComments,
  FaRegObjectUngroup,
} from "react-icons/fa";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import { instance } from "@/app/Api/axios";
import { formatDistanceToNow } from "date-fns";
import Loading from "../../Loading";
import Footer from "../Footer";
import { useDataContext } from "@/app/context/DataContext";
import CheckCurrentUserPopup from "../_Auth/CheckCurrentUserPopup";
import PaginationWithoutNumbers from "../../paginationWithOutnumbers";
import RandomArticlesSidebar from "./RandomArticlesSidebar";

interface articleType {
  id: number;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  views: number;
  reactions_count: number;
  comments_count: number;
  published_at: string;
  created_at: string;
  image: string;
  author: {
    name: string;
    image: string;
    icon: string;
    title_en: string;
  };
}

interface reactions {
  likes: number;
  dislikes: number;
  loves: number;
  laughs: number;
}

interface commentType {
  id: number;
  content: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    image: string;
    icon: string;
    title_en: string;
  };
}

export default function ArticlePage({ id }: { id: number }) {
  const { language } = UseVariables();
  const { currentuser, type } = useDataContext();
  const userId = currentuser && currentuser.id && currentuser.id;
  const [article, setArticle] = useState<articleType>({
    id: 0,
    title_ar: "",
    title_en: "",
    content_ar: "",
    content_en: "",
    views: 0,
    comments_count: 0,
    reactions_count: 0,
    published_at: "",
    created_at: "",
    image: "",
    author: {
      name: "",
      image: "",
      icon: "",
      title_en: "",
    },
  });
  const [reactions, setReactions] = useState<any>({
    likes: 0,
    dislikes: 0,
    loves: 0,
    laughs: 0,
  });

  const [comments, setComments] = useState<commentType[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [userReaction, setUserReaction] = useState<string | null>(null); // Track the user's reaction
  const [loading, setLoading] = useState<boolean>(true);
  const [checkUser, setCheckUser] = useState<boolean>(false);
  const [currentPgae, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const handlePageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const handleAddComment = async () => {
    try {
      if (!currentuser) {
        setCheckUser(true);
        return;
      }

      const data = {
        article_id: id,
        user_id: userId,
        user_type: type,
        content: newComment,
      };
      const response = await instance.post("/add-comment", data);
      console.log(response);
      if (newComment.trim()) {
        setComments((prev: any) => [
          {
            id: 3,
            content: newComment,
            created_at: Date.now(),
            user: {
              name: currentuser.name ? currentuser.name : currentuser.title_en,
              image: currentuser.icon ? currentuser.icon : currentuser.image,
              email: currentuser.email,
            },
          },
          ...prev,
        ]);
        setNewComment("");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleAddReaction = async (reactionType: string) => {
    try {
      if (!userId) {
        setCheckUser(true);
        return;
      }

      if (userReaction) {
        // إذا كان هناك تفاعل سابق من المستخدم، قم بحذفه أولًا
        await handleremoveReaction(userReaction);
      }

      // بعد إزالة التفاعل القديم (إن وجد)، أضف التفاعل الجديد
      const data = {
        article_id: id,
        user_id: currentuser.id,
        reaction_type: reactionType,
      };

      const response = await instance.post(`/articles/${id}/reactions`, data);

      if (response.status === 201) {
        // تغيير 200 إلى 201
        setReactions((prevReactions: any) => ({
          ...prevReactions,
          [`${reactionType}s`]: prevReactions[`${reactionType}s`] + 1, // استخدام "_count" بدلًا من "s"
        }));
        setUserReaction(reactionType); // تعيين التفاعل الحالي للمستخدم
      }
    } catch (error: any) {
      console.error("Failed to add reaction:", error);
    }
  };

  const handleremoveReaction = async (reactionType: string) => {
    if (!currentuser) {
      setCheckUser(true);
    }

    try {
      const data = {
        article_id: id,
        user_id: currentuser.id,
      };
      const response = await instance.delete(`/articles/${id}/reactions`, {
        data,
      });
      if (response.status === 200) {
        setReactions((prevReactions: any) => ({
          ...prevReactions,
          [`${reactionType}s`]: prevReactions[`${reactionType}s`] - 1, // استخدام "_count" بدلًا من "s"
        }));
        setUserReaction(null); // Remove the user's reaction
      }
    } catch (error: any) {
      console.error("Failed to remove reaction:", error);
    }
  };

  const reacttoggle = (reactionType: string) => {
    if (userReaction === reactionType) {
      handleremoveReaction(reactionType);
    } else {
      handleAddReaction(reactionType);
    }
  };

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await instance.get(`/artical/${id}`);
        if (response.status == 200) {
          const data = response.data.data;
          const reactions = data.reaction_count;
          setArticle(data.blog);
          setReactions({
            likes: reactions.likes,
            dislikes: reactions.dislikes,
            loves: reactions.loves,
            laughs: reactions.laughs,
          });
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const getuserreaction = async () => {
      try {
        const response = await instance.get(
          `/articles/${id}/reactions/${userId}`
        );
        if (response.status == 200) {
          const user = response.data.user;
          setUserReaction(user.reaction_type);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    const getComments = async (page: number) => {
      try {
        const response = await instance.get(`/get-comments/${id}?page=${page}`);
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setComments(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    getComments(currentPgae);
    userId && getuserreaction();
    getdata();
  }, [userId, currentPgae]);

  const backegroundsIcons =
    userReaction == "like"
      ? "bg-sky-400"
      : userReaction == "love"
      ? "bg-red-400"
      : userReaction == "dislike"
      ? "bg-gray-400"
      : userReaction == "laugh"
      ? "bg-main_orange"
      : "bg-red-800";

  const reactIcons = [
    { icon: <FaThumbsUp />, type: "like", hovercolor: "hover:bg-sky-400" },
    { icon: <FaHeart />, type: "love", hovercolor: "hover:bg-red-400" },
    {
      icon: <FaThumbsDown />,
      type: "dislike",
      hovercolor: "hover:bg-gray-400",
    },
    { icon: <FaLaugh />, type: "laugh", hovercolor: "hover:bg-main_orange" },
  ];

  const extractWords = (
    text: string,
    startWordIndex: number,
    wordLimit: number
  ) => {
    const words = text.split(" ");
    if (startWordIndex >= words.length) {
      return "";
    }
    const extractedWords = words.slice(
      startWordIndex,
      startWordIndex + wordLimit
    );
    return extractedWords.join(" ");
  };

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  if (loading) return <Loading />;

  return (
    <>
      <div className="bg-gray-50 py-3 dark:bg-gray-800 mt-16">
        <div className=" mx-auto  flex items-start justify-between max-xl:flex-col w-full gap-4 pt-4 px-3 max-md:px-1">
          {/* المقال الرئيسي */}
          <motion.div
            style={{ direction: language == "EN" ? "ltr" : "rtl" }}
            className="flex-1 flex-grow bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-md:p-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* صورة المقال */}
            <div className="relative mb-6">
              <Img
                src={article.image ? article.image : "/services/service_1.jpg"}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* العنوان و تفاصيل المقال */}
            <div className="text-center text-white">
              <h1 className="text-4xl max-md:text-2xl pb-2 border-b border-main_orange w-fit mx-auto font-bold text-gray-900 dark:text-white mb-2">
                {language == "EN" ? article.title_en : article.title_ar}
              </h1>
              <p className="text-md text-gray-600 border-b border-green-300 pb-2 w-fit mx-auto dark:text-gray-300 mb-4">
                By{" "}
                <span className="font-semibold text-teal-400">
                  {article.author && article.author.name}
                </span>{" "}
                |{" "}
                {article.created_at
                  ? formatDistanceToNow(new Date(article.created_at), {
                      addSuffix: true,
                    })
                  : "Not available"}
              </p>
            </div>

            {/* محتوى المقال */}
            <motion.div
              className="prose lg:prose-xl dark:prose-invert mt-6"
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-gray-500 ">
                {language == "EN"
                  ? extractWords(article.content_en, 0, 30)
                  : extractWords(article.content_ar, 0, 30)}
              </p>
              <p className="text-gray-500">
                {language == "EN"
                  ? extractWords(article.content_en, 30, 60)
                  : extractWords(article.content_ar, 30, 60)}
              </p>
              <p className="text-gray-500">
                {language == "EN"
                  ? extractWords(article.content_en, 60, 50000)
                  : extractWords(article.content_ar, 60, 50000)}
              </p>
            </motion.div>

            {/* ردود الفعل */}
            <div className="mt-8">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center flex-wrap max-md:justify-center gap-6">
                  {reactIcons.map((icon, index) => {
                    return (
                      <motion.button
                        onClick={() => reacttoggle(icon.type)}
                        key={index}
                        className="p-3 text-xl outline-none"
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div
                            className={`icon outline-none rounded-full ${
                              icon.hovercolor
                            } hover:text-white  duration-200 ${
                              userReaction == icon.type
                                ? ` text-white  ${backegroundsIcons} `
                                : " text-gray-400 "
                            }   w-12 h-12 flex items-center justify-center`}
                          >
                            {icon.icon}
                          </div>
                          <p className="text-center dark:text-white font-extralight text-sm">
                            {reactions[`${icon.type}s`]}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* التعليقات */}
            <div className="mt-10">
              <h3 className="text-lg font-light text-gray-900 pb-2 border-b border-main_red w-fit text-md  dark:text-white mb-4">
                {language == "EN" ? "Comments:" : "التعليقات"}
              </h3>
              <div className="  mb-6">
                <textarea
                  className="w-full p-3 outline-none border rounded-md dark:bg-gray-800 dark:text-white"
                  placeholder="Add your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="w-fit ml-auto">
                  <motion.button
                    className="bg-teal-500 w-fit text-white px-4 py-2 rounded-md hover:bg-teal-600"
                    onClick={handleAddComment}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {language == "EN" ? "Add" : "تعليق"}
                  </motion.button>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-4 bg-gray-100 dark:bg-secend_dash rounded-sm min-h-screen">
                  <div className="space-y-6">
                    {comments &&
                      comments.length > 0 &&
                      comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="bg-white dark:bg-main_dash dark:text-white shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                              {(comment.user && comment.user.image) ||
                              comment.user.icon ? (
                                <Img
                                  src={
                                    comment.user.icon
                                      ? comment.user.icon
                                      : comment.user.image
                                  }
                                  className="w-full h-full rounded-full"
                                />
                              ) : comment.user.name ? (
                                comment.user.name[0].toUpperCase()
                              ) : (
                                comment.user.title_en[0].toUpperCase()
                              )}
                            </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-semibold text-gray-800 dark:text-secend_text">
                                {comment.user.name}
                              </h4>
                            </div>
                          </div>
                          <p
                            style={{ overflowWrap: "anywhere" }}
                            className="text-gray-700 dark:text-white text-base mb-4"
                          >
                            {comment.content}
                          </p>
                          <div className="text-sm text-gray-500">
                            <p
                              style={{ direction: "ltr" }}
                              className="text-left "
                            >
                              {comment.created_at
                                ? formatDistanceToNow(
                                    new Date(comment.created_at),
                                    { addSuffix: true }
                                  )
                                : "Not available"}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                  {comments.length > 8 && (
                    <PaginationWithoutNumbers
                      currentPage={currentPgae}
                      totalPages={lastPage}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* القسم الجانبي */}
          <RandomArticlesSidebar length={6} />
        </div>
      </div>

      <CheckCurrentUserPopup
        isOpen={checkUser}
        onClose={() => setCheckUser((prev) => !prev)}
        language={language}
      />
    </>
  );
}
