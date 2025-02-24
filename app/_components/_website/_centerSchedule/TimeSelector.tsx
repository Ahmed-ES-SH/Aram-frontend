import React from "react";
import { motion } from "framer-motion";
import { UseVariables } from "@/app/context/VariablesContext";

export default function TimeSelector({
  openAt,
  closeAt,
  selectedTimes,
  setSelectedTimes,
  selectedDay,
  bookedAppointments,
}: any) {
  const { language } = UseVariables();
  // دالة لتوليد أوقات اختيار الوقت بناءً على open_at و close_at
  const generateTimeSlots = (openAt: any, closeAt: any) => {
    const slots = [];
    const [openHour, openMinute] = openAt.split(":").map(Number);
    const [closeHour, closeMinute] = closeAt.split(":").map(Number);

    let current = new Date();
    current.setHours(openHour, openMinute, 0, 0);

    const end = new Date();
    end.setHours(closeHour, closeMinute, 0, 0);

    while (current <= end) {
      slots.push(
        current.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      current.setMinutes(current.getMinutes() + 30); // خطوات نصف ساعة
    }
    return slots;
  };

  // توليد أوقات الاختيار
  const timeSlots = generateTimeSlots(openAt, closeAt);

  // دالة لتصفية المواعيد المحجوزة بناءً على اليوم المحدد
  const getBookedAppointmentsForSelectedDay = (selectedDay: Date) => {
    const selectedDateString = selectedDay.toLocaleDateString("en-CA"); // تنسيق YYYY-MM-DD
    return bookedAppointments.filter(
      (appointment: any) => appointment.book_day === selectedDateString
    );
  };

  // التحقق إذا كان الوقت محجوزًا في اليوم المحدد
  const isBooked = (time: string) => {
    const bookedAppointmentsForSelectedDay =
      getBookedAppointmentsForSelectedDay(selectedDay);
    return bookedAppointmentsForSelectedDay.some(
      (appointment: any) => appointment.book_time === time
    );
  };

  // دالة لإضافة أو إزالة الوقت من المصفوفة selectedTimes
  const toggleTime = (time: string) => {
    if (isBooked(time)) return; // لا تفعل شيئًا إذا كان الوقت محجوزًا

    const updatedTimes = selectedTimes || []; // استخدام مصفوفة فارغة إذا كانت selectedTimes تساوي null
    if (updatedTimes.includes(time)) {
      // إذا كان الوقت محددًا بالفعل، قم بإزالته
      setSelectedTimes(updatedTimes.filter((t: string) => t !== time));
    } else {
      // إذا لم يكن محددًا، قم بإضافته
      setSelectedTimes([...updatedTimes, time]);
    }
  };

  console.log(selectedTimes);
  console.log(selectedDay);

  return (
    <>
      <h2 className="text-xl max-md:text-md w-fit mx-auto text-center my-4 pb-3 border-b dark:text-white border-main_orange">
        {language == "EN"
          ? "Setting pending appointments"
          : "تحديد المواعيد المعلقة"}
      </h2>
      <div className="relative overflow-y-auto overflow-x-hidden p-4 h-[65vh]">
        {timeSlots.map((time, index) => {
          const booked = isBooked(time);
          const isSelected = (selectedTimes || []).includes(time); // التحقق من null

          return (
            <motion.div
              key={index}
              whileHover={{ scale: booked ? 1 : 1.1 }} // لا يتم التكبير إذا كان محجوزًا
              whileTap={{ scale: booked ? 1 : 0.95 }}
              onClick={() => toggleTime(time)} // إضافة أو إزالة الوقت عند النقر
              className={`p-4 my-4 text-center rounded-lg cursor-pointer ${
                booked
                  ? "bg-red-200 text-red-700 cursor-not-allowed"
                  : isSelected
                  ? "bg-main_orange text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-orange-300 hover:text-white duration-150"
              }`}
            >
              {time}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
