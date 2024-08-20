import React, { useState } from 'react';
import { TextField, styled } from '@mui/material';

const AttackInputs = ({ onInputChange }) => {

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [speed, setSpeed] = useState('');
    const [radius, setRadius] = useState('');

    const [errors, setErrors] = useState({});

    const validateInput = (name, value) => {
        let error = '';

        if (name === 'latitude') {
            const lat = parseFloat(value);
            if (isNaN(lat) || lat < -90 || lat > 90) {
                error = 'Latitude must be a number between -90 and 90.';
            }
        }

        if (name === 'longitude') {
            const lon = parseFloat(value);
            if (isNaN(lon) || lon < -180 || lon > 180) {
                error = 'Longitude must be a number between -180 and 180.';
            }
        }

        if (name === 'speed' || name === 'radius') {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0) {
                error = `${name.charAt(0).toUpperCase() + name.slice(1)} must be a positive number.`;
            }
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));

        return error === '';
    };

    const CustomHelperText = styled('p')(({ theme }) => ({
        fontSize: '1rem', 
        color: theme.palette.error.main,
        fontWeight: 500,
        fontFamily: 'Arial, sans-serif',
    }));

    const handleInputChange = (event, setter) => {
        const { name, value } = event.target;
        setter(value);
        if (validateInput(name, value)) {
            onInputChange(name, value);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', padding: '20px' }}>
            <TextField
                id="latitude"
                label="Latitude"
                variant="outlined"
                value={latitude}
                name="latitude"
                onChange={(e) => handleInputChange(e, setLatitude)}
                error={!!errors.latitude}
                helperText={errors.latitude && <CustomHelperText>{errors.latitude}</CustomHelperText>}
                />
            <TextField
                id="longitude"
                label="Longitude"
                variant="outlined"
                value={longitude}
                name="longitude"
                onChange={(e) => handleInputChange(e, setLongitude)}
                error={!!errors.longitude}
                helperText={errors.longitude && <CustomHelperText>{errors.longitude}</CustomHelperText>}
                />
            <TextField
                id="speed"
                label="Speed"
                variant="outlined"
                value={speed}
                name="speed"
                onChange={(e) => handleInputChange(e, setSpeed)}
                error={!!errors.speed}
                helperText={errors.speed && <CustomHelperText>{errors.speed}</CustomHelperText>}
                />
            <TextField
                id="radius"
                label="Radius"
                variant="outlined"
                value={radius}
                name="radius"
                onChange={(e) => handleInputChange(e, setRadius)}
                error={!!errors.radius}
                helperText={errors.radius && <CustomHelperText>{errors.radius}</CustomHelperText>}
                />
        </div>
    );
};

export default AttackInputs;