"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { UseVariables } from "@/app/context/VariablesContext";
import Loading from "../../Loading";
import { instance } from "@/app/Api/axios";

export default function Video_Section() {
  const { language }: any = UseVariables();
  const [loading, setLoading] = useState(true);
  const [main_video, setMainVideo] = useState("");
  const [linkVideo, setLinkVideo] = useState("");
  const videoRef = useRef<any>(null); // مرجع للفيديو

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/detailes");
        const data = response.data.data;
        if (data) {
          setMainVideo(data.main_video);
          setLinkVideo(data.link_video);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <div className="relative h-[100vh] mt-[75px] flex items-center justify-center w-full overflow-hidden">
        {/* فيديو الخلفية */}
        {main_video ? (
          <video
            ref={videoRef} // مرجع للفيديو
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={main_video}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <iframe
            src={linkVideo}
            allow="autoplay; encrypted-media"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        )}

        {/* طبقة سوداء شفافة فوق الفيديو */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
      </div>
    </>
  );
}
