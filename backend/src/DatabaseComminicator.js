const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function validateInputs(attacker, friendlyPlane) {
    const errors = [];

    // Validate attacker fields
    if (typeof attacker.latitude !== 'number' || isNaN(attacker.latitude) || attacker.latitude < -90 || attacker.latitude > 90) {
        errors.push('Invalid attacker latitude');
    }
    if (typeof attacker.longitude !== 'number' || isNaN(attacker.longitude) || attacker.longitude < -180 || attacker.longitude > 180) {
        errors.push('Invalid attacker longitude');
    }
    if (typeof attacker.speed !== 'number' || isNaN(attacker.speed) || attacker.speed <= 0) {
        errors.push('Invalid attacker speed');
    }
    if (typeof attacker.radius !== 'number' || isNaN(attacker.radius) || attacker.radius <= 0) {
        errors.push('Invalid attacker radius');
    }

    // Validate friendlyPlane fields
    if (typeof friendlyPlane.Latitude !== 'number' || isNaN(friendlyPlane.Latitude) || friendlyPlane.Latitude < -90 || friendlyPlane.Latitude > 90) {
        errors.push('Invalid friendly plane latitude');
    }
    if (typeof friendlyPlane.Longitude !== 'number' || isNaN(friendlyPlane.Longitude) || friendlyPlane.Longitude < -180 || friendlyPlane.Longitude > 180) {
        errors.push('Invalid friendly plane longitude');
    }
    if (typeof friendlyPlane.Callsign !== 'string' || friendlyPlane.Callsign.trim() === '') {
        errors.push('Invalid friendly plane callsign');
    }
    if (typeof friendlyPlane.OriginCountry !== 'string' || friendlyPlane.OriginCountry.trim() === '') {
        errors.push('Invalid friendly plane origin country');
    }
    if (typeof friendlyPlane.ClosestAirport !== 'string' || friendlyPlane.ClosestAirport.trim() === '') {
        errors.push('Invalid friendly plane closest airport');
    }
    if (typeof friendlyPlane.ICAO24 !== 'string' || friendlyPlane.ICAO24.trim() === '') {
        errors.push('Invalid friendly plane ICAO24');
    }
    if (typeof friendlyPlane.OnGround !== 'boolean') {
        errors.push('Invalid friendly plane on ground status');
    }
    if (typeof friendlyPlane.LastContact !== 'number' || isNaN(friendlyPlane.LastContact)) {
        errors.push('Invalid friendly plane last contact');
    }

    return errors;
}

async function saveAttackData(attacker, friendlyPlane) {
    // Validate inputs
    const errors = validateInputs(attacker, friendlyPlane);
    if (errors.length > 0) {
        return { success: false, errors };
    }

    try {
        // Create a new Friendly record
        const friendly = await prisma.friendly.create({
            data: {
                Latitude: friendlyPlane.Latitude,
                Longitude: friendlyPlane.Longitude,
                Callsign: friendlyPlane.Callsign,
                OriginCountry: friendlyPlane.OriginCountry,
                Closest_Airport: friendlyPlane.ClosestAirport,
                ICAO24: friendlyPlane.ICAO24,
                OnGround: friendlyPlane.OnGround,
                LastContact: String(friendlyPlane.LastContact),
            },
        });

        // Create the Attack record
        const attack = await prisma.attacks.create({
            data: {
                latitude: attacker.latitude,
                longitude: attacker.longitude,
                speed: Number(attacker.speed),
                radius: Number(attacker.radius),
                friendly: {
                    connect: { id: friendly.id },
                },
            },
        });

        return { success: true, attack, friendly };
    } catch (error) {
        console.error('Error saving attack data:', error);
        return { success: false, error: error.message };
    }
}

module.exports = saveAttackData;
