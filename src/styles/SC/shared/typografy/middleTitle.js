import React from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core';

// Create a overRide styles.
export const MiddleTitle = styled(Typography)`
&& {
  text-align : left;
  font-weight: bold;
  display : block;
  width : 18em;
  padding : 0em 1.6em 0em 0.2em;
  margin : 0em 0px 0px 0px;
  color : #393e4f; //青褐あおかち
  font-size : 1.8em;
}
`;