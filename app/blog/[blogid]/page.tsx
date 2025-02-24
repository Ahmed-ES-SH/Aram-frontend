import ArticlePage from "@/app/_components/_website/_blogpage/ArticlePage";
import Navbar from "@/app/_components/_website/Navbar";
import React from "react";

export default function page({ searchParams }: any) {
  const { id } = searchParams;

  return (
    <>
      <ArticlePage id={id} />
    </>
  );
}
