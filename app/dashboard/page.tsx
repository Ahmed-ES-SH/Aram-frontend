import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import FourCards from "../_components/_dashboard/_maindash/FourCards";
import FirstCanvesSection from "../_components/_dashboard/_maindash/FirstCanvesSection";
import SecendCanvesSection from "../_components/_dashboard/_maindash/SecendCanvesSection";
import Head from "../_components/_dashboard/_maindash/Head";
import BillsTable from "../_components/_dashboard/_maindash/BillsTable";
import TobOrganizations from "../_components/_dashboard/_maindash/TobOrganizations";
import BillsSummaryTable from "../_components/_dashboard/_maindash/BillsSummary";
import MapComponent from "../_components/MapVariable";

export default function page() {
  const location = {
    address:
      "Muzdalifah Road, كدي, محافظة مكة المكرمة, منطقة مكة المكرمة, 24243, السعودية",
    latitude: 21.40281772305478,
    longitude: 39.84603881835938,
  };
  return (
    <>
      <div className="w-full   h-fit overflow-y-auto hidden-scrollbar">
        <Head />
        <FourCards />
        <FirstCanvesSection />
        <BillsTable />
        <TobOrganizations />
        <BillsSummaryTable />
        <div className="h-[50vh] w-full p-2 rounded-md">
          <MapComponent location={location} />
        </div>
      </div>
    </>
  );
}
