import ConversationComponent from "@/app/_components/_website/_conversations/ConversationComponent";
import Navbar from "@/app/_components/_website/Navbar";
import React from "react";

export default function Conversation({ params }: any) {
  const conversationId = params.conversationId;
  console.log(params);
  return (
    <>
      <ConversationComponent conversationId={conversationId} />
    </>
  );
}
