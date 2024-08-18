const express = require('express');
//const fetch = require('node-fetch');
const axios = require('axios');

const app = express();
const openaipAPI = "ef8bfd4669b7d18735a6f0b44fd42d55"

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

app.get('/', (req, res) => {
    res.send('How did we get here?'); //funny minecraft refrence
});


function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

function calcNearest(l_lat, l_lon, _radius, flights) {
    let nearestFlight = null;
    let minDistance = Infinity;

    // Loop through all flights
    for (let flight of flights) {
        const flightLat = flight[6];
        const flightLon = flight[5];

        // Calculate distance between the given coordinates and the flight's coordinates
        const distance = haversineDistance(l_lat, l_lon, flightLat, flightLon);
        // Check if the flight is within the specified radius
        if (distance <= _radius && distance < minDistance) {
            nearestFlight = flight;
            minDistance = distance;
        }
    }

    return nearestFlight;
}

async function getNearestAirport(lat, lon) {
    const url = `https://api.core.openaip.net/api/airports?limit=1&pos=${lat},${lon}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Aequseted-With": "XMLHttpRequest",
                "x-openaip-client-id": openaipAPI
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data["items"][0]["name"];
    } catch (error) {
        console.error('Error fetching Airplane data:', error);
    }
}

app.post('/api/calculate', async (req, res) => {
    const { coordinates1, planeSpeed, flightRadius } = req.body;
    console.log({ coordinates1, planeSpeed, flightRadius });

    if (!coordinates1.lat || !coordinates1.lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const kmToDegreesLatitude = (flightRadius / 111).toFixed(6);
    const kmToDegreesLongitude = (flightRadius / (111 * Math.cos(coordinates1.lat * (Math.PI / 180)))).toFixed(6);

    // Convert formatted string back to number for calculation
    const formatCoordinate = (coordinate) => Number(coordinate).toFixed(6);

    //console.log(formatCoordinate(coordinates1.lat - kmToDegreesLatitude), formatCoordinate(coordinates1.lng - kmToDegreesLongitude), Number(coordinates1.lat) + Number(kmToDegreesLatitude), Number(coordinates1.lng) + Number(kmToDegreesLongitude));
    const url = `https://opensky-network.org/api/states/all?lamin=${formatCoordinate(coordinates1.lat - kmToDegreesLatitude)}&lomin=${formatCoordinate(coordinates1.lng - kmToDegreesLongitude)}&lamax=${Number(coordinates1.lat) + Number(kmToDegreesLatitude)}&lomax=${Number(coordinates1.lng) + Number(kmToDegreesLongitude)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        f = calcNearest(coordinates1.lat, coordinates1.lng, flightRadius, data.states);
        nearestAirport = await getNearestAirport(f[6], f[5]);
        f.push(nearestAirport);
        res.json(f);
    } catch (error) {
        console.error('Error fetching flight data:', error);
        res.status(500).json({ error: 'Failed to fetch flight data.' });
    }

    //res.json({ message: 'msg from server' });
});
const port = process.env.PORT || 1212

app.listen(1212, () => {
    console.log(`Server is running on port ${port}`);
});