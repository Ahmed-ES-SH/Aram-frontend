"use client";
import CardPage from "@/app/_components/_website/_cardspage/CardPage";
import Loading from "@/app/_components/Loading";
import React, { Suspense } from "react";

function SearchBarFallback() {
  return <Loading />;
}

export default function page() {
  return (
    <>
      <Suspense fallback={<SearchBarFallback />}>
        <CardPage api="card-type" />
      </Suspense>
    </>
  );
}
