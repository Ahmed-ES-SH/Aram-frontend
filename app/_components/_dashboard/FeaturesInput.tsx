"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface props {
  features: string[];
  setFeatures: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FeaturesInput({ features, setFeatures }: props) {
  const [featureInput, setFeatureInput] = useState("");
  const handleFeatureAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && featureInput.trim() !== "") {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput(""); // Reset input field
      e.preventDefault(); // Prevent form submission
    }
  };
  return (
    <>
      <form
        onSubmit={(e: React.ChangeEvent<HTMLFormElement>) => e.preventDefault()}
      >
        <label className="block text-sm font-medium text-secend_text max-lg:dark:text-white max-lg:font-light font-serif text-md py-2">
          المميزات
        </label>
        <input
          className="p-4 duration-150 outline-none border-4 border-gray-300 my-2 w-full rounded-md text-sm text-gray-700 shadow-sm focus:border-blue-400"
          placeholder="Add a feature and press Enter"
          value={featureInput}
          onChange={(e) => setFeatureInput(e.target.value)}
          onKeyDown={handleFeatureAdd}
        />

        <div className="flex items-center gap-3 flex-wrap mt-4">
          {features &&
            features.length > 0 &&
            features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="p-3 bg-main_orange w-fit text-white rounded-md shadow-sm text-sm font-medium  flex items-center justify-between"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                {feature}
              </motion.div>
            ))}
        </div>
      </form>
    </>
  );
}
