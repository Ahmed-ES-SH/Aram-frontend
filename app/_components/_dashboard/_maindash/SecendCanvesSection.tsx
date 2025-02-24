import React from "react";
import ChartPart from "./ChartPart";
import CireclePart from "./CireclePart";
import SecendCircle_2 from "./SecendCircle_2";

const SecendCanvesSection = () => {
  return (
    <>
      <div className="flex max-lg:flex-col items-center gap-3 mt-2  px-4 w-full  h-fit m-auto">
        <ChartPart state={false} title={"Visitors Report"} />
        <SecendCircle_2 />
      </div>
    </>
  );
};

export default SecendCanvesSection;
