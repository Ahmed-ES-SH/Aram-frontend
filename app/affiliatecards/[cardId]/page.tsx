import dynamic from "next/dynamic";
import React from "react";

const CardPage = dynamic(
  () => import("@/app/_components/_website/_cardspage/CardPage"),
  {
    ssr: false,
  }
);

export default function Page() {
  return (
    <>
      <CardPage api="affiliate-card-type" />
    </>
  );
}
