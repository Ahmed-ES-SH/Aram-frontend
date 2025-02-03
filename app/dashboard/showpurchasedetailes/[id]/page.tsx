"use client";
import Loading from "@/app/_components/Loading";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function Page({ params }: any) {
  const Id = params.id;
  const [purchaseDetailes, setPurchaseDetailes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
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
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                الرقم التعريفي
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                رمز المستخدم
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                مبلغ عملية الشراء
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                الحالة
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                تاريخ الإنشاء
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                تاريخ التحديث
              </th>
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
                    {item.promo_code}
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
                  <td className="py-4 whitespace-nowrap px-6 text-sm text-gray-600">
                    {new Date(item.updated_at).toLocaleString()}
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
    </>
  );
}
