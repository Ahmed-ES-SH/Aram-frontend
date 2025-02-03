import React from "react";
import FourCards from "../_components/_dashboard/_maindash/FourCards";
import FirstCanvesSection from "../_components/_dashboard/_maindash/FirstCanvesSection";
import Head from "../_components/_dashboard/_maindash/Head";
import BillsTable from "../_components/_dashboard/_maindash/BillsTable";
import TobOrganizations from "../_components/_dashboard/_maindash/TobOrganizations";
import BillsSummaryTable from "../_components/_dashboard/_maindash/BillsSummary";
import MapComponent from "../_components/MapVariable";
import PurchaseTable from "../_components/_dashboard/_maindash/PurchaseTable";
import VisitsTable from "../_components/_dashboard/_maindash/VisitorsTable";
import CardVisitsTable from "../_components/_dashboard/_maindash/CardVisitsTable";

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
        <PurchaseTable />
        <VisitsTable />
        <CardVisitsTable />
        <div className="h-[50vh] w-full p-2 rounded-md">
          <MapComponent location={location} />
        </div>
      </div>
    </>
  );
}
