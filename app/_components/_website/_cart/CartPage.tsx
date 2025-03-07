"use client";
import { Cardcontext } from "@/app/context/CartContext";
import { UseVariables } from "@/app/context/VariablesContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Minicard from "../MiniCard";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Footer from "../Footer";
import { instance } from "@/app/Api/axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BsCartX } from "react-icons/bs";
import { useDataContext } from "@/app/context/DataContext";
import CheckCurrentUserPopup from "../_Auth/CheckCurrentUserPopup";

export default function CartPage() {
  const { activeCurrency, currenciesValue, currentuser, type } =
    useDataContext();
  const { language } = UseVariables();
  const currency = currenciesValue[activeCurrency.code] || 1;
  const { cartitems, decreasequantity, increasequantity, removefromcard } =
    Cardcontext();
  const router = useRouter();
  const userId = currentuser && currentuser.id;
  const calculateTotal = () => {
    const subtotal = cartitems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const vat = 0; // مثال: ضريبة 10%
    const discount = 0; // مثال: خصم ثابت
    const total = Number(currency * (subtotal + vat - discount)).toFixed(2);
    return { subtotal, vat, discount, total };
  };
  const { subtotal, vat, discount, total }: any = calculateTotal();

  const headers = [
    {
      title_ar: "العنصر",
      title_en: "Product",
    },
    {
      title_ar: "الإسم",
      title_en: "Name",
    },
    {
      title_ar: "السعر",
      title_en: "Price",
    },
    {
      title_ar: "الكمية",
      title_en: "Quantity",
    },
    {
      title_ar: "إزالة",
      title_en: "Remove",
    },
  ];

  const [cardsDetailes, setCardsDetailes] = useState<any>([]);
  const [promoCode, setPromoCode] = useState("");
  const [purchaseId, setpurchaseId] = useState("");
  const [checkLoading, setCheckLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [checkCurrentuser, setCheckCurrentuser] = useState(false);

  useEffect(() => {
    setCardsDetailes((prevcards: any) => {
      // الاحتفاظ فقط بالعناصر التي لا تزال موجودة في السلة
      const filteredPrevCards = prevcards.filter((prevcard: any) =>
        cartitems.some((card) => card.id === prevcard.id)
      );

      const updatedCards = [...filteredPrevCards];

      // إضافة العناصر الجديدة التي ليست في القائمة القديمة
      cartitems.forEach((card) => {
        const existingCard = filteredPrevCards.find(
          (prevcard: any) => prevcard.id === card.id
        );

        if (!existingCard) {
          updatedCards.push({
            id: `${card.id}`,
            price: card.price,
            title: card.title_en,
            image: card.image,
            quantity: card.quantity,
            duration: card.duration,
          });
        }
      });

      return updatedCards;
    });
  }, [cartitems]);

  const handlesubmit = async (e: any) => {
    if (!currentuser) {
      setCheckCurrentuser(true);
    }
    try {
      const formdata = new FormData();
      formdata.append(
        "customerName",
        type == "Organization" ? currentuser.title_en : currentuser.name
      );
      formdata.append("customerEmail", currentuser.email);
      formdata.append("customerMobile", currentuser.phone_number);
      formdata.append("currentUserId", currentuser.id);
      formdata.append("currency", activeCurrency.code);
      formdata.append("account_type", type);
      formdata.append("notificationOption", "LNK");
      formdata.append("invoiceValue", total);
      if (purchaseId) formdata.append("purchase_id", purchaseId);
      formdata.append("cardsDetailes", JSON.stringify(cardsDetailes));
      const response = await instance.post("/payment/initiate", formdata);
      router.push(response.data.Data.InvoiceURL);
    } catch (error: any) {
      console.log(error);
    }
  };

  const checkPromoCode = async () => {
    try {
      setCheckLoading(true);
      const data = {
        promo_code: promoCode,
        amount: total,
        buyer_id: userId,
        buyer_type: type,
      };
      const response = await instance.post("/purchase", data);
      if (response.status == 200) {
        const data = response.data.data;
        setpurchaseId(data.uniqId);
        // إظهار علامة النجاح
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000); // إخفاء العلامة بعد ثانيتين
      }
    } catch (error: any) {
      console.log(error);
      // إظهار علامة الفشل
      setError(true);
      setTimeout(() => setError(false), 2000); // إخفاء العلامة بعد ثانيتين
    } finally {
      setCheckLoading(false);
    }
  };

  return (
    <>
      <div className="flex  items-start max-xl:flex-col gap-4 max-xl:gap-2 p-6 max-md:p-2 mt-16 max-md:mt-20 bg-white dark:bg-secend_dash ">
        <div className="table-products  h-screen max-xl:h-fit  overflow-auto w-[60%] max-xl:w-full flex-grow">
          <table className="min-w-full border dark:border-gray-700 rounded-lg shadow-lg max-h-screen min-h-[52vh] overflow-x-auto bg-gray-100 dark:bg-main_dash text-sm  ">
            <thead className="ltr:text-left rtl:text-right border-b border-black  dark:border-gray-300">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="whitespace-nowrap text-left dark:text-white px-4 py-2 font-medium text-gray-900"
                  >
                    {language == "EN" ? header.title_en : header.title_ar}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cartitems && cartitems.length > 0 ? (
                cartitems.map((item, index) => (
                  <tr className="h-[80px]" key={index}>
                    <td className="whitespace-nowrap  px-4 py-2   font-medium text-gray-900">
                      <div className="w-fit mr-auto">
                        <Minicard
                          bg_img={item.image ? item.image : "/cards/card_1.jpg"}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 h-[20px]  text-gray-700 dark:text-white">
                      {language == "EN" ? item.title_en : item.title_ar}
                    </td>
                    <td className="whitespace-nowrap  px-4 py-2 h-[20px]  text-gray-700 dark:text-white">
                      <div className="flex items-center gap-1">
                        <span>{activeCurrency.symbol}</span>
                        <p>{Number(currency * item.price).toFixed(2)}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 h-[20px]  text-gray-700 dark:text-white">
                      <div className="flex items-center justify-center w-fit mr-auto  border dark:border-gray-600 rounded-sm shadow-sm px-2">
                        <div className="flex items-center gap-1 ">
                          <button
                            onClick={() => decreasequantity(item)}
                            type="button"
                            className="  text-gray-600 transition hover:opacity-75"
                          >
                            <AiOutlineMinus />
                          </button>
                          <p className="dark:text-white p-2 text-center">
                            {item.quantity}
                          </p>
                          <button
                            onClick={() => increasequantity(item)}
                            type="button"
                            className="  text-gray-600 transition hover:opacity-75"
                          >
                            <AiOutlinePlus />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 h-[20px]  text-gray-700 dark:text-white">
                      <button
                        onClick={() => removefromcard(item)}
                        className="cursor-pointer hover:text-red-600 duration-200 text-red-400"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="h-[45vh] w-full">
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
                          {language === "EN" ? "Start Shopping" : "ابدأ التسوق"}
                        </Link>
                      </motion.button>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="space-y-4 mt-2 w-[40%]  max-xl:w-full rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-sm dark:border-gray-700 dark:bg-main_dash sm:p-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="voucher"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  {language == "EN"
                    ? "Do you have a promo Code?"
                    : "هل لديك كود دعائى او كود خصم"}
                </label>
                <input
                  name="promo_code"
                  type="text"
                  id="voucher"
                  className="block outline-none w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder=""
                  value={promoCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPromoCode(e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col items-center gap-2 w-full">
                <button
                  onClick={checkPromoCode}
                  disabled={checkLoading}
                  className={`${
                    checkLoading ? "bg-orange-500" : "bg-green-500"
                  } text-white py-2 px-4 rounded-lg text-lg transition-all duration-300 hover:bg-green-600 disabled:bg-gray-300`}
                >
                  {checkLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.3, repeat: Infinity }}
                      className="w-5 h-5 border-4 border-t-transparent border-black rounded-full"
                    />
                  ) : language === "EN" ? (
                    "Apply Code"
                  ) : (
                    "تطبيق الرمز"
                  )}
                </button>

                {/* علامة النجاح */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-green-500 mt-2 text-sm"
                  >
                    {language === "EN"
                      ? "Promo code applied successfully!"
                      : "تم تطبيق الرمز الترويجي بنجاح!"}
                  </motion.div>
                )}

                {/* علامة الفشل */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-red-500 mt-2 text-sm"
                  >
                    {language === "EN"
                      ? "Invalid promo code!"
                      : "الرمز الترويجي غير صالح!"}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto h-[52vh] max-xl:h-fit  w-[40%] max-xl:w-full mt-6  flex-1 space-y-6 lg:mt-0 ">
          <div
            style={{ direction: language === "EN" ? "ltr" : "rtl" }}
            className="space-y-4 rounded-lg border border-gray-200 bg-gray-100 p-4  dark:border-gray-700 h-full dark:bg-main_dash shadow-lg sm:p-6"
          >
            <p className="text-xl pb-2 border-b border-main_orange font-semibold text-gray-900 dark:text-white">
              {language == "EN" ? "Order Summary" : "ملخص الطلب"}
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <dl className="flex items-center justify-between gap-4">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                    {language == "EN" ? "Sub Total" : "الإجمالي الفرعي"}
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-1">
                    <span>{activeCurrency.symbol}</span>{" "}
                    <p>{subtotal && Number(currency * subtotal).toFixed(2)}</p>
                  </dd>
                </dl>

                <dl className="flex items-center justify-between gap-4">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                    {language == "EN" ? "Discount" : "الخصم"}
                  </dt>
                  <dd className="text-base font-medium text-green-600">
                    -%{` ${discount && discount.toFixed(2)}`}
                  </dd>
                </dl>
                <dl className="flex items-center justify-between gap-4">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                    {language == "EN" ? "VAT" : "الضريبة"}
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-1">
                    <span>{activeCurrency.symbol}</span>
                    <p>{vat && vat.toFixed(2)}</p>
                  </dd>
                </dl>
              </div>

              <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                <dt className="text-base font-bold text-gray-900 dark:text-white">
                  {language == "EN" ? "Total" : "الإجمالي"}
                </dt>
                <dd className="text-base flex items-center gap-1 font-bold text-gray-900 dark:text-white">
                  <span>{activeCurrency.symbol}</span>
                  <p>{total && total}</p>
                </dd>
              </dl>
            </div>
            <p
              style={{ direction: language === "EN" ? "ltr" : "rtl" }}
              className="text-[10px] text-gray-500 dark:text-gray-400"
            >
              {language === "EN" ? (
                <>
                  By purchasing the cards, you acknowledge and agree to all
                  applicable{" "}
                  <Link className="underline" href="/terms">
                    terms and conditions
                  </Link>{" "}
                  and{" "}
                  <Link className="underline" href="/policies">
                    policies
                  </Link>
                  , ensuring a smooth and secure experience.
                </>
              ) : (
                <>
                  عند شرائك للبطاقات، فإنك تقرّ وتوافق على جميع{" "}
                  <Link className="underline" href="/termsconditionsusers">
                    الشروط والأحكام
                  </Link>{" "}
                  و{" "}
                  <Link className="underline" href="/privacypolicyusers">
                    السياسات
                  </Link>{" "}
                  المعمول بها، مما يضمن لك تجربة سلسة وآمنة.
                </>
              )}
            </p>

            <button
              onClick={handlesubmit}
              className="flex w-full items-center justify-center rounded-lg bg-main_orange border border-transparent duration-200 hover:bg-transparent dark:hover:text-white hover:text-black hover:border-main_orange hover:scale-105 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              {language == "EN" ? "Proceed to Checkout" : "إتمام الدفع"}
            </button>

            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {language == "EN" ? "or" : "أو"}
              </span>
              <Link
                href="/cards"
                className="inline-flex dark:text-white items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
              >
                {language == "EN" ? "Continue Shopping" : "متابعة التسوق"}
              </Link>
            </div>
          </div>
        </div>
      </div>
      {checkCurrentuser && (
        <CheckCurrentUserPopup
          language={language}
          onClose={() => setCheckCurrentuser((prev) => !prev)}
          isOpen={checkCurrentuser}
        />
      )}
    </>
  );
}
