"use client";
import React, { useState, useEffect } from "react";
import CardComponent from "../../_website/Cardcomponent";
import { instance } from "@/app/Api/axios";
import Img from "../../Img";
import Loading from "../../Loading";
import Pagination from "../../PaginationComponent";
import Link from "next/link";

export default function PromotionalCardsTable() {
  // const headers = [
  //   "ID",
  //   "صورة المروج",
  //   "إسم المروج",
  //   "اسم البطاقة",
  //   "شكل البطاقة",
  //   "رقم الفاتورة",
  //   "قيمة الفاتورة",
  //   "عدد عمليات",
  //   "تفاصيل العمليات",
  // ];

  const headers = [
    "معرف البطاقة",
    "البطاقة",
    "عنوان البطاقة",
    "قسم البطاقة",
    "عدد عمليات الشراء المروجة",
    "تفاصيل العمليات",
  ];

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const getdata = async (page: number) => {
      try {
        const response = await instance.get(
          `/card-types-by-numbers?page=${page}`
        );
        if (response.status === 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setData(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getdata(currentPage);
  }, [currentPage]);

  return (
    <div className="w-[98%] px-4 py-4 mt-4 m-auto dark:bg-secend_dash rounded-md">
      <h1 className="text-xl pb-4 border-b border-gray-300 dark:text-white text-black">
        إحصائيات البطاقات التى تم شراءها عن طريق كود مروج
      </h1>

      {loading ? (
        <Loading />
      ) : (
        <div className="w-full border hidden-scrollbar h-full overflow-y-auto border-main_orange dark:border-gray-700 p-2 rounded-md text-black mt-2">
          <div className="overflow-x-auto rounded-t-lg">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-300/20 dark:bg-secend_dash">
              {/* رأس الجدول */}
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 whitespace-nowrap text-right font-medium text-gray-700 dark:text-white"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* جسم الجدول */}
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((item: any) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {item.id}
                    </td>

                    <td className="px-4 py-2  text-gray-900 dark:text-white">
                      <div className="w-fit ml-auto">
                        <CardComponent
                          width="w-52"
                          hight="h-32"
                          bg_img={
                            item?.image ? item?.image : "/cards/card_1.jpg"
                          }
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900 dark:text-white">
                      {item?.title_en}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900 dark:text-white">
                      {item?.category?.title_en}
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {item?.number_of_promotional_purchases}
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {item?.number_of_promotional_purchases > 0 ? (
                        <Link
                          href={`/dashboard/showpromotionalcarddetailes/${item.id}`}
                          className="cursor-pointer whitespace-nowrap block w-fit mx-auto underline  hover:text-blue-600 duration-200 text-blue-400"
                        >
                          تفاصيل عمليات البطاقة
                        </Link>
                      ) : (
                        <p className="text-main_orange whitespace-nowrap underline w-fit mx-auto cursor-not-allowed">
                          لا يوجد عمليات شراء ترويجية خاصة بهذة البطاقة حتى الأن
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={lastPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
