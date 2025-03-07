"use client";
import { UseVariables } from "@/app/context/VariablesContext";
import React from "react";
import { LuEllipsis } from "react-icons/lu";

const ShortMenue = () => {
  const { shortmenue, setshortmenue } = UseVariables();
  return (
    <>
      <div className="relative z-[40]">
        <LuEllipsis
          onClick={() => setshortmenue(!shortmenue)}
          width={25}
          className=" cursor-pointer  border bg-transparent text-secend_text border-secend_text/40 rounded-md"
        />
        {shortmenue && (
          <div className=" absolute top-[30px] right-0 w-[200px] h-fit rounded-md bg-main_dash  ">
            <p className="text-white hover:bg-white hover:text-black duration-200 px-4 py-4 cursor-pointer">
              View All
            </p>
            <p className="text-white hover:bg-white hover:text-black duration-200 px-4 py-4 cursor-pointer">
              Download
            </p>
            <p className="text-white hover:bg-white hover:text-black duration-200 px-4 py-4 cursor-pointer">
              Refresh
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ShortMenue;
