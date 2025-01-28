import OffersByCategoryComponent from "@/app/_components/_website/_Couponsoffers/OffersByCategoryComponent";
import Footer from "@/app/_components/_website/Footer";
import Navbar from "@/app/_components/_website/Navbar";
import React from "react";

export default function OffersByCategory({ searchParams }: any) {
  const categoryId = searchParams.categoryId;
  const deCodeCategoryId = atob(categoryId);
  return (
    <>
      <OffersByCategoryComponent categoryId={deCodeCategoryId} />
    </>
  );
}
