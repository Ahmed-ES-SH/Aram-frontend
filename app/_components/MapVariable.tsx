"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LocationProps {
  address: string;
  latitude: number;
  longitude: number;
}

const MapComponent: React.FC<{ location: LocationProps }> = ({ location }) => {
  const { address, latitude, longitude } = location;

  // Check if we are in a browser environment
  const customIcon: L.DivIcon | undefined =
    typeof window !== "undefined"
      ? L.divIcon({
          html: `<div style="display: flex; justify-content: center; align-items: center; width: 32px; height: 32px;">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12 2C8.68629 2 6 4.68629 6 8C6 11.866 12 22 12 22C12 22 18 11.866 18 8C18 4.68629 15.3137 2 12 2ZM12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9C14 10.1046 13.1046 11 12 11Z" fill="black"/>
                 </svg>
               </div>`,
          className: "custom-icon",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        })
      : undefined;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
