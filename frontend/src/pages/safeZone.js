import React, { useState, useEffect } from 'react';
import MapComp from '../components/mapComp';
import AttackInputs from '../components/AttackData';
import FlightInfoPopup from '../components/FlightInfo';
import TimeUntilContactPopup from '../components/TimePopUp';
import SaveButton from '../components/SaveData';
import DataModal from '../components/dataModal/dataModal';
import LoadButton from '../components/LoadAttack';
import SafeZoneInputs from '../components/SafeZoneData';
import './home.css'



const SafeZone = ({ inputs, setInputs, flightData, setFlightData, timeUntilContact, setTime, errorMessages, setErrorMessages, formatFlightData, handleInputChange, handleLocationSelect }) => {

    const [shieldData, setShieldData] = useState(null);

    useEffect(() => {
        const { latitude, longitude, speed, radius } = inputs;
        // Only send the request if all required inputs are present and valid
        if (latitude && longitude && radius) {
            const fetchFlightData = async () => {
                try {
                    const response = await fetch('http://localhost:1212/api/calculate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            coordinates1: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
                            planeSpeed: parseFloat(speed),
                            flightRadius: parseFloat(radius),
                        }),
                    });

                    if (!response.ok) {
                        setFlightData(null);
                        setTime(null);
                        throw new Error('Failed to fetch flight data');
                    }

                    const data = await response.json();
                    setFlightData(formatFlightData(data));
                    // const timeResponse = await fetch('http://localhost:1212/api/smartTimeCalc', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: JSON.stringify({
                    //         flightLat: parseFloat(flightData.Latitude),
                    //         flightLon: parseFloat(flightData.Longitude),
                    //         flightSpeed: flightData.Speed,
                    //         missileLat: parseFloat(latitude),
                    //         missileLon: parseFloat(longitude),
                    //         missileSpeed: speed,
                    //         trueDiraction: flightData.TrueDirection
                    //     }),
                    // });

                    // if (!timeResponse.ok) {
                    //     throw new Error('Failed to fetch contact data');
                    // }

                    // const timeData = await timeResponse.json();
                    // console.log(timeData);
                    // setTime(timeData.time);

                } catch (error) {
                    console.error('Error fetching flight data:', error);
                }
            };

            fetchFlightData();
        }
    }, [inputs, shieldData]);

    return (
        <div
            style={{
                position: 'relative',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10px 20px', // Reduced top and bottom padding
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <h1 style={{ margin: '0 20px 0 0' }}>Attack Predictor</h1>
                    <AttackInputs
                        onInputChange={handleInputChange}
                        handleButton={null}
                    />
                </div>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <SafeZoneInputs setShieldData={setShieldData}/>
                </div>
            </div>
            {errorMessages.length > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        zIndex: 1100,
                    }}
                >
                    <ul>
                        {errorMessages.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <TimeUntilContactPopup timeUntilContact={timeUntilContact} />
            <MapComp
                inputs={inputs}
                flightData={flightData}
                shieldData={shieldData}
                onLocationSelect={handleLocationSelect}
            />
            <FlightInfoPopup flightData={flightData} />
        </div>
    );



}

export default SafeZone;