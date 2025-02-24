"use client";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import React from "react";
import { AiOutlineHome } from "react-icons/ai"; // رمز المنزل
import { BsChevronRight } from "react-icons/bs"; // رمز الفصل بين الروابط

export default function Breadcrumb() {
  const { language } = UseVariables();
  // استخراج المسار الحالي من نافذة المتصفح
  const pathArray = window.location.pathname
    .split("/")
    .filter((segment) => segment);

  // إنشاء الروابط بناءً على المسار
  const breadcrumbLinks = pathArray.map((segment, index) => {
    const href = `/${pathArray.slice(0, index + 1).join("/")}`;
    const isLast = index === pathArray.length - 1;
    const title = segment.charAt(0).toUpperCase() + segment.slice(1);
    return (
      <li key={index} className="relative flex items-center">
        {index > 0 && (
          <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)] rtl:rotate-180"></span>
        )}
        <Link
          href={href}
          className={`flex h-10 items-center ${
            isLast ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600"
          } px-4 text-xs font-medium transition hover:text-gray-900`}
          aria-current={isLast ? "page" : undefined}
        >
          {title.length > 30 ? title.slice(0, 30) + "..." : title}
        </Link>
      </li>
    );
  });

  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol className="flex overflow-hidden rounded-lg border border-gray-200 text-gray-600">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex h-10 items-center gap-1.5 bg-gray-100 px-4 transition hover:text-gray-900"
          >
            <AiOutlineHome className="text-lg" />
            <span className="ms-1.5 text-xs font-medium">
              {language == "EN" ? "Home" : "الرئيسية"}
            </span>
          </Link>
        </li>
        {breadcrumbLinks}
      </ol>
    </nav>
  );
}
