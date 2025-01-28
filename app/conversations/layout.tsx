import React from "react";
import Navbar from "../_components/_website/Navbar";
import Footer from "../_components/_website/Footer";
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
