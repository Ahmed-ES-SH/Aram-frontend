"use client";
import React, { useEffect, useState } from "react";
import { instance } from "@/app/Api/axios";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import Loading from "../../Loading";
import { motion } from "framer-motion";
import {
  FaBullseye,
  FaLightbulb,
  FaHandsHelping,
  FaInfoCircle,
} from "react-icons/fa";

export default function About_content() {
  const { language }: any = UseVariables();
  const [form, setform] = useState({
    about_en: "",
    about_ar: "",
    goals_en: "",
    goals_ar: "",
    value_en: "",
    value_ar: "",
    vision_ar: "",
    vision_en: "",
  });
  const [aboutimage, setaboutimage] = useState<string>("");
  const [valueimage, setvalueimage] = useState<any>(null);
  const [loading, setloading] = useState(true);
  const [goalsimage, setgoalsimage] = useState<string>("");
  const [visionimage, setvisionimage] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await instance.get("/detailes");
      const data = response.data.data;

      setform({
        about_en: data.about_en,
        about_ar: data.about_ar,
        value_ar: data.values_ar,
        value_en: data.values_en,
        vision_ar: data.vision_ar,
        vision_en: data.vision_en,
        goals_ar: data.goals_ar,
        goals_en: data.goals_en,
      });
      setaboutimage(data.about_image);
      setvalueimage(data.values_image);
      setvisionimage(data.vision_image);
      setgoalsimage(data.goals_image);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [language]);

  if (loading) {
    return <Loading />;
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* About Us Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center mb-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="md:w-1/2">
          <Img
            src={aboutimage ? aboutimage : "/about/about.webp"}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 md:ml-8 mt-6 md:mt-0">
          <h2 className="text-3xl font-bold mb-4 flex dark:text-secend_text items-center">
            <FaInfoCircle className="mr-2" />{" "}
            {language === "EN" ? "About Us" : "من نحن"}
          </h2>
          <p className="text-gray-700 dark:text-white">
            {language === "EN" ? form.about_en : form.about_ar}
          </p>
        </div>
      </motion.div>

      {/* Our Goals Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center mb-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="md:w-1/2 md:order-2">
          <Img
            src={goalsimage ? goalsimage : "/about/about.webp"}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 md:mr-8 mt-6 md:mt-0 md:order-1">
          <h2 className="text-3xl font-bold mb-4 flex dark:text-secend_text items-center">
            <FaBullseye className="mr-2" />{" "}
            {language === "EN" ? "Our Goals" : "أهدافنا"}
          </h2>
          <p className="text-gray-700 dark:text-white">
            {language === "EN" ? form.goals_en : form.goals_ar}
          </p>
        </div>
      </motion.div>

      {/* Our Values Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center mb-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="md:w-1/2">
          <Img
            src={valueimage ? valueimage : "/about/about.webp"}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 md:ml-8 mt-6 md:mt-0">
          <h2 className="text-3xl font-bold mb-4 flex dark:text-secend_text items-center">
            <FaHandsHelping className="mr-2" />{" "}
            {language === "EN" ? "Our Values" : "قيمنا"}
          </h2>
          <p className="text-gray-700 dark:text-white">
            {language === "EN" ? form.value_en : form.value_ar}
          </p>
        </div>
      </motion.div>

      {/* Our Vision Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center mb-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="md:w-1/2 md:order-2">
          <Img
            src={visionimage ? visionimage : "/about/about.webp"}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 md:mr-8 mt-6 md:mt-0 md:order-1">
          <h2 className="text-3xl font-bold mb-4 flex dark:text-secend_text items-center">
            <FaLightbulb className="mr-2" />{" "}
            {language === "EN" ? "Our Vision" : "رؤيتنا"}
          </h2>
          <p className="text-gray-700 dark:text-white">
            {language === "EN" ? form.vision_en : form.vision_ar}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
