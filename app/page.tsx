"use client";
import { Suspense } from "react";
import BlogSlider from "./_components/_website/_homepage/Blog_slider";
import Cards_section from "./_components/_website/_homepage/Cards_section";
import Contactus_section from "./_components/_website/_homepage/Contactus_Section";
import Organizations_section from "./_components/_website/_homepage/Organizations_section";
import PromoSection from "./_components/_website/_homepage/Promosection";
import Selected_HeroSection from "./_components/_website/_homepage/Selected_HeroSection";
import Services_section from "./_components/_website/_homepage/Services_section";
import StatisticsSection from "./_components/_website/_homepage/StatisticsSection";
import SiderbarAds from "./_components/_website/_sidebarAds/SiderbarAds";
import Loading from "./_components/Loading";

function SearchBarFallback() {
  return <Loading />;
}

export default function Home() {
  return (
    <>
      <Suspense fallback={<SearchBarFallback />}>
        <Selected_HeroSection />
      </Suspense>
      <PromoSection />
      <Cards_section />
      <Services_section />
      <Organizations_section />
      <StatisticsSection />
      <BlogSlider />
      <Contactus_section />
      <div className="w-fit min-h-screen max-md:hidden fixed top-0 right-0 z-40 overflow-hidden">
        <SiderbarAds />
      </div>
    </>
  );
}
