import React from 'react'
import styled from 'styled-components'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// import { Toolbar } from '@mui/material';

// Create a overRide styles.
export const SCAppBar = styled(AppBar)`
&& {
  top: auto;
  /* position : absolute; */
  /* position : relative; */
  /* bottom: -1px; */
  /* padding : 10; */
  margin-top : 10px;
  bottom: 0px;
  box-shadow : none;
}
`;

export const SCToolBar = styled(Toolbar)`
&& {
  height : 3.3rem; //親要素のrem倍
  min-height : 2.3rem;
}
`;

