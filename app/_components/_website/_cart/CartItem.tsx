"use client";
import React from "react";
import Minicard from "../MiniCard";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { UseVariables } from "@/app/context/VariablesContext";
import { Cardcontext } from "@/app/context/CartContext";
import { useDataContext } from "@/app/context/DataContext";

export default function CartItem({ item }: any) {
  const { language } = UseVariables();
  const { activeCurrency, currenciesValue } = useDataContext();
  const { decreasequantity, increasequantity, removefromcard } = Cardcontext();
  const Currency = currenciesValue[activeCurrency.code] || 1;
  return (
    <>
      <li className="flex items-center gap-4 pb-4 border-b last:border-b-0">
        <Minicard bg_img={item.image ? item.image : "/cards/card_1.jpg"} />

        <div>
          <h3 className="text-sm text-gray-900 dark:text-secend_text">
            {language == "EN" ? item.title_en : item.title_ar}
          </h3>
          <div className="text-[12px] flex items-center gap-1 dark:text-white">
            {language == "EN" ? "price" : "السعر"} :
            <span className="px-2  font-bold text-[13px] dark:text-white">
              <div className="flex items-center gap-1">
                <span>{activeCurrency.symbol}</span>
                <p>{Number(Currency * item.price).toFixed(2)}</p>
              </div>
            </span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div>
            <label htmlFor="Quantity" className="sr-only">
              {language == "EN" ? "Quantity" : "الكمية"}
            </label>

            <div className="flex items-center justify-center  border dark:border-gray-600 rounded-sm shadow-sm px-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => decreasequantity(item)}
                  type="button"
                  className="  text-gray-600 transition hover:opacity-75"
                >
                  <AiOutlineMinus />
                </button>
                <p className="dark:text-white p-2 text-center">
                  {item.quantity}
                </p>
                <button
                  onClick={() => increasequantity(item)}
                  type="button"
                  className="  text-gray-600 transition hover:opacity-75"
                >
                  <AiOutlinePlus />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => removefromcard(item)}
            className="text-gray-600 transition hover:text-red-600 duration-200"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
      </li>
    </>
  );
}
