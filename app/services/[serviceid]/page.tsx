"use client";
import OrganizationSlider from "@/app/_components/_website/_servicespage/OrganizationSlider";
import RandomServicesSidebar from "@/app/_components/_website/_servicespage/RandomServicesSidebar";
import Img from "@/app/_components/Img";
import Loading from "@/app/_components/Loading";
import { instance } from "@/app/Api/axios";
import { useDataContext } from "@/app/context/DataContext";
import { UseVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GiBarbedStar } from "react-icons/gi";
import { IoIosTime } from "react-icons/io";

interface serviceType {
  id: number;
  category_id: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  features: string[];
  image: string;
  icon: string;
}

export default function ServiceDetails({ searchParams }: any) {
  const { language }: any = UseVariables();
  const { loading } = useDataContext();
  const id = searchParams.serviceId;

  const [service, setService] = useState<serviceType>({
    id: 0,
    category_id: 0,
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    image: "",
    icon: "",
    features: [],
  });

  const [serviceFeatures, setServiceFeatures] = useState<string[]>([]);

  const formatTitle = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    const getdata = async (api: string, setdata: any) => {
      try {
        const response = await instance.get(api);
        if (response.status == 200) {
          const data = response.data.data;
          const features = data.features;
          setdata(data);
          features &&
            setServiceFeatures(
              typeof features == "string" ? JSON.parse(data.features) : features
            );
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    getdata(`/service/${id}`, setService);
  }, [id]);

  if (loading) return <Loading />;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.7 }}
        className="w-[98%] pt-5  h-fit dark:bg-main_dash mx-auto p-2  flex items-start justify-between max-xl:flex-col gap-2 mt-16 max-lg:mt-20"
      >
        {/* محتوى الخدمة الرئيسي */}
        <div className="border dark:bg-secend_dash dark:border-gray-600 w-3/4  rounded-md shadow-md max-xl:w-full  h-full px-2 py-1">
          {/* قسم الصورة مع تأثير الحركة عند التمرير */}
          <motion.div
            className="w-full h-80 bg-cover relative bg-center rounded-lg shadow-md"
            style={{
              backgroundImage: service.image
                ? `url('${service.image}')`
                : `url('/services/service_2.jpg')`, // ضع مسار الصورة هنا
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Img
              src={service.icon ? service.icon : "/logo.png"}
              className="w-10 h-10 absolute bottom-2 left-2 rounded-full"
            />
          </motion.div>

          {/* عنوان الخدمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 text-center mt-4"
          >
            <div className="w-fit pb-2 border-b border-main_red mx-auto">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl  mx-auto w-fit font-semibold text-gray-800 dark:text-white">
                  {language == "EN" ? service.title_en : service.title_ar}
                </h1>
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300">
              {language == "EN"
                ? service.description_en
                : service.description_ar}
            </p>
          </motion.div>

          {/* المزيد من المعلومات عن الخدمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <h2 className="text-2xl pb-2 border-b border-main_orange w-fit font-semibold text-gray-800 dark:text-white">
              {language == "EN" ? "Service Features" : "مميزات الخدمة"}
            </h2>
            <ul className="list-inside flex flex-col items-start gap-4 mt-4 text-lg text-gray-600 dark:text-gray-300">
              {serviceFeatures.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center gap-3"
                >
                  <GiBarbedStar className="text-main_blue" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* قسم الأسئلة الشائعة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-6"
          >
            <h2 className="text-xl pb-2 border-b border-main_orange w-fit font-semibold text-gray-800 dark:text-white">
              {language == "EN"
                ? "Frequently Asked Questions"
                : "الأسئلة الشائعة"}
            </h2>
            <div className="space-y-4 mt-6">
              <div className="text-gray-600 dark:text-gray-300">
                <h3 className="font-semibold">
                  {language == "EN"
                    ? "Can I make an appointment?"
                    : "هل يمكنني حجز موعد؟"}
                </h3>
                <p>
                  {language == "EN"
                    ? "Yes, you can book an appointment through our website or contact us directly."
                    : "نعم، يمكنك حجز موعد عبر موقعنا الإلكتروني أو الاتصال بنا مباشرة."}
                </p>
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                <h3 className="font-semibold text-sm">
                  {language == "EN"
                    ? "Are there any side effects?"
                    : "هل هناك أي تأثيرات جانبية؟"}
                </h3>
                <p>
                  {language == "EN"
                    ? "The services we offer are completely safe and there are no noticeable side effects."
                    : "الخدمات التي نقدمها آمنة تمامًا ولا توجد تأثيرات جانبية ملحوظة."}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="button w-full mt-8 mx-auto">
            <Link
              className="w-[30%] max-lg:w-1/2 max-md:w-[90%]  mx-auto h-[40px] flex items-center gap-4 duration-200 justify-center rounded-md shadow-md my-2 bg-main_orange text-white border border-transparent hover:border-main_orange hover:bg-white hover:text-black"
              href={`/bookservice/${formatTitle(service.title_en)}?serviceId=${
                service.id
              }&serviceCategoryId=${service.category_id}`}
            >
              <IoIosTime className="size-4 " />
              <p>{language == "EN" ? "Book Now" : "إحجز الأن"}</p>
            </Link>
          </div>
          <OrganizationSlider />
        </div>

        {/* Sidebar مع الخدمات الأخرى */}
        {<RandomServicesSidebar />}
      </motion.div>
    </>
  );
}
