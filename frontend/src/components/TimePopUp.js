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

const formatTime = (timeInSeconds) => {
    if (timeInSeconds === -1)
        return "too slow";

    const hours = Math.round(timeInSeconds / 3600);
    const minutes = Math.round((timeInSeconds % 3600) / 60);
    const seconds = Math.round(timeInSeconds % 60);

    if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? ` and ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}${seconds > 0 ? ` and ${seconds} second${seconds !== 1 ? 's' : ''}` : ''}`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
};

const TimeUntilContactPopup = ({ timeUntilContact }) => {
    if (!timeUntilContact) return null;

    return (
        <PopupContainer>
            <PopupTitle>Time Until Contact</PopupTitle>
            <PopupText>{formatTime(timeUntilContact)}</PopupText>
        </PopupContainer>
    );
};

export default TimeUntilContactPopup;