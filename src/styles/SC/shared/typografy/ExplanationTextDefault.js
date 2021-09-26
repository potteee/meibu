import React from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core';

// Create a overRide styles.
export const ExplanationTextDefault = styled(Typography)`
&& {
  font-size: 1.2em;
  /* width : 40em; */
  display : block;
  justify-content: center;
  align-items : center;
  text-align : left;
  overflow-wrap: break-word;
}
`;
