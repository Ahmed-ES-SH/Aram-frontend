import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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
      {/* Previous */}
      <div
        onClick={() => handlePageClick(currentPage - 1)}
        tabIndex={0} // يجعل العنصر قابلًا للتركيز بلوحة المفاتيح
        role="button" // تحسين الوصولية (Accessibility)
        className={`inline-flex w-8 h-8 items-center justify-center rounded border cursor-pointer ${
          currentPage === 1
            ? "border-gray-300 bg-gray-100 text-gray-400 pointer-events-none"
            : "border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
        } transition`}
      >
        <span className="sr-only">Prev Page</span>
        <FaChevronLeft className="w-3 h-3" />
      </div>

      {/* Next */}
      <div
        onClick={() => handlePageClick(currentPage + 1)}
        tabIndex={0}
        role="button"
        className={`inline-flex w-8 h-8 items-center justify-center rounded border cursor-pointer ${
          currentPage === totalPages
            ? "border-gray-300 bg-gray-100 text-gray-400 pointer-events-none"
            : "border-gray-100 bg-white text-gray-900 hover:bg-gray-200"
        } transition`}
      >
        <span className="sr-only">Next Page</span>
        <FaChevronRight className="w-3 h-3" />
      </div>
    </div>
  );
}
