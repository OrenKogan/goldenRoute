import React, { useState, useEffect } from 'react';
import Home from './pages/home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SafeZone from './pages/safeZone';

const formatFlightData = (data) => {
    let flightData = {}
    flightData.ICAO24 = data[0];
    flightData.Callsign = data[1].trim();
    flightData.OriginCountry = data[2];
    flightData.LastContact = data[4];
    flightData.OnGround = data[8];
    flightData.Closest_Airport = data[18];
    flightData.Latitude = data[6];
    flightData.Longitude = data[5];
    flightData.Speed = data[9];
    flightData.TrueDirection = data[10];

    return flightData;
}

const App = () => {
    const [inputs, setInputs] = useState({
        latitude: '',
        longitude: '',
        speed: '',
        radius: '',
    });
    
    const [flightData, setFlightData] = useState(null);
    const [timeUntilContact, setTime] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]);

    const handleInputChange = (name, value) => {
        setInputs((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLocationSelect = (lat, lon) => {
        setInputs((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lon,
        }));
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home handleLocationSelect={handleLocationSelect} setErrorMessages={setErrorMessages} errorMessages={errorMessages} setTime={setTime} timeUntilContact={timeUntilContact} setFlightData={setFlightData} flightData={flightData} inputs={inputs} setInputs={setInputs} formatFlightData={formatFlightData} handleInputChange={handleInputChange}/>} />
                <Route path="/safeZone" element={<SafeZone handleLocationSelect={handleLocationSelect} setErrorMessages={setErrorMessages} errorMessages={errorMessages} setTime={setTime} timeUntilContact={timeUntilContact} setFlightData={setFlightData} flightData={flightData} inputs={inputs} setInputs={setInputs} formatFlightData={formatFlightData} handleInputChange={handleInputChange} />} />
            </Routes>
        </Router>
    );
};

export default App;