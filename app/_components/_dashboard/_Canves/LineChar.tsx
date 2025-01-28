// components/LineChart.js
"use client";
import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

const BarChart = () => {
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
      type: "bar",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "Dataset 1",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            data: [65, 59, 80, 81, 56, 55, 40],
          },
          {
            label: "Dataset 2",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            data: [28, 48, 40, 19, 86, 27, 90],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
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

export default BarChart;
