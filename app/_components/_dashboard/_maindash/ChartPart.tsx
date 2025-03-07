import React from "react";
import BarChart from "../_Canves/LineChar";
import Pyrimd from "../_Canves/Pyrimd";

const ChartPart = ({ state, title }: any) => {
  return (
    <>
      <div
        className={`w-[70%] max-lg:w-full ${
          state ? "max-lg:h-full" : ""
        }  h-full rounded-md mt-6  dark:bg-secend_dash bg-light_bg`}
      >
        <div className="head flex items-center justify-between w-full px-4 py-6">
          <h1 className="dark:text-white text-xl font-serif font-extralight">
            {title}
          </h1>
          <div className="relative">
            <select className=" cursor-pointer outlien-none border-none  px-4 py-2 text-[14px] text-gray-400/40 bg-main_dash rounded-md text-white">
              <option className="text-gray-400/40 py-2 px-1 ">jan 12</option>
              <option className="text-gray-400/40 py-2 px-1 ">jan 13</option>
              <option className="text-gray-400/40 py-2 px-1 ">jan 14</option>
            </select>
          </div>
        </div>
        {state ? <BarChart /> : <Pyrimd />}
      </div>
    </>
  );
};

export default ChartPart;
