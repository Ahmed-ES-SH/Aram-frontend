"use client";

import React, { useState, useEffect } from "react";

import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import {
  LuChartColumnDecreasing,
  LuFileChartColumn,
  LuBadgeCheck,
  LuShieldAlert,
  LuChartNoAxesColumn,
  LuIdCard,
} from "react-icons/lu";
const FourCards = () => {
  const { opensidebar } = UseVariables();

  const [userscount, setuserscount] = useState<number>(0);
  const [vendorscount, setvendorscount] = useState<number>(0);
  const [orderscount, setorderscount] = useState<number>(0);
  const [servicescount, setservicescount] = useState<number>(0);

  useEffect(() => {
    const getcount = async (
      api: string,
      set: React.Dispatch<React.SetStateAction<number>>
    ) => {
      try {
        const res = await instance.get(api);
        set(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getcount("/users-count", setuserscount);
    getcount("/organizations-count", setvendorscount);
    getcount("/books-count", setorderscount);
    getcount("/active-cards-count", setservicescount);
  }, []);

  const fourcards: {
    text: string;
    number: number;
    icon: any;
    bg_color: string;
  }[] = [
    {
      text: "عدد المستخدمين",
      number: userscount,
      icon: <LuChartColumnDecreasing color="white" />,
      bg_color: "#4e33b8",
    },
    {
      text: "عدد المراكز",
      number: vendorscount,
      icon: <LuFileChartColumn color="white" />,
      bg_color: "#f97316",
    },
    {
      text: "عدد الحجوزات",
      number: orderscount,
      icon: <LuBadgeCheck color="white" />,
      bg_color: "#22c55e",
    },
    {
      text: "عدد البطاقات النشطة",
      number: servicescount,
      icon: <LuIdCard color="white" />,
      bg_color: "#ef4444",
    },
  ];
  return (
    <>
      <div
        className={` rounded-md gap-4  grid grid-cols-4 max-xl:grid-cols-2  max-sm:grid-cols-1 w-full m-auto justify-items-center px-4 py-4 dark:bg-secend_dash bg-light_bg mt-4 `}
      >
        {fourcards.map((card, index) => (
          <div
            style={{
              backgroundColor: card.bg_color,
            }}
            key={index}
            className={`px-2 shadow-md shadow-${card.bg_color} rounded-md  py-2 w-full   h-[150px] relative flex flex-col items-start overflow-hidden after:w-[120px] after:h-[120px] after:absolute after:-left-8 after:-top-8 after:bg-white/30 after:rounded-full after:content-[''] before:w-[100px] before:h-[100px] before:absolute before:-left-6 before:-top-6 before:bg-white/20 before:rounded-full before:content-[''] `}
          >
            <div className="icon p-1 border border-dashed rounded-full">
              <div className="bg-white/60 rounded-full p-1 ">{card.icon}</div>
            </div>
            <h1 className="py-4 text-white text-[15px]">{card.text}</h1>
            <div className="flex items-center gap-3 text-white text-[18px]">
              <p>{card.number}</p>
              <LuChartNoAxesColumn color="white" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FourCards;
