"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import Img from "../Img";
import Link from "next/link";
import { UseVariables } from "@/app/context/VariablesContext";

export default function Sidebar(): JSX.Element {
  const { showsidebar }: any = UseVariables();
  // const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  // بيانات الصفحات (العنوان + الصورة)
  const pages = [
    {
      title: "الرئيسية",
      image: "/dashboard/dashboard.png",
      to: "#",
      minilinks: [
        {
          title: "تحديد قسم الواجهة",
          image: "/dashboard/activeview.png",
          to: "/dashboard/activesection",
        },
        {
          title: "قسم الفيديو",
          image: "/dashboard/video.png",
          to: "/dashboard/videodash",
        },
        {
          title: "الجزء التعريفى",
          image: "/logo.png",
          to: "/dashboard/aboutsection",
        },
        {
          title: "البطاقات المختارة",
          image: "/dashboard/cards.png",
          to: "/dashboard/selectedcards",
        },
        {
          title: "المقالات المختارة",
          image: "/dashboard/blog.png",
          to: "/dashboard/selectedarticals",
        },
        {
          title: "المنظمات المختارة",
          image: "/dashboard/orgs.png",
          to: "/dashboard/selectedorganizations",
        },
      ],
    },

    {
      title: "الشرائح",
      image: "/dashboard/services-slider.png",
      to: "#",
      minilinks: [
        {
          title: "كل الشرائح",
          image: "/dashboard/teamwork.png",
          to: "/dashboard/sliders",
        },
        {
          title: "أضف شريحة جديدة",
          image: "/dashboard/add.png",
          to: "/dashboard/addslider",
        },
      ],
    },
    {
      title: "المستخدمون",
      image: "/dashboard/group.png",
      to: "#",
      minilinks: [
        {
          title: "جميع المستخدمون",
          image: "/dashboard/users.png",
          to: "/dashboard/users",
        },
        {
          title: "أضف مستخدم جديد",
          image: "/dashboard/add-group.png",
          to: "/dashboard/adduser",
        },
      ],
    },
    {
      title: "الخدمات",
      image: "/dashboard/services.png",
      to: "#",
      minilinks: [
        {
          title: "جميع الخدمات",
          image: "/dashboard/services-2.png",
          to: "/dashboard/services",
        },
        {
          title: "أقسام الخدمات",
          image: "/dashboard/layers.png",
          to: "/dashboard/servicecategories",
        },
        {
          title: "أضف قسم جديد",
          image: "/dashboard/layer.png",
          to: "/dashboard/addservicecategory",
        },
        {
          title: "أضف خدمة جديدة",
          image: "/dashboard/add.png",
          to: "/dashboard/addservice",
        },
      ],
    },
    {
      title: "الخدمات التابعة",
      image: "/dashboard/affiliate-services.png",
      to: "#",
      minilinks: [
        {
          title: "جميع الخدمات",
          image: "/dashboard/gear.png",
          to: "/dashboard/affiliateservices",
        },
        {
          title: "أضف خدمة جديدة",
          image: "/dashboard/add.png",
          to: "/dashboard/addservice",
        },
      ],
    },
    {
      title: "البطاقات",
      image: "/dashboard/cards.png",
      to: "#",
      minilinks: [
        {
          title: "أقسام البطاقات",
          image: "/dashboard/genre.png",
          to: "/dashboard/cardcategories",
        },
        {
          title: "أضف قسم جديد ",
          image: "/dashboard/add.png",
          to: "/dashboard/addcardcategory",
        },
        {
          title: "جميع البطاقات",
          image: "/dashboard/cards.png",
          to: "/dashboard/cards",
        },
        {
          title: "أضف بطاقة جديدة",
          image: "/dashboard/addcard.png",
          to: "/dashboard/addcard",
        },
      ],
    },
    {
      title: "المراكز",
      image: "/dashboard/orgs.png",
      to: "#",
      minilinks: [
        {
          title: "جميع المراكز",
          image: "/dashboard/orgs.png",
          to: "/dashboard/organizations",
        },
        {
          title: "إتفاقيات المراكز",
          image: "/dashboard/orgs.png",
          to: "/dashboard/orgsWithcooperationfiles",
        },
        {
          title: "أضف مركز جديدة",
          image: "/dashboard/add.png",
          to: "/dashboard/addorganization",
        },
      ],
    },
    {
      title: "عروض وخصومات المراكز",
      image: "/dashboard/offer.png",
      to: "#",
      minilinks: [
        {
          title: "جميع العروض",
          image: "/dashboard/discount.png",
          to: "/dashboard/couponsoffers",
        },
        {
          title: "أضف عرض جديدة",
          image: "/dashboard/add.png",
          to: "/dashboard/addoffer",
        },
      ],
    },
    {
      title: "كوبونات المستخدمين ",
      image: "/dashboard/voucher.png",
      to: "#",
      minilinks: [
        {
          title: "جميع الكوبونات",
          image: "/dashboard/gift-card.png",
          to: "/dashboard/coupons",
        },
        {
          title: "إرسال كوبون",
          image: "/dashboard/paper-plane.png",
          to: "/dashboard/sendcoupon",
        },
        {
          title: "أضف كوبون جديدة",
          image: "/dashboard/add.png",
          to: "/dashboard/addcoupon",
        },
      ],
    },
    {
      title: "الإشعارات",
      image: "/dashboard/notification.png",
      to: "#",
      minilinks: [
        {
          title: "مستخدم",
          image: "/dashboard/add-group.png",
          to: "/dashboard/usernotification",
        },
        {
          title: "مركز",
          image: "/dashboard/orgs.png",
          to: "/dashboard/orgnotification",
        },
      ],
    },
    {
      title: "المدونة",
      image: "/dashboard/blog.png",
      to: "#",
      minilinks: [
        {
          title: "المقالات",
          image: "/dashboard/addblog.png",
          to: "/dashboard/articals",
        },
        {
          title: "أقسام المقالات",
          image: "/dashboard/layers.png",
          to: "/dashboard/articalservices",
        },
        {
          title: "أضف قسم جديد",
          image: "/dashboard/add.png",
          to: "/dashboard/addarticalcategory",
        },
        {
          title: "أضف مقال جديدة",
          image: "/dashboard/artical.png",
          to: "/dashboard/addartical",
        },
      ],
    },
    {
      title: "صفحات الأحكام والخصوصية",
      image: "/dashboard/privacy-policy.png",
      to: "#",
      minilinks: [
        {
          title: "سياسية الخصوصية للمستخديمن",
          image: "/dashboard/group-2.png",
          to: "/dashboard/privacypolicyusers",
        },
        {
          title: "الشروط والأحكام للمستخديمن",
          image: "/dashboard/group-3.png",
          to: "/dashboard/termsconditionsusers",
        },
        {
          title: "سياسية الخصوصية للمراكز",
          image: "/dashboard/center-1.png",
          to: "/dashboard/privacypolicyorganization",
        },
        {
          title: "الشروط والأحكام للمراكز",
          image: "/dashboard/center-2.png",
          to: "/dashboard/termsconditionsorganization",
        },
        {
          title: "شروط إتفاقية التعاون للمراكز",
          image: "/dashboard/cooperate.png",
          to: "/dashboard/cooperateorganizations",
        },
      ],
    },

    {
      title: "طلبات سحب الرصيد",
      image: "/dashboard/money.png",
      to: "/dashboard/withdrawbalancerequestes",
    },
    {
      title: "التقارير",
      image: "/dashboard/report.png",
      to: "/dashboard",
    },
    {
      title: "حسابات التواصل الإجتماعى",
      image: "/dashboard/social-media.png",
      to: "/dashboard/socialcontactinfo",
    },
    {
      title: "تفاصيل الشركة",
      image: "/logo.png",
      to: "/dashboard/companydetailes",
    },
    {
      title: "قسم الشكاوى",
      image: "/dashboard/customer-service.png",
      to: "/dashboard/problems",
    },
    {
      title: "قسم الأسئلة الشائعه",
      image: "/dashboard/who.png",
      to: "/dashboard/FAQ",
    },
    {
      title: "قسم النشرة البريدية",
      image: "/dashboard/newsletter.png",
      to: "/dashboard/newsletter",
    },
    {
      title: "روابط نهاية الموقع",
      image: "/dashboard/footer.png",
      to: "/dashboard/footerdash",
    },
  ];

  // حركة Framer Motion للفتح والإغلاق
  // const sidebarVariants = {
  //   open: {
  //     width: "250px",
  //     transition: { duration: 0.5 },
  //   },
  //   closed: {
  //     width: "60px",
  //     transition: { duration: 0.5 },
  //   },
  // };

  // حركة Framer Motion للقوائم الفرعية
  const dropdownVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.4 },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.4 },
    },
  };

  const toggleDropdown = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <>
      {/* الشريط الجانبي */}
      <AnimatePresence>
        {showsidebar && (
          <motion.div
            className="bg-gray-800  dark:bg-secend_dash  shadow-sky-400 text-white h-screen hidden-scrollbar   z-[999999] fixed top-0 left-0  overflow-y-auto shadow-lg flex flex-col"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* روابط الصفحات */}
            <ul className="mt-4">
              {pages.map((page, index) => (
                <li key={index} className="relative">
                  <div
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 duration-150 cursor-pointer"
                  >
                    {/* صورة الصفحة */}
                    <Img src={page.image} className="w-7 " />
                    {/* اسم الصفحة */}
                    {
                      <Link
                        href={page.to}
                        className="text-sm flex-1 hover:text-main_blue duration-150"
                      >
                        {page.title}
                      </Link>
                    }
                    {/* أيقونة dropdown */}
                    {page.minilinks && page.minilinks.length > 0 && (
                      <FaChevronDown
                        className={`w-3 h-3 transition-transform ${
                          expanded[index] ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    )}
                  </div>
                  {/* روابط الفرعية */}
                  <motion.ul
                    initial="closed"
                    animate={expanded[index] ? "open" : "closed"}
                    variants={dropdownVariants}
                    className="ml-8 overflow-hidden"
                  >
                    {page.minilinks?.map((link, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={link.to}
                          className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 cursor-pointer"
                        >
                          <Img src={link.image} className="w-5" />
                          <span className="text-sm whitespace-nowrap">
                            {link.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
