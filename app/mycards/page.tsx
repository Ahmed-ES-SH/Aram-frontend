import React from "react";
import Navbar from "../_components/_website/Navbar";
import MyCardsComponent from "../_components/_website/_cardspage/MyCardsComponent";

export default function MyCardsPage({ searchParams }: any) {
  const userId = searchParams.userId;
  return (
    <>
      <MyCardsComponent id={userId} />
    </>
  );
}
