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
import NewUsersPromoterTable from "../_components/_dashboard/_maindash/NewUsersPromoterTable";
import PromotionalCardsTable from "../_components/_dashboard/_maindash/PromotionalCardsTable";
import SummaryPromotersStatsWithCards from "../_components/_dashboard/_maindash/SummaryPromotersStatsWithCards";

export default function page() {
  const location = {
    latitude: 21.4735,
    longitude: 55.9754,
    address: "سلطنة عمان",
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
        <NewUsersPromoterTable />
        <SummaryPromotersStatsWithCards />
        <PromotionalCardsTable />
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
