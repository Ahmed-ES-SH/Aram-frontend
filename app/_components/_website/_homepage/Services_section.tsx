"use client";
import React from "react";
import Separator from "../Separator";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import Loading from "../../Loading";
import Img from "../../Img";
import { useDataContext } from "@/app/context/DataContext";

export default function Services_section() {
  const { language }: any = UseVariables();
  const { loading, activeServices } = useDataContext();
  if (loading) return <Loading />;
  const desc_ar =
    "الخدمات الطبية والعناية الشخصية ضرورية لتحسين جودة الحياة والصحة العامة. تشمل العناية بالعيون، الأسنان، العظام، والقلب، وتوفر تشخيصًا دقيقًا وعلاجًا فعالًا للوقاية من الأمراض وتعزيز نمط الحياة.";

  const desc_en =
    "Medical and personal care services are vital for improving quality of life and health. They include eye, dental, bone, and heart care, offering accurate diagnoses and effective treatments to prevent diseases and enhance daily life.";

  return (
    <>
      <Separator
        bg_dark="dark:bg-main_dash"
        text={language == "EN" ? "Aram Services" : "خدمات آرام"}
      />
      <section
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        id="features"
        className="max-w-screen-2xl rounded-md max-md:w-full mt-4 mx-auto px-4 space-y-6 bg-slate-50 dark:bg-secend_dash py-8 md:py-12 lg:py-20"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center gap-y-4 text-center">
          <h2 className="font-bold  pb-2  border-b border-main_orange leading-[1.1] sm:text-xl md:text-4xl dark:text-secend_text">
            {language == "EN" ? "Services" : "خدماتنا"}
          </h2>

          <p className="max-w-[90%] max-md:w-full leading-normal text-muted-foreground sm:text-lg sm:leading-7 dark:text-gray-500">
            {language == "EN" ? desc_en : desc_ar}
          </p>
        </div>

        <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-full lg:grid-cols-3 xl:grid-cols-4">
          {activeServices &&
            activeServices.map((card: any, index: number) => (
              <Link
                href={`/services/${card.title_en}?serviceId=${card.id}`}
                key={index}
                className="w-full flex flex-col items-start  h-[400px] border dark:border-gray-600  rounded-md shadow-md relative"
              >
                <div
                  style={{ backgroundImage: `url(${card.image || ""})` }}
                  className={`w-full h-[60%]  bg-cover`}
                ></div>
                <div className="content mt-4 px-4 flex flex-col gap-2 items-start">
                  <h1 className="dark:text-secend_text font-semibold text-[18px]">
                    {language == "EN" ? card.title_en : card.title_ar}
                  </h1>
                  <p className="dark:text-gray-500">
                    {language == "EN"
                      ? card.description_en
                      : card.description_ar}
                  </p>
                </div>
                <div
                  className={` absolute w-[60px] h-[60px] rounded-md shadow-sm bg-main_blue ${
                    language == "EN" ? "right-3" : "left-3"
                  } top-[60%] -translate-y-1/2 border dark:border-gray-700 overflow-hidden flex items-center justify-center`}
                >
                  <Img
                    src={card.icon ? card.icon : "/logo.ico"}
                    className="w-full h-full"
                  />
                </div>
              </Link>
            ))}
        </div>
        <div className="button w-full mx-auto">
          <Link
            className="w-[30%] max-lg:w-1/2 max-md:w-[90%] mx-auto h-[40px] flex items-center duration-200 justify-center rounded-md shadow-md my-2 bg-main_orange text-white border border-transparent hover:border-main_orange hover:bg-white hover:text-black "
            href={"/services"}
          >
            <p>{language == "EN" ? "Show More" : "شاهد المزيد"}</p>
          </Link>
        </div>
      </section>
    </>
  );
}
