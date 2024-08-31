import React, { useState } from 'react';
import { TextField, styled } from '@mui/material';

const SafeZoneInputs = ({ setShieldData }) => {

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [radius, setRadius] = useState('');

    const [errors, setErrors] = useState({});

    const validateInput = (name, value) => {
        let error = '';

        if (name === 's_latitude') {
            const lat = parseFloat(value);
            if (isNaN(lat) || lat < -90 || lat > 90) {
                error = 'Latitude must be a number between -90 and 90.';
            }
        }

        if (name === 's_longitude') {
            const lon = parseFloat(value);
            if (isNaN(lon) || lon < -180 || lon > 180) {
                error = 'Longitude must be a number between -180 and 180.';
            }
        }

        if (name === 's_radius') {
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

    const _style = {
        backgroundColor: 'rgba(34, 139, 34, 0.2)', //rgba(128, 128, 128, 0.5)', // Grayish with some opacity
    };

    const handleInputChange = (event, setter) => {
        const { name, value } = event.target;
        setter(value);
        const valid = validateInput(name, value);
        if (valid) {
            setShieldData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    return (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', padding: '20px' }}>
            <TextField
                style={_style}
                id="latitude"
                label="Latitude"
                variant="outlined"
                value={latitude}
                name="s_latitude"
                onChange={(e) => handleInputChange(e, setLatitude)}
                error={!!errors.s_latitude}
                helperText={errors.s_latitude && <CustomHelperText>{errors.s_latitude}</CustomHelperText>}
                
            />
            <TextField
                style={_style}
                id="longitude"
                label="Longitude"
                variant="outlined"
                value={longitude}
                name="s_longitude"
                onChange={(e) => handleInputChange(e, setLongitude)}
                error={!!errors.s_longitude}
                helperText={errors.s_longitude && <CustomHelperText>{errors.s_longitude}</CustomHelperText>}
            />
            <TextField
                style={_style}
                id="radius"
                label="Radius (km)"
                variant="outlined"
                value={radius}
                name="s_radius"
                onChange={(e) => handleInputChange(e, setRadius)}
                error={!!errors.s_radius}
                helperText={errors.s_radius && <CustomHelperText>{errors.s_radius}</CustomHelperText>}
            />
        </div>
    );
};

export default SafeZoneInputs;