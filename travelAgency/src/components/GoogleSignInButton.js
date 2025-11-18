import React from 'react';
import Button from '@mui/material/Button';

// Minimal placeholder Google sign-in button.
// Calls onSuccess immediately when clicked so flows depending on OAuth can be tested.
const GoogleSignInButton = ({ onSuccess, onError }) => {
  const handleClick = async () => {
    try {
      // Placeholder: in a real app integrate Google Identity Services here.
      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
    }
  };

  return (
    <Button variant="outlined" color="primary" onClick={handleClick} fullWidth>
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;
