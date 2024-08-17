import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const FlightCollisionCalculator = () => {
  const [coordinates1, setCoordinates1] = useState({ lat: '', lng: '' });
  const [planeSpeed, setPlaneSpeed] = useState('');
  const [flightRadius, setFlightRadius] = useState('');

  const handleInputChange = (event, setFunction) => {
    const { name, value } = event.target;
    setFunction(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Prepare the data to be sent
    const data = {
      coordinates1,
      planeSpeed,
      flightRadius,
    };

    try {
      // Send the data to the server
      const response = await fetch('http://localhost:1212/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result); // Handle the response from the server
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Coordinate 1 (Latitude):</label>
        <input
          type="number"
          name="lat"
          value={coordinates1.lat}
          onChange={(e) => handleInputChange(e, setCoordinates1)}
          placeholder="Latitude"
          required
        />
        <label>Coordinate 1 (Longitude):</label>
        <input
          type="number"
          name="lng"
          value={coordinates1.lng}
          onChange={(e) => handleInputChange(e, setCoordinates1)}
          placeholder="Longitude"
          required
        />
      </div>
      <div>
        <label>Plane Speed (km/h):</label>
        <input
          type="number"
          value={planeSpeed}
          onChange={(e) => setPlaneSpeed(e.target.value)}
          placeholder="Speed"
          required
        />
      </div>
      <div>
        <label>Max Flight Radius (km):</label>
        <input
          type="number"
          value={flightRadius}
          onChange={(e) => setFlightRadius(e.target.value)}
          placeholder="Radius"
          required
        />
      </div>
      <button type="submit">Calculate Collision</button>
    </form>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<FlightCollisionCalculator />);