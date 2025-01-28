import React from "react";
import ChartPart from "./ChartPart";
import CireclePart from "./CireclePart";

const FirstCanvesSection = () => {
  return (
    <>
      <div className="flex max-lg:flex-col items-center gap-3 mt-1 dark:bg-main_dash   w-full max-lg:h-fit  h-[85vh]  py-[1.5rem] m-auto">
        <ChartPart title={"Average Revenue"} state={true} />
        <CireclePart />
      </div>
    </>
  );
};

export default FirstCanvesSection;
