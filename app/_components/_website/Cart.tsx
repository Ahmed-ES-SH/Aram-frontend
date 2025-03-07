"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cardcontext } from "@/app/context/CartContext";
import CartItem from "./_cart/CartItem";
import { UseVariables } from "@/app/context/VariablesContext";
import { FaPercentage } from "react-icons/fa";
import Link from "next/link";
import { BsCartX } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useDataContext } from "@/app/context/DataContext";

const Cart = () => {
  const { open_close, isopen, cartitems }: any = Cardcontext();
  const { language } = UseVariables();
  const { currenciesValue, activeCurrency } = useDataContext();
  const router = useRouter();

  const calculateTotal = () => {
    const subtotal = cartitems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const vat = 0; // مثال: ضريبة 10%
    const discount = 0; // مثال: خصم ثابت
    const total = subtotal + vat - discount;
    return { subtotal, vat, discount, total };
  };
  const { subtotal, vat, discount, total }: any = calculateTotal();

  const goToCart = async () => {
    await open_close();
    router.push("/cart");
  };

  const Currency = currenciesValue[activeCurrency.code] || 1;

  return (
    <>
      <section>
        <AnimatePresence>
          {isopen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className=" max-w-screen-xl max-md:w-[90%] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 h-screen overflow-y-auto shadow-xl border dark:border-gray-600 fixed top-0 left-0 z-[9999999] bg-white dark:bg-secend_dash"
            >
              <div className="mx-auto max-w-3xl">
                <header className="text-center">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-secend_text sm:text-3xl pb-2 border-b border-main_orange w-fit mx-auto">
                    {language == "EN" ? "Your Cart" : "سلة المشتريات"}
                  </h1>
                </header>
                <div className="mt-8">
                  {cartitems && cartitems.length > 0 ? (
                    <motion.ul
                      className="space-y-4 w-full"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      {cartitems.map((item: any) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <CartItem item={item} />
                        </motion.li>
                      ))}
                    </motion.ul>
                  ) : (
                    <motion.div
                      className="w-full h-[50vh] flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 15,
                      }}
                    >
                      <motion.div
                        className="flex flex-col items-center"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <BsCartX className="text-6xl text-gray-400 mb-4 " />
                        <motion.h2
                          className="text-xl font-semibold text-gray-600"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                        >
                          {language === "EN"
                            ? "Your cart is empty"
                            : "السلة فارغة"}
                        </motion.h2>
                        <motion.p
                          className="mt-2 text-gray-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                        >
                          {language === "EN"
                            ? "Looks like you haven't added anything to your cart yet."
                            : "يبدو أنه لم يتم إضافة أي منتجات إلى سلتك بعد."}
                        </motion.p>
                        <motion.button
                          className="mt-6 px-6 py-2 bg-main_orange text-white rounded-lg hover:bg-orange-500 transition"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.6 }}
                          onClick={() => (window.location.href = "/shop")} // إضافة الرابط إلى المتجر
                        >
                          <Link href={"/cards"}>
                            {language === "EN"
                              ? "Start Shopping"
                              : "ابدأ التسوق"}
                          </Link>
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}

                  <div className="mt-8 flex justify-end max-md:justify-start border-t border-gray-100 pt-8">
                    <div className="w-screen max-w-lg space-y-4">
                      <dl className="space-y-0.5 text-sm text-gray-700 dark:text-secend_text">
                        <div className="flex justify-between">
                          <dt>
                            {language === "EN" ? "Subtotal" : "المجموع الفرعي"}
                          </dt>
                          <dd>
                            <div className="flex items-center gap-1">
                              <span>{activeCurrency.symbol}</span>
                              <p>{Number(Currency * subtotal).toFixed(2)}</p>
                            </div>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>{language === "EN" ? "VAT" : "الضريبة"}</dt>
                          <dd>
                            <div className="flex items-center gap-1">
                              <span>{activeCurrency.symbol}</span>
                              <p>{Number(Currency * vat).toFixed(2)}</p>
                            </div>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>{language === "EN" ? "Discount" : "الخصم"}</dt>
                          <dd>
                            <div className="flex items-center gap-1">
                              -<span>{activeCurrency.symbol}</span>
                              <p>{Number(Currency * discount).toFixed(2)}</p>
                            </div>
                          </dd>
                        </div>
                        <div className="flex justify-between !text-base font-medium">
                          <dt>
                            {language === "EN" ? "Total" : "المجموع الكلي"}
                          </dt>
                          <dd>
                            <div className="flex items-center gap-1">
                              <span>{activeCurrency.symbol}</span>
                              <p>{Number(Currency * total).toFixed(2)}</p>
                            </div>
                          </dd>
                        </div>
                      </dl>

                      <div className="flex justify-end">
                        <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-indigo-700">
                          <FaPercentage className="mr-1 h-4 w-4" />
                          <p className="whitespace-nowrap text-xs">
                            {language === "EN"
                              ? "0 Discounts Applied"
                              : "لم يتم تطبيق أي خصومات"}
                          </p>
                        </span>
                      </div>

                      <div className="flex justify-start">
                        <button
                          onClick={() => goToCart()}
                          className="block rounded bg-main_orange px-5 py-3 text-sm text-white transition duration-200 hover:bg-orange-500"
                        >
                          {language === "EN" ? "Checkout" : "الدفع"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={open_close}
                className="close px-4 py-1 absolute top-6 left-5 border dark:border-gray-600 rounded-sm text-white hover:bg-white hover:text-black duration-200 cursor-pointer bg-red-400 flex items-center justify-center"
              >
                -
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default Cart;
