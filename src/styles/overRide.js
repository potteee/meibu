import React from 'react'
import styled from 'styled-components'
import { makeStyles } from '@mui/styles';

// Create a overRide styles.
const useStyles = makeStyles((theme) => ({
  appStyle : { //footer(48px)がメインコンテンツにかぶらないように調整。ちょっと多めに
    margin : "3.4rem 0.3rem 2.8rem 0.3rem",
    // margin : "40px 5px 52px 5px",
  },

  appBarPosition : {
    //  position: 'fixed', //defaultでオーバーライドだから書かなくていい。
    top: "auto" ,
    bottom: "-1px", //最下部がちらつくので-1しておく
    boxShadow : "none", //デフォルトで影がついてるので消す。
  },
  footerToolBar : {
    height : "2.3rem", //親要素のrem倍
    minHeight : "2.3rem",
  },
}))

export default useStyles;