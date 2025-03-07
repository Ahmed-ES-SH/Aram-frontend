import React from "react";
import Articles from "../_components/_website/_blogpage/Articles";
import Slider_part from "../_components/_website/_blogpage/Slider_part";
import Navbar from "../_components/_website/Navbar";

export default function page() {
  return (
    <>
      <Slider_part />
      <Articles />
    </>
  );
}
