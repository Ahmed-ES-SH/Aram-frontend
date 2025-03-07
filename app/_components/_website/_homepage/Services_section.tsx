"use client";
import React from "react";
import Separator from "../Separator";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import Loading from "../../Loading";
import Img from "../../Img";
import { useDataContext } from "@/app/context/DataContext";
import AffiliateServiceCard from "../_affiliate_services/AffiliateServiceCard";

export default function Services_section() {
  const { language }: any = UseVariables();
  const { loading, activeServices } = useDataContext();
  if (loading) return <Loading />;

  const desc_en =
    "Our platform partners are committed to delivering high-quality services that meet customer needs with the highest standards. Through professionalism, precision, and dedication, we ensure an exceptional experience that reflects our providers' commitment to offering reliable and innovative solutions.";

  const desc_ar =
    "يحرص شركاء منصتنا على تقديم خدمات عالية الجودة تلبي احتياجات العملاء بأفضل المعايير. من خلال الاحترافية، الدقة، والالتزام، نضمن لك تجربة مميزة تعكس تفاني مزودينا في تقديم حلول موثوقة ومبتكرة.";

  return (
    <>
      <Separator
        bg_dark="dark:bg-main_dash"
        text={language == "EN" ? "Aram Services" : "خدمات آرام"}
      />
      <section
        style={{ direction: language == "EN" ? "ltr" : "rtl" }}
        id="features"
        className="max-w-screen-2xl rounded-md max-md:w-full  mx-auto px-4 space-y-6  dark:bg-secend_dash py-3 md:py-4 lg:py-5"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center gap-y-4 text-center">
          <h2 className="font-bold  pb-2  border-b border-main_orange leading-[1.1] sm:text-xl md:text-4xl dark:text-secend_text">
            {language == "EN" ? "Services" : "خدماتنا"}
          </h2>

          <p className="max-w-[92%] max-md:w-full leading-normal text-muted-foreground sm:text-lg sm:leading-7 dark:text-gray-500">
            {language == "EN" ? desc_en : desc_ar}
          </p>
        </div>

        <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-full lg:grid-cols-3 xl:grid-cols-4">
          {activeServices &&
            activeServices.map((service: any, index: number) => (
              <AffiliateServiceCard
                key={index}
                service={service}
                index={index}
                direct={"affiliateservices"}
              />
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
