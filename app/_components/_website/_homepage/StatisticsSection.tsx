"use client";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  FaChartLine,
  FaUsers,
  FaProjectDiagram,
  FaSmile,
} from "react-icons/fa";

const StatisticsSection = () => {
  const { language } = UseVariables();
  // بيانات الإحصائيات
  const stats = [
    {
      icon: <FaUsers className="w-12 h-12 text-main_orange" />,
      value: 10000, // 10K+
      label: language === "EN" ? "Happy Clients" : "عملاء سعداء",
    },
    {
      icon: <FaProjectDiagram className="w-12 h-12 text-main_orange" />,
      value: 500, // 500+
      label: language === "EN" ? "Projects Completed" : "مشاريع مكتملة",
    },
    {
      icon: <FaChartLine className="w-12 h-12 text-main_orange" />,
      value: 95, // 95%
      label: language === "EN" ? "Customer Satisfaction" : "رضا العملاء",
    },
    {
      icon: <FaSmile className="w-12 h-12 text-main_orange" />,
      value: 50, // 50+
      label: language === "EN" ? "Team Members" : "أعضاء الفريق",
    },
  ];

  // دالة لزيادة الأرقام تدريجيًا
  const Counter = ({
    from,
    to,
    duration,
  }: {
    from: number;
    to: number;
    duration: number;
  }) => {
    const controls = useAnimation();
    const ref = useRef<any>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
      if (inView) {
        controls.start({
          opacity: 1,
          transition: { duration: 1 },
        });

        let start = from;
        const increment = (to - from) / (duration * 60); // زيادة تدريجية بناءً على المدة

        const interval = setInterval(() => {
          start += increment;
          if (start >= to) {
            start = to;
            clearInterval(interval);
          }
          ref.current.textContent = Math.floor(start).toLocaleString();
        }, 1000 / 60); // 60 إطار في الثانية

        return () => clearInterval(interval);
      }
    }, [inView, controls, from, to, duration]);

    return (
      <motion.span
        ref={ref}
        initial={{ opacity: 0 }}
        animate={controls}
        className="text-5xl font-bold text-gray-900 dark:text-secend_text"
      >
        {from}
      </motion.span>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-main_dash dark:to-main_dash">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* العنوان والوصف */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl pb-3 border-b border-main_orange font-bold text-gray-900 dark:text-white">
            {language === "EN" ? "By The Numbers" : "بالأرقام"}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-secend_text">
            {language === "EN"
              ? "Here are some key statistics that highlight our impact."
              : "إليك بعض الإحصائيات الرئيسية التي توضح تأثيرنا."}
          </p>
        </motion.div>

        {/* الإحصائيات */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white dark:bg-secend_dash dark:border-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <div className="text-center">
                <div className="flex justify-center">{stat.icon}</div>
                <div className="mt-4 dark:text-secend_text">
                  <Counter from={0} to={stat.value} duration={2} />
                  {/* زيادة الأرقام في 2 ثانية */}
                </div>
                <p className="mt-2 text-lg text-gray-600">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
