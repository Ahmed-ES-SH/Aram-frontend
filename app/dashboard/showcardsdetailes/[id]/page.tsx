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

export default function Page({ params, searchParams }: any) {
  const Id = params.id;
  const promoterCode = searchParams.promoter_code;
  const [cardsDetailes, setcardsDetailes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [billPopup, setBillPopup] = useState(false);

  const toggleShowBill = (bill: any) => {
    setSelectedBill(bill);
    setBillPopup(true);
  };

  useEffect(() => {
    const getcardsDetailes = async (page: number) => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/cards-detailes-for-promoter/${encodeURIComponent(
            promoterCode
          )}?page=${page}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setcardsDetailes(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (Id) getcardsDetailes(currentPage);
  }, [currentPage]);

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
      <div className="fixed w-full h-screen top-0 left-0 bg-black/50 flex items-center justify-center">
        <motion.div
          className="p-6 bg-white relative rounded-2xl h-[70vh] overflow-y-auto shadow-lg w-1/2 max-lg:w-[95%] mx-auto"
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
              نوع الفاتورة:{" "}
              <span className="font-medium">
                {selectedBill.bell_type && "فاتورة بطاقات"}
              </span>
            </p>
            <p className="text-gray-600">
              المبلغ الإجمالي:{" "}
              <span className="font-medium text-green-600">
                {selectedBill.amount} ريال
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
                className="p-4 flex items-center w-full justify-between bg-gray-100 rounded-lg shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="">
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-gray-600">المدة: {item.duration}</p>
                  <p className="text-gray-600">الكمية: {item.quantity}</p>
                  <p className="text-green-600 font-semibold">${item.price}</p>
                </div>
                {item.image ? (
                  <CardComponent
                    width="w-52 max-2xl:m-0"
                    hight="h-32"
                    bg_img={item.image}
                  />
                ) : (
                  <FaCcMastercard className="size-12  text-gray-400" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage < lastPage) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <div className="w-full  min-h-screen overflow-auto mx-auto p-6">
        <motion.table
          className="min-w-full bg-white overflow-auto border border-gray-300 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                الرقم التعريفي
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                اسم البطاقة
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                مظهر البطاقة
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                اسم المروج
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                صورة المروج
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                قيمة الفاتورة
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                رقم الفاتورة
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                كمية البطاقة فى الفاتورة
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                تفاصيل الفاتورة
              </th>
            </tr>
          </thead>
          <tbody>
            {cardsDetailes &&
              cardsDetailes.map((item: any, index) => (
                <motion.tr
                  key={index}
                  className="border-b border-gray-200"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-4 px-6 text-sm text-gray-600">{item.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item?.card?.title_en}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="w-fit ml-auto">
                      <CardComponent
                        width="w-52 mx-0"
                        hight="h-32"
                        bg_img={
                          item?.card?.image
                            ? item?.card?.image
                            : "/cards/card_1.jpg"
                        }
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item?.promoter?.name}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <Img
                      className="w-8 h-8 rounded-full"
                      src={
                        item?.promoter?.image
                          ? item?.promoter?.image
                          : "/avatars/avatar_male.png"
                      }
                    />
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item?.bell?.amount} ريال
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item?.bell?.id}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item?.order_quantity} بطاقات
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                    <FaPen
                      onClick={() => toggleShowBill(item?.bell)}
                      className="text-sky-400 size-5 cursor-pointer"
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
