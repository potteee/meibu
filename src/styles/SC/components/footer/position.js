import React from 'react'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar';

// Create a overRide styles.
export const SCAppBar = styled(AppBar)`
&& {
  top: auto;
  bottom: -1px;
  box-shadow : none;
}
`;

