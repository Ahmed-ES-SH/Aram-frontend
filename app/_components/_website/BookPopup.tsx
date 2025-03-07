"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import SelectDay from "./_booking/SelectDay";
import { FaTimesCircle } from "react-icons/fa";
import TimeSlotSelector from "./_booking/TimeSlotSelector";
import { UseVariables } from "@/app/context/VariablesContext";
import { instance } from "@/app/Api/axios";
import PaymentOption from "./_booking/PaymentOption";
import { useDataContext } from "@/app/context/DataContext";
import { useRouter } from "next/navigation";
import Loading from "../Loading";

interface stepErrorType {
  ar: string;
  en: string;
}

export default function BookPopup({
  onClose,
  selectedOrg,
  successToggle,
  service,
  priceState,
}: any) {
  const { language } = UseVariables();
  const { currentuser, type, currenciesValue, activeCurrency } =
    useDataContext();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [stepError, setStepError] = useState<stepErrorType>({ ar: "", en: "" });
  const [bookedAppointments, setBookedAppointments] = useState<any>([]);
  const [payState, setPayState] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const steps = ["Day", "Time", "Finishe"];

  const handleStepError = (messageAr: string, messageEn: string) => {
    setStepError({ ar: messageAr, en: messageEn });
  };

  const Currency = currenciesValue[activeCurrency.code] || 1;

  const handleNextStep = () => {
    if (step < steps.length) {
      if (step === 1) {
        if (selectedDay) {
          setStep(step + 1);
          handleStepError("", ""); // إزالة الأخطاء
        } else {
          handleStepError("يرجى اختيار يوم.", "Please select a day.");
        }
      } else if (step === 2) {
        if (selectedTime) {
          setStep(step + 1);
          handleStepError("", ""); // إزالة الأخطاء
        } else {
          handleStepError("يرجى اختيار وقت.", "Please select a time.");
        }
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
    setPayState("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (payState == "") {
      return;
    }

    try {
      setLoading(true);
      // تحويل التاريخ إلى تنسيق مناسب
      const formattedDate = selectedDay.toLocaleDateString("en-CA"); // YYYY-MM-DD

      // دالة لإضافة 10 دقائق إلى الوقت
      const addMinutesToTime = (time: string, minutes: number) => {
        const [hour, minute] = time.split(":").map((val) => parseInt(val, 10));
        const amPm = time.includes("AM") ? "AM" : "PM";
        const date = new Date();
        date.setHours(amPm === "PM" && hour !== 12 ? hour + 12 : hour, minute);

        // إضافة الدقائق
        date.setMinutes(date.getMinutes() + minutes);

        // تحويل الوقت الجديد إلى نص
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true, // استخدام AM/PM
        });
      };

      // إضافة 15 دقائق إلى الوقت المحدد
      const expireTime = addMinutesToTime(selectedTime, 15);

      const formData = new FormData();
      formData.append("book_day", formattedDate);
      formData.append("book_time", selectedTime);
      formData.append("expire_in", expireTime);
      formData.append("additional_notes", additionalNotes);
      formData.append("user_id", currentuser.id);
      formData.append("organization_id", selectedOrg.id);

      const response = await instance.post("/add-book", formData);
      if (response.status == 201) {
        onClose();
        successToggle();
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlepaywithbooked = async (e: any) => {
    e.preventDefault();
    try {
      // تحويل التاريخ إلى تنسيق مناسب
      const formattedDate = selectedDay.toLocaleDateString("en-CA"); // YYYY-MM-DD

      // دالة لإضافة 10 دقائق إلى الوقت
      const addMinutesToTime = (time: string, minutes: number) => {
        const [hour, minute] = time.split(":").map((val) => parseInt(val, 10));
        const amPm = time.includes("AM") ? "AM" : "PM";
        const date = new Date();
        date.setHours(amPm === "PM" && hour !== 12 ? hour + 12 : hour, minute);

        // إضافة الدقائق
        date.setMinutes(date.getMinutes() + minutes);

        // تحويل الوقت الجديد إلى نص
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true, // استخدام AM/PM
        });
      };

      // إضافة 15 دقائق إلى الوقت المحدد
      const expireTime = addMinutesToTime(selectedTime, 15);
      const formdata = new FormData();
      formdata.append(
        "customerName",
        type == "Organization" ? currentuser.title_en : currentuser.name
      );
      formdata.append("customerEmail", currentuser.email);
      formdata.append("customerMobile", currentuser.phone_number);
      formdata.append("currentUserId", currentuser.id);
      formdata.append("currency", activeCurrency.code);
      formdata.append("notificationOption", "LNK");
      formdata.append(
        "invoiceValue",
        priceState == "service"
          ? service.confirmation_price
          : selectedOrg.confirmation_price
      );
      formdata.append("book_day", formattedDate);
      formdata.append("book_time", selectedTime);
      formdata.append("expire_in", expireTime);
      formdata.append("additional_notes", additionalNotes);
      formdata.append("user_id", currentuser.id);
      formdata.append("account_type", type);
      formdata.append("organization_id", selectedOrg.id);
      const response = await instance.post(
        "/payment/initiate-booked",
        formdata
      );
      if (response.data.IsSuccess) {
        router.push(response.data.Data.InvoiceURL);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getBookedAppointments = async () => {
      try {
        const response = await instance.get(
          `/booked-appointments/${selectedOrg.id}`
        );
        if (response.status === 200) {
          const data = response.data.data;
          setBookedAppointments(data);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    getBookedAppointments();
  }, [selectedOrg.id]);

  if (loading) return <Loading />;

  return (
    <div className="w-full h-screen  fixed top-0 left-0 bg-black/50 flex items-center justify-center z-[99999]">
      <motion.div
        className="bg-white  dark:bg-gray-800 rounded-md shadow-md p-4 w-3/4 h-[85%]  max-md:w-[95%] relative  "
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress Bar */}
        <div className=" relative  after:mt-4 after:block after:h-1 after:w-full after:rounded-lg after:bg-gray-200">
          <span
            className={` block duration-500 absolute left-0 bottom-0 h-1 ${
              step == 2 ? "w-1/2" : step == 3 ? "w-full" : "w-0"
            } rounded-lg bg-main_orange`}
          ></span>
          <ol className="grid grid-cols-3 text-sm font-medium text-gray-500">
            {steps.map((stepName, index) => (
              <li
                key={index}
                className={`relative flex justify-${
                  index === 0
                    ? "start"
                    : index === steps.length - 1
                    ? "end"
                    : "center"
                } ${index < step ? "text-blue-600" : "text-gray-600"}`}
              >
                <span
                  className={`absolute -bottom-[1.75rem] ${
                    index === 0
                      ? "start-0"
                      : index === steps.length - 1
                      ? "end-0"
                      : "left-1/2 -translate-x-1/2"
                  } rounded-full ${
                    index < step ? "bg-main_orange" : "bg-gray-600"
                  } text-white p-1`}
                >
                  {index < step ? (
                    <AiOutlineCheckCircle size={20} />
                  ) : (
                    <MdOutlineRadioButtonUnchecked size={20} />
                  )}
                </span>

                <span className="hidden sm:block">{stepName}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="text-center pb-2 px-6 border-b border-main_blue w-fit mx-auto text-gray-600 mt-8 mb-4">
          {steps[step - 1]}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <SelectDay
            orgId={selectedOrg.id}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            bookedAppointments={bookedAppointments}
          />
        )}

        {step === 2 && (
          <TimeSlotSelector
            openAt={selectedOrg.open_at}
            closeAt={selectedOrg.close_at}
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            bookedAppointments={bookedAppointments}
          />
        )}
        {step === 3 && (
          <>
            <div className="pb-2 border-b border-sky-400">
              <p className="mb-2 text-gray-700">
                {language == "EN" ? "Additional Notes" : "ملاحظات إضافية"}:
              </p>
              <textarea
                name="additional_notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full p-2 border rounded-md outline-none h-[25vh]"
                placeholder="Write your notes here..."
              />
            </div>
            <PaymentOption
              setPayState={setPayState}
              confirmation_status={
                priceState == "service"
                  ? service.confirmation_status == 1
                    ? true
                    : false
                  : selectedOrg.confirmation_status
              }
              price={
                priceState == "service"
                  ? service.confirmation_price
                  : selectedOrg.confirmation_price
              }
            />
          </>
        )}

        {/* Navigation Buttons */}
        <div className=" mt-4 absolute bottom-1 left-1/2 -translate-x-1/2 w-full p-2">
          {stepError.ar && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="my-4 text-lg text-red-400 p-2 w-fit mx-auto pb-2 border-b border-red-500"
            >
              {language == "EN" ? stepError.en : stepError.ar}
            </motion.p>
          )}
          <div className="flex items-center justify-between w-full">
            <button
              onClick={handlePrevStep}
              disabled={step === 1}
              className={`px-8 max-md:px-3 max-md:py-1 py-4 rounded-md ${
                step === 1
                  ? "bg-gray-300"
                  : "bg-red-300 text-white border border-transparent hover:bg-white hover:text-black hover:scale-105 hover:border-red-300 duration-150"
              } `}
            >
              {language == "EN" ? "Back" : "عودة"}
            </button>
            <button
              onClick={
                step === steps.length
                  ? payState == "paynow"
                    ? handlepaywithbooked
                    : handleSubmit
                  : handleNextStep
              }
              className={`px-8 max-md:px-3 max-md:py-1 py-4 bg-main_orange text-white rounded-md border border-transparent duration-150 ${
                step === steps.length && payState == ""
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-white hover:text-black hover:scale-105 hover:border-main_orange "
              }`}
            >
              {step === steps.length
                ? language == "EN"
                  ? "Book Now"
                  : "إحجز الأن"
                : language == "EN"
                ? "Next"
                : "التالى"}
            </button>
          </div>
        </div>
        <div
          onClick={onClose}
          className=" w-[30px] h-[30px] absolute -top-10 -right-8 max-md:-right-1 cursor-pointer bg-gray-200 rounded-full flex items-center justify-center  "
        >
          <FaTimesCircle className="size-5" />
        </div>
      </motion.div>
    </div>
  );
}
