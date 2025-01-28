"use client";
import React, { useEffect } from "react";
import OffersSlider from "./OffersSlider";
import OffersCategoriesSlider from "./OffersCategoriesSlider";
import Offers from "./Offers";

export default function CouponsoffersComponent() {
  return (
    <>
      <div className="w-full min-h-screen max-md:mt-20 mt-16">
        <OffersSlider />
        <OffersCategoriesSlider />
        <Offers />
      </div>
    </>
  );
}
