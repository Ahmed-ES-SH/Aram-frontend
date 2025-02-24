import React from "react";
import { motion } from "framer-motion";

export default function TimeSlotSelector({
  openAt,
  closeAt,
  selectedTime,
  setSelectedTime,
  selectedDay,
  bookedAppointments,
}: any) {
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

  return (
    <div className="relative overflow-y-auto overflow-x-hidden p-4 h-[45vh]">
      {timeSlots.map((time, index) => {
        const booked = isBooked(time);
        return (
          <motion.div
            key={index}
            whileHover={{ scale: booked ? 1 : 1.1 }} // لا يتم التكبير إذا كان محجوزًا
            whileTap={{ scale: booked ? 1 : 0.95 }}
            onClick={() => !booked && setSelectedTime(time)} // منع النقر إذا كان محجوزًا
            className={`p-4 my-4 text-center rounded-lg cursor-pointer ${
              booked
                ? "bg-red-200 text-red-700 cursor-not-allowed"
                : selectedTime === time
                ? "bg-main_orange text-white"
                : "bg-gray-200 text-gray-700 hover:bg-orange-300 hover:text-white duration-150"
            }`}
          >
            {time}
          </motion.div>
        );
      })}
    </div>
  );
}
