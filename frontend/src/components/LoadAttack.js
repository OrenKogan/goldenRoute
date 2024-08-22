import React from 'react';
import { Button, styled } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

const StyledButton = styled(Button)({
    backgroundColor: 'rgba(128, 128, 128, 0.5)', // Grayish with some opacity
    height: '57px',
    color: 'white',
    borderRadius: '8px',
    padding: '0px 20px',
    boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
    '&:hover': {
        backgroundColor: '#1565c0',
    },
    position: 'absolute',
    right: '4%', // Align to the right with some margin
    top: '50%', // Center vertically relative to the container
    transform: 'translateY(-50%)' // Center vertically
});

const LoadButton = ({ handleLoad }) => {
    return (
        <StyledButton
            onClick={handleLoad}
            endIcon={<UploadIcon />}
        >
            Load Attack
        </StyledButton>
    );
};

export default LoadButton;
