import React from "react";
import Quations_Answers from "../_components/_website/_FAQ/Quations_answers";
import OrganizationSlider from "../_components/_website/_servicespage/OrganizationSlider";

export default function page() {
  return (
    <>
      <div className="w-full mt-16">
        <Quations_Answers />
      </div>
      <OrganizationSlider />
    </>
  );
}
