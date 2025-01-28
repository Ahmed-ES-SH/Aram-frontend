import React from "react";
import VariablesProvider from "../context/VariablesContext";
import CartProvider from "../context/CartContext";
import { DataProvider } from "../context/DataContext";

type ClientLayoutProps = {
  children: React.ReactNode; // النوع المناسب لـ children
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <VariablesProvider>
        <DataProvider>
          <CartProvider>{children}</CartProvider>
        </DataProvider>
      </VariablesProvider>
    </>
  );
}
