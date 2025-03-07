import Image from "next/image";
import React from "react";

interface props {
  src: string;
  className: string;
}

export default function Img({ src, className }: props) {
  return (
    <>
      <Image
        src={src}
        alt="image"
        className={className}
        width={1024}
        height={1280}
      />
    </>
  );
}
