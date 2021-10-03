import React from 'react'
import styled from 'styled-components'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// import { Toolbar } from '@mui/material';

// Create a overRide styles.
export const SCAppBar = styled(AppBar)`
&& {
  top: auto;
  /* bottom: -1px; */
  bottom: 0px;
  box-shadow : none;
}
`;

export const SCToolBar = styled(Toolbar)`
&& {
  height : 2.3rem; //親要素のrem倍
  min-height : 2.3rem;
}
`;

