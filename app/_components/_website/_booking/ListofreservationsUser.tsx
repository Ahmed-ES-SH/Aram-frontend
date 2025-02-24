"use client";
import { instance } from "@/app/Api/axios";
import { useDataContext } from "@/app/context/DataContext";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "../../Loading";
import { UseVariables } from "@/app/context/VariablesContext";
import Footer from "../Footer";
import {
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiFilter,
  FiThumbsUp,
  FiHash,
  FiCalendar,
  FiInfo,
  FiHome,
  FiFileText,
  FiXCircle,
} from "react-icons/fi";
import { MdOutlineSignalCellularNodata } from "react-icons/md";
import DeleteBooking from "./DeleteBooking";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import SidebarFilter from "./SidebarFilter";

export default function ListofreservationsUser() {
  const { currentuser, type } = useDataContext();
  const { language } = UseVariables();
  const id = currentuser && currentuser.id;
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [sidebarShow, setSidebarShow] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState({
    ar: "",
    en: "",
  });

  const translations: any = {
    AR: {
      filters: {
        all: "الكل",
        waiting: "قيد الانتظار",
        done: "منتهية",
        expired: "منتهية الصلاحية",
        acceptable: "مقبول",
        unacceptable: "غير مقبول",
      },
      headings: {
        filter: "فلترة المواعيد",
        details: "تفاصيل الحجوزات",
        bookingId: "رقم الحجز",
        day: "اليوم",
        time: "الوقت",
        status: "الحالة",
        centerName: "اسم المركز",
        notes: "ملاحظات إضافية",
        action: "إجراء",
        noBookings: "لا توجد حجوزات مطابقة.",
      },
    },
    EN: {
      filters: {
        all: "All",
        waiting: "Waiting",
        done: "Done",
        expired: "Expired",
        acceptable: "Acceptable",
        unacceptable: "Unacceptable",
      },
      headings: {
        filter: "Filter Appointments",
        details: "Reservation Details",
        bookingId: "Booking ID",
        day: "Day",
        time: "Time",
        status: "Status",
        centerName: "Center Name",
        notes: "Additional Notes",
        action: "Action",
        noBookings: "No matching reservations found.",
      },
    },
  };

  const t = translations[language] || translations.EN;

  useEffect(() => {
    const getBookings = async () => {
      try {
        const response = await instance.get(`/bookings/${id}/${type}`);
        if (response.status === 200) {
          const data = response.data.data;
          setBookings(data);
          setFilteredBookings(data); // افتراضيًا، عرض كل المواعيد
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, [id, type]);

  useEffect(() => {
    // تصفية الحجوزات بناءً على الفلتر
    if (filter === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter((booking: any) => booking.status === filter)
      );
    }
  }, [filter, bookings]);

  const filterColors: Record<string, string> = {
    all: "bg-blue-500/50",
    done: "bg-green-500/50",
    waiting: "bg-main_orange",
    acceptable: "bg-sky-400/50",
    expired: "bg-gray-400/50",
    unacceptable: "bg-red-500/50 ",
  };
  const hoverfilterColors: Record<string, string> = {
    all: "hover:bg-blue-500/50",
    done: "hover:bg-green-500/50",
    waiting: "hover:bg-main_orange",
    acceptable: "hover:bg-sky-400/50",
    expired: "hover:bg-gray-400/50",
    unacceptable: "hover:bg-red-500/50 ",
  };
  const filterIcons: Record<string, JSX.Element> = {
    all: <FiFilter className="text-blue-500" />,
    waiting: <FiClock className="text-orange-500" />,
    done: <FiCheck className="text-green-500" />,
    expired: <FiAlertCircle className="text-gray-400" />,
    acceptable: <FiThumbsUp className="text-sky-400" />,
    unacceptable: <FiXCircle className="text-red-500" />,
  };

  const tableBorderColors: Record<string, string> = {
    all: "border-blue-500/50",
    expired: "border-gray-400/50",
    done: "border-green-500/50",
    waiting: "border-main_orange",
    acceptable: "border-sky-400/50",
    unacceptable: "border-red-500/50",
  };

  const tableIcons: Record<string, JSX.Element> = {
    bookingId: <FiHash className="inline mr-2 text-blue-500" />, // أيقونة مع التنسيق
    day: <FiCalendar className="inline mr-2 text-green-500" />,
    time: <FiClock className="inline mr-2 text-main_orange" />,
    status: <FiInfo className="inline mr-2 text-red-500" />,
    centerName: <FiHome className="inline mr-2 text-sky-400" />,
    notes: <FiFileText className="inline mr-2 text-gray-400" />,
    delete: <RiDeleteBack2Fill className="inline mr-2 text-red-400" />,
  };

  const tableTextsColors: Record<string, string> = {
    all: "text-blue-500",
    expired: "text-gray-400",
    done: "text-green-500",
    waiting: "text-main_orange",
    acceptable: "text-sky-400",
    unacceptable: "text-red-500",
  };

  const deleteBooking = async (booking: any) => {
    try {
      setLoading(true);
      const response = await instance.post(
        `/book/${booking.id}/${booking?.user?.id}/${null}`
      );
      if (response.status == 200) {
        setIsPopupVisible(true);
        setSuccessPopupMessage({
          ar: "تم حذف الموعد بنجاح من قاعدة البيانات .",
          en: "The appointment has been successfully deleted from the database.",
        });
        setBookings((prevData) =>
          prevData.filter((book: any) => book.id !== booking.id)
        );
        setDeletePopup(false);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const closeDeletePopup = () => {
    setDeletePopup(false);
  };

  const deleteToggle = (item: any) => {
    setDeletePopup(true);
    setSelectedBooking(item);
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="w-full mb-2 h-screen mt-20 flex items-start">
        {/* الفلاتر */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-[20%] max-md:hidden  h-full bg-gray-200 dark:bg-gray-800 dark:text-secend_text p-4"
        >
          <h2 className="text-lg font-semibold mb-4">{t.headings.filter}</h2>
          <ul className="divide-y divide-gray-300 dark:divide-gray-700">
            {/* لإضافة خط سفلي */}
            {Object.keys(filterColors).map((key) => (
              <motion.li
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 cursor-pointer duration-150 dark:text-white p-2 rounded ${
                  filter === key
                    ? `${filterColors[key]} text-white` // اللون النشط
                    : `${hoverfilterColors[key]} hover:text-white` // لون عند التمرير
                }`}
                onClick={() => setFilter(key)}
              >
                {filterIcons[key]} {/* عرض الأيقونة */}
                <span>{t.filters[key]}</span> {/* النص بجانب الأيقونة */}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* تفاصيل الحجوزات */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-grow overflow-x-auto min-h-screen h-fit max-md:p-4 max-h-full bg-white dark:bg-main_dash p-4"
        >
          <h2
            className={`text-lg font-semibold dark:text-secend_text mb-4 pb-2 border-b ${tableBorderColors[filter]}`}
          >
            {t.headings.details}
          </h2>
          {filteredBookings.length > 0 ? (
            <table
              className={`w-full overflow-x-auto  bg-white dark:bg-secend_dash dark:text-white rounded-lg shadow border ${tableBorderColors[filter]}`}
            >
              <thead className="bg-sky-400/60 text-white rounded-md">
                <tr>
                  <th className="p-2 text-left whitespace-nowrap">
                    {tableIcons.bookingId}
                    {t.headings.bookingId}
                  </th>
                  <th className="p-2 text-left whitespace-nowrap">
                    {tableIcons.day}
                    {t.headings.day}
                  </th>
                  <th className="p-2 text-left whitespace-nowrap">
                    {tableIcons.time}
                    {t.headings.time}
                  </th>
                  <th className="p-2 text-left whitespace-nowrap">
                    {tableIcons.status}
                    {t.headings.status}
                  </th>
                  <th className="p-2 text-left whitespace-nowrap">
                    {tableIcons.centerName}
                    {t.headings.centerName}
                  </th>
                  <th className="p-2 text-left whitespace-nowrap">
                    {tableIcons.notes}
                    {t.headings.notes}
                  </th>
                  <th className="p-2 text-left whitespace-nowrap">
                    {tableIcons.delete}
                    {t.headings.action}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking: any) => (
                  <motion.tr
                    key={booking.id}
                    className="border-b last:border-none my-4 dark:divide-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 duration-150"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="p-2 whitespace-nowrap">{booking.id}</td>
                    <td className="p-2 whitespace-nowrap">
                      {booking.book_day}
                    </td>
                    <td className="p-2 whitespace-nowrap">{`${booking.book_time} - ${booking.expire_in}`}</td>
                    <td
                      className={`p-2  w-fit mx-left text-left rounded-md pt-2 `}
                    >
                      <p
                        className={`block whitespace-nowrap py-3 rounded-lg ${
                          tableTextsColors[booking.status]
                        }`}
                      >
                        {booking.status}
                      </p>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {booking?.organization?.title_en ||
                        "Organization Deleted This booking"}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {(booking.additional_notes &&
                        booking.additional_notes.slice(0, 40) + "...") ||
                        "No notes"}
                    </td>
                    <td>
                      <button
                        onClick={() => deleteToggle(booking)}
                        className="px-4 py-2 bg-red-400 rounded-md shadow-sm hover:bg-white hover:text-black hover:border-red-400 hover:scale-105 duration-150 border border-transparent text-white text-center"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-full h-[80vh] flex items-center justify-center">
              <div className="flex flex-col gap-4">
                <MdOutlineSignalCellularNodata className="size-80 text-gray-500" />
                <p className="text-center text-lg dark:text-white">
                  {t.headings.noBookings}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {deletePopup && (
        <DeleteBooking
          selectedBooking={selectedBooking}
          handleDelete={deleteBooking}
          onClose={closeDeletePopup}
        />
      )}

      <SidebarFilter
        filter={filter}
        setFilter={setFilter}
        setFilteredBookings={setFilteredBookings}
        bookings={bookings}
        sidebarShow={sidebarShow}
        setSidebarShow={setSidebarShow}
      />
    </>
  );
}
