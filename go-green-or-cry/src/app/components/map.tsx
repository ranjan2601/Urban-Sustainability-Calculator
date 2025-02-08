"use client"; // Ensure this runs only on the client side

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker issue in Next.js
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: markerIconPng.src,
    shadowUrl: markerShadowPng.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const Map = () => {
    const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);

    // Handle map click to add markers
    const sendData = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/generate_json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ latitude, longitude }),

            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            console.log("New site added successfully");
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("There was a problem with your fetch operation:", error);
        }
        

       
    }
    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                setMarkers(() => [{ lat: e.latlng.lat, lng: e.latlng.lng }]);
                console.log("New marker added at: ", e.latlng.lat, e.latlng.lng);
                sendData(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    return (
        <MapContainer center={[40.7291, -73.9965]} zoom={15} style={{ height: "100vh", width: "70%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <MapClickHandler />
            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.lat, marker.lng]} icon={customIcon}>
                    <Popup>
                        New Construction Site<br />Lat: {marker.lat.toFixed(5)}, Lon: {marker.lng.toFixed(5)}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
