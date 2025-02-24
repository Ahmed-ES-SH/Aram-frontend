import React, { useState } from "react";
import { UseVariables } from "@/app/context/VariablesContext";
import { MdPayment } from "react-icons/md";
import { GrOrganization } from "react-icons/gr";
import { motion } from "framer-motion";
import { useDataContext } from "@/app/context/DataContext";

interface Props {
  price: number;
  setPayState: (payment: string) => void;
  confirmation_status: boolean;
}

export default function PaymentOption({
  price,
  setPayState,
  confirmation_status,
}: Props) {
  const { language } = UseVariables();
  const { currenciesValue, activeCurrency } = useDataContext();
  const [activeCircle, setActiveCircle] = useState<string>("");

  const selectPaymentOpation = (payment: string) => {
    // منع تحديد الدفع في المركز إذا كانت حالة التأكيد غير صحيحة
    if (payment === "center" && confirmation_status) return;
    setActiveCircle(payment);
    setPayState(payment);
  };

  const Currency = currenciesValue[activeCurrency.code] || 1;

  return (
    <>
      <h3 className="pb-2 border-b border-main_blue my-2 w-fit mx-auto">
        {language === "EN" ? "Payment Option" : "خيار الدفع"}
      </h3>
      <div className="w-full flex  gap-4 justify-between items-center p-2 my-4">
        <div
          onClick={() => selectPaymentOpation("paynow")}
          className={`w-1/2  relative cursor-pointer hover:text-white hover:bg-main_orange group h-[20vh] py-4 duration-200 rounded-md shadow-md bg-gray-100 flex flex-col gap-3 items-center justify-center ${
            activeCircle === "paynow"
              ? "bg-main_orange text-white"
              : "bg-gray-100"
          }`}
        >
          <h4 className="pb-2 border-b w-fit ml-auto border-main_blue absolute top-2 left-2">
            {language === "EN" ? "Pay Now" : "إدفع الأن"}
          </h4>
          <MdPayment
            className={`size-20 max-md:size-12 text-sky-500 group-hover:text-white duration-200 ${
              activeCircle === "paynow" ? "text-white" : "text-sky-500"
            }`}
          />
          <div className="circle absolute bottom-2 right-2 w-[20px] h-[20px] rounded-full bg-white flex items-center justify-center">
            {activeCircle === "paynow" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-[12px] h-[12px] rounded-full bg-main_orange"
              ></motion.div>
            )}
          </div>
        </div>
        <div
          onClick={() => selectPaymentOpation("center")}
          className={`w-1/2  relative  group ${
            confirmation_status
              ? " cursor-not-allowed bg-red-200"
              : "hover:text-white cursor-pointer hover:bg-main_orange"
          } py-4 duration-200 h-[20vh] rounded-md shadow-md flex flex-col gap-3 items-center justify-center ${
            activeCircle === "center"
              ? "bg-main_orange cursor-pointer text-white"
              : "bg-gray-100"
          }`}
        >
          <h4 className="pb-2 border-b w-fit ml-auto border-main_blue absolute top-2 left-2">
            {language === "EN" ? "In Center" : "فى المركز"}
          </h4>
          <GrOrganization
            className={`size-20 max-md:size-12 text-sky-500 group-hover:text-white duration-200 ${
              activeCircle === "center" ? "text-white" : ""
            }`}
          />
          <div className="circle absolute bottom-2 right-2 w-[20px] h-[20px] rounded-full bg-white flex items-center justify-center">
            {activeCircle === "center" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`w-[12px] h-[12px] rounded-full bg-main_orange`}
              ></motion.div>
            )}
          </div>
        </div>
      </div>
      {activeCircle === "paynow" && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 w-fit mx-auto pb-2 px-4 border-b border-main_orange"
        >
          <span>{activeCurrency.symbol}</span>
          <p>{Number(Currency * price).toFixed(2)}</p>
        </motion.span>
      )}
    </>
  );
}
