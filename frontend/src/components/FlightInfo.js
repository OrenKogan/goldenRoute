import React from 'react';
import { styled } from '@mui/material';

const PopupContainer = styled('div')({
    position: 'fixed',
    top: '50%',
    right: '10px',
    transform: 'translateY(-50%)', // Offset to truly center vertically
    width: '250px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    zIndex: 1000,
});

const PopupTitle = styled('h3')({
    margin: '0 0 10px 0',
    fontSize: '2rem',
});

const PopupText = styled('p')({
    margin: '5px 0',
    fontSize: '1.5rem',
});

const formatDate = (epochTime) => {
    const date = new Date(epochTime * 1000); // Convert to milliseconds
    return date.toLocaleString(); // Format to local date and time
};

const FlightInfoPopup = ({ flightData }) => {
    if (!flightData) return null;

    return (
        <PopupContainer>
            <PopupTitle>Flight Information</PopupTitle>
            <PopupText><strong>ICAO24:</strong> {flightData[0]}</PopupText>
            <PopupText><strong>Callsign:</strong> {flightData[1].trim()}</PopupText>
            <PopupText><strong>Origin Country:</strong> {flightData[2]}</PopupText>
            <PopupText><strong>Last Contact:</strong> {formatDate(flightData[4])}</PopupText>
            <PopupText><strong>On Ground:</strong> {flightData[8] ? 'Yes' : 'No'}</PopupText>
        </PopupContainer>
    );
};

export default FlightInfoPopup;