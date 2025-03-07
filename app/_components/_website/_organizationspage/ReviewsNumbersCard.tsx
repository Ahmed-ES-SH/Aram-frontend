"use client";
import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import ReviewsContent from "./ReviewsContent";

interface props {
  orgId: number;
}

interface ReviewsNumberType {
  total_reviews: number;
  average_rating: number;
  reviews_count_by_stars: {
    [key in 1 | 2 | 3 | 4 | 5]: {
      count: number;
      percentage: number;
    };
  };
}

export default function ReviewsNumbersCard({ orgId }: props) {
  const { language }: any = UseVariables();
  const [reviewsNumber, setReviewsNumber] = useState<any>({
    total_reviews: 0,
    average_rating: 0,
    reviews_count_by_stars: {
      1: { count: 0, percentage: 0 },
      2: { count: 0, percentage: 0 },
      3: { count: 0, percentage: 0 },
      4: { count: 0, percentage: 0 },
      5: { count: 0, percentage: 0 },
    },
  });
  const [activeSection, setActiveSection] = useState(true);

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await instance.get(`/org-reviews-numbers/${orgId}`);
        if (response.status == 200) {
          const data = response.data;
          setReviewsNumber({ ...data });
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    if (orgId) getdata();
  }, [orgId]);

  const StarsPercentage: any = [5, 4, 3, 2, 1].map((star) => ({
    title: {
      AR: `${star} نجوم`,
      EN: `${star} stars`,
    },
    percentage: reviewsNumber.reviews_count_by_stars[String(star)].percentage,
  }));

  return (
    <div className="w-full bg-gray-100 py-2 ">
      <div className=" h-fit py-4 px-2  rounded-md  bg-white w-full  dark:bg-secend_dash">
        <div className="flex items-center my-2 border rounded-sm">
          <button
            onClick={() => setActiveSection(true)}
            className={`px-4 py-2 hover:bg-main_orange hover:text-white duration-150  flex-1 ${
              activeSection ? "bg-main_orange text-white" : ""
            }`}
          >
            {language == "EN" ? "Ratings" : "التقييمات"}
          </button>
          <button
            onClick={() => setActiveSection(false)}
            className={`px-4 py-2 hover:bg-main_orange hover:text-white duration-150 border-l flex-1 ${
              !activeSection ? "bg-main_orange text-white" : ""
            }`}
          >
            {language == "EN" ? "Reviews" : "المراجعات"}
          </button>
        </div>
        {activeSection ? (
          /* Start Reviews Section */
          <div className="flex flex-col items-center gap-2 w-full mx-auto">
            <h2 className="tajawal-bold text-2xl mt-3">
              {language == "EN" ? "Customer Ratings" : "تقييمات العملاء"}
            </h2>
            <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FaStar
                    key={index}
                    color={
                      index < Math.round(reviewsNumber?.average_rating)
                        ? "gold"
                        : "gray"
                    }
                    className="size-6"
                  />
                ))}
              </div>

              <p
                style={{ direction: language == "EN" ? "ltr" : "rtl" }}
                className="tajawal-bold"
              >
                {reviewsNumber?.average_rating}{" "}
                {language === "EN" ? "out of" : "من"} 5
              </p>
            </div>
            <p
              style={{ direction: language == "EN" ? "ltr" : "rtl" }}
              className="text-center text-lg text-gray-500"
            >
              {reviewsNumber?.total_reviews}{" "}
              {language === "EN" ? "Customers Rating" : "تقييم العملاء"}
            </p>

            <div className="flex flex-col w-full mt-4 items-start gap-4">
              {StarsPercentage.map((line: any, index: number) => (
                <div key={index} className="flex w-full items-center gap-2">
                  <p className="whitespace-nowrap font-light">
                    {line.title[language]}
                  </p>
                  <div className="relative w-full h-[10px] rounded-md shadow-sm bg-gray-100">
                    <span
                      className="block h-[10px] rounded-md bg-main_orange duration-150 absolute top-0 left-0"
                      style={{ width: `${line.percentage}%` }}
                    ></span>
                  </div>
                  <p>{line.percentage}%</p>
                </div>
              ))}
            </div>
            {/* End Reviews Section */}
          </div>
        ) : (
          <ReviewsContent orgId={orgId} />
        )}
      </div>
    </div>
  );
}
