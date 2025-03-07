import React from "react";
import Img from "../Img";

export default function Minicard({ bg_img }: { bg_img: string }) {
  return (
    <div className="w-14 h-10 overflow-hidden m-auto rounded-sm relative text-white transition-transform transform hover:scale-110">
      <Img
        className="relative object-cover w-full h-full rounded-sm"
        src={bg_img}
      />

      <div className="w-full px-2 absolute top-2">
        <div className="flex justify-between">
          <div>
            <p className="font-light text-[3px]">Name</p>
            <p className="font-medium tracking-widest text-[8px]">------</p>
          </div>
          <Img className="w-4 h-4" src="/logo.ico" />
        </div>
        <div className="pt-1">
          <p className="font-light text-[3px]">Card Number</p>
        </div>
      </div>
    </div>
  );
}
