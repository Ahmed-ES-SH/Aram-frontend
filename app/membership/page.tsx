"use client";
import React, { Suspense } from "react";
import MembershipComponent from "../_components/_website/MemberShipComponent";

export default function page() {
  return (
    <>
      <Suspense>
        <MembershipComponent />
      </Suspense>
    </>
  );
}
