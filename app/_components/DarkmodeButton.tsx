"use client";
import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
const DarkmodeButton = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-main_dash");
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof document !== "undefined") {
      setDarkMode((prevMode) => {
        const newMode = !prevMode;
        localStorage.setItem("darkMode", newMode.toString());
        if (newMode) {
          document.documentElement.classList.add("dark");
          document.body.classList.add("bg-main_dash");
        } else {
          document.documentElement.classList.remove("dark");
          document.body.classList.remove("bg-main_dash");
        }
        return newMode;
      });
    }
  };

  return (
    <button className=" duration-200" onClick={toggleDarkMode}>
      <div className="flex items-center justify-center">
        <div
          className={`absolute transition-transform duration-300 ${
            darkMode
              ? "translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <FaMoon />
        </div>
        <div
          className={`absolute transition-transform duration-300 ${
            darkMode
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
        >
          <FaSun />
        </div>
      </div>
    </button>
  );
};

export default DarkmodeButton;
