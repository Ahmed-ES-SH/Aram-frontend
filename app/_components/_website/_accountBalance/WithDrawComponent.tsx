import { instance } from "@/app/Api/axios";
import { useDataContext } from "@/app/context/DataContext";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaPaypal } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import Loading from "../../Loading";

const translations = {
  EN: {
    title: "Withdraw via PayPal",
    emailPlaceholder: "Enter your PayPal email",
    amountPlaceholder: "Enter withdrawal amount",
    availableBalance: "Available Balance:",
    submit: "Request Withdrawal",
    errorEmail: "Please enter a valid email",
    errorAmount: "Invalid amount or exceeds available balance",
    success: "Withdrawal request submitted successfully!",
  },
  AR: {
    title: "سحب عبر PayPal",
    emailPlaceholder: "أدخل بريدك الإلكتروني في PayPal",
    amountPlaceholder: "أدخل مبلغ السحب",
    availableBalance: "الرصيد المتاح:",
    submit: "طلب السحب",
    errorEmail: "يرجى إدخال بريد إلكتروني صحيح",
    errorAmount: "المبلغ غير صحيح أو يتجاوز الرصيد المتاح",
    success: "تم إرسال طلب السحب بنجاح!",
  },
};

interface props {
  balacne: any;
  setBalance: any;
}

export default function WithDrawComponent({ balacne, setBalance }: props) {
  const { currentuser, type } = useDataContext();
  const currentId = currentuser && currentuser.id;
  const { language } = UseVariables();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<any>({});
  const [loading, setLoadaing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleWithdraw = async () => {
    if (!email || !amount) {
      setError({ EN: "All fields are required.", AR: "جميع الحقول مطلوبة." });
      return;
    }

    setError("");
    try {
      const formdata = new FormData();
      formdata.append("account_type", type);
      formdata.append("account_id", currentId);
      formdata.append("paypal_email", email);
      formdata.append("amount", amount);
      const response = await instance.post(`/withdrawal-request`, formdata);
      if (response.status == 201) {
        const data = response.data.data;
        const balance = data.account;
        setShowSuccessPopup(true);
        setBalance({
          pending_balance: balance.pending_balance,
          available_balance: balance.available_balance,
          total_balance: balance.total_balance,
        });
        setEmail("");
        setAmount("");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message) {
        setError({
          AR: error.response.data.message,
          EN: error.response.data.message,
        });
      }
    } finally {
      setLoadaing(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      style={{ direction: language == "EN" ? "ltr" : "rtl" }}
      className="w-full h-full flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white h-3/4 max-md:h-fit py-3 border dark:border-gray-700  dark:bg-gray-800 rounded-lg shadow-lg  p-6 relative w-[90%] max-md:w-full"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <FaPaypal className="text-blue-500 text-2xl" />
          {language === "EN" ? "Withdraw via PayPal" : "سحب عبر PayPal"}
        </h2>

        <div className="gap-y-12 flex flex-col items-center">
          <div className="w-full">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              {language === "EN" ? "PayPal Email" : "بريد PayPal"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
              placeholder="example@paypal.com"
            />
          </div>

          <div className="w-full">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              {language === "EN" ? "Amount to Withdraw" : "المبلغ المطلوب سحبه"}
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                max={balacne.available_balance}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 outline-none py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white pr-10"
                placeholder="0.00"
              />
              <AiOutlineDollarCircle className="absolute right-3 top-3 text-gray-500 text-xl" />
            </div>
          </div>
          <p className="text-lg text-gray-500 mt-1">
            {language === "EN" ? (
              <>
                Available balance:{" "}
                <span className="text-green-500">
                  ${balacne.available_balance}
                </span>
              </>
            ) : (
              <>
                الرصيد المتاح:{" "}
                <span className="text-green-500">
                  ${balacne.available_balance}
                </span>
              </>
            )}
          </p>

          {error && <p className="text-red-500 text-sm">{error[language]}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWithdraw}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <FaPaypal className="text-xl" />
            {language === "EN" ? "Withdraw Now" : "اسحب الآن"}
          </motion.button>
        </div>
      </motion.div>
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => setShowSuccessPopup((prev) => !prev)}
          message={
            language == "EN"
              ? "Your credit withdrawal request has been sent successfully. It will be reviewed soon."
              : "تم إرسال طلب سحب الرصيد بنجاح. سيتم مراجعته قريبًا"
          }
        />
      )}
    </div>
  );
}
