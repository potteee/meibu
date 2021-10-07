import React from 'react'
import styled from 'styled-components'
// import { Typography } from '@mui/material';
import Typography from '@mui/material/Typography';

// Create a overRide styles.
export const CSHighLightBar = styled.a`
&& {
  padding : 1.5px 8.7px;
  text-align : right;
  font-weight: bold;
  font-family: sans-serif;
  /* align-items : center; */
  /* align : center; */
  color: white;
  background-color: black;
  display: block;
  position : relative;
  left : -1em;
  /* left : -1em; */
  width : 9em;
  /* text-align : left; */
  font-size: 1.4em;
}
`