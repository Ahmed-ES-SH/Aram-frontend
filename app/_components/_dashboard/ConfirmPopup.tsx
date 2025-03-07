import React from "react";

export default function ConfirmPopup({ onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-[300px] text-center">
        <h2 className="mb-4 text-lg font-semibold">تأكيد الحذف</h2>
        <p>هل أنت متأكد من أنك تريد حذف هذا العنصر؟</p>
        <div className="mt-4 flex justify-around">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            تأكيد
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
