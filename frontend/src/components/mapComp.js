import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
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

const shieldIcon = new L.Icon({
    iconUrl: '/sheild.png',
    iconSize: [50, 50], // Size of the icon
    iconAnchor: [25, 25], // Anchor the icon at its center
});

const MapView = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [center, map, zoom]);

    return null;
};

const MapComp = ({ inputs, flightData, onLocationSelect, shieldData }) => {
    // Coordinates for a location in Israel (e.g., Tel Aviv)
    const { latitude, longitude, radius } = inputs;

    const hasValidInput = latitude && longitude;
    const zoom = hasValidInput ? 8 : 2;

    const greenPlaneCoordinates = flightData ? {
        lat: flightData.Latitude,
        lng: flightData.Longitude,
    } : null;

    const sheildCoordinates = shieldData ? {
        lat: shieldData.s_latitude,
        lng: shieldData.s_longitude,
    } : null;

    const MapClickHandler = () => {
        useMapEvents({
            click: (event) => {
                const { latlng } = event;
                const lat = latlng.lat;
                const lon = latlng.lng;
                onLocationSelect(lat, lon);
            }
        });
        return null;
    };

    return (
        <MapContainer center={[latitude, longitude]} zoom={zoom} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapView center={[latitude, longitude]} zoom={zoom} />
            <MapClickHandler />
            {hasValidInput && (
                <>
                    <Marker position={[latitude, longitude]} icon={redMissleIcon} />
                    <Circle
                        center={[latitude, longitude]}
                        radius={radius * 1000} // Convert kilometers to meters
                        color="red"
                        fillColor="red"
                        fillOpacity={0.2} // 20% transparent
                    />
                    {greenPlaneCoordinates && (
                        <Marker
                            position={greenPlaneCoordinates}
                            icon={greenPlaneIcon}
                        />
                    )}
                    {sheildCoordinates && sheildCoordinates.lat && sheildCoordinates.lng && shieldData.s_radius && (
                        <>
                            <Marker
                                position={sheildCoordinates}
                                icon={shieldIcon}
                            />
                            <Circle
                                center={[shieldData.s_latitude, shieldData.s_longitude]}
                                radius={shieldData.s_radius * 1000} // Convert kilometers to meters
                                color="green"
                                fillColor="green"
                                fillOpacity={0.2} // 20% transparent
                            />
                        </>
                    )}
                </>
            )}
        </MapContainer>
    );
};

export default MapComp;