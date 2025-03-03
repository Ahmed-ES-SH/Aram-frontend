"user client";
import { instance } from "@/app/Api/axios";
import React, { useEffect, useRef, useState } from "react";
import Loading from "../../Loading";
import { MdOutlineEdit } from "react-icons/md";
import Img from "../../Img";
import { RiAdvertisementFill, RiUser2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import SuccessPopup from "../../_dashboard/SuccessPopup";
import SlectLocation from "../../MapFile";
import LocationPicker from "../../MapFile";

export default function UserDeatiles({ userId }: { userId: number }) {
  const openInput = useRef<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<null | File>(null);
  const [formData, setFormData] = useState<any>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [location, setlocation] = useState({
    latitude: 21.4735,
    longitude: 55.9754,
    address: "سلطنة عمان",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onLocationSelect = (location: any) => {
    setlocation(location);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get(`/user/${userId}`);
        if (response.status == 200) {
          const data = response.data.data;
          setFormData({ ...data });
          setlocation(
            typeof data.location == "string"
              ? JSON.parse(data.location)
              : data.location
          );
          setImage(data.image);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) getData();
  }, [userId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const skipedColumn = [
        "image",
        "location",
        "updated_at",
        "created_at",
        "email_verified_at",
        "social_type",
        "number_of_reservations",
      ];
      const form = new FormData();
      Object.entries(formData)
        .filter(([key]) => !skipedColumn.includes(key)) // استبعاد الحقول غير المرغوبة
        .forEach(([key, value]) => {
          form.append(key, value as any);
        });

      if (image) form.append("image", image);
      if (location)
        form.append(
          "location",
          typeof location == "string" ? location : JSON.stringify(location)
        );
      const response = await instance.post(`/update-user/${userId}`, form);
      if (response.status == 200) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          router.push("/dashboard/users");
        }, 1500);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChaneg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const inputs = [
    {
      name: "name",
      label: "إسم المستخدم",
      value: formData.name,
      type: "text",
    },
    {
      name: "email",
      label: "البريد الإلكترونى",
      value: formData.email,
      type: "email",
    },
    {
      name: "phone_number",
      label: "رقم الهاتف",
      value: formData.phone_number,
      type: "text",
    },
    {
      name: "location",
      label: "العنوان",
      value: location?.address,
      type: "text",
    },
  ];

  const labelstyle =
    "block text-sm font-medium pb-1 border-b   w-fit border-main_red text-gray-700  dark:text-gray-300";
  const inputstyle =
    "dark:bg-main_dash dark:text-white  mt-1 py-2 read-only:bg-gray-300 read-only:outline-none   outline-transparent focus:outline-main_orange duration-200 px-2 border  w-full rounded-md border-gray-200  text-sm text-gray-700 dark:text-gray-300 shadow-sm";

  if (loading) return <Loading />;

  return (
    <>
      <div className=" w-[90%] mx-auto max-md:w-[98%] max-lg:w-[95%] min-h-screen">
        <h1 className="pb-3 border-b  border-main_orange w-fit mx-auto">
          {formData.name}
        </h1>
        <div className="my-4  bg-gray-50 px-2 py-1 flex flex-col gap-3">
          <div className="w-fit relative mx-auto mt-4 h-48 rounded-md shadow-md border">
            {image instanceof File ? (
              <Img
                src={URL.createObjectURL(image)}
                className="w-full h-full object-cover"
              />
            ) : (
              <Img
                src={formData.image ? formData.image : "/public"}
                className="w-full h-full object-cover"
              />
            )}
            <div
              onClick={() => openInput.current.click()}
              className="w-8 h-8 absolute bottom-2 right-2 cursor-pointer text-white flex items-center justify-center rounded-md shadow-md bg-sky-400"
            >
              <MdOutlineEdit className="size-5" />
            </div>
            <input
              ref={openInput}
              type="file"
              hidden
              onChange={handleFileChaneg}
              name="image"
            />
          </div>
          {inputs.map((input, index) => (
            <div key={index} className="flex flex-col gap-2">
              <label className={labelstyle}>{input.label}</label>
              <input
                type={input.type}
                value={input.value}
                name={input.name}
                className={inputstyle}
                onChange={handleChange}
                readOnly={input.name == "location" ? true : false}
              />
            </div>
          ))}
          <div className=" w-full h-fit">
            <LocationPicker
              location={location}
              onLocationSelect={onLocationSelect}
              setLocation={setlocation}
            />
          </div>
          <div className="w-full mt-4">
            <label className={labelstyle}>نوع الحساب</label>
            <select
              className="w-full mt-1 rounded-md outline-sky-300 px-2 py-4 "
              name="role"
              value={formData?.role || ""}
              onChange={handleChange}
            >
              <option value={""} disabled>
                حدد دور المستخدم :-
              </option>
              <option value={"Admin"}>أدمن</option>
              <option value={"user"}>مستخدم</option>
            </select>
          </div>
          <div className="w-full mt-4">
            <label className={labelstyle}>حالة الترويج</label>
            <div className="flex items-center justify-between gap-2 max-md:flex-col w-full mt-2">
              <div
                onClick={() => setFormData({ ...formData, is_promoter: 1 })}
                className={`flex-1 max-md:w-full py-4 px-2 rounded-md shadow-md flex items-center justify-center ${
                  formData.is_promoter
                    ? "text-white bg-green-400"
                    : "bg-gray-50"
                } duration-200 cursor-pointer`}
              >
                <div className="flex flex-col items-center gap-2">
                  <RiAdvertisementFill className="size-7 " />
                  <p>مروج</p>
                </div>
              </div>
              <div
                onClick={() => setFormData({ ...formData, is_promoter: 0 })}
                className={`flex-1 max-md:w-full py-4 px-2 rounded-md shadow-md flex items-center justify-center ${
                  !formData.is_promoter
                    ? "text-white bg-green-400"
                    : "bg-gray-50"
                } duration-200 cursor-pointer`}
              >
                <div className="flex items-center flex-col gap-2">
                  <RiUser2Line className="size-7 " />
                  <p>مستخدم</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="block mt-4 duration-200 w-1/4 mx-auto max-md:w-[98%] max-lg:w-[75%] text-white bg-green-400 hover:bg-white hover:scale-110 hover:text-black hover:border-green-400 border border-transparent px-2 py-4 rounded-md shadow-md "
          >
            حفظ
          </button>
        </div>
      </div>
      {showSuccessPopup && (
        <SuccessPopup
          message="تم تحديث بيانات المستخدم بنجاح "
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </>
  );
}
