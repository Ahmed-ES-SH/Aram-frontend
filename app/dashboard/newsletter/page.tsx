"use client";
import MessageForm from "@/app/_components/_dashboard/_newsletter/MessageForm";
import PaginatedTable from "@/app/_components/_dashboard/PagenationTable";
import React, { useState } from "react";

export default function NewsLetterComponent() {
  const headers = ["id", "البريد الإلكترونى ", "وقت الإشتراك"];
  const keys = ["id", "email", "created_at"];
  const [show, setshow] = useState(false);

  const handleshow = () => {
    setshow((prev) => !prev);
  };

  return (
    <div className="flex items-start flex-col gap-3 w-full p-6 max-md:p-2">
      <MessageForm show={show} setshow={setshow} />
      <PaginatedTable
        headers={headers}
        editpath={"/newsletter"}
        keys={keys}
        api="/members"
        apidelete="/unsubscribe"
      />
    </div>
  );
}
