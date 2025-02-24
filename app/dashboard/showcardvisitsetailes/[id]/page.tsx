"use client";
import Loading from "@/app/_components/Loading";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

export default function Page({ params }: any) {
  const Id = params.id;
  const [visitDetailes, setvisitDetailes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getvisitdetailes = async (page: number) => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/card-visits-user/${Id}?page=${page}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setvisitDetailes(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (Id) getvisitdetailes(currentPage);
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
                معرف ال ip
              </th>
              <th className="py-3 px-6 whitespace-nowrap text-right text-sm text-gray-700">
                تاريخ الزيارة
              </th>
            </tr>
          </thead>
          <tbody>
            {visitDetailes &&
              visitDetailes.map((item: any, index) => (
                <motion.tr
                  key={index}
                  className="border-b border-gray-200"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-4 px-6 text-sm text-gray-600">{item.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {item.ip_address}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                    {new Date(item.created_at).toLocaleString()}
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
