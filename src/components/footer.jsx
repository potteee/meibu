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
import { makeStyles ,createMuiTheme,ThemeProvider} from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';

///アイコン
// import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import AnnouncementOutlinedIcon from '@material-ui/icons/AnnouncementOutlined';
import SearchIcon from '@material-ui/icons/Search';

///位置固定
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
// import Container from '@material-ui/core/container';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

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