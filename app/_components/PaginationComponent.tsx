import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number; // الصفحة الحالية
  totalPages: number; // عدد الصفحات الإجمالي
  onPageChange: (page: number) => void; // دالة لتغيير الصفحة
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): JSX.Element {
  const handlePageClick = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <ol
      style={{ direction: "ltr" }}
      className="flex justify-center gap-1 text-xs font-medium pt-4 border-t border-gray-300 dark:border-gray-700 my-6"
    >
      {/* Previous Button */}
      <li>
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          className="inline-flex w-8 h-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          <span className="sr-only">Prev Page</span>
          <FaChevronLeft className="w-3 h-3" />
        </button>
      </li>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <li key={page}>
            <button
              onClick={() => handlePageClick(page)}
              className={`block w-8 h-8 rounded border text-center leading-8 font-medium transition
              ${
                page == currentPage
                  ? "bg-main_orange text-white border-orange-400"
                  : "bg-white text-gray-900 border-gray-100 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          </li>
        )
      )}

      {/* Next Button */}
      <li>
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          className="inline-flex w-8 h-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Next Page</span>
          <FaChevronRight className="w-3 h-3" />
        </button>
      </li>
    </ol>
  );
}
