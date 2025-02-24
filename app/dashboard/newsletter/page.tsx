"use client";
import MessageForm from "@/app/_components/_dashboard/_newsletter/MessageForm";
import PaginatedTable from "@/app/_components/_dashboard/PagenationTable";
import MembersForSelected from "@/app/_components/MembersForSelected";
import React, { useState } from "react";

export default function NewsLetterComponent() {
  const [show, setshow] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  return (
    <div className="flex items-start flex-col gap-3 w-full p-6 max-md:p-2">
      <MessageForm
        setSelectedMembers={setSelectedMembers}
        selectedMembers={selectedMembers}
        show={show}
        setshow={setshow}
      />

      <MembersForSelected setSelectedMembersProp={setSelectedMembers} />
    </div>
  );
}
