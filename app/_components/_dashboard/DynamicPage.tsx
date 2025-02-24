"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { instance } from "@/app/Api/axios";
import Loading from "../Loading";
import { motion } from "framer-motion";

{
  /*
///////////////////////////////////////////////////////////////////       
////////////////////////////////  
//////////////////////////////// End of Imports lines
////////////////////////////////                                
//////////////////////////////////////////////////////////
  */
}

interface Type {
  inputs: { [key: string]: string }[];
  api: string;
  updateapi: string;
  direct: string;
  state: string;
}

interface Typeform {
  [key: string]: any;
}

{
  /*
  ///////////////////////////////////////////////////////////////////       
  ////////////////////////////////  
  //////////////////////////////// End of types lines
  ////////////////////////////////                                
  //////////////////////////////////////////////////////////
    */
}

const DynamicPage: React.FC<Type> = ({
  inputs,
  api,
  updateapi,
  direct,
  state,
}) => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [loading, setloading] = useState<boolean>(false);
  const [category, setCategory] = useState<any>(null);
  const [form, setForm] = useState<Typeform>({});
  const [initialForm, setInitialForm] = useState<Typeform>({}); // حفظ البيانات الأصلية للمقارنة
  const [errors, seterrors] = useState<any>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [articalcategoryId, setarticalcategoryId] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [categories, setcategories] = useState<[]>([]);
  const [articalcategories, setarticalcategories] = useState<[]>([]);
  const [icon, seticon] = useState<any>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [features_ar, setfeatures_ar] = useState<string[]>([]);
  const [features_en, setfeatures_en] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [featureInputAr, setFeatureInputAr] = useState("");
  const [featureInputEn, setFeatureInputEn] = useState("");

  const openInput = useRef<HTMLInputElement | null>(null);
  const openiconinput = useRef<HTMLInputElement | null>(null);

  console.log(categoryId);

  useEffect(() => {
    const initialFormState = inputs.reduce(
      (acc: { [key: string]: string }, input: { [key: string]: string }) => {
        acc[input.name] = "";
        return acc;
      },
      {} as { [key: string]: string }
    );

    setForm(initialFormState);
    setInitialForm(initialFormState); // تخزين القيم الأولية
  }, [inputs]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get(`${api}/${id}`);
        setCategory(response.data.data);

        const initialFormState = inputs.reduce((acc, input) => {
          acc[input.name] = response.data.data[input.name] || "";
          return acc;
        }, {} as { [key: string]: string });

        setForm(initialFormState);
        setCategoryId(response.data.data.category_id);
        seticon(response.data.data.icon);
        setInitialForm(initialFormState); // حفظ البيانات الأصلية عند التحميل
        if (api == "/service" || api == "/organization") {
          if (response.data.data.features) {
            const parsefeatures = JSON.parse(response.data.data.features);
            setFeatures(parsefeatures);
          }
        }

        if (api == "/card-type") {
          if (
            response.data.data.features_ar ||
            response.data.data.features_en
          ) {
            setfeatures_ar(response.data.data.features_ar);
            setfeatures_ar(response.data.data.features_en);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [id, api, inputs]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
  };
  const handlearticalCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategoryId(e.target.value);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get(`/all-service-categories`);
        setcategories(response.data.data);
        setarticalcategoryId(response.data.data.category_id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get(`/all-artical-categories`);
        setarticalcategories(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm({
        ...form,
        ["image"]: e.target.files[0],
      });
    }
  };

  const handleiconimage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      seticon(e.target.files[0]);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedImages(files);
    }
  };

  const handleFeatureAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && featureInput.trim() !== "") {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput(""); // Reset input field
      e.preventDefault(); // Prevent form submission
    }
  };
  const handleFeatureArAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && featureInput.trim() !== "") {
      setfeatures_ar([...features_ar, featureInputAr.trim()]);
      setFeatureInputAr(""); // Reset input field
      e.preventDefault(); // Prevent form submission
    }
  };
  const handleFeatureEnAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && featureInput.trim() !== "") {
      setfeatures_en([...features_en, featureInputEn.trim()]);
      setFeatureInputEn(""); // Reset input field
      e.preventDefault(); // Prevent form submission
    }
  };

  const handelDeleteFeature = (featureToDelete: string) => {
    setFeatures((prev) =>
      prev.filter((feature) => feature !== featureToDelete)
    );
  };
  const handelDeleteFeatureAr = (featureToDelete: string) => {
    setfeatures_ar((prev) =>
      prev.filter((feature) => feature !== featureToDelete)
    );
  };
  const handelDeleteFeatureEn = (featureToDelete: string) => {
    setfeatures_ar((prev) =>
      prev.filter((feature) => feature !== featureToDelete)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setloading(true);
      const formData = new FormData();

      // أضف فقط الحقول التي تم تعديلها
      for (const key in form) {
        if (form[key] !== initialForm[key]) {
          // مقارنة القيم الحالية بالقيم الأصلية
          formData.append(key, form[key]);
        }
      }

      // إضافة الصور
      if (selectedImages.length > 0) {
        selectedImages.forEach((file) => {
          formData.append("images[]", file);
        });
      }

      if (categoryId) {
        formData.append("category_id", categoryId);
      }
      if (articalcategoryId) {
        formData.append("category_id", articalcategoryId);
      }
      if (icon && typeof icon != "string") {
        formData.append("icon", icon);
      }

      if (features && features.length > 0)
        formData.append("features", JSON.stringify(features));

      const res = await instance.post(`${updateapi}/${id}`, formData);
      console.log(res);
      router.push(direct);
    } catch (error: any) {
      setloading(false);
      console.log("Error:", error);
      seterrors(error.response?.data?.errors || {});
    }
  };

  const labelstyle =
    "block text-sm font-medium text-gray-700  dark:text-gray-300";
  const inputstyle =
    "dark:bg-main_dash dark:text-white  mt-1 py-2 outline-transparent focus:outline-main_orange duration-200 px-2 border  w-full rounded-md border-gray-200  text-sm text-gray-700 dark:text-gray-300 shadow-sm";
  const textareaStyle =
    "dark:bg-main_dash h-[20vh] dark:text-white  mt-1 py-2 outline-transparent focus:outline-main_orange duration-200 px-2 border  w-full rounded-md border-gray-200  text-sm text-gray-700 dark:text-gray-300 shadow-sm";

  {
    /*
    ///////////////////////////////////////////////////////////////////       
    ////////////////////////////////  
    //////////////////////////////// End of dynamic functions lines
    ////////////////////////////////                                
    //////////////////////////////////////////////////////////
      */
  }

  if (loading) return <Loading />;

  return (
    <>
      {category !== null ? (
        <div
          style={{ direction: "rtl" }}
          className="h-[93vh] py-4 overflow-y-auto hidden-scrollbar w-full"
        >
          <div className=" head flex items-start max-lg:items-center border-b px-2 border-gray-300/30 pb-4">
            <h1 className="text-xl dark:text-white">
              {category[inputs[0].name]}
            </h1>
          </div>

          <form
            className="px-4 shadow-md relative hidden-scrollbar max-lg:w-3/4 m-auto w-[90%] h-[70vh] overflow-y-auto dark:bg-secend_dash bg-light_bg mt-8 z-[3] bg-transparent"
            onSubmit={handleSubmit}
          >
            {/*
    ///////////////////////////////////////////////////////////////////       
    ////////////////////////////////  
    //////////////////////////////// start of dynamic inputs lines
    ////////////////////////////////                                
    //////////////////////////////////////////////////////////
      */}
            {state == "service" && (
              <div className="mb-4">
                <label
                  htmlFor="categories"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  الأقسام
                </label>
                <select
                  id="categories"
                  name="categories"
                  value={categoryId} // ربط القيمة بالقسم المحدد
                  onChange={handleCategoryChange} // تحديث القيمة عند التغيير
                  className="block w-full shadow-md outline-none border-gray-300 rounded-md py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value={""} disabled className="text-gray-500">
                    اختر القسم
                  </option>
                  {categories.map((cat: any, index) => (
                    <option
                      value={cat.id}
                      key={index}
                      className="text-gray-700"
                    >
                      {cat.title_en}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {state == "artical" && (
              <div className="mb-4">
                <label
                  htmlFor="categories"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  الأقسام
                </label>
                <select
                  id="categories"
                  name="categories"
                  value={articalcategoryId} // ربط القيمة بالقسم المحدد
                  onChange={handlearticalCategoryChange} // تحديث القيمة عند التغيير
                  className="block w-full shadow-md outline-none border-gray-300 rounded-md py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value={""} disabled className="text-gray-500">
                    اختر القسم
                  </option>
                  {articalcategories.map((cat: any, index) => (
                    <option
                      value={cat.id}
                      key={index}
                      className="text-gray-700"
                    >
                      {cat.title_ar}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {inputs.map((input: { [key: string]: string }, index: number) => (
              <div className="w-full" key={index}>
                <label htmlFor={input.name} className={labelstyle}>
                  {input.label}
                </label>

                {/* Textarea Condition */}
                {input.type === "textarea" && (
                  <textarea
                    id={input.name}
                    className={`${inputstyle} h-[20vh]`}
                    name={input.name}
                    onChange={handleChange}
                    value={form[input.name]}
                  />
                )}

                {/* Input Condition */}
                {input.name !== "features" &&
                  input.name !== "features_ar" &&
                  input.name !== "features_en" &&
                  input.type !== "textarea" && (
                    <input
                      ref={input.type === "file" ? openInput : null}
                      id={input.name}
                      className={`${
                        input.type === "file" ? "hidden" : ""
                      } ${inputstyle}`}
                      name={input.name}
                      type={input.type}
                      onChange={
                        input.type === "file"
                          ? input.name === "images"
                            ? handleImagesChange
                            : handleImageChange
                          : handleChange
                      }
                      multiple={input.name === "images"}
                      {...(input.type !== "file" && {
                        value: form[input.name],
                      })}
                    />
                  )}

                {/* Features Input */}
                {input.name === "features" && (
                  <>
                    <input
                      id={input.name}
                      className={inputstyle}
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
                            className="p-3 bg-main_orange hover:bg-red-500 duration-300 cursor-pointer w-fit text-white rounded-md shadow-sm text-sm font-medium flex items-center justify-between"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            onClick={() => handelDeleteFeature(feature)}
                          >
                            {feature}
                          </motion.div>
                        ))}
                    </div>
                  </>
                )}

                {/* Features Ar Input */}
                {input.name === "features_ar" && (
                  <>
                    <input
                      id={input.name}
                      className={inputstyle}
                      placeholder="Add a feature and press Enter"
                      value={featureInputAr}
                      onChange={(e) => setFeatureInputAr(e.target.value)}
                      onKeyDown={handleFeatureArAdd}
                    />

                    <div className="flex items-center gap-3 flex-wrap mt-4">
                      {features_ar &&
                        features_ar.length > 0 &&
                        features_ar.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            className="p-3 bg-main_orange hover:bg-red-500 duration-300 cursor-pointer w-fit text-white rounded-md shadow-sm text-sm font-medium flex items-center justify-between"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            onClick={() => handelDeleteFeatureAr(feature)}
                          >
                            {feature}
                          </motion.div>
                        ))}
                    </div>
                  </>
                )}

                {/* Features EN Input */}
                {input.name === "features_en" && (
                  <>
                    <input
                      id={input.name}
                      className={inputstyle}
                      placeholder="Add a feature and press Enter"
                      value={featureInputEn}
                      onChange={(e) => setFeatureInputEn(e.target.value)}
                      onKeyDown={handleFeatureEnAdd}
                    />

                    <div className="flex items-center gap-3 flex-wrap mt-4">
                      {features_en &&
                        features_en.length > 0 &&
                        features_en.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            className="p-3 bg-main_orange hover:bg-red-500 duration-300 cursor-pointer w-fit text-white rounded-md shadow-sm text-sm font-medium flex items-center justify-between"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            onClick={() => handelDeleteFeatureEn(feature)}
                          >
                            {feature}
                          </motion.div>
                        ))}
                    </div>
                  </>
                )}

                {/* Image Input */}
                {input.name === "image" && (
                  <div className="group w-fit overflow-hidden h-full relative cursor-pointer mt-4">
                    <label
                      className="block w-fit h-fit cursor-pointer text-sm font-medium dark:text-white max-lg:dark:text-white max-lg:font-light after:h-[88%] after:rounded-md font-serif text-md py-2 after:content-[''] after:w-0  after:bg-black/40 after:absolute after:bottom-0 after:left-0 after:invisible before:content-['تغيير'] before:dark:text-white before:w-[160px] before:h-[50px] before:-translate-x-1/2 before:-translate-y-1/2 before:top-1/2 before:left-0 before:absolute before:flex before:items-center before:justify-center before:bg-sky-400 before:rounded-md before:z-[22] before:invisible group-hover:before:visible group-hover:before:left-1/2 group-hover:before:duration-200 group-hover:after:visible group-hover:after:duration-200 group-hover:after:w-full duration-200"
                      onClick={() => openInput.current?.click()}
                    >
                      {" صورة:"}
                    </label>

                    {typeof form["image"] === "string" ? (
                      <Image
                        key={index}
                        src={form[input.name]}
                        alt="image"
                        width={1024}
                        height={1280}
                        className="w-[250px] max-md:h-full rounded-md shadow-lg"
                      />
                    ) : (
                      <Image
                        src={URL.createObjectURL(form[input.name])}
                        alt="image"
                        width={1024}
                        height={1280}
                        className="w-[250px] rounded-md shadow-lg"
                      />
                    )}
                  </div>
                )}

                {/* Icon Input */}
                {input.type === "file" && input.name === "icon" && (
                  <div className="group w-fit overflow-hidden h-fit rounded-md relative cursor-pointer">
                    <label
                      className="block cursor-pointer text-sm font-medium dark:text-white max-lg:dark:text-white max-lg:font-light font-serif text-md py-2 after:content-[''] after:w-0 after:h-[88%] after:rounded-md after:bg-black/40 after:absolute after:bottom-0 after:left-0 after:invisible before:content-['تغيير'] before:dark:text-white before:w-[160px] before:h-[50px] before:-translate-x-1/2 before:-translate-y-1/2 before:top-1/2 before:left-0 before:absolute before:flex before:items-center before:justify-center before:bg-sky-400 before:rounded-md before:z-[22] before:invisible group-hover:before:visible group-hover:before:left-1/2 group-hover:before:duration-200 group-hover:after:visible group-hover:after:duration-200 group-hover:after:w-full duration-200"
                      onClick={() => openiconinput.current?.click()}
                    >
                      الأيقونة:
                    </label>
                    <input
                      type="file"
                      name="icon"
                      hidden
                      ref={openiconinput}
                      onChange={handleiconimage}
                    />
                    {icon instanceof File ? (
                      <Image
                        key={index}
                        src={URL.createObjectURL(icon) || "/logo.png"}
                        alt="image"
                        width={1024}
                        height={1280}
                        className="w-[250px] h-[250px] rounded-md shadow-lg"
                      />
                    ) : (
                      <Image
                        key={index}
                        src={icon || "/logo.png"}
                        alt="image"
                        width={1024}
                        height={1280}
                        className="w-[250px] h-[250px] rounded-md shadow-lg"
                      />
                    )}
                  </div>
                )}

                {/* Images Input */}
                {input.type === "file" && input.name === "images" && (
                  <div className="h-full w-fit group relative cursor-pointer mt-4">
                    <label
                      onClick={() => openInput.current?.click()}
                      className="block cursor-pointer text-sm font-medium text-secend_text max-lg:dark:text-white max-lg:font-light font-serif text-md py-2 after:content-[''] after:w-0 after:h-full after:bg-black/40 after:absolute after:top-0 after:left-0 after:invisible before:content-['Change'] before:dark:text-white before:w-[160px] before:h-[50px] before:-translate-x-1/2 before:-translate-y-1/2 before:top-1/2 before:left-0 before:absolute before:flex before:items-center before:justify-center before:bg-orange-400 before:rounded-md before:z-[22] before:invisible group-hover:before:visible group-hover:before:left-1/2 group-hover:before:duration-200 group-hover:after:visible group-hover:after:duration-200 group-hover:after:w-full duration-200"
                    >
                      صور:
                    </label>

                    {selectedImages.length > 0 ? (
                      <div className="flex items-center flex-wrap overflow-hidden gap-2 h-fit">
                        {selectedImages.map((file, index) => (
                          <Image
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt="image"
                            width={1024}
                            height={1280}
                            className="w-[150px] rounded-md shadow-lg"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 h-fit flex-wrap overflow-hidden">
                        {Array.isArray(form[input.name]) &&
                          form[input.name].map((src: string, index: number) => (
                            <Image
                              key={index}
                              src={src}
                              alt="image"
                              width={1024}
                              height={1280}
                              className="w-[150px] rounded-md shadow-lg"
                            />
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Errors */}
                {errors !== null &&
                  errors[input.name] &&
                  errors[input.name].map((error: string, index: number) => (
                    <p
                      className="w-full px-2 py-1 my-1 bg-red-400 rounded-md text-white"
                      key={index}
                    >
                      {error}
                    </p>
                  ))}
              </div>
            ))}

            {api == "/user" && (
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium dark:text-white text-[22px] max-lg:font-light font-serif text-md py-2"
                >
                  {"نوع الحساب :"}
                </label>
                <select
                  className="w-full rounded-md bg-secend_color dark:text-white dark:bg-main_dash shadow-md p-2 dark:border dark:border-secend_text outline-none"
                  name="role"
                  onChange={handleChange}
                  value={form.role || ""} // اجعل القيمة الافتراضية فارغة
                >
                  <option value="" disabled>
                    {" حدد نوع الحساب"}
                  </option>
                  <option value="user">{"مستخدم"}</option>
                  <option value="Admin">{"أدمن"}</option>
                </select>
              </div>
            )}

            {/*
    ///////////////////////////////////////////////////////////////////       
    ////////////////////////////////  
    //////////////////////////////// end of dynamic inputs lines
    ////////////////////////////////                                
    //////////////////////////////////////////////////////////
      */}
            <input
              type="submit"
              value="تعديل"
              className="w-fit px-8 py-2 my-3 rounded-md dark:text-white bg-sky-400 text-center  cursor-pointer mr-auto"
            />
          </form>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default DynamicPage;
