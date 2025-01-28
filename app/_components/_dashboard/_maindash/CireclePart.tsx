import React from "react";
import CircleChar from "../_Canves/CircleChar";
import ShortMenue from "./ShortMenue";

const CireclePart = () => {
  return (
    <>
      <div className="w-[30%] max-lg:w-full max-lg:h-fit h-full  rounded-md mt-6  dark:bg-secend_dash bg-light_bg">
        <div className="head flex items-center justify-between w-full px-4 py-6">
          <h1 className="dark:text-white text-xl font-serif font-extralight">
            Tob Browser
          </h1>
        </div>
        <CircleChar />
      </div>
    </>
  );
};

export default CireclePart;
