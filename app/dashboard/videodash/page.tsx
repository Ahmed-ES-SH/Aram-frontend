import Hero_video_dash from "@/app/_components/_dashboard/_mainpage/Hero_video_dash";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "شركة آرام الخليج المحدودة - قسم الفيديو",
  description:
    "شركة آرام الخليج المحدودة توفر منصة شاملة لعمليات التجميل وتقديم البطاقات الطبية لاستخدامها في المراكز الصحية والتجميلية المرتبطة بالمنصة. نوفر حلولاً مبتكرة وخدمات متكاملة لتلبية احتياجاتك الجمالية والصحية.",
};

export default function page() {
  return (
    <>
      <Hero_video_dash />
    </>
  );
}
