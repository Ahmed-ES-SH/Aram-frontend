import BookServiceComponent from "@/app/_components/_website/BookServiceComponent";
import Navbar from "@/app/_components/_website/Navbar";
import React from "react";

export default function BookService({ searchParams }: any) {
  const catgeoryId = searchParams.serviceCategoryId;
  return (
    <>
      <BookServiceComponent categoryId={catgeoryId} />
    </>
  );
}
