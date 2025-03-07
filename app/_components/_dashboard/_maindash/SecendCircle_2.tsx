import React from "react";
import Secendcorcle from "../_Canves/Secendcircle";
import ShortMenue from "./ShortMenue";

const SecendCircle_2 = () => {
  return (
    <div className="w-[30%] max-lg:w-full  2xl:h-fit h-[520px] rounded-md mt-6  dark:bg-secend_dash bg-light_bg">
      <div className="head flex items-center justify-between w-full px-4 py-6">
        <h1 className="dark:text-white text-xl font-serif font-extralight">
          Customer Statistics
        </h1>
        <ShortMenue />
      </div>
      <Secendcorcle />
    </div>
  );
};

export default SecendCircle_2;
