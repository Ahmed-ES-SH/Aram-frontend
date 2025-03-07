import { motion } from "framer-motion";
import React from "react";
import { FaPen } from "react-icons/fa";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import Link from "next/link";

interface props {
  data: any;
}

export default function WithDrawsTable({ data }: props) {
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
      <div className="overflow-x-auto min-h-screen w-full p-6 bg-gray-100 rounded-lg shadow-lg">
        <motion.table
          className="min-w-full bg-white shadow-md rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-medium">ID</th>
              <th className="px-6 py-3 text-right text-sm font-medium">
                نوع الحساب
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium">
                حساب paypal
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium">
                المبلغ
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium">
                حساب المستخدم
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium">
                وقت الطلب
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium">
                إجراء
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any) => (
              <motion.tr
                key={item.id}
                className="border-b hover:bg-gray-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 text-sm text-gray-700">{item.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.account_type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.paypal_email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  ${item.amount}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      item.status === "pending"
                        ? "bg-yellow-500 text-white"
                        : item.status == "approved"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {item.status == "pending"
                      ? "معلق"
                      : item.status == "approved"
                      ? "تم التحويل"
                      : "مرفوض"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.user.icon}
                      alt="User Icon"
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                    />
                    <span className="text-gray-700">{item.user.title_en}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(item.created_at, "EN")}
                </td>
                {
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <Link
                      href={`/dashboard/withdrawbalancerequestes/${item.id}`}
                      className="block"
                    >
                      <FaPen className="text-sky-400 cursor-pointer size-5" />
                    </Link>
                  </td>
                }
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </>
  );
}
