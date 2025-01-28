import React from "react";
import Img from "../../Img";
import { UseVariables } from "@/app/context/VariablesContext";

interface props {
  category: any;
}

export default function OfferCategorySlide({ category }: props) {
  const { language } = UseVariables();
  return (
    <>
      <div className="flex flex-col object-cover  items-center gap-2 hover:scale-125 duration-200 cursor-pointer ">
        <Img
          src={category.image ? category.image : "/public"}
          className="w-12 h-12 rounded-full object-cover  shadow-md"
        />
        <p className="max-md:text-[14px]">
          {language == "EN" ? category?.title_en : category?.title_ar}
        </p>
      </div>
    </>
  );
}
