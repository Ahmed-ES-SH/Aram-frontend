import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Img from "../Img";

export default function VariableCard({ card }: any) {
  const renderAnimationText = (mainText: string, margin: string) => {
    return mainText
      .toString()
      .split("")
      .map((digit, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, scale: 1.8, filter: "blur(10px)" }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            textShadow: [
              "0 0 12px rgba(59, 130, 246, 0.9)", // لمعة زرقاء أولية
              "0 0 24px rgba(59, 130, 246, 1)", // توهج أزرق عالٍ
              "0 0 36px rgba(255, 255, 255, 1)", // توهج أبيض (برق)
              "0 0 24px rgba(59, 130, 246, 1)", // رجوع إلى الأزرق
              "0 0 12px rgba(59, 130, 246, 0.8)", // لمعة زرقاء خفيفة
            ],
          }}
          transition={{
            delay: index * 0.15, // تأخير ظهور كل رقم
            duration: 0.7, // مدة الظهور
            ease: "easeInOut",
            repeat: 1, // تكرار التأثير مرة واحدة
            repeatType: "reverse", // عكس التأثير بعد انتهاء الحركة
          }}
          className={`inline-block mx-[${margin}] text-blue-500 font-bold text-lg`}
        >
          {digit}
        </motion.span>
      ));
  };

  return (
    <>
      <AnimatePresence>
        {card && (
          <motion.div
            className="w-80 h-52  m-auto my-4 rounded-xl relative text-white transition-transform transform hover:scale-110"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Img
              className="relative object-cover w-full h-full rounded-xl"
              src={
                card.card_type.image
                  ? card.card_type.image
                  : "/cards/card_1.jpg"
              }
            />

            <div className="w-full px-4 absolute top-4">
              <div className="flex justify-between">
                <div className="flex flex-col items-start">
                  <motion.p
                    className="font-light text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Name
                  </motion.p>
                  <motion.p
                    className="font-medium tracking-widest text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {card.user.name ? card.user.name : "------------"}{" "}
                  </motion.p>
                </div>
                <Img className="w-8 h-8" src="/logo.ico" />
              </div>
              <div className="pt-4 flex flex-col items-start">
                <p className="font-light text-md">Card Number</p>
                <p className="font-medium tracking-more-wider text-sm">
                  {card.card_number
                    ? renderAnimationText(card.card_number, "3px")
                    : "XXXX-XXXX-XXXX-XXXX"}
                </p>
              </div>
            </div>
            <div className=" absolute text-white bottom-2 left-1/2 -translate-x-1/2 w-[90%]">
              <div className="flex justify-between">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <p className="font-light text-md">Valid</p>
                  <p className="font-sm text-[11px] tracking-wider ">
                    {card.issue_date
                      ? renderAnimationText(card.issue_date.split("T")[0], "0")
                      : card.card_type.duration}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <p className="font-light text-md">Expiry</p>
                  <p className="font-sm text-[11px] tracking-wider ">
                    {card.expiry_date
                      ? renderAnimationText(card.expiry_date.split("T")[0], "0")
                      : "--/--"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <p className="font-light text-md">CVV</p>
                  <p className="font-bold tracking-more-wider text-xs">
                    {card.cvv ? renderAnimationText(card.cvv, "0") : "..."}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
