"use client";
import { useState } from "react";
import Img from "../Img";
import { UseVariables } from "@/app/context/VariablesContext";
import UserButton from "../_website/_Auth/UserButtton";
import Link from "next/link";
import { FaArrowLeft, FaArrowRightToBracket } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const { setshowsidebar }: any = UseVariables();
  const router = useRouter();

  return (
    <>
      <nav
        className={`bg-gray-100 z-[9999]  fixed top-0 left-0 w-full dark:bg-secend_dash dark:text-white p-4 flex items-center justify-between shadow-lg`}
      >
        {/* قسم الشعار */}
        <div className="flex items-center gap-3">
          <Link href={"/"}>
            <Img
              src="/logo.png" // استبدل هذا بمسار الشعار الخاص بك
              className="w-[50px]"
            />
          </Link>
          <span className="text-lg font-bold">لوحة التحكم</span>
        </div>

        {/* قسم الخيارات */}
        <div className="flex items-center  space-x-4">
          {/* قائمة المستخدم */}
          <div className="relative ">
            <div className="flex items-center gap-4">
              <UserButton />
              <div
                onClick={() => setshowsidebar((prev: any) => !prev)}
                className="cursor-pointer"
              >
                <Img src="/dashboard/menu-bar.png" className="w-6 " />
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => router.back()}
          className="back_button w-8 h-8 absolute -bottom-8 rounded-b-md  left-4 flex items-center cursor-pointer justify-center text-white bg-red-400"
        >
          <FaArrowLeft className="size-5" />
        </div>
      </nav>
    </>
  );
}
