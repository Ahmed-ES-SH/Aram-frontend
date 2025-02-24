import React from "react";
import Organizations from "../_components/_website/_organizationspage/Organizations";
import Navbar from "../_components/_website/Navbar";
import Slider_cards from "../_components/_website/_cardspage/Slider_cards";
import Footer from "../_components/_website/Footer";

export default function page() {
  return (
    <>
      <Organizations />
      <Slider_cards />
    </>
  );
}
