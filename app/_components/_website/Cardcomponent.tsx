import React from "react";
import Img from "../Img";

const CardComponent = ({
  bg_img,
  width = "w-56",
  hight = "h-40",
  card = null,
}: any) => {
  const formatCardNumber = (cardNumber: string | undefined | null) => {
    if (!cardNumber || typeof cardNumber !== "string") {
      return "xxxx xxxx xxxx xxxx"; // إذا لم يكن هناك رقم بطاقة أو ليس نصًا
    }
    return cardNumber.replace(/(\d{4})(?=\d)/g, "$1 "); // إضافة مسافة كل 4 أرقام
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return "00/00"; // إذا لم يكن هناك تاريخ
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0"); // الشهر (مع إضافة صفر إذا لزم الأمر)
    const year = String(date.getFullYear()).slice(-2); // السنة (آخر رقمين)
    return `${month}/${year}`;
  };
  return (
    <div
      className={` ${width} ${hight}   overflow-hidden  m-auto   my-4  rounded-xl relative text-white  transition-transform transform hover:scale-110`}
    >
      <Img
        className="relative object-cover w-full h-full rounded-xl"
        src={bg_img}
      />

      <div className="w-full px-4 absolute top-4">
        <div className="flex justify-between">
          <div className="flex flex-col items-start">
            <p className="font-light text-xs">Name</p>
            <p className="font-medium tracking-widest text-sm">
              {card
                ? card.user && card.user.title_en
                  ? card.user.title_en
                  : card.user.name
                : "-----------"}
            </p>
          </div>
          <Img className="w-8 h-8" src="/logo.ico" />
        </div>
        <div className="pt-1 flex flex-col items-start">
          <p className="font-light text-xs">Card Number</p>
          <p className="font-medium tracking-more-wider text-sm">
            {card ? formatCardNumber(card.card_number) : "xxxx xxxx xxxx xxxx"}
          </p>
        </div>
        <div className="pt-4 pr-3">
          <div className="flex justify-between">
            <div>
              <p className="font-light text-[10px]">Valid</p>
              <p className="font-sm text-[8px] tracking-wider">
                {card ? formatDate(card.issue_date) : "00/00"}
              </p>
            </div>
            <div>
              <p className="font-light text-[10px]">Expiry</p>
              <p className="font-sm text-[8px] tracking-wider">
                {card ? formatDate(card.expiry_date) : "00/00"}
              </p>
            </div>

            <div className="">
              <p className="font-light text-[10px]">CVV</p>
              <p className="font-bold tracking-more-wider text-xs">
                {card ? card.cvv && card.cvv : "···"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
