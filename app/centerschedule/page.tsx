"use client";
import React, { useEffect, useState } from "react";
import { instance } from "../Api/axios";
import { useDataContext } from "../context/DataContext";
import Calender from "../_components/_website/_centerSchedule/Calender";
import { UseVariables } from "../context/VariablesContext";
import TimeSelector from "../_components/_website/_centerSchedule/TimeSelector";
import SuccessPopup from "../_components/_dashboard/SuccessPopup";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function CenterSchedule() {
  const { currentuser } = useDataContext();
  const { language } = UseVariables();
  const orgId = currentuser && currentuser.id;
  const [bookedAppointments, setBookedAppointments] = useState<any>([]);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [showsuccessPopup, setshowsuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stepError, setStepError] = useState<any>({ ar: "", en: "" });
  const steps = ["Day", "Time", "Finishe"];
  useEffect(() => {
    const getBookedAppointments = async () => {
      try {
        const response = await instance.get(`/booked-appointments/${orgId}`);
        if (response.status === 200) {
          const data = response.data.data;
          setBookedAppointments(data);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    getBookedAppointments();
  }, [orgId]);

  const handleStepError = (messageAr: string, messageEn: string) => {
    setStepError({ ar: messageAr, en: messageEn });
  };

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
        if (selectedTimes.length > 0) {
          setStep(step + 1);
          handleStepError("", ""); // إزالة الأخطاء
        } else {
          handleStepError("يرجى اختيار وقت.", "Please select a time.");
        }
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setStepError({ ar: "", en: "" });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    try {
      if (selectedTimes.length === 0) {
        handleStepError("يرجى اختيار وقت.", "Please select a time.");
        setshowsuccessPopup(false);
        return;
      }
      setLoading(true);

      // تحويل التاريخ إلى تنسيق مناسب
      const formattedDate = selectedDay.toLocaleDateString("en-CA"); // YYYY-MM-DD

      // دالة لإضافة دقائق إلى الوقت
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

      // إرسال كل موعد في المصفوفة selectedTimes
      const requests = selectedTimes.map(async (time: string) => {
        // إضافة 15 دقائق إلى الوقت المحدد
        const expireTime = addMinutesToTime(time, 15);

        const formData = new FormData();
        formData.append("book_day", formattedDate);
        formData.append("book_time", time);
        formData.append("expire_in", expireTime);
        formData.append("additional_notes", "");
        formData.append("organization_id", orgId);

        // إرسال الطلب
        return instance.post("/pendding-book", formData);
      });

      // انتظار اكتمال جميع الطلبات
      const responses = await Promise.all(requests);

      // التحقق من نجاح جميع الطلبات
      if (responses.every((response) => response.status === 201)) {
        setshowsuccessPopup(true);
        await instance
          .get(`/booked-appointments/${orgId}`)
          .then((data) => setBookedAppointments(data.data.data));
        setSelectedDay(null);
        setSelectedTimes([]);
        setStep(1);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onclose = () => {
    setshowsuccessPopup((prev) => !prev);
  };

  if (loading)
    return (
      <div className="min-h-[98vh] h-full w-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <AiOutlineLoading3Quarters className="size-36 max-xl:size-24 text-main_orange animate-pulse" />
        </motion.div>
      </div>
    );
  return (
    <>
      <div className="w-full p-4 min-h-[95vh] relative bg-gradient-to-r from-orange-50 to-orange-100 dark:from-main_dash dark:to-secend_dash mt-20 pt-10">
        {step == 1 && (
          <Calender
            orgId={orgId}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            bookedAppointments={bookedAppointments}
            stepError={stepError}
          />
        )}
        {step === 2 && (
          <TimeSelector
            openAt={currentuser && currentuser.open_at}
            closeAt={currentuser && currentuser.close_at}
            selectedDay={selectedDay}
            selectedTimes={selectedTimes}
            setSelectedTimes={setSelectedTimes}
            bookedAppointments={bookedAppointments}
          />
        )}
        <p className="my-4 text-red-400 text-lg w-fit mx-auto pb-2 border-b border-red-400">
          {stepError && language == "EN" ? stepError.en : stepError.ar}
        </p>
        <div className="flex max-md:flex-col-reverse max-md:gap-4   items-center justify-between border-t border-main_orange w-[90%] mx-auto max-md:w-[97%] pt-8 my-4 ml-auto">
          <button
            onClick={handlePrevStep}
            className="min-w-[200px] max-md:w-[90%] mx-auto bg-gray-400   py-4 rounded-md  text-white text-center shadow-md "
          >
            {language == "EN" ? "Back" : "عودة"}
          </button>
          <button
            onClick={step == 2 ? handleSubmit : handleNextStep}
            disabled={!selectedDay}
            className="min-w-[200px] max-md:w-[90%] mx-auto disabled:bg-gray-400  bg-main_orange  py-4 rounded-md  text-white text-center shadow-md "
          >
            {step == 2
              ? language == "EN"
                ? "Suspend"
                : "تعليق"
              : language == "EN"
              ? "Next"
              : "التالى"}
          </button>
        </div>
      </div>
      {showsuccessPopup && (
        <SuccessPopup
          onClose={onclose}
          message={
            language == "EN"
              ? "Appointments have been successfully suspended."
              : "تم تعليق المواعيد المحددة بنجاح "
          }
        />
      )}
    </>
  );
}
