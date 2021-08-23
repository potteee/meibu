import React from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core';

// Create a overRide styles.
export const H2CenterLine = styled(Typography)`
&& {
  /* margin : 0px 0px 0px 0px;
  color: '#393e4f //青褐あおかち',
  font-size : 0.8em; */
  display: flex;
  align-items: center; /* 垂直中心 */
  justify-content: center; /* 水平中心 */;
  font-size: 1.4em;
  &:before,&:after {
    content: "";
    position: relative;
    width: 3.5em /* 線の長さ */;
    border-width: 0.2px 0 0 0 ;
    /* border-top-width: 1; */
    border-color: brack;
    border-style: solid;
    margin-right: 0.3em; /* 文字の右隣 */;
    margin-left: 0.3em; /* 文字の右隣 */;
  }
}
`