"use client";
import React, { Suspense } from "react";
import SignupForm from "../_components/_website/_Auth/Signup";

export default function page() {
  return (
    <>
      <Suspense>
        <SignupForm />
      </Suspense>
    </>
  );
}
