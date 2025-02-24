import React from "react";
import ConversationSidebar from "../_components/_website/_conversations/ConversationSidebar";

export default function ConversationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex items-start justify-between  w-full min-h-screen h-fit max-md:h-fit mt-16">
        <ConversationSidebar />
        {children}
      </div>
    </>
  );
}
