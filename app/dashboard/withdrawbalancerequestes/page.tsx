"use client";
import HeadTable from "@/app/_components/_dashboard/Head_table";
import PaginatedTable from "@/app/_components/_dashboard/PagenationTable";
import WithDrawsTable from "@/app/_components/_dashboard/WithDrawsTable";
import Loading from "@/app/_components/Loading";
import Pagination from "@/app/_components/PaginationComponent";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage < lastPage) {
      setCurrentPage(newPage);
    }
  };
  useEffect(() => {
    const getdata = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/withdrawal-requests`);
        if (response.status == 200) {
          const data = response.data.data;
          const pagination = response.data.pagination;
          setData(data);
          setCurrentPage(pagination.current_page);
          setLastPage(pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getdata();
  }, [currentPage]);

  if (loading) return <Loading />;

  return (
    <>
      <div className="flex items-start flex-col gap-3 w-full p-6 max-md:p-2">
        <HeadTable title="طلبات سحب الرصيد" linktitle="" path="" />
        <WithDrawsTable data={data} />
        <Pagination
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
