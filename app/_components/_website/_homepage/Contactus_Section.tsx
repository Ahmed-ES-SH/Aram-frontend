/* eslint-disable react/no-unescaped-entities */
"use client";
import { instance } from "@/app/Api/axios";
import { UseVariables } from "@/app/context/VariablesContext";
import React, { useState } from "react";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import Loading from "../../Loading";
import Separator from "../Separator";

interface formType {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function Contactus_section() {
  const { language }: any = UseVariables();
  const [form, setform] = useState<formType>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setform((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setloading(true);
      const formdata = new FormData();
      formdata.append("name", form.name);
      formdata.append("email", form.email);
      formdata.append("phone_number", form.phone);
      formdata.append("message", form.message);
      const response = await instance.post("/add-problem", formdata);
      if (response.status == 201) {
        setIsPopupVisible(true);
    	 setform({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Separator
        bg_dark="dark:bg-main_dash"
        text={language == "EN" ? "Aram always cares" : "آرام تهتم دائما"}
      />
      <section className=" dark:bg-secend_dash">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
            {/* الجانب النصي */}
            <div className="lg:col-span-2 lg:py-12 ">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-secend_text pb-2 border-b border-b-main_red">
                {language === "EN" ? "Contact Us" : "اتصل بنا"}
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {language === "EN"
                  ? "If you have any issues or inquiries, feel free to reach out to us at any time. We're here to help!"
                  : "إذا كانت لديك أي مشاكل أو استفسارات، لا تتردد في التواصل معنا في أي وقت. نحن هنا للمساعدة!"}
              </p>
            </div>

            {/* نموذج الاتصال */}
            <div className="rounded-lg bg-white dark:bg-main_dash p-8 shadow-lg lg:col-span-3 lg:p-12">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="sr-only" htmlFor="name">
                    {language === "EN" ? "Name" : "الاسم"}
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-400 border outline-none p-3 text-sm"
                    placeholder={language === "EN" ? "Name" : "الاسم"}
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="sr-only" htmlFor="email">
                      {language === "EN" ? "Email" : "البريد الإلكتروني"}
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-400 border outline-none p-3 text-sm"
                      placeholder={
                        language === "EN"
                          ? "Email address"
                          : "البريد الإلكتروني"
                      }
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="phone">
                      {language === "EN" ? "Phone" : "رقم الهاتف"}
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-400 border outline-none p-3 text-sm"
                      placeholder={
                        language === "EN" ? "Phone Number" : "رقم الهاتف"
                      }
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="sr-only" htmlFor="message">
                    {language === "EN" ? "Message" : "الرسالة"}
                  </label>
                  <textarea
                    className="w-full rounded-lg border-gray-400 border outline-none p-3 h-[20vh] text-sm"
                    placeholder={language === "EN" ? "Message" : "الرسالة"}
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                  >
                    {language === "EN" ? "Send Message" : "إرسال الرسالة"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {isPopupVisible && (
        <SuccessPopup
          message="شكرا على تواصلك معنا سيتم الرد عليك فى أسرع وقت إنشاء اللة ."
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </>
  );
}
