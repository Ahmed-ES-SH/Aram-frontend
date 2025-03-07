import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import ConfirmPopup from "./ConfirmPopup";

interface props {
  apidelete: string;
  item: any;
  hadledelete: any;
  api: string;
}

export default function DeleteBtn({
  apidelete,
  item,
  hadledelete,
  api,
}: props) {
  const [showPopup, setShowPopup] = useState(false);

  const handleDelete = () => {
    setShowPopup(true);
  };

  const confirmDelete = () => {
    hadledelete(apidelete, item["id"]);
    setShowPopup(false); // أغلق الـ popup بعد الحذف
  };

  const cancelDelete = () => {
    setShowPopup(false); // أغلق الـ popup بدون حذف
  };

  return (
    <div>
      {api !== "/messagescustomer" && api !== "/messagesvendor" && (
        <button onClick={handleDelete} className="text-red-500">
          <FaTrash />
        </button>
      )}

      {showPopup && (
        <ConfirmPopup onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </div>
  );
}
