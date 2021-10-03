import React from 'react'
import styled from 'styled-components'
import AppBar from '@mui/material/AppBar';
import { Button, Toolbar } from '@mui/material';

// Create a overRide styles.
export const SCButtonActive = styled(Button)`
&& {
  text-transform: none;
  color : black;
}
`;

export const SCButtonDeactive = styled(Button)`
&& {
  text-transform: none;
  color : gray;
  text-decoration: line-through;
  /* disabled ; */
}
`;

