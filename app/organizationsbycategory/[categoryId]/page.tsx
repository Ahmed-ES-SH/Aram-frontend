"use client";
import Slider_cards from "@/app/_components/_website/_cardspage/Slider_cards";
import Organizations from "@/app/_components/_website/_organizationspage/Organizations";
import React from "react";

export default function page({ searchParams }: any) {
  const { category_id } = searchParams;
  return (
    <>
      <Organizations category_id={category_id} />
      <Slider_cards />
    </>
  );
}
