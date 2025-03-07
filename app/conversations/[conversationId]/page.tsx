import ConversationComponent from "@/app/_components/_website/_conversations/ConversationComponent";
import Navbar from "@/app/_components/_website/Navbar";
import React from "react";

export default function Conversation({ params }: any) {
  const conversationId = params.conversationId;
  return (
    <>
      <ConversationComponent conversationId={conversationId} />
    </>
  );
}
