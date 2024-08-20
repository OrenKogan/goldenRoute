import React, {useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Plane icon
const greenPlaneIcon = new L.Icon({
    iconUrl: '/green-plane.png',
    iconSize: [50, 50], // Size of the icon
    iconAnchor: [25, 25], // Anchor the icon at its center
});

const redMissleIcon = new L.Icon({
    iconUrl: '/red-missle.png',
    iconSize: [60, 55], // Size of the icon
    iconAnchor: [25, 25], // Anchor the icon at its center
});

const MapView = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);

    return null;
};

const MapComp = ({ inputs, flightData }) => {
    // Coordinates for a location in Israel (e.g., Tel Aviv)
    const { latitude, longitude, radius } = inputs;

    const greenPlaneCoordinates = flightData ? {
        lat: flightData[6],
        lng: flightData[5],
    } : null;

    return (
        <MapContainer center={[latitude, longitude]} zoom={8} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapView center={[latitude, longitude]} />
            <Marker position={[latitude, longitude]} icon={redMissleIcon} />
            <Circle
                center={[latitude, longitude]}
                radius={radius * 1000} // 3000 meters = 3 kilometers
                color="red"
                fillColor="red"
                fillOpacity={0.2} // 20% transparent
            />

            {greenPlaneCoordinates && (
                <Marker position={greenPlaneCoordinates} icon={greenPlaneIcon} />
            )}
        </MapContainer>
    );
};

export default MapComp;