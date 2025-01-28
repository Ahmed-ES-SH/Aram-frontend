"use client";
import React, { useRef, useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import SuccessPopup from "@/app/_components/_dashboard/SuccessPopup";
import Img from "@/app/_components/Img";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import Loading from "@/app/_components/Loading";

interface SectionData {
  id: string;
  title: string;
  placeholder: string;
  textEn: string;
  textAr: string;
  image: File | string | null;
  ref: React.RefObject<HTMLInputElement>;
}

export default function CompanyDetails() {
  const videoref = useRef<HTMLInputElement>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generalError, setGeneralError] = useState<string>("");
  const [main_video, setmain_video] = useState<string>("");
  const [videoUrl, setVideo] = useState<File | null>(null);

  const initialSections: SectionData[] = [
    {
      id: "about",
      title: "عن الشركة",
      placeholder: "عن الشركة",
      textEn: "",
      textAr: "",
      image: null,
      ref: useRef<HTMLInputElement>(null),
    },
    {
      id: "goals",
      title: "أهداف الشركة",
      placeholder: "أهداف الشركة",
      textEn: "",
      textAr: "",
      image: null,
      ref: useRef<HTMLInputElement>(null),
    },
    {
      id: "values",
      title: "قيم الشركة",
      placeholder: "قيم الشركة",
      textEn: "",
      textAr: "",
      image: null,
      ref: useRef<HTMLInputElement>(null),
    },
    {
      id: "vision",
      title: "رؤية الشركة",
      placeholder: "رؤية الشركة",
      textEn: "",
      textAr: "",
      image: null,
      ref: useRef<HTMLInputElement>(null),
    },
  ];

  const [sections, setSections] = useState(initialSections);

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const response = await instance.get("/detailes");
      const data = response.data.data;

      const updatedSections = sections.map((section) => ({
        ...section,
        textEn: data[`${section.id}_en`] || "",
        textAr: data[`${section.id}_ar`] || "",
        image: data[`${section.id}_image`] || null,
      }));

      setSections(updatedSections);
      setVideo(data.main_video || "");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input changes
  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    sectionId: string
  ) => {
    const { name, value } = e.target;
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, [name]: value } : section
      )
    );
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    sectionId: string
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId ? { ...section, image: files[0] } : section
        )
      );
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const videoFile = files[0];
      setVideo(videoFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    setLoading(true);

    // Append text and images to the form data
    sections.forEach((section) => {
      formData.append(`${section.id}_en`, section.textEn);
      formData.append(`${section.id}_ar`, section.textAr);
      if (section.image && section.image instanceof File) {
        formData.append(`${section.id}_image`, section.image);
      }
      if (videoUrl) {
        formData.append("main_video", videoUrl);
      }
      if (main_video) {
        formData.append("main_video", main_video);
      }
    });

    try {
      const response = await instance.post("/update-detailes", formData);
      if (response.status === 200) {
        setIsPopupVisible(true);
      }
    } catch (error) {
      setGeneralError("Error submitting data.");
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div style={{ direction: "rtl" }} className="w-full  pb-6">
        <h1 className="text-xl w-fit mx-auto font-semibold text-center pb-4 border-b-2 border-sky-400 dark:text-white">
          معلومات الشركة
        </h1>
        <form onSubmit={handleSubmit} className="w-[90%] mx-auto">
          {sections.map((section) => (
            <div
              key={section.id}
              className="w-full pb-4 border-b-2 border-sky-500 my-2 flex items-center justify-between max-md:flex-col gap-4"
            >
              <div className="w-1/2 max-md:w-full max-md:px-2">
                <div className="flex flex-col items-start gap-1">
                  <label className="text-[18px] py-2 dark:text-white">
                    {section.title}
                  </label>
                  <textarea
                    name="textEn"
                    value={section.textEn}
                    onChange={(e) => handleTextChange(e, section.id)}
                    className="w-full h-32 px-4 outline-none  py-2 border rounded-md"
                  />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <label className="text-[18px] py-2 dark:text-white">
                    {section.title} (عربى)
                  </label>
                  <textarea
                    name="textAr"
                    value={section.textAr}
                    onChange={(e) => handleTextChange(e, section.id)}
                    className="w-full h-32 px-4 outline-none  py-2 border rounded-md mt-2"
                  />
                </div>
              </div>
              <div
                className="cursor-pointer flex justify-center w-1/2 "
                onClick={() => section.ref.current?.click()}
              >
                {section.image ? (
                  <Img
                    src={
                      typeof section.image === "string"
                        ? section.image
                        : URL.createObjectURL(section.image)
                    }
                    className="w-48 h-48 object-cover"
                  />
                ) : (
                  <FaPlusCircle className="text-sky-400 text-4xl" />
                )}
              </div>
              <input
                type="file"
                ref={section.ref}
                className="hidden"
                onChange={(e) => handleImageChange(e, section.id)}
                accept="image/*"
              />
            </div>
          ))}
          {/* قسم الفيديو الرئيسي */}
          <div className="w-full my-4">
            <h2 className="text-lg font-semibold dark:text-white pb-2 ">
              الفيديو الرئيسي
            </h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => videoref.current?.click()}
              className="flex flex-col items-center  cursor-pointer"
            >
              {videoUrl ? (
                typeof videoUrl == "string" ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full md:w-3/4 rounded-md shadow-md"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(videoUrl)}
                    controls
                    className="w-full md:w-3/4 rounded-md shadow-md"
                  />
                )
              ) : (
                <FaPlusCircle className="text-sky-400 text-4xl cursor-pointer" />
              )}
            </motion.div>
            <input
              ref={videoref}
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
            />
            <label className="text-[18px] py-2 dark:text-white" htmlFor="">
              رابط الفيديو
            </label>
            <input
              type="text"
              className="w-full h-12 px-4 outline-none  py-2 border rounded-md mt-2"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setmain_video(e.target.value)
              }
              name="main_video"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 w-full rounded mt-4"
          >
            حفظ
          </button>
          {isPopupVisible && (
            <SuccessPopup
              message="تمت العملية بنجاح!"
              onClose={() => setIsPopupVisible(false)}
            />
          )}
          {generalError && <p className="text-red-500">{generalError}</p>}
        </form>
      </div>
    </>
  );
}
