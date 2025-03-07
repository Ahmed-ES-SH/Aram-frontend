"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const initialSections: any = [
    {
      id: "first_section",
      title: "القسم الأول",
      placeholder: "القسم الأول",
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
    },
    {
      id: "second_section",
      title: "القسم الثانى",
      placeholder: "القسم الثانى",
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
    },
    {
      id: "thired_section",
      title: "القسم الثالث",
      placeholder: "القسم الثالث",
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
    },
    {
      id: "fourth_section",
      title: "القسم الرابع",
      placeholder: "القسم الرابع",
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
    },
  ];
  const [sections, setSections] = useState(initialSections);
  const [loading, setloading] = useState(true);
  const [FirstSectionimage, setFirstSectionimage] = useState(null);
  const [SecondSectionimage, setSecondSectionimage] = useState(null);
  const [ThiredSectionimage, setThiredSectionimage] = useState(null);
  const [FourthSectionimage, setFourthSectionimage] = useState(null);

  const fetchData = async () => {
    try {
      const response = await instance.get("/detailes");
      const data = response.data.data;
      const updatedSections = sections.map((section: any) => ({
        ...section,
        contentEn: data[`${section.id}_content_en`] || "",
        contentAr: data[`${section.id}_content_ar`] || "",
        titleAr: data[`${section.id}_title_ar`] || "",
        titleEn: data[`${section.id}_title_en`] || "",
      }));
      setSections(updatedSections);
      setFirstSectionimage(data.first_section_image || null);
      setSecondSectionimage(data.second_section_image || null);
      setThiredSectionimage(data.thired_section_image || null);
      setFourthSectionimage(data.fourth_section_image || null);
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
    <div
      style={{ direction: language == "EN" ? "ltr" : "rtl" }}
      className="container mx-auto px-4 py-8"
    >
      {/* About Us Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center mb-12 w-full justify-between gap-3"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="md:w-1/2">
          <Img
            src={FirstSectionimage ? FirstSectionimage : "/about/about.webp"}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 md:ml-8 mt-6 md:mt-0">
          <h2 className="text-3xl font-bold mb-4 flex dark:text-secend_text items-center gap-2">
            <FaInfoCircle className="mr-2" />{" "}
            {language === "EN" ? sections[0].titleEn : sections[0].titleAr}
          </h2>
          <p className="text-gray-700 dark:text-white">
            {language === "EN" ? sections[0].contentEn : sections[0].contentAr}
          </p>
        </div>
      </motion.div>

      {/* Our Goals Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center mb-12 w-full justify-between gap-3"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="md:w-1/2 md:order-2">
          <Img
            src={SecondSectionimage ? SecondSectionimage : "/about/about.webp"}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 md:mr-8 mt-6 md:mt-0 md:order-1">
          <h2 className="text-3xl font-bold mb-4 flex dark:text-secend_text items-center gap-2">
            <FaBullseye className="mr-2" />{" "}
            {language === "EN" ? sections[1].titleEn : sections[1].titleAr}
          </h2>
          <p className="text-gray-700 dark:text-white">
            {language === "EN" ? sections[1].contentEn : sections[1].contentAr}
          </p>
        </div>
      </motion.div>

      {/* Our Values Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center mb-12 w-full justify-between gap-3"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="md:w-1/2 ">
          <Img
            src={ThiredSectionimage ? ThiredSectionimage : "/about/about.webp"}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 md:ml-8 mt-6 md:mt-0">
          <h2 className="text-3xl font-bold mb-4 flex dark:text-secend_text items-center gap-2">
            <FaBullseye className="mr-2" />{" "}
            {language === "EN" ? sections[2].titleEn : sections[2].titleAr}
          </h2>
          <p className="text-gray-700 dark:text-white">
            {language === "EN" ? sections[2].contentEn : sections[2].contentAr}
          </p>
        </div>
      </motion.div>

      {/* Our Vision Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center mb-12 w-full justify-between gap-3"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="md:w-1/2 md:order-2">
          <Img
            src={FourthSectionimage ? FourthSectionimage : "/about/about.webp"}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 md:mr-8 mt-6 md:mt-0 md:order-1">
          <h2 className="text-3xl font-bold mb-4 flex dark:text-secend_text items-center gap-2">
            <FaBullseye className="mr-2" />{" "}
            {language === "EN" ? sections[3].titleEn : sections[3].titleAr}
          </h2>
          <p className="text-gray-700 dark:text-white">
            {language === "EN" ? sections[3].contentEn : sections[3].contentAr}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
