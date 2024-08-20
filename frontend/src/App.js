import React, { useState, useEffect } from 'react';
import MapComp from './components/mapComp';
import AttackInputs from './components/AttackData';
import FlightInfoPopup from './components/FlightInfo';

const App = () => {
    const [inputs, setInputs] = useState({
        latitude: 32.0853,  // Default latitude (e.g., Tel Aviv)
        longitude: 34.7818, // Default longitude
        speed: 50,          // Default speed (optional)
        radius: 10,          // Default radius (3 kilometers)
    });

    const [flightData, setFlightData] = useState(null);

    const handleInputChange = (name, value) => {
        setInputs((prev) => ({
            ...prev,
            [name]: value,
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
                        throw new Error('Failed to fetch flight data');
                    }

                    const data = await response.json();
                    setFlightData(data);
                } catch (error) {
                    console.error('Error fetching flight data:', error);
                }
            };

            fetchFlightData();
        }
    }, [inputs]);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                <h1 style={{ margin: 0, flex: '0 1 auto' }}>Attack Predictor</h1>
                <div style={{ display: 'flex', gap: '20px', flex: '1 1 auto', justifyContent: 'center' }}>
                    <AttackInputs onInputChange={handleInputChange} />
                </div>
            </div>
            <MapComp inputs={inputs} flightData={flightData} />
            <FlightInfoPopup flightData={flightData} />
        </div>
    );
};

//ReactDOM.render(<App />, document.getElementById('root'));

export default App;