"use client";
import React, { useState } from "react";
import CouponsForSelect from "@/app/_components/_dashboard/_coupons/Coupons";
import UsersForSelect from "@/app/_components/_dashboard/_coupons/UsersForSelect";
import { instance } from "@/app/Api/axios";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import { GrOrganization, GrUser } from "react-icons/gr";
import OrgsForSelect from "@/app/_components/OrgsForSelection";

export default function Page() {
  const [step, setStep] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [selectedCoupoe, setSelectedCoupone] = useState<any>({});
  const [showSuccessPopoup, setShowSuccessPopoup] = useState(false);
  const [currentSelectedType, setCurrentSelectedType] = useState("");

  const maxSteps = 2;

  const canProceed =
    (step === 1 && selectedCoupoe?.id) ||
    (step === 2 && selectedUsers.length > 0);

  const handleNextStep = () => {
    if (!canProceed) return;

    setStep((prev) => (prev < maxSteps ? prev + 1 : prev));
  };

  const handlePrevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleSend = async () => {
    if (!selectedCoupoe?.id || selectedUsers.length === 0) return;

    try {
      const formdata = new FormData();
      formdata.append("users_array", JSON.stringify(selectedUsers));
      formdata.append("coupon_id", selectedCoupoe.id);
      formdata.append("account_type", currentSelectedType);
      const response = await instance.post(`/send-coupone`, formdata);
      if (response.status == 200) {
        setStep(1);
        setSelectedCoupone({});
        setSelectedUsers([]);
        setShowSuccessPopoup(true);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleselectType = (type: string) => {
    setCurrentSelectedType(type);
    setStep(3);
  };

  return (
    <>
      {step === 1 && (
        <CouponsForSelect setSelectedCouponeprop={setSelectedCoupone} />
      )}

      {step == 2 && (
        <div className="w-full min-h-[90vh] flex flex-col gap-6 items-center justify-center">
          <h1 className="pb-3 border-b border-main_orange w-fit mx-auto">
            حدد الفئة المراد إرسال الكوبون إليها{" "}
          </h1>
          <div className="w-[60%] flex items-center gap-5 justify-between">
            <div
              onClick={() => handleselectType("Organization")}
              className="flex flex-col flex-1 cursor-pointer duration-200 group hover:scale-110 hover:bg-main_orange shadow-md rounded-md h-[350px] py-2 justify-center  items-center bg-gray-50 gap-4"
            >
              <GrOrganization className="size-28 text-orange-500" />
              <p className="text-2xl group-hover:text-white">منظمات</p>
            </div>
            <div
              onClick={() => handleselectType("User")}
              className="flex flex-col items-center cursor-pointer duration-200 group hover:scale-110 hover:bg-sky-400 shadow-md rounded-md flex-1 h-[350px] py-2 justify-center  bg-gray-50 gap-4"
            >
              <GrUser className="size-28 text-sky-500" />
              <p className="text-2xl group-hover:text-white">مستخدمين</p>
            </div>
          </div>
        </div>
      )}
      {step === 3 && currentSelectedType == "User" ? (
        <UsersForSelect setSelectedUsersProp={setSelectedUsers} />
      ) : (
        <OrgsForSelect setSelectedOrgsProp={setSelectedUsers} />
      )}

      <div className="w-full fixed bottom-0 left-0 bg-gray-50 shadow-md rounded-t-md p-6 flex items-center justify-between">
        {step > 1 ? (
          <button
            onClick={handlePrevStep}
            className="px-8 py-2 text-center duration-200 text-white shadow-md rounded-md hover:bg-white hover:text-black hover:border-gray-300 border border-transparent bg-gray-300"
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
            onClick={handleSend}
            disabled={!selectedCoupoe?.id || selectedUsers.length === 0}
            className={`px-8 py-2 text-center duration-200 text-white shadow-md rounded-md 
            border border-transparent ${
              selectedCoupoe?.id && selectedUsers.length > 0
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 cursor-not-allowed opacity-50"
            }`}
          >
            إرسال
          </button>
        )}
      </div>

      {showSuccessPopoup && (
        <SuccessPopup
          onClose={() => setShowSuccessPopoup((prev) => !prev)}
          message="تم إرسال الكوبون إلى المستخدمين المحددين"
        />
      )}
    </>
  );
}
