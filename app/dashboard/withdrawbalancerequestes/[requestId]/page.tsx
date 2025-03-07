"use client";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Img from "@/app/_components/Img";
import Loading from "@/app/_components/Loading";
import { instance } from "@/app/Api/axios";
import ForbiddenPage from "@/app/forbiddenpage/page";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  RiUserLine,
  RiMailLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
} from "react-icons/ri";

export default function RequestPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.requestId;

  const [withdrawalData, setWithdrawalData] = useState<any>({});
  const [status, setStatus] = useState(withdrawalData.status);
  const [rejectionReason, setRejectionReason] = useState(
    withdrawalData.rejection_reason || ""
  );
  const [notificationMessage, setNotificationMessage] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setshowSuccessPopup] = useState(false);

  // النصوص الافتراضية بناءً على الحالة
  const defaultMessages: any = {
    pending: "طلبك قيد المراجعة، سنقوم بالرد عليك قريبًا.",
    approved: "تم تحويل المبلغ بنجاح. شكرًا لاستخدامك خدماتنا.",
    rejected: "نأسف لإبلاغك بأن طلبك قد تم رفضه بسبب: ",
  };

  const handleStatusChange = (e: any) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    // تعبئة نص الإشعار تلقائيًا بناءً على الحالة
    if (newStatus === "rejected") {
      setNotificationMessage(defaultMessages.rejected);
    } else {
      setNotificationMessage(defaultMessages[newStatus]);
    }

    // إعادة تعيين سبب الرفض إذا لم تكن الحالة "مرفوض"
    if (newStatus !== "rejected") {
      setRejectionReason("");
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/withdrawal-requests/${requestId}`
        );
        if (response.status === 200) {
          const data = response.data.data;
          setWithdrawalData(data);
          setRejectionReason(data.rejection_reason);
          setTransactionId(data.transaction_id);
          setStatus(data.status);
          // تعبئة نص الإشعار بالرسالة الافتراضية بناءً على الحالة الحالية
          setNotificationMessage(defaultMessages[data.status] || "");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [requestId]);

  const handleaprrov = async () => {
    try {
      if (withdrawalData.status == status) {
        alert(
          "هذة الحالة الحالية للطلب بالفعل برجاء اختيار حالة جديدة عند التعديل"
        );
        return;
      }

      if (!transactionId.trim()) {
        alert("من فضلك، أدخل معرف العملية الخاص ب PayPal.");
        return;
      }

      const response = await instance.post(
        `/withdrawal-requests/${requestId}/approve`,
        { transaction_id: transactionId }
      );
      if (response.status == 200) {
        await instance.post(`/notifications/send`, {
          message: notificationMessage,
          account_type: withdrawalData.account_type,
          user_id: withdrawalData.account_id,
        });
        setshowSuccessPopup(true);
        setRejectionReason("");
        setNotificationMessage("");
        setTimeout(() => {
          router.push(`/dashboard/withdrawbalancerequestes`);
        }, 500);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleReject = async () => {
    try {
      if (withdrawalData.status == status) {
        alert(
          "هذة الحالة الحالية للطلب بالفعل برجاء اختيار حالة جديدة عند التعديل"
        );
        return;
      }

      if (!rejectionReason.trim()) {
        alert("من فضلك، أدخل سبب الرفض.");
        return;
      }

      const response = await instance.post(
        `/withdrawal-requests/${requestId}/reject`,
        { rejection_reason: rejectionReason }
      );
      if (response.status == 200) {
        await instance.post(`/notifications/send`, {
          message: notificationMessage,
          account_type: withdrawalData.account_type,
          user_id: withdrawalData.account_id,
        });
        setshowSuccessPopup(true);
        setRejectionReason("");
        setNotificationMessage("");
        setTimeout(() => {
          router.push(`/dashboard/withdrawbalancerequestes`);
        }, 500);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-8"
    >
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-8">
        {withdrawalData.user && (
          <div className="flex items-center gap-4 mb-6">
            <Img
              src={
                withdrawalData.user.icon
                  ? withdrawalData.user.icon
                  : withdrawalData.user.image
              }
              className="w-16 h-16 rounded-full border-2 border-indigo-100"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {withdrawalData.user.title_en
                  ? withdrawalData.user.title_en
                  : withdrawalData.user.name}
              </h2>
              <p className="text-gray-500">{withdrawalData.account_type}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <RiUserLine className="text-indigo-500" />
            <span className="text-gray-700">
              معرف الحساب: {withdrawalData.account_id}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <RiMailLine className="text-indigo-500" />
            <span className="text-gray-700">
              حساب بايبال : {withdrawalData.paypal_email}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <RiMoneyDollarCircleLine className="text-indigo-500" />
            <span className="text-gray-700">
              المبلغ: ${withdrawalData.amount}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <RiCalendarLine className="text-indigo-500" />
            <span className="text-gray-700">
              تاريخ الإنشاء:{" "}
              {new Date(withdrawalData.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        {withdrawalData.status != "rejected" &&
          withdrawalData.status != "approved" && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                حالة الطلب
              </label>
              <select
                value={status}
                onChange={handleStatusChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="pending">قيد الانتظار</option>
                <option value="approved">تم التحويل</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
          )}

        {status === "rejected" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              سبب الرفض
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="أدخل سبب الرفض..."
              readOnly={withdrawalData.status == "rejected"}
            />
          </div>
        )}

        {withdrawalData.status != "rejected" &&
          withdrawalData.status != "approved" && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                نص الإشعار
              </label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="أدخل نص الإشعار..."
              />
            </div>
          )}
        {withdrawalData.status != "rejected" && status == "approved" && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              أدخل معرف العملية الخاص ب Paypal
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="أدخل معرف العملية الخاص ب Paypal ..."
              readOnly={withdrawalData.status == "approved"}
            />
          </div>
        )}

        {withdrawalData.status != "rejected" &&
          withdrawalData.status != "approved" && (
            <div className="mt-6 flex justify-end">
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
                onClick={status == "approved" ? handleaprrov : handleReject}
              >
                حفظ التغييرات
              </button>
            </div>
          )}
        {withdrawalData.status == "approved" && (
          <div className="w-full py-5 px-2 text-center rounded-md shadow-md text-white text-lg my-4 bg-green-400">
            تم التحويل
          </div>
        )}
        {withdrawalData.status == "rejected" && (
          <div className="w-full py-5 px-2 text-center rounded-md shadow-md text-white text-lg my-4 bg-red-400">
            طلب مرفوض
          </div>
        )}
      </div>
      {showSuccessPopup && (
        <SuccessPopup
          message={"تم حفظ التعديلات بنجاح"}
          onClose={() => setshowSuccessPopup(false)}
        />
      )}
    </motion.div>
  );
}
