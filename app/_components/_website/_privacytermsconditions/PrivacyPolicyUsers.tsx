"use client";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import Loading from "../../Loading";
import { useEffect, useState } from "react";
import { instance } from "@/app/Api/axios";

interface PrivacyPolicy {
  id: number;
  content_ar: string;
  content_en: string;
}

export default function PrivacyPolicyUsers() {
  const { language }: any = UseVariables();

  const [policies, setPolicies] = useState<PrivacyPolicy[]>([]);
  const [loading, setloading] = useState(true);
  // Fetch policies
  const fetchPolicies = async () => {
    try {
      const response = await instance.get("/users-points");
      setPolicies(response.data.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  if (loading) return <Loading />;

  return (
    <div
      style={{ direction: language == "EN" ? "ltr" : "rtl" }}
      className="p-6 mt-16 min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-md"
    >
      <h2 className="text-2xl pb-3 border-b border-sky-400 w-fit mx-auto font-bold mb-4 text-center">
        {language == "EN" ? "Privacy Policy" : "سياسات الخصوصية"}
      </h2>
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-3 mt-6"
      >
        {policies.map((policy, index) => (
          <motion.li
            key={index}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-2"
          >
            <span className="w-2.5 h-2.5 mt-1 bg-blue-500 rounded-full flex-shrink-0"></span>
            <p className="text-sm sm:text-base">
              {language == "EN" ? policy.content_en : policy.content_ar}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
