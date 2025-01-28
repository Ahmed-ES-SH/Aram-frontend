"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data01 = [
  { name: "Group A", value: 800, color: "#8884d8" },
  { name: "Group B", value: 700, color: "#8dd1e1" },
  { name: "Group C", value: 700, color: "#82ca9d" },
  { name: "Group D", value: 700, color: "#a4de6c" },
  { name: "Group E", value: 778, color: "#d0ed57" },
  { name: "Group F", value: 689, color: "#ffc658" },
];

const data02 = [
  { name: "Group A", value: 2400, color: "#8884d8" },
  { name: "Group B", value: 4567, color: "#8dd1e1" },
  { name: "Group C", value: 1398, color: "#82ca9d" },
  { name: "Group D", value: 9800, color: "#a4de6c" },
  { name: "Group E", value: 3908, color: "#d0ed57" },
  { name: "Group F", value: 4800, color: "#ffc658" },
];

const Secendcorcle = () => {
  return (
    <ResponsiveContainer width="100%" height="80%">
      <PieChart width={500} height={600}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data01}
          cx="50%"
          cy="50%"
          // outerRadius={width > 739 ? 140 : 80}
          outerRadius={140}
          fill="#8884d8"
          label
        >
          {data01.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Secendcorcle;
