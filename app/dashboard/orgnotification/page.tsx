"use client";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Loading from "@/app/_components/Loading";
import OrgsForSelect from "@/app/_components/OrgsForSelection";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function OrganizationNotification() {
  const [selectedOrgs, setSelectedOrgs] = useState<any[]>([]);
  const [messageuser, setmessageuser] = useState<string>("");
  const [mainError, setMainError] = useState<string>("");
  const [done, setDone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const onClose = () => {
    setShowSuccessPopup(false);
  };
  const maxSteps = 2;

  const canProceed =
    (step === 1 && selectedOrgs.length > 0) ||
    (step === 2 && messageuser.length > 0);

  const handleNextStep = () => {
    if (!canProceed) return;

    setStep((prev) => (prev < maxSteps ? prev + 1 : prev));
  };

  const handlePrevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
    setSelectedOrgs([]);
  };

  const handleSendNotification = async () => {
    if (!messageuser.trim()) {
      setMainError("يرجى إدخال نص الإشعار");
      return;
    }

    try {
      setMainError("");
      setLoading(true);

      const formData = new FormData();
      formData.append("user_ids", JSON.stringify(selectedOrgs));
      formData.append("account_type", "Organization");
      formData.append("message", messageuser);
      const response = await instance.post(
        "/multiplenotifications/send",
        formData
      );
      if (response.status == 200) {
        setmessageuser("");
        setShowSuccessPopup(true);
        setSelectedOrgs([]);
        setDone("تم الإرسال بنجاح!");
        setLoading(false);
        setStep(1);
      }
    } catch (error: any) {
      setLoading(false);
      setMainError("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="w-full bg-gray-50 min-h-screen py-6 px-4 max-md:px-2">
        <h1 className="text-2xl w-fit mx-auto pb-2 border-b border-sky-400 dark:text-secend_text font-bold mb-4 text-gray-800">
          إرسال إشعار الى مركز طبي !
        </h1>

        {step === 1 && <OrgsForSelect setSelectedOrgsProp={setSelectedOrgs} />}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white shadow rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-main_orange">
              <h2 className="text-xl max-md:text-sm">
                عدد المراكز الطبية المحددة :{" "}
                {selectedOrgs.length > 0 && selectedOrgs.length}
              </h2>
              <button
                onClick={() => {
                  setSelectedOrgs([]);
                  setStep(1);
                }}
                className="hover:text-red-500 hover:bg-white hover:border-red-400 border text-sm border-transparent duration-150 text-white bg-red-400 rounded-md shadow-md text-center px-4 py-2 max-md:px-2 max-md:py-1 flex items-center gap-2"
              >
                <FaTimes />
                إلغاء
              </button>
            </div>
            <textarea
              value={messageuser}
              onChange={(e) => setmessageuser(e.target.value)}
              placeholder="أدخل نص الإشعار..."
              className="w-full h-[50vh] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>

            {mainError && (
              <p className="text-red-500 w-fit mx-auto underline underline-red-300 mt-2">
                {mainError}
              </p>
            )}
          </motion.div>
        )}
      </div>
      <div className="w-full z-[999999999] fixed bottom-0 left-0 bg-gray-50 shadow-md rounded-t-md p-6 flex items-center justify-between">
        {step > 1 ? (
          <button
            onClick={handlePrevStep}
            className="px-8 py-2 text-center duration-200 text-white shadow-md rounded-md hover:bg-white hover:text-black hover:border-gray-300 border border-transparent bg-red-300"
          >
            السابق
          </button>
        ) : (
          <div />
        )}

        {step < maxSteps ? (
          <button
            onClick={handleNextStep}
            disabled={!canProceed}
            className={`px-8 py-2 text-center duration-200 text-white shadow-md rounded-md 
            border border-transparent ${
              canProceed
                ? "bg-main_orange hover:bg-white hover:text-black hover:border-main_orange"
                : "bg-gray-300 cursor-not-allowed opacity-50"
            }`}
          >
            التالي
          </button>
        ) : (
          <button
            onClick={handleSendNotification}
            disabled={selectedOrgs.length < 0 || messageuser.length === 0}
            className={`px-8 cursor-pointer py-2 text-center duration-200 text-white shadow-md rounded-md 
            border border-transparent ${
              selectedOrgs?.length && messageuser.length > 0
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 cursor-not-allowed opacity-50"
            }`}
          >
            إرسال
          </button>
        )}
      </div>
      {showSuccessPopup && <SuccessPopup message={done} onClose={onClose} />}
    </>
  );
}
