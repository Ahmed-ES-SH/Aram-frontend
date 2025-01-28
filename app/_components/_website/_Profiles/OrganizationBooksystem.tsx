"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";

interface props {
  onClose: () => void; // دالة تُغلق الـ popup
  form: Record<string, any>; // كائن يحتوي على البيانات (المفتاح والقيمة)
  setForm: any;
}

export default function OrganizationBooksystem({
  onClose,
  form,
  setForm,
}: props) {
  const [isConfirmationEnabled, setIsConfirmationEnabled] = useState<boolean>(
    form.confirmation_status || false
  );
  const [confirmationPrice, setConfirmationPrice] = useState<string | number>(
    form.confirmation_price || 0
  );

  const handleSave = () => {
    setForm({
      ...form,
      confirmation_status: isConfirmationEnabled,
      confirmation_price: confirmationPrice,
    });
    onClose();
  };

  console.log(form);

  return (
    <>
      <div className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-black/50 z-50">
        <motion.div
          className="w-1/2 max-md:w-full max-lg:w-3/4 max-md:p-2 p-6 bg-white rounded-md shadow-md relative"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            <MdClose size={24} />
          </button>

          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Booking Confirmation System
          </h2>

          {/* Toggle Confirmation */}
          <div className="flex items-center mb-4">
            <span className="text-gray-700 mr-4">Enable Confirmation:</span>
            <button
              onClick={() => setIsConfirmationEnabled(!isConfirmationEnabled)}
              className={`w-14 h-8 rounded-full flex items-center ${
                isConfirmationEnabled ? "bg-blue-500" : "bg-gray-300"
              } transition-colors duration-300`}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                layout
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  marginLeft: isConfirmationEnabled
                    ? "calc(100% - 24px)"
                    : "4px",
                }}
              ></motion.div>
            </button>
          </div>

          {/* Price Input */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="price">
              Confirmation Price:
            </label>
            <input
              type="number"
              id="price"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter confirmation price"
              value={confirmationPrice}
              onChange={(e) => setConfirmationPrice(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </motion.div>
      </div>
    </>
  );
}
