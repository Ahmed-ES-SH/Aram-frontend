"use client";
import Topbar from "../_components/_dashboard/Topbar";
import Sidebar from "../_components/_dashboard/Sidebar";
import Footer from "../_components/_website/Footer";
import { useDataContext } from "../context/DataContext";
import ForbiddenPage from "../forbiddenpage/page";

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentuser } = useDataContext();
  const role = currentuser && currentuser.role;

  if (role != "Admin") return <ForbiddenPage />;

  return (
    <>
      <Topbar />
      <div style={{ direction: "rtl" }} className="">
        <Sidebar />
        <div className="w-full h-full dark:bg-main_dash min-h-screen mt-20 ">
          {children}
        </div>
      </div>
    </>
  );
}
