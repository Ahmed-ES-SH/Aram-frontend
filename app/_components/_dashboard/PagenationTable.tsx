/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaMoneyBill,
  FaPen,
} from "react-icons/fa";
import { instance } from "@/app/Api/axios";
import DeleteBtn from "./DeleteBtn";
import Loading from "../Loading";
import Img from "../Img";
import { LuClock } from "react-icons/lu";

///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////

export default function PaginatedTable({
  headers,
  api,
  apidelete,
  keys,
  editpath,
}: any): JSX.Element {
  // const { id, currentuser } = UseVariabels();
  const [data, setdata] = useState<any>(null);
  const [refresh, setrefresh] = useState(false);
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [emptydata, setemptydata] = useState<boolean>(false);

  const pathname = usePathname();

  const handlePageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };
  useEffect(() => {
    const getdata = async (page: number) => {
      try {
        setemptydata(false);
        setloading(true);
        const res = await instance.get(api, { params: { page } });
        setdata(res.data.data);
        setCurrentPage(res.data.pagination.current_page);
        setLastPage(res.data.pagination.last_page);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        if (error.response.status == 404) {
        }
        setemptydata(true);
      } finally {
        setloading(false);
      }
    };
    getdata(currentPage);
  }, [currentPage, api]);

  async function hadledelete(apidelete: any, id: any) {
    try {
      const res = await instance.delete(`${apidelete}/${id}`);
      setdata((prevData: any) =>
        prevData.filter((item: any) => item.id !== id)
      );
      setrefresh((prev) => !prev);
      throw res;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className=" w-full   border hidden-scrollbar h-full overflow-y-auto border-main_orange dark:border-gray-700 p-2 rounded-md text-black mt-2">
          <div className="overflow-x-auto rounded-t-lg">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-300/20   dark:bg-secend_dash ">
              <thead className="ltr:text-left rtl:text-right">
                <tr className="text-right">
                  {headers.map((head: any, index: number) => (
                    <th
                      key={index}
                      className={`whitespace-nowrap   px-4 py-2 font-medium text-right text-gray-900 dark:text-secend_text  `}
                    >
                      {head}
                    </th>
                  ))}
                  {api !== "" && pathname != "/dashbord" && (
                    <th className="whitespace-nowrap  dark:text-secend_text px-4 py-2 font-medium ">
                      إجراء
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="dark:odd:divide-y dark:divide-gray-400/50 dark:bg-secend_dash divide-y divide-gray-200">
                {emptydata ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="dark:bg-main_dash h-screen w-full "
                    >
                      <div className="flex flex-col gap-2 items-center justify-center w-full">
                        <h1 className="text-lg dark:text-white">
                          عفوا لا يوجد بيانات فى هذا الجدول حتى الأن
                        </h1>
                        <Img src="/dashboard/empty.png" className="w-[200px]" />
                      </div>
                    </td>
                  </tr>
                ) : data == null ? (
                  <tr>
                    <td colSpan={12} className="bg-main_dash">
                      <Loading />
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((item: any, index: number) => (
                    <tr className=" odd:bg-sky-500/30" key={index}>
                      {keys.map((key: any, index: number) => (
                        <td
                          className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-secend_text"
                          key={index}
                        >
                          {key == "image" || key == "icon" ? (
                            <Image
                              src={item[key] || "/avatars/3.jpg"}
                              alt="logo"
                              width={1024}
                              height={1280}
                              className="w-[40px] h-[40px] rounded-full"
                            />
                          ) : key == "images" ? (
                            <div className="flex items-center gap-2 max-w-[200px] overflow-hidden">
                              {item[key].map((src: any, index: number) => (
                                <img
                                  key={index}
                                  src={src}
                                  alt="alt"
                                  className="w-[50px] h-[40px] rounded-sm"
                                />
                              ))}
                            </div>
                          ) : key == "vendor" ? (
                            <Image
                              src={
                                item["vendor"]?.image || "/images/userbg.png"
                              }
                              width={1024}
                              height={1280}
                              alt="logo"
                              className="w-[60px] h-[60px] rounded-full"
                            />
                          ) : key == "vendor.name" ? (
                            item["vendor"]?.name
                          ) : key == "message" ? (
                            <p className="max-w-[100px] overflow-hidden">
                              {item["message"]}
                            </p>
                          ) : key == "status" ? (
                            <p
                              className={`px-3 py-2 w-[130px]  rounded-md dark:text-white text-center ${
                                item["status"] == "pending"
                                  ? "bg-red-400/60"
                                  : item["status"] == "reviewed"
                                  ? "bg-green-400/60"
                                  : item["status"] == "closed"
                                  ? "bg-yellow-400/60"
                                  : "bg-gray-400/60" // في حال كانت القيمة غير معروفة
                              }`}
                            >
                              {item["status"] == "pending"
                                ? "فى إنتظار المراجعة"
                                : item["status"] == "reviewed"
                                ? "تمت المراجعة"
                                : item["status"] == "closed"
                                ? "مغلق"
                                : "غير معروف"}
                            </p>
                          ) : key == "user.image" ? (
                            <Image
                              src={
                                item["user"]?.icon
                                  ? item["user"]?.icon
                                  : item["user"]?.image || "/images/userbg.png"
                              }
                              width={1024}
                              height={1280}
                              alt="logo"
                              className="w-[60px] h-[60px] rounded-full"
                            />
                          ) : key == "promoter.image" ? (
                            <Image
                              src={
                                item["promoter"]?.image
                                  ? item["promoter"]?.image
                                  : "/images/userbg.png"
                              }
                              width={1024}
                              height={1280}
                              alt="logo"
                              className="w-[60px] h-[60px] rounded-full"
                            />
                          ) : key == "promoter.name" ? (
                            <p>{item["promoter"]?.name}</p>
                          ) : key == "promoter.user_code" ? (
                            item["promoter"]?.user_code
                          ) : key == "amount" ||
                            key == "purchases_sum_amount" ? (
                            <p>{`$ ${item[key]} `}</p>
                          ) : key == "bell_type" ? (
                            <p>
                              {item["bell_type"] == "cards_bell" ? (
                                <div className="flex px-2 py-1 w-[120px] bg-green-400 items-center justify-center gap-1  ml-auto rounded-md shadow-sm">
                                  <p className="  text-white text-center ">
                                    {"فاتورة بطاقات"}
                                  </p>
                                  <FaMoneyBill className="text-white size-4" />
                                </div>
                              ) : (
                                <div className="flex px-2 py-1 bg-orange-400 items-center justify-center gap-1 w-[120px] ml-auto rounded-md shadow-sm">
                                  <p className="  text-white text-center ">
                                    {"فاتورة حجز"}
                                  </p>
                                  <LuClock className="text-white size-4" />
                                </div>
                              )}
                            </p>
                          ) : key == "user.id" ? (
                            item["user"]?.id
                          ) : key == "user.name" ? (
                            item["user"]?.name ? (
                              item["user"]?.name
                            ) : (
                              item["user"]?.title_en
                            )
                          ) : item["created_at"] && key == "created_at" ? (
                            item[key].split("T")[0] +
                            " " +
                            item[key].split("T")[1].split(".")[0]
                          ) : item["updated_at"] && key == "updated_at" ? (
                            item[key].split("T")[0] +
                            " " +
                            item[key].split("T")[1].split(".")[0]
                          ) : key == "statuss" ? (
                            <p
                              className={`px-3  py-2 w-fit rounded-md  dark:text-white text-center ${
                                item["status"] != "pending"
                                  ? "bg-green-400/60"
                                  : "bg-red-400/60"
                              }`}
                            >
                              {item["status"] != "pending"
                                ? "منشورة"
                                : "فى إنتظار الموافقة"}
                            </p>
                          ) : key == "bill_status" ? (
                            <p
                              className={`px-3  py-2 w-fit rounded-md  dark:text-white text-center ${
                                item["bill_status"] != false
                                  ? "bg-green-400/60"
                                  : "bg-red-400/60"
                              }`}
                            >
                              {item["bill_status"] == true
                                ? "نم الدفع"
                                : "فشل الدفع"}
                            </p>
                          ) : key == "order" ? (
                            <div className="flex items-center gap-2 ">
                              <p>({item[key].length})</p>
                              {item[key].map((order: any, index: number) => {
                                return (
                                  <div key={index} className="">
                                    {order.images && (
                                      <Image
                                        key={index}
                                        src={order.images[0] || ""}
                                        alt="alt"
                                        width={1024}
                                        height={1280}
                                        className="w-[20px] h-[20px] rounded-full"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : key == "order_status" ? (
                            item[key] == true ? (
                              <p
                                className={`px-1  py-2 rounded-md dark:text-white text-center bg-green-400`}
                              >
                                تم التحويل
                              </p>
                            ) : (
                              <p
                                className={`px-1  py-2 rounded-md dark:text-white text-center bg-red-400`}
                              >
                                فى انتظار المراجعة
                              </p>
                            )
                          ) : key == "balance" ? (
                            <p>${item["vendor"]?.balance}</p>
                          ) : (
                            item[key]
                          )}
                        </td>
                      ))}
                      <td>
                        <div className="flex items-center  gap-4">
                          {api != "/members" && (
                            <Link
                              href={`/dashboard${editpath}/${item["id"]}`}
                              className="text-sky-500"
                            >
                              <FaPen />
                            </Link>
                          )}
                          {apidelete != "/" && (
                            <DeleteBtn
                              api={api}
                              hadledelete={hadledelete}
                              apidelete={apidelete}
                              item={item}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="bg-main_dash">
                      <div className="h-[60vh] flex items-center  justify-center">
                        <div className="w-fit m-auto flex flex-col items-center justify-center">
                          <Image
                            src={"/Business_SVG.svg"}
                            alt="image"
                            width={1024}
                            height={1280}
                            className="w-[250px] max-md:w-[150px]"
                          />
                          <p className="text-white text-[22px] mt-3">
                            لم يتم إضافة بيانات الى الجدول حتى الوقت الحالى
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="w-fit bg-sky-400 ml-2 mt-4 px-2 py-1 border border-gray-300 rounded-md">
            <ol className="flex justify-center gap-1 text-xs font-medium">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
                >
                  <span className="sr-only">Prev Page</span>
                  <FaChevronCircleLeft
                    className={
                      currentPage > 1 ? "cursor-pointer" : "text-gray-400"
                    }
                  />
                </button>
              </li>

              {[...Array(lastPage)].map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`block size-8 rounded border text-center leading-8 ${
                      index + 1 === currentPage
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-100 bg-white text-gray-900"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= lastPage}
                  className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
                >
                  <span className="sr-only">Next Page</span>
                  <FaChevronCircleRight
                    className={
                      currentPage < lastPage
                        ? "cursor-pointer"
                        : "text-gray-400"
                    }
                  />
                </button>
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
