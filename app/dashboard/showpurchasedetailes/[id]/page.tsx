"use client";
import CardComponent from "@/app/_components/_website/Cardcomponent";
import Img from "@/app/_components/Img";
import Loading from "@/app/_components/Loading";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FaCcMastercard,
  FaFileInvoiceDollar,
  FaPen,
  FaTimes,
} from "react-icons/fa";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function Page({ params }: any) {
  const Id = params.id;
  const [purchaseDetailes, setPurchaseDetailes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [billPopup, setBillPopup] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  useEffect(() => {
    const getpurchasedetailes = async (page: number) => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/user-purchases/${Id}?page=${page}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setPurchaseDetailes(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (Id) getpurchasedetailes(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage < lastPage) {
      setCurrentPage(newPage);
    }
  };

  const selectBill = (bill: any) => {
    setSelectedBill(bill);
    setBillPopup(true);
  };
  const renderSelectedBill = () => {
    let billDetails;
    try {
      billDetails =
        typeof selectedBill.bell_items === "string"
          ? JSON.parse(selectedBill.bell_items)
          : selectedBill.bell_items;
    } catch (error) {
      console.error("خطأ في تحليل JSON:", error);
      return null;
    }

    return (
      <div className="fixed z-[9999999] w-full h-screen top-0 left-0 bg-black/50 flex items-center justify-center">
        <motion.div
          className="p-6 bg-white relative rounded-2xl shadow-lg w-1/2 max-lg:w-3/4 max-md:w-[95%] max-sm:w-[98%] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaTimes
            onClick={() => setBillPopup(false)}
            className=" absolute top-2 left-2 cursor-pointer text-red-400 size-5"
          />
          <div className="flex items-center gap-4 mb-4">
            <FaFileInvoiceDollar className="text-4xl text-blue-500" />
            <h2 className="text-xl font-bold">تفاصيل الفاتورة</h2>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">
              نوع الحساب:{" "}
              <span className="font-medium">{selectedBill.account_type}</span>
            </p>
            <p className="text-gray-600">
              نوع الفاتورة:{" "}
              <span className="font-medium">{selectedBill.bell_type}</span>
            </p>
            <p className="text-gray-600">
              المبلغ الإجمالي:{" "}
              <span className="font-medium text-green-600">
                ${selectedBill.amount}
              </span>
            </p>
            <p className="text-gray-600">
              تاريخ الإنشاء:{" "}
              <span className="font-medium">
                {new Date(selectedBill.created_at).toLocaleDateString()}
              </span>
            </p>
          </div>

          <h3 className="text-lg font-semibold mb-3">العناصر:</h3>
          <div className="space-y-3">
            {billDetails.map((item: any) => (
              <motion.div
                key={item.id}
                className="p-4 flex items-center justify-between bg-gray-100 rounded-lg shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="">
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-gray-600 ">المدة: {item.duration}</p>
                  <p className="text-gray-600">الكمية: {item.quantity}</p>
                  <p className="text-green-600 font-semibold">${item.price}</p>
                </div>
                {item.image ? (
                  <CardComponent
                    width="w-52 m-0"
                    hight="h-32"
                    bg_img={item.image}
                  />
                ) : (
                  <FaCcMastercard className="size-12 text-gray-400" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) return <Loading />;
  return (
    <>
      <div className="w-full min-h-screen overflow-auto mx-auto p-6">
        <motion.table
          className="min-w-full bg-white border border-gray-300 overflow-auto rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead className="bg-gray-100">
            <tr>
              {[
                "الرقم التعريفي",
                "اسم المروج",
                "رمز المروج",
                "صورة المروج",
                "اسم المشترى",
                "صورة المشترى",
                "مبلغ عملية الشراء",
                "الحالة",
                "تاريخ الإنشاء",
                "تحقق من الفاتورة",
              ].map((header, index) => (
                <th
                  key={index}
                  className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {purchaseDetailes &&
              purchaseDetailes.map((item: any, index) => (
                <motion.tr
                  key={index}
                  className="border-b border-gray-200"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-4 px-6 text-sm text-gray-600">{item.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item.user?.name}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item.user?.user_code}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <Img
                      className="w-8 h-8 rounded-full object-cover"
                      src={
                        item?.user?.image
                          ? item?.user?.image
                          : "/avatars/avatar_male.png"
                      }
                    />
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item.buyer?.name ? item.buyer?.name : item.buyer?.title_en}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <Img
                      className="w-8 h-8 rounded-full object-cover"
                      src={
                        item?.buyer?.image
                          ? item?.buyer?.image
                          : item?.buyer?.icon || "/logo.png"
                      }
                    />
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item.amount} $
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 flex items-center">
                    <div className="flex items-center gap-2">
                      {item.status === "completed" ? (
                        <FiCheckCircle className="text-green-500 mr-2" />
                      ) : (
                        <FiXCircle className="text-red-500 mr-2" />
                      )}
                      <p>
                        {item.status === "completed" ? "مكتمل" : "غير مكتمل"}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 whitespace-nowrap px-6 text-sm text-gray-600">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="py-4 flex items-center justify-center">
                    <FaPen
                      onClick={() => selectBill(item?.bell)}
                      className="text-sky-400 cursor-pointer size-5"
                    />
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </motion.table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={lastPage}
        onPageChange={handlePageChange}
      />
      {billPopup && renderSelectedBill()}
    </>
  );
}
