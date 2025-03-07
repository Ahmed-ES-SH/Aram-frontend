import OffersByCategoryComponent from "@/app/_components/_website/_Couponsoffers/OffersByCategoryComponent";
import React from "react";

export default function OffersByCategory({ params }: any) {
  const categoryId = params.categoryId;
  // const deCodeCategoryId = categoryId && atob(categoryId);
  return (
    <>
      <OffersByCategoryComponent categoryId={categoryId} />
    </>
  );
}
