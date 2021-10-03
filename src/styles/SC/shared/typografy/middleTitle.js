import React from 'react'
import styled from 'styled-components'
import { Typography } from '@mui/material';

// Create a overRide styles.
export const MiddleTitle = styled(Typography)`
&& {
  text-align : left;
  font-weight: bold;
  display : block;
  width : 18em;
  padding : 0em 0.3em 0em 0.2em;
  margin : 0em 0px 0px 0px;
  color : #393e4f; //青褐あおかち
  font-size : 1.6em;
  /* top : 5px; */
}
`;