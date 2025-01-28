import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import { RiCloseLargeFill } from "react-icons/ri";
import { UseVariables } from "../context/VariablesContext";

// تغيير الأيقونات الافتراضية
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Routing = ({ location1, location2 }) => {
  const map = useMap(); // استخدم useMap هنا داخل هذا المكون الذي يقع ضمن MapContainer

  useEffect(() => {
    if (!map) return; // تأكد من أن الخريطة موجودة

    // إضافة خدمة التوجيه لرسم الطريق بين النقطتين
    const control = L.Routing.control({
      waypoints: [
        L.latLng(location1.latitude, location1.longitude),
        L.latLng(location2.latitude, location2.longitude),
      ],
      lineOptions: {
        styles: [{ color: "blue", weight: 5 }],
      },
      createMarker: () => null, // إخفاء العلامات بين النقطتين
      showAlternatives: false, // إخفاء البدائل
      routeWhileDragging: false, // عدم التحديث أثناء السحب
      draggableWaypoints: false,
      addWaypoints: false,
    }).addTo(map);

    // إخفاء واجهة المستخدم الخاصة بالتفاصيل
    control.on("routesfound", function (e) {
      const routes = e.routes;
      routes.forEach((route) => {
        route.instructions = []; // إفراغ التعليمات لمنع ظهور القائمة
      });
    });

    return () => {
      map.removeControl(control);
    };
  }, [map, location1, location2]);

  return null;
};

export default function MapRouting({
  setCheckCurrentUserLocation,
  onClose,
  location1,
  location2,
}) {
  const { language } = UseVariables();

  return (
    <div className="fixed top-0 left-0 bg-black/50 flex items-center justify-center w-full h-screen">
      <div className="bg-white max-md:w-[95%] max-lg:w-[90%] w-1/2 h-fit dark:bg-secend_dash rounded-md shadow-md p-2 ">
        <MapContainer
          center={[30.5, 31.2]}
          zoom={7}
          style={{ height: "70vh", width: "100%", outlineColor: "transparent" }}
          className=""
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[location1.latitude, location1.longitude]} />
          <Marker position={[location2.latitude, location2.longitude]} />
          <Routing location1={location1} location2={location2} />
        </MapContainer>
        <button
          onClick={onClose}
          className="rounded-md  px-4 py-2 text-center my-2 w-fit ml-auto text-white bg-red-400 hover:bg-red-500 hover:scale-105 duration-100 flex items-center gap-1 "
        >
          <RiCloseLargeFill className="size-6 text-white" />
          <p>{language == "EN" ? "Close" : "إغلاق"}</p>
        </button>
      </div>
    </div>
  );
}
