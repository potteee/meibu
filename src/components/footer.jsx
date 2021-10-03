// import Link from 'next/link'
// import styles from '../styles/components.module.css'
// import {getIsSignedIn,getUserId} from '../reducks/users/selectors'
// import {useDispatch, useSelector} from "react-redux";

import React,{useCallback, useState, useEffect} from "react"
import { useRouter } from 'next/router'

//Redux
import {useDispatch,useSelector} from 'react-redux'
import {getIsSignedIn, getUserId,getUserName} from "../reducks/users/selectors";

//makeStyles
import useStyles from "src/styles/overRide"
import {SCAppBar,SCToolBar} from "src/styles/SC/components/footer/position"

import styled from "styled-components"

//material UI
import { makeStyles ,createMuiTheme,ThemeProvider} from '@mui/styles';

import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';

///アイコン
// import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import SearchIcon from '@mui/icons-material/Search';

///位置固定
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
// import Container from '@mui/material/container';
import useScrollTrigger from '@mui/material/useScrollTrigger';

const Footer = () => {
  const router = useRouter();
  const classes = useStyles();
  // export default function MenuAppBar() {
  // const [auth, setAuth] = useState(true);
  const selector = useSelector((state) => state)
  //上記よりこっちの方が処理漏れ少ない？
  const isSignedIn = getIsSignedIn(selector);
  
  const handleGoMypage = () => {
    if(isSignedIn) {
      router.push('/menu/mypage')
    } else {
      router.push('/menu/PleaseSignUpIn')
    }
  }
  const handleGoNotification = () => {
    router.push('/menu/notification')
  }
  const handleGoNews = () => {
    router.push('/')
  }
  const handleGoSearch = () => {
    // router.push('/menu/search')
    router.push({
      pathname: '/menu/search',
      // pathname: '/post/index',
      query: {
        hist : "Search",
      }
    })
  }

  // const appBarTheme = createMuiTheme({
  // // const appBarTheme = createMuiTheme({
  //   overrides: {
  //     MuiAppBar: {
  //       positionFixed: {
  //         top: "auto",
  //         bottom: "-1px", //最下部がちらつくので-1しておく
  //         boxShadow : "none", //デフォルトで影がついてるので消す。
  //       }
  //     }
  //   }
  // })

  return (
    <>
      <SCAppBar> 
        <SCToolBar variant="dense">
          <Grid container item xs={12} justify="space-between" direction="row">
            <Grid container item xs={2} justify="center" alignItems="center">
              {/* <a>マイページ</a> */}
              <IconButton
                onClick={handleGoMypage}
                color="inherit"
              >
                <HomeIcon />
              </IconButton>
            </Grid>
            <Grid container item xs={2} justify="center" alignItems="center">
              {/* <a>通知</a> */}
              <IconButton
                onClick={handleGoNotification}
                color="inherit"
              >
                <NotificationsNoneIcon />
              </IconButton>
            </Grid>
            <Grid container item xs={2} justify="center" alignItems="center">
              {/* <a>NEWS</a> */}
              <IconButton
                onClick={handleGoNews}
                color="inherit"
              >
                <AnnouncementOutlinedIcon />
              </IconButton>
            </Grid>
            <Grid container item xs={2} justify="center" alignItems="center">
              {/* <a>検索</a> */}
              <IconButton
                onClick={handleGoSearch}
                color="inherit"
              >
                <SearchIcon />
              </IconButton>
            </Grid>
          </Grid>
        </SCToolBar>
      </SCAppBar>
    </>
  )
}

export default Footer