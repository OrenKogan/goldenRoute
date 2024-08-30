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
                <Route path="/safe" element={<SafeZone handleLocationSelect={handleLocationSelect} setErrorMessages={setErrorMessages} errorMessages={errorMessages} setTime={setTime} timeUntilContact={timeUntilContact} setFlightData={setFlightData} flightData={flightData} inputs={inputs} setInputs={setInputs} formatFlightData={formatFlightData} handleInputChange={handleInputChange} />} />
            </Routes>
        </Router>



        // <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        //     <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        //         <h1 style={{ margin: '0 20px' }}>Attack Predictor</h1>
        //         <div style={{ display: 'flex', gap: '20px', flex: '1 1 auto', justifyContent: 'center', alignItems: 'center' }}>
        //             <AttackInputs onInputChange={handleInputChange} handleButton={handleSaveButtonLogic} />
        //             <SaveButton onSave={handleSave} style={{ height: '100%' }} disabled={isButtonDisabled} />
        //         </div>
        //         <LoadButton handleLoad={HandleFetchBtnClick} />
        //     </div>
        //     {errorMessages.length > 0 && (
        //         <div style={{ position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', zIndex: 1100 }}>
        //             <ul>
        //                 {errorMessages.map((error, index) => (
        //                     <li key={index}>{error}</li>
        //                 ))}
        //             </ul>
        //         </div>
        //     )}
        //     <TimeUntilContactPopup timeUntilContact={timeUntilContact} />
        //     <MapComp inputs={inputs} flightData={flightData} onLocationSelect={handleLocationSelect} />
        //     <DataModal isOpen={isFetchOpen} attacksData={attacksData} closeHandle={HandleFetchBtnClick} setFlightData={handleAttackDataHover} setAttack={handleLoadAttack} />
        //     <FlightInfoPopup flightData={flightData} />
        // </div>
    );
};

export default App;