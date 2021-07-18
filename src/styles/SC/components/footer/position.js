import React from 'react'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar';
import { Toolbar } from '@material-ui/core';

// Create a overRide styles.
export const SCAppBar = styled(AppBar)`
&& {
  top: auto;
  bottom: -1px;
  box-shadow : none;
}
`;

export const SCToolBar = styled(Toolbar)`
&& {
  height : 2.3rem; //親要素のrem倍
  min-height : 2.3rem;
}
`;

