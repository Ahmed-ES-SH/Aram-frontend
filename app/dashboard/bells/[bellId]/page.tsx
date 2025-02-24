"use client";
import BellDetails from "@/app/_components/_dashboard/_bells/BellDetailes";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useState } from "react";

export default function BellPage({ params }: any) {
  const bellId = params.bellId;

  const [bell, setbell] = useState(null);
  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await instance.get(`/bell/${bellId}`);
        if (response.status == 200) {
          const data = response.data.data;
          setbell(data);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    getdata();
  }, [bellId]);
  return (
    <>
      <BellDetails bellData={bell} />
    </>
  );
}
