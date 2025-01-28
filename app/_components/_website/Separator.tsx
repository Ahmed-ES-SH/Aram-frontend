import React from "react";

export default function Separator({
  text,
  bg_dark,
}: {
  text: string;
  bg_dark: string;
}) {
  return (
    <div className={``}>
      <span className="relative flex justify-center my-6">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-main_red to-transparent opacity-75"></div>
        <span
          className={`relative  max-md:px-2 max-md:text-[12px] bg-white ${
            bg_dark ? bg_dark : "bg-secend_dash"
          }  dark:text-secend_text px-6`}
        >
          {text}
        </span>
      </span>
    </div>
  );
}
