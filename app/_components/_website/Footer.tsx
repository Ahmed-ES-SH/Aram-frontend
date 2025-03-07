"use client";
import React, { useEffect, useState } from "react";
import { instance } from "@/app/Api/axios";
import Link from "next/link";
import { UseVariables } from "@/app/context/VariablesContext";
import Img from "../Img";
import SuccessPopup from "../_dashboard/SuccessPopup";

export default function Footer() {
  const { language } = UseVariables();
  const [menus, setMenus] = useState([]);
  const [email, setEmail] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [form, setForm] = useState({
    facebook: "",
    youtube: "",
    instagram: "",
    x_account: "",
    snapchat: "",
  });

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await instance.get("/footer-lists");
        const data = response.data;

        const combinedLists: any = [
          { title: "قائمة 1", links: data.list1 },
          { title: "قائمة 2", links: data.list2 },
          { title: "قائمة 3", links: data.list3 },
          { title: "قائمة 4", links: data.list4 },
          { title: "قائمة 5", links: data.list5 },
        ];

        setMenus(combinedLists);
      } catch (error) {
        console.error("Error fetching footer lists:", error);
      }
    };

    fetchMenus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    try {
      const response = await instance.post("/subscribe", formData);

      if (response.status === 201) {
        setIsPopupVisible(true);
        setEmail("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const response = await instance.get("/getsociallinks");
      const data = response.data.data;
      setForm({
        facebook: data.facebook_account,
        youtube: data.youtube_account,
        instagram: data.instgram_account,
        x_account: data.x_account,
        snapchat: data.snapchat_account,
      });
    };
    getData();
  }, []);

  const socialIcons = [
    { imgsrc: "/facebook.png", link: form.facebook },
    { imgsrc: "/instagram.png", link: form.instagram },
    { imgsrc: "/twitter.png", link: form.x_account },
    { imgsrc: "/youtube.png", link: form.youtube },
    { imgsrc: "/snapchat.png", link: form.snapchat },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-main_dash  ">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:gap-8">
          <div className="text-teal-600 max-md:w-fit max-md:mx-auto">
            <Img src="/logo.png" className="w-[120px] object-contain" />
          </div>

          <div className="mt-8 gap-8 lg:mt-0 lg:grid-cols-5 lg:gap-y-16 w-full">
            {/* Newsletter Section */}
            <div className="flex max-lg:flex-col w-full items-center justify-between">
              <div className="col-span-2">
                <div>
                  <h2 className="text-2xl dark:text-secend_text font-bold ">
                    {language === "EN"
                      ? "Get the Latest News"
                      : "احصل على آخر الأخبار!"}
                  </h2>
                  <p className="mt-4 dark:text-secend_text w-[430px] max-md:w-fit">
                    {language === "EN"
                      ? "Follow the Latest News!"
                      : "تابع جميع آخر الأخبار"}
                  </p>
                </div>
              </div>
              <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="w-full">
                  <label htmlFor="UserEmail" className="sr-only">
                    Email
                  </label>

                  <div className="p-2 sm:flex sm:items-center sm:gap-4">
                    <input
                      type="email"
                      id="UserEmail"
                      placeholder="john@rhcp.com"
                      name="email"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      value={email}
                      className="w-full h-[5vh] outline-none rounded-md px-3 placeholder-shown:px-3 border-none focus:border-transparent focus:ring-transparent sm:text-sm"
                    />
                    <button className="mt-1 w-full bg-teal-500 px-6 py-3 text-sm font-bold uppercase tracking-wide  transition-none hover:bg-teal-600 sm:mt-0 sm:w-auto sm:shrink-0">
                      {language === "EN" ? "Subscribe" : "اشترك"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer Links Section */}
            <div className="w-full grid grid-cols-5 max-lg:grid-cols-3  max-md:grid-cols-2 gap-16 max-md:gap-3 items-center justify-items-center my-6">
              {menus.map((menu: any, index) => (
                <div key={index} className="w-full">
                  <ul className="mt-6 flex flex-col items-start  space-y-4 text-sm">
                    {menu.links.map((link: any, linkIndex: any) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.url}
                          className="dark:text-secend_text transition hover:opacity-75 hover:underline hover:underline-gray-500"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Social Icons Section */}
            <div className="flex items-center flex-wrap gap-4 pt-8 w-fit mx-auto">
              {socialIcons.map((item, index) => (
                <Link
                  href={item.link ? item.link : "#"}
                  key={index}
                  className="group relative overflow-hidden w-[34px] h-[34px] flex items-center justify-center rounded-md bg-slate-200/80 shadow-sm"
                >
                  <Img
                    src={item.imgsrc}
                    className="w-[20px] z-[2] cursor-pointer"
                  />
                  <div className="group-hover:w-full left absolute left-0 top-0 z-[1] bg-sky-400 w-0 duration-300 cursor-pointer h-[500px]"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {isPopupVisible && (
        <SuccessPopup
          message={
            language === "EN"
              ? "Thank you for subscribing to our newsletter. We will be keen to provide you with the latest news about Aram."
              : "شكرا على إشتراكك فى النشرة البريدية سنكون حريصين على تزويدك بأخر ما يخص آرام"
          }
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </footer>
  );
}
