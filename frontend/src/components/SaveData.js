import React from 'react';
import { Button, styled } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const StyledButton = styled(Button)({
    backgroundColor: 'rgba(128, 128, 128, 0.5)', // Grayish with some opacity
    //backgroundColor: '#1976d2',
    height: '60px',
    color: 'white',
    borderRadius: '8px',
    padding: '0px 20px',
    boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
    '&:hover': {
        backgroundColor: '#1565c0',
    },
});

const SaveButton = ({ onSave, disabled }) => {
    return (
        <StyledButton
            disabled={disabled}
            onClick={onSave}
            endIcon={<SaveIcon />}
        >
            Save Data
        </StyledButton>
    );
};

export default SaveButton;
