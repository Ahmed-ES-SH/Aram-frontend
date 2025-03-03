"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet"; // استيراد Leaflet لإنشاء أيقونة مخصصة
import "leaflet/dist/leaflet.css";

// إنشاء أيقونة مخصصة
const customIcon = L.icon({
  iconUrl: "/dashboard/location.png", // استبدلها بمسار صورتك
  iconSize: [32, 32], // حجم الأيقونة
  iconAnchor: [16, 32], // موقع الأيقونة بالنسبة للنقطة
  popupAnchor: [0, -32], // مكان ظهور النافذة المنبثقة بالنسبة للأيقونة
});

export default function LocationPicker({
  location = {
    latitude: 21.4735,
    longitude: 55.9754,
    address: "سلطنة عمان",
  },
  setLocation,
  onLocationSelect,
}) {
  useEffect(() => {
    if (location) {
      setLocation(location);
    }
  }, [location, setLocation]);

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`
      );
      const data = await response.json();
      return data.display_name || "عنوان غير متاح";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "عنوان غير متاح";
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        const address = await fetchAddress(lat, lng);
        const newLocation = { latitude: lat, longitude: lng, address };
        setLocation(newLocation);
        onLocationSelect(newLocation);
      },
    });
    return null;
  };

  return (
    <div>
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={13}
        style={{ height: "60vh", margin: "20px auto 0px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        {location.latitude && location.longitude && (
          <Marker
            position={[location.latitude, location.longitude]}
            icon={customIcon}
          />
        )}
      </MapContainer>
    </div>
  );
}
