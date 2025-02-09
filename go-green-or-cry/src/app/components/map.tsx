"use client";

import { FC, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useCallback } from "react";


// Fix marker issue in Next.js
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

interface MapProps {
    onDataFetch: (data: any) => void;
}

// Custom Leaflet icon
const customIcon = new L.Icon({
    iconUrl: markerIconPng.src,
    shadowUrl: markerShadowPng.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const Map: FC<MapProps> = ({ onDataFetch }) => {
    const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);

    // POST data to Flask backend and pass the response to the parent
    const sendData = useCallback(async (latitude: number, longitude: number) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/generate_json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ latitude, longitude }),
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            console.log("Fetched Sustainability Data:", data);
            onDataFetch(data);
        } catch (error) {
            console.error("Error fetching sustainability data:", error);
        }
    }, [onDataFetch]); // Dependencies for useCallback

    // Handle map clicks with React Leaflet
    const MapClickHandler = () => {
        const map = useMapEvents({
            click(e) {
                setMarkers([{ lat: e.latlng.lat, lng: e.latlng.lng }]);
                console.log("New marker added at:", e.latlng.lat, e.latlng.lng);
                sendData(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    return (
        <MapContainer
            center={[40.7291, -73.9965]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />

            {/* Listen for map clicks */}
            <MapClickHandler />

            {/* Render Markers */}
            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.lat, marker.lng]} icon={customIcon}>
                    <Popup>
                        New Construction Site
                        <br />
                        Lat: {marker.lat.toFixed(5)}, Lon: {marker.lng.toFixed(5)}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
