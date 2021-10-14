import React from 'react'
import styled from '@mui/styled-engine-sc'
// import styled from 'styled-components'
import { Typography } from '@mui/material';

// Create a overRide styles.
export const ExplanationTextDefault = styled(Typography)`
&& {
  font-size: 1.0rem;
  color : black;
  /* width : 40em; */
  width : 100%;
  display : block;
  justify-content: flex-start;
  /* justify-content: center; */
  align-items : center;
  text-align : left;
  overflow-wrap: break-word;
}
`;
