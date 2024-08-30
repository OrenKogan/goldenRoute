import React from 'react';
import { styled } from '@mui/material';

// Define the styled PopupContainer
const PopupContainer = styled('div')({
    // position: 'fixed',
    // top: '20%',
    // left: '50%',
    // transform: 'translateX(-50%)', // Offset to truly center horizontally
    width: '300px',
    padding: '20px',
    backgroundColor: '#ffcccc', // Light red background to indicate warning
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    zIndex: 1000,
    textAlign: 'center',
});

// Define the styled PopupTitle
const PopupTitle = styled('h3')({
    margin: '0 0 10px 0',
    fontSize: '2rem',
    color: '#b30000', // Dark red text to indicate urgency
});

// Define the styled PopupText
const PopupText = styled('p')({
    margin: '5px 0',
    fontSize: '1.5rem',
});

const DistancePopup = ({ distance }) => {
    console.log('P', distance);
    if (!distance) return null;
    return (
        <PopupContainer>
            <PopupTitle>Distance To Flight</PopupTitle>
            <PopupText>{Math.round(distance)} m</PopupText>
        </PopupContainer>
    );
};

export default DistancePopup;