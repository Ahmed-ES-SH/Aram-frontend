"use client";
import { instance } from "@/app/Api/axios";
import { useDataContext } from "@/app/context/DataContext";
import { UseVariables } from "@/app/context/VariablesContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import Img from "../../Img";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import {
  MdAccessTime,
  MdCalendarToday,
  MdClose,
  MdNotes,
  MdPerson,
  MdSignalCellularNodata,
  MdTimer,
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Pagination from "../../PaginationComponent";
import { FcCurrencyExchange } from "react-icons/fc";

export default function InvoiceTable() {
  const { language }: any = UseVariables();
  const { currentuser } = useDataContext();
  const currentId = currentuser && currentuser.id;
  const translations: any = {
    EN: {
      invoiceDetails: "Invoice Details",
      bookingDate: "Booking Date",
      bookingTime: "Booking Time",
      paymentTime: "Payment Time",
      expirationTime: "Expiration Time",
      additionalNotes: "Additional Notes",
      noNotes: "No additional notes",
      userName: "User Name",
    },
    AR: {
      invoiceDetails: "تفاصيل الفاتورة",
      bookingDate: "تاريخ الحجز",
      bookingTime: "وقت الحجز",
      paymentTime: "وقت الدفع",
      expirationTime: "وقت الانتهاء",
      additionalNotes: "ملاحظات إضافية",
      noNotes: "لا توجد ملاحظات",
      userName: "اسم المستخدم",
    },
  };

  const t = translations[language] || translations.AR;

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [bills, setBills] = useState([]);
  const [selectedBell, setSelectedBell] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage < lastPage) {
      setCurrentPage(newPage);
    }
  };
  const openPopup = (bell: any) => {
    setSelectedBell(bell);
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    const getBills = async () => {
      try {
        const response = await instance.get(
          `/financial-transactions/${currentId}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setBills(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
        if (error.response.status == 404) {
          setBills([]);
        }
      } finally {
        setLoading(false);
      }
    };
    if (currentId) getBills();
  }, [currentId, currentPage]);

  const formatDate = (dateString: string, language: string) => {
    const locales: any = {
      EN: { format: "MMMM dd, yyyy hh:mm a", locale: enUS },
      AR: { format: "yyyy/MM/dd hh:mm a", locale: ar },
    };

    const { format: dateFormat, locale } = locales[language] || locales.EN;

    return format(new Date(dateString), dateFormat, { locale });
  };

  return (
    <>
      <div className="overflow-x-auto p-4">
        <motion.table
          className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <th className="px-6 py-3 text-left whitespace-nowrap">
                {language === "EN" ? "Invoice Amount" : "قيمة الفاتورة"}
              </th>
              <th className="px-6 py-3 text-left whitespace-nowrap">
                {language === "EN" ? "Type of operation" : "نوع العملية"}
              </th>
              <th className="px-6 py-3 text-left whitespace-nowrap">
                {language === "EN" ? "status of operation" : "حالة العملية"}
              </th>
              <th className="px-6 py-3 text-left whitespace-nowrap">
                {language === "EN" ? "Invoice Type" : "نوع الفاتورة"}
              </th>
              <th className="px-6 py-3 text-left whitespace-nowrap">
                {language === "EN" ? "Bill Payer" : "دافع الفاتورة"}
              </th>
              <th className="px-6 py-3 text-center whitespace-nowrap">
                {language === "EN" ? "Actions" : "الإجراءات"}
              </th>
            </tr>
          </thead>
          <tbody>
            {!loading ? (
              bills.length > 0 ? (
                bills.map((invoice: any, index: number) => (
                  <tr key={index} className="odd:bg-orange-50">
                    <td
                      className={`py-2 px-4 border-b ${
                        invoice.type_operation == "deposit"
                          ? "text-green-500"
                          : "text-red-400"
                      } `}
                    >{`${invoice.type_operation != "deposit" ? "-" : ""} $ ${
                      invoice.amount
                    }`}</td>
                    <td className="py-2 px-4  border-b ">
                      <p
                        className={`px-2 py-1 w-[120px]  rounded-md shadow-sm text-center text-white ${
                          invoice.type_operation == "deposit"
                            ? "bg-green-300"
                            : "bg-red-300"
                        }`}
                      >
                        {language == "EN"
                          ? invoice.type_operation
                          : invoice.type_operation == "deposit"
                          ? "إيداع"
                          : "سحب"}
                      </p>
                    </td>
                    <td className="py-2 px-4  border-b ">
                      <div
                        className={`${
                          invoice.status == "waiting"
                            ? "bg-yellow-300"
                            : invoice.status == "done"
                            ? "bg-green-300"
                            : "bg-red-300"
                        } text-white text-center rounded-md shadow-sm px-2 py-1 w-[120px] `}
                      >
                        {language == "EN"
                          ? invoice.status
                          : invoice.status == "waiting"
                          ? "معلق"
                          : invoice.status == "done"
                          ? "تم"
                          : "مرفوضة"}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b ">
                      {language == "EN"
                        ? invoice.bell_type
                        : invoice.bell_type == "confirm_booked"
                        ? "تأكيد حجز"
                        : invoice.bell_type == "withdraw_balance"
                        ? "عملية سحب"
                        : "غير معرف"}
                    </td>
                    {invoice.type_operation == "withdraw" ? (
                      <td className="py-2 px-4 border-b  ">
                        <div className="flex items-center gap-3 px-3 group">
                          <Img
                            src={
                              currentuser && currentuser.icon
                                ? currentuser.icon
                                : currentuser.image || "/public"
                            }
                            className="w-7 h-7 border rounded-full"
                          />
                          <p className="group-hover:underline whitespace-nowrap duration-150 cursor-pointer">
                            {currentuser.title_en
                              ? currentuser.title_en
                              : currentuser.name}
                          </p>
                        </div>
                      </td>
                    ) : (
                      <td className="py-2 px-4 border-b  ">
                        <div className="flex items-center gap-3 px-3 group">
                          <Img
                            src={
                              invoice.Bill_payer.icon
                                ? invoice.Bill_payer.icon
                                : invoice.Bill_payer.image || "/public"
                            }
                            className="w-7 h-7 border rounded-full"
                          />
                          <p className="group-hover:underline whitespace-nowrap duration-150 cursor-pointer">
                            {invoice.Bill_payer.title_ar
                              ? invoice.Bill_payer.title_ar
                              : invoice.Bill_payer.name}
                          </p>
                        </div>
                      </td>
                    )}
                    {invoice.type_operation != "withdraw" ? (
                      <td className="py-2 px-4 border-b ">
                        <motion.button
                          onClick={() => openPopup(invoice)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-blue-500 w-[180px] text-white  mx-auto px-4 py-2 whitespace-nowrap rounded flex items-center justify-center"
                        >
                          <FaInfoCircle className="mr-2" />
                          {language == "EN"
                            ? "Bill Deatiles"
                            : "تفاصيل الفاتورة"}
                        </motion.button>
                      </td>
                    ) : (
                      <td>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-red-300 w-[180px] text-white  mx-auto px-4 py-2 whitespace-nowrap rounded flex items-center justify-center"
                        >
                          <FaInfoCircle className="mr-2" />
                          {language == "EN"
                            ? "withdraw operation"
                            : "عملية سحب"}
                        </motion.button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12}>
                    <div className="h-[70vh] flex items-center justify-center">
                      <div className="flex items-center gap-3 flex-col">
                        <MdSignalCellularNodata className="size-36 text-gray-400" />
                        <p>
                          {language == "EN"
                            ? "No Data Available For This Account yet ."
                            : "لا توجد معاملات مالية تخص هذا الحساب حتى الأن ."}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan={12} className="dark:bg-main_dash">
                  <div className="h-[58vh] flex items-center  justify-center">
                    <div className="w-fit m-auto flex flex-col items-center justify-center">
                      <div className=" h-full w-full flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <AiOutlineLoading3Quarters className="size-20 max-xl:size-24 text-main_orange animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
        <Pagination
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={handlePageChange}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative"
            >
              {/* زر الإغلاق */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <MdClose className="text-2xl" />
              </button>

              {/* عنوان البوب أب */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {t.invoiceDetails}
              </h2>

              {/* تفاصيل الفاتورة */}
              <div className="space-y-4">
                {/* تاريخ الحجز */}
                <div className="flex items-center gap-3">
                  <MdCalendarToday className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.bookingDate}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {selectedBell.bell_items.book_day}
                    </p>
                  </div>
                </div>

                {/* وقت الحجز */}
                <div className="flex items-center gap-3">
                  <MdAccessTime className="text-green-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.bookingTime}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {selectedBell.bell_items.book_time}
                    </p>
                  </div>
                </div>

                {/* وقت الدفع */}
                <div className="flex items-center gap-3">
                  <FcCurrencyExchange className="text-green-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.paymentTime}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {formatDate(selectedBell.created_at, language)}
                    </p>
                  </div>
                </div>

                {/* وقت الانتهاء */}
                <div className="flex items-center gap-3">
                  <MdTimer className="text-red-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.expirationTime}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {selectedBell.bell_items.expire_in}
                    </p>
                  </div>
                </div>

                {/* ملاحظات إضافية */}
                <div className="flex items-center gap-3">
                  <MdNotes className="text-purple-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.additionalNotes}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {selectedBell.bell_items.additional_notes || t.noNotes}
                    </p>
                  </div>
                </div>

                {selectedBell.type_operation != "withdraw" && (
                  <div className="flex items-center gap-3">
                    <MdPerson className="text-orange-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.userName}
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {language === "EN"
                          ? selectedBell.Bill_payer.title_en ||
                            selectedBell.Bill_payer.name
                          : selectedBell.Bill_payer.title_ar ||
                            selectedBell.Bill_payer.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
