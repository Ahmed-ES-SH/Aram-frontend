// components/LineChart.js
"use client";
import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

const CircleChar = () => {
  const chartRef = useRef<any>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // تدمير الرسم البياني القديم إذا كان موجودًا
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // إنشاء رسم بياني جديد
    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Chrom", "FireFox", "Edge", "safrie", "opera"],
        datasets: [
          {
            label: "The Percent of Browser",
            data: [200, 50, 100, 40, 25],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(54, 112, 235)",
              "rgb(24, 122, 235)",
              "rgb(255, 205, 86)",
            ],
            hoverOffset: 8,
          },
        ],
      },
    });

    // تنظيف الرسم البياني عند تفريغ المكون
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} />;
};

export default CircleChar;
