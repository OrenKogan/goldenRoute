import React, { useState, useEffect } from 'react';
import MapComp from '../components/mapComp';
import AttackInputs from '../components/AttackData';
import FlightInfoPopup from '../components/FlightInfo';
import TimeUntilContactPopup from '../components/TimePopUp';
import SafeZoneInputs from '../components/SafeZoneData';
import DistancePopup from '../components/DistancePopUp';
import './home.css'



const SafeZone = ({ inputs, setInputs, flightData, setFlightData, timeUntilContact, setTime, errorMessages, setErrorMessages, formatFlightData, handleInputChange, handleLocationSelect }) => {

    const [shieldData, setShieldData] = useState(null);
    const [travelDistance, setTravelDistance] = useState(null);

    useEffect(() => {
        const { latitude, longitude, speed, radius } = inputs;
        setErrorMessages([]);
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
                    const curr_flightData = formatFlightData(data);
                    setFlightData(curr_flightData);

                    //get distance
                    const distance_res = await fetch('http://localhost:1212/api/BestDistance', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            flightLat: parseFloat(curr_flightData.Latitude),
                            flightLon: parseFloat(curr_flightData.Longitude),
                            missileLat: parseFloat(latitude),
                            missileLon: parseFloat(longitude),
                            safeLat: shieldData.s_latitude,
                            safeLon: shieldData.s_longitude,
                            safeRadius: shieldData.s_radius
                        }),
                    });

                    const dis_data = await distance_res.json();
                    if (!distance_res.ok) {
                        setErrorMessages([dis_data.error]);
                        setTravelDistance(null);
                        setTime(null);
                        throw new Error('Failed to fetch distance data');
                    }

                    setTravelDistance(dis_data.distance);
                    console.log(dis_data);


                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchFlightData();
        }
    }, [inputs, shieldData]);

    useEffect(() => {
        console.log(travelDistance);
        if (travelDistance && inputs.speed){
            const fetchTimeUntilContact = async () => {
                try {
                    const time_res = await fetch('http://localhost:1212/api/time-until-contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            distance: parseFloat(travelDistance),
                            speed: parseFloat(inputs.speed)
                        }),
                    });

                    if (!time_res.ok) {
                        setTime(null);
                        throw new Error('Failed to fetch time until contact');
                    }

                    const time_data = await time_res.json();
                    setTime(time_data.timeUntilContact);
                } catch (error) {
                    console.error('Error fetching time until contact:', error);
                }
            };

            fetchTimeUntilContact();
        }
    }, [travelDistance, inputs.speed]);

    return (
        <div
            style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden', }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 20px',  }} >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', }} >
                    <h1 style={{ margin: '0 20px 0 0' }}>Attack Predictor</h1>
                    <AttackInputs
                        onInputChange={handleInputChange}
                        handleButton={null}
                    />
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }} >
                    <SafeZoneInputs setShieldData={setShieldData} />
                </div>
            </div>
            {errorMessages.length > 0 && (
                <div style={{ position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', zIndex: 1100, }} >
                    <ul>
                        {errorMessages.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'absolute', top: '20%', flexDirection: 'row', gap: '20px', }} >
                <DistancePopup distance={travelDistance} />
                <TimeUntilContactPopup timeUntilContact={timeUntilContact} />
            </div>
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