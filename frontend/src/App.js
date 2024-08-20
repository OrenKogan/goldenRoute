import React, { useState, useEffect } from 'react';
import MapComp from './components/mapComp';
import AttackInputs from './components/AttackData';
import FlightInfoPopup from './components/FlightInfo';
import TimeUntilContactPopup from './components/TimePopUp';

const App = () => {
    const [inputs, setInputs] = useState({
        latitude: '',  
        longitude: '', 
        speed: '',          
        radius: '',          
    });

    const [flightData, setFlightData] = useState(null);
    const [timeUntilContact, setTime] = useState(null);

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

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0)' }}>
                <h1 >Attack Predictor</h1>
                <div style={{ display: 'flex', gap: '20px', flex: '1 1 auto', justifyContent: 'center' }}>
                    <AttackInputs onInputChange={handleInputChange} />
                </div>
            </div>
            <TimeUntilContactPopup timeUntilContact={timeUntilContact} />
            <MapComp inputs={inputs} flightData={flightData} onLocationSelect={handleLocationSelect}/>
            <FlightInfoPopup flightData={flightData} />
        </div>
    );
};

//ReactDOM.render(<App />, document.getElementById('root'));

export default App;