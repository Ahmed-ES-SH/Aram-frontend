import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number; // الصفحة الحالية
  totalPages: number; // عدد الصفحات الإجمالي
  onPageChange: (page: number) => void; // دالة لتغيير الصفحة
}

export default function PaginationWithoutNumbers({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): JSX.Element {
  const handlePageClick = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center gap-2 my-6">
      {/* Previous Button */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        className={`inline-flex w-8 h-8 items-center justify-center rounded border ${
          currentPage === 1
            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
        } transition`}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Prev Page</span>
        <FaChevronLeft className="w-3 h-3" />
      </button>

      {/* Next Button */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        className={`inline-flex w-8 h-8 items-center justify-center rounded border ${
          currentPage === totalPages
            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
        } transition`}
        disabled={currentPage === totalPages}
      >
        <span className="sr-only">Next Page</span>
        <FaChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}
