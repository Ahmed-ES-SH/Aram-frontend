import EditAffiliateService from "@/app/_components/_website/_affiliate_services/EditAffiliateService";
import Footer from "@/app/_components/_website/Footer";
import Navbar from "@/app/_components/_website/Navbar";
import React from "react";

export default function page({ searchParams }: any) {
  const serviceId = searchParams.serviceId;
  const decodedServiceId = atob(serviceId);
  return (
    <>
      <EditAffiliateService id={decodedServiceId} />
    </>
  );
}
