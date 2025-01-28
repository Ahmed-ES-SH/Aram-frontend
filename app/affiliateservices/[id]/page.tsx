import Affiliate_service from "@/app/_components/_website/_affiliate_services/Affiliate_service";
import Footer from "@/app/_components/_website/Footer";
import Navbar from "@/app/_components/_website/Navbar";
import React from "react";

export default function page({ searchParams, params }: any) {
  const serviceId = params.id;
  const searchId = searchParams.serviceId;
  const decodedServiceId = atob(searchId);

  return (
    <>
      <Affiliate_service serviceId={decodedServiceId} />
    </>
  );
}
