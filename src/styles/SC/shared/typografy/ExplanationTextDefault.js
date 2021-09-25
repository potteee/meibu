import React from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core';

// Create a overRide styles.
export const ExplanationTextDefault = styled(Typography)`
&& {
  font-size: 1.3em;
  overflow-wrap: break-word;
}
`;
