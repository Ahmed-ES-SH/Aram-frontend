"use client";
import UserDeatiles from "@/app/_components/_website/_Profiles/UserDeatiles";
import React from "react";

export default function EditUserPage({ params }: any) {
  const userId = params.id;
  return (
    <>
      <UserDeatiles userId={userId} />
    </>
  );
}
