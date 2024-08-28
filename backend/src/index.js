const express = require('express');
const geolib = require('geolib');
const { saveAttackData, FetchAttackData, FetchFriendlyData } = require('./DatabaseComminicator.js');
const CalculateTime = require('./Calculator.js');
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



async function calcNearest(l_lat, l_lon, _radius, flights) {
    let nearestFlight = null;
    let minDistance = Infinity;

    // Loop through all flights
    for (let flight of flights) {
        const flightLat = flight[6];
        const flightLon = flight[5];

        // Calculate distance between the given coordinates and the flight's coordinates
        const distance = geolib.getDistance({ latitude: l_lat, longitude: l_lon }, { latitude: flightLat, longitude: flightLon });
        // Check if the flight is within the specified radius
        if (distance <= (_radius * 1000) && distance < minDistance) {
            nearestFlight = flight;
            minDistance = distance;
        }
    }
    if (nearestFlight)
        nearestFlight.push(minDistance / 1000);
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
    //console.log({ coordinates1, planeSpeed, flightRadius });

    if (!coordinates1.lat || !coordinates1.lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const kmToDegreesLatitude = (flightRadius / 111).toFixed(6);
    const kmToDegreesLongitude = (flightRadius / (111 * Math.cos(coordinates1.lat * (Math.PI / 180)))).toFixed(6);

    // Convert formatted string back to number for calculation
    const formatCoordinate = (coordinate) => Number(coordinate).toFixed(6);

    const url = `https://opensky-network.org/api/states/all?lamin=${formatCoordinate(coordinates1.lat - kmToDegreesLatitude)}&lomin=${formatCoordinate(coordinates1.lng - kmToDegreesLongitude)}&lamax=${Number(coordinates1.lat) + Number(kmToDegreesLatitude)}&lomax=${Number(coordinates1.lng) + Number(kmToDegreesLongitude)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (!data.states)
            throw 'No Flights Nearby.';
        f = await calcNearest(coordinates1.lat, coordinates1.lng, flightRadius, data.states);
        if (!f)
            throw 'No Flights Nearby.';
        nearestAirport = await getNearestAirport(f[6], f[5]);
        f.push(nearestAirport);
        res.json(f);
    } catch (error) {
        console.error('Error fetching flight data:', error);
        res.status(500).json({ error: 'Failed to fetch flight data.' });
    }

    //res.json({ message: 'msg from server' });
});

//deprecated
app.post('/api/time-until-contact', (req, res) => {
    const { distance, speed } = req.body;
    console.log({ distance, speed });

    // Validate inputs
    if (typeof distance !== 'number' || typeof speed !== 'number' || speed <= 0) {
        return res.status(400).json({ error: 'Invalid distance or speed. Ensure they are numbers and speed is greater than zero.' });
    }

    // Calculate time until contact
    const timeUntilContact = distance / speed; // Time in hours

    // Send the result
    res.json({ timeUntilContact });
});

app.post('/api/smartTimeCalc', (req, res) => {
    const { flightLat, flightLon, flightSpeed, missileLat, missileLon, missileSpeed, trueDiraction } = req.body;

    time_res = CalculateTime(flightLat, flightLon, missileLat, missileLon, flightSpeed, Number(missileSpeed), trueDiraction);

    if (time_res.status == "failed"){
        res.status(500).json({erros: time_res.errors});
    }

    console.log(time_res);
    res.json(time_res);
});

app.post('/api/saveAttack', async (req, res) => {
    const { attacker, friendlyPlane } = req.body;

    try {
        const result = await saveAttackData(attacker, friendlyPlane);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: result.errors });
        }
    } catch (error) {
        console.error('Error saving Attack:', error);
        res.status(500).json({ error: 'Failed to to save attack.' });
    }
});

app.get('/api/FetchAttacks', async (req, res) => {
    try {
        const result = await FetchAttackData();
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.errors });
        }
    } catch (error) {
        console.error('Error saving Attack:', error);
        res.status(500).json({ error: 'Failed to to save attack.' });
    }
});

app.post('/api/FetchFriendlyOfAttack', async (req, res) => {
    const { friendlyId } = req.body;
    try {
        const result = await FetchFriendlyData(friendlyId);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.errors });
        }
    } catch (error) {
        console.error('Error fetching friendly info:', error);
        res.status(500).json({ error: 'Failed to to fetch friendly info.' });
    }
});

const port = process.env.PORT || 1212

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});