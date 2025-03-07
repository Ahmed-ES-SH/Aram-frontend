"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaWallet, FaClock, FaHandHoldingUsd } from "react-icons/fa"; // يمكنك اختيار الأيقونات المناسبة
import { UseVariables } from "../context/VariablesContext";
import Loading from "../_components/Loading";
import { instance } from "../Api/axios";
import { useDataContext } from "../context/DataContext";
import InvoiceTable from "../_components/_website/_accountBalance/InvoiceTable";
import WithDrawComponent from "../_components/_website/_accountBalance/WithDrawComponent";

const BalancePage = () => {
  const { language } = UseVariables();
  const { currentuser, type } = useDataContext();
  const texts = {
    EN: {
      pendingBalance: "Pending Balance",
      totalBalance: "Total Balance",
      withdrawableBalance: "Withdrawable Balance",
      AccountTransactions: "Account Transactions",
      WithdrawBalance: "Withdraw balance",
    },
    AR: {
      pendingBalance: "الرصيد المعلق",
      totalBalance: "الرصيد الكلي",
      withdrawableBalance: "الرصيد القابل للسحب",
      AccountTransactions: "معاملات الحساب",
      WithdrawBalance: "سحب الرصيد",
    },
  };
  const currentId = currentuser && currentuser.id;
  const currentTexts = language === "EN" ? texts.EN : texts.AR;
  const [balacne, setBalance] = useState({
    pending_balance: 0,
    available_balance: 0,
    total_balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currenButton, setCurrentButton] = useState("AccountTransactions");

  useEffect(() => {
    const getBalance = async () => {
      try {
        const response = await instance.get(`/numbers/${currentId}/${type}`);
        if (response.status == 200) {
          const data = response.data.data;
          setBalance({
            pending_balance: data.pending_balance,
            available_balance: data.available_balance,
            total_balance: data.total_balance,
          });
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (currentId) getBalance();
  }, [currentId]);

  if (loading) return <Loading />;

  return (
    <div className=" mt-20 flex justify-center min-h-screen max-md:p-1  p-4">
      <div className="w-full flex items-center flex-col  rounded-md">
        <div className="mx-auto my-6 max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center head">
          <h1
            style={{ overflowWrap: "anywhere" }}
            className="pb-2 border-b border-b-main_orange w-fit lg:whitespace-nowrap mx-auto text-center font-manrope font-bold max-sm:text-lg text-3xl text-gray-900 dark:text-secend_text mb-5 md:text-4xl md:leading-normal"
          >
            {language === "EN"
              ? "Manage Your Account Balance with Ease"
              : "إدارة رصيد حسابك بكل سهولة"}
            <br />
            <span className="text-main_orange">
              {language === "EN"
                ? "Check Your Funds Anytime"
                : "تحقق من أموالك في أي وقت"}
            </span>
          </h1>
        </div>

        <div className="w-[90%] max-md:w-full max-md:p-2 max-lg:w-[95%]  rounded-lg  p-6">
          <motion.div
            className="flex flex-row max-md:flex-col max-md:gap-6 max-md:justify-center max-md:items-center  items-start justify-between "
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pending Balance */}
            <motion.div
              className="flex flex-col items-center justify-center bg-gray-200 p-4 rounded-lg w-1/3 max-md:w-full mx-2"
              whileHover={{ scale: 1.05 }}
            >
              <FaClock className="text-2xl mb-2" />
              <h3 className="text-lg font-semibold whitespace-nowrap">
                {currentTexts.pendingBalance}
              </h3>
              <p className="text-2xl font-bold">${balacne?.pending_balance}</p>
            </motion.div>

            {/* Total Balance */}
            <motion.div
              className="flex flex-col items-center justify-center bg-main_orange text-white p-6 rounded-lg w-1/3 max-md:w-full mx-2 relative max-md:top-0 -top-8"
              whileHover={{ scale: 1.05 }}
            >
              <FaWallet className="text-3xl mb-2" />
              <h3 className="text-lg font-semibold whitespace-nowrap">
                {currentTexts?.totalBalance}
              </h3>
              <p className="text-4xl font-bold">${balacne?.total_balance}</p>
            </motion.div>

            {/* Withdrawable Balance */}
            <motion.div
              className="flex flex-col items-center justify-center bg-gray-200 p-4 rounded-lg w-1/3 max-md:w-full mx-2"
              whileHover={{ scale: 1.05 }}
            >
              <FaHandHoldingUsd className="text-2xl mb-2" />
              <h3 className="text-lg font-semibold whitespace-nowrap">
                {currentTexts?.withdrawableBalance}
              </h3>
              <p className="text-2xl font-bold">
                ${balacne?.available_balance}
              </p>
            </motion.div>
          </motion.div>
          <div className="mt-4 flex items-center border  rounded-t-md shadow-md">
            <button
              onClick={() => setCurrentButton("AccountTransactions")}
              className={`flex-1 p-4 rounded-t text-center text-xl duration-150 max-md:text-[13px] ${
                currenButton == "AccountTransactions"
                  ? "bg-main_orange border-main_orange text-white"
                  : "bg-gray-100 text-black"
              } whitespace-nowrap   border-r  `}
            >
              {currentTexts?.AccountTransactions}
            </button>
            <button
              onClick={() => setCurrentButton("WithdrawBalance")}
              className={`flex-1 p-4 rounded-t text-center text-xl duration-150 max-md:text-[13px] whitespace-nowrap ${
                currenButton == "WithdrawBalance"
                  ? "bg-main_orange border-main_orange text-white"
                  : "bg-gray-100 text-black"
              }  `}
            >
              {currentTexts?.WithdrawBalance}
            </button>
          </div>
          <div className="h-[70vh] relative border overflow-y-auto p-2 bg-white roudned-md shadow-md">
            {currenButton == "AccountTransactions" ? (
              <InvoiceTable />
            ) : (
              <WithDrawComponent balacne={balacne} setBalance={setBalance} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalancePage;
