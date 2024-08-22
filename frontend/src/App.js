import React, { useState, useEffect } from 'react';
import MapComp from './components/mapComp';
import AttackInputs from './components/AttackData';
import FlightInfoPopup from './components/FlightInfo';
import TimeUntilContactPopup from './components/TimePopUp';
import SaveButton from './components/SaveData';
import DataModal from './components/dataModal/dataModal';
import './App.css'
import { Button } from '@mui/material';

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
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isFetchOpen, setIsFetchOpen] = useState(false);
    const [attacksData, setAttacksData] = useState([]);

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

    const validateInputs = () => {
        const { latitude, longitude, speed, radius } = inputs;
        return (
            latitude >= -90 && latitude <= 90 &&
            longitude >= -180 && longitude <= 180 &&
            speed > 0 &&
            radius > 0
        );
    };

    const handleSaveButtonLogic = (isValid) => {
        setIsButtonDisabled(!isValid);
    }

    useEffect(() => {
        const { latitude, longitude, speed, radius } = inputs;
        setIsButtonDisabled(!validateInputs());
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
                    setFlightData(data);
                    const timeResponse = await fetch('http://localhost:1212/api/time-until-contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            distance: data[17],
                            speed: Number(speed)
                        }),
                    });

                    if (!timeResponse.ok) {
                        throw new Error('Failed to fetch contact data');
                    }

                    const timeData = await timeResponse.json();
                    setTime(timeData.timeUntilContact);

                } catch (error) {
                    console.error('Error fetching flight data:', error);
                }
            };

            fetchFlightData();
        }
    }, [inputs]);

    const handleSave = async () => {
        if(!isButtonDisabled){
            const attacker = {
                latitude: parseFloat(inputs.latitude),
                longitude: parseFloat(inputs.longitude),
                speed: parseFloat(inputs.speed),
                radius: parseFloat(inputs.radius),
            };
    
            const friendlyPlane = flightData
                ? {
                    ICAO24: flightData[0],
                    Callsign: flightData[1].trim(),
                    OriginCountry: flightData[2],
                    LastContact: flightData[4],
                    OnGround: flightData[8],
                    ClosestAirport: flightData[18],
                    Latitude: flightData[6],
                    Longitude: flightData[5]
                }
                : {};
    
            try {
                const response = await fetch('http://localhost:1212/api/saveAttack', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ attacker, friendlyPlane }),
                });
    
                const result = await response.json();
                console.log(result);
                if (!response.ok || !result.success) {
                    setErrorMessages(["No Friendly Flight Nearby"]);//result.error || ['Failed to save attack data']);
                    return;
                }
    
                setErrorMessages([]); // Clear errors if successful
            } catch (error) {
                console.error('Error saving attack data:', error);
                setErrorMessages(['An unexpected error occurred']);
            }
        }
    };

    const HandleFetchBtnClick = () =>{
        if (!isFetchOpen)
            fetchAttackData();
        setIsFetchOpen(!isFetchOpen);
    }

    const fetchAttackData = async () => {
        try {
            const response = await fetch('http://localhost:1212/api/FetchAttacks');
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setAttacksData(data);
        } catch (error) {
            console.error('Error fetching table data:', error);
        }
    };

    const fetchFriendlyOfAttackData = async (friendlyId) => {
        try {
            const response = await fetch('http://localhost:1212/api/FetchFriendlyOfAttack', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendlyId }),
            });
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            console.log(data);
            //setFlightData(data);
        } catch (error) {
            console.error('Error fetching table data:', error);
        }
    };

    const handleAttackDataHover = async (friendlyId) => {
        console.log(friendlyId);
        fetchFriendlyOfAttackData(friendlyId);
    };


    return (
        <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <h1 style={{ margin: '0 20px' }}>Attack Predictor</h1>
                <div style={{ display: 'flex', gap: '20px', flex: '1 1 auto', justifyContent: 'center', alignItems: 'center' }}>
                    <AttackInputs onInputChange={handleInputChange} handleButton={handleSaveButtonLogic}/>
                    <SaveButton onSave={handleSave} style={{ height: '100%' }} disabled={isButtonDisabled} />
                </div>
                <Button onClick={HandleFetchBtnClick}>Load Attack</Button>
            </div>
            {errorMessages.length > 0 && (
                <div style={{ position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', zIndex: 1100 }}>
                    <ul>
                        {errorMessages.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <TimeUntilContactPopup timeUntilContact={timeUntilContact} />
            <MapComp inputs={inputs} flightData={flightData} onLocationSelect={handleLocationSelect} />
            <FlightInfoPopup flightData={flightData} />
            <DataModal isOpen={isFetchOpen} attacksData={attacksData} closeHandle={HandleFetchBtnClick} setFlightData={handleAttackDataHover}/>
        </div>
    );
};

//ReactDOM.render(<App />, document.getElementById('root'));

export default App;