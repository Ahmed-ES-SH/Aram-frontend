"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import CardComponent from "./Cardcomponent";
import Link from "next/link";
import { UseVariables } from "@/app/context/VariablesContext";
import { Cardcontext } from "@/app/context/CartContext";
import { useDataContext } from "@/app/context/DataContext";

interface props {
  direct: string;
  card: any;
}

const ProductCard = ({ card, direct }: props) => {
  const { currenciesValue, activeCurrency } = useDataContext();
  const { language }: any = UseVariables();
  const {
    cartitems,
    increasequantity,
    decreasequantity,
    addToCart,
    getitemquanity,
  } = Cardcontext();

  const quantity = getitemquanity(card);

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  // حساب نسبة الخصم
  const discountPercentage = card.price_before_discount
    ? Math.round(
        ((card.price_before_discount - card.price) /
          card.price_before_discount) *
          100
      )
    : 0;

  const Currency = currenciesValue[activeCurrency.code] || 1;

  return (
    <motion.div
      className="group relative w-full h-fit overflow-hidden rounded-lg border dark:border-gray-700 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* دائرة نسبة الخصم */}
      {discountPercentage > 0 && (
        <motion.div
          className="absolute top-2 -right-40 group-hover:right-2 duration-200 bg-red-400 border  border-dashed text-white text-xs font-bold rounded-full w-10 h-10 flex items-center justify-center z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {discountPercentage}%
        </motion.div>
      )}

      {/* صورة الخلفية */}
      <div className="w-full h-full bg-gray-100 dark:bg-secend_dash">
        <Link
          href={`/${direct}/${card.id}?Card_title=${formatTitle(
            card?.title_en
          )}`}
          className="px-2"
        >
          <CardComponent
            bg_img={card.image ? card.image : "/cards/card_1.jpg"}
          />
        </Link>
      </div>

      {/* محتوى البطاقة */}
      <div className="h-1/3 bg-white dark:bg-main_dash border-t dark:border-gray-600 p-4 pt-8">
        <Link
          href={`/${direct}/${card.id}?Card_title=${formatTitle(
            card.title_en
          )}`}
          className="text-sm font-bold text-gray-800 dark:text-secend_text group-hover:underline"
        >
          {language === "EN" ? card.title_en : card.title_ar}
        </Link>

        {/* عرض السعر قبل الخصم والسعر الحالي */}
        <div className="mt-1">
          {card.price_before_discount && (
            <span className="text-md  flex items-center gap-1 text-red-500 line-through mr-2">
              <span>{activeCurrency.symbol}</span>
              <p>{Number(Currency * card.price_before_discount).toFixed(2)}</p>
            </span>
          )}
          <span className="text-lg flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
            <span>{activeCurrency.symbol}</span>
            <p>{Number(Currency * card.price).toFixed(2)}</p>
          </span>
        </div>

        {/* أزرار التحكم بالكمية */}
        <div className="flex items-center mt-4 gap-x-2">
          <button
            onClick={() => decreasequantity(card)}
            className="p-1 border rounded-full text-gray-700 dark:text-secend_text hover:bg-gray-100 duration-200"
          >
            <AiOutlineMinus />
          </button>
          <span className="px-4 py-1 text-gray-900 dark:bg-secend_dash dark:text-white border rounded-md">
            {quantity}
          </span>
          <button
            onClick={() => increasequantity(card)}
            className="p-1 border rounded-full text-gray-700 dark:text-secend_text hover:bg-gray-100 duration-200"
          >
            <AiOutlinePlus />
          </button>
        </div>

        {/* زر الإضافة للسلة */}
        <button
          onClick={() => addToCart(card)}
          className="mt-4 w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
