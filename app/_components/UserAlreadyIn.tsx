"use client";
import { motion } from "framer-motion";
import { FaUserCheck } from "react-icons/fa";
import { UseVariables } from "../context/VariablesContext";
import Img from "./Img";

export default function UserAlreadyIn() {
  const { language } = UseVariables();
  const messages: any = {
    AR: {
      title: "أنت مسجل دخول بالفعل",
      message: "مرحبًا بك مرة أخرى! استمتع بتجربتك على موقعنا. 😊",
    },
    EN: {
      title: "You are already logged in",
      message: "Welcome back! Enjoy your experience on our website. 😊",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-orange-200 to-main_orange text-white text-center px-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Img src="/logo.png" className="w-52" />
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <FaUserCheck className="text-6xl mb-4 text-white/90 hover:text-white transition-colors duration-300" />
      </motion.div>
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-4xl font-bold mb-2"
      >
        {messages[language].title}
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-lg max-w-md"
      >
        {messages[language].message}
      </motion.p>
    </motion.div>
  );
}
