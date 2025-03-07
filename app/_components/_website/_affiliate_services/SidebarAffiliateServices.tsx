"use client";
import { instance } from "@/app/Api/axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import AffiliateServiceCard from "./AffiliateServiceCard";
import RandomArticlesSidebar from "../_blogpage/RandomArticlesSidebar";
import { getDate } from "date-fns";
import { UseVariables } from "@/app/context/VariablesContext";

export default function SidebarAffiliateServices() {
  const { language } = UseVariables();
  const params = useParams();
  const orgId = params.organizationid;
  const [data, setData] = useState([]);
  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await instance.get(
          `/organization-affiliate-services/${orgId}`
        );
        if (response.status == 200) {
          const data = response.data.data;
          setData(data);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    if (orgId) getdata();
  }, [orgId]);
  return (
    <>
      {data && data.length > 0 ? (
        <div className="w-1/4 max-xl:w-full  rounded-md  p-1">
          <h2 className="my-1 pb-2 border-b w-fit mx-auto border-main_orange">
            {language == "EN" ? "Center Services" : "خدمات المركز"}
          </h2>
          <div className="w-[95%] p-6 max-md:p-2 max-xl:w-full gap-3 max-xl:gap-6 max-md:grid-cols-1 max-xl:grid-cols-2 grid grid-cols-1 ">
            {data.slice(0, 7).map((service, index) => (
              <AffiliateServiceCard
                key={index}
                index={index}
                service={service}
                direct="affiliateservices"
              />
            ))}
          </div>
        </div>
      ) : (
        <RandomArticlesSidebar length={6} />
      )}
    </>
  );
}
