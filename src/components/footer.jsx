// import Link from 'next/link'
// import styles from '../styles/components.module.css'
// import {getIsSignedIn,getUserId} from '../reducks/users/selectors'
// import {useDispatch, useSelector} from "react-redux";

import React,{useCallback, useState, useEffect} from "react"
import { useRouter } from 'next/router'

//Redux
import {useDispatch,useSelector} from 'react-redux'
import {getUserId,getUserName} from "../reducks/users/selectors";

//makeStyles
import useStyles from "src/styles/overRide"

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
  // const useStyles = makeStyles((theme) => ({
  //   appBarPosition : {
  //     //  position: 'fixed', //defaultでオーバーライドだから書かなくていい。
  //     top: "auto",
  //     bottom: "-1px", //最下部がちらつくので-1しておく
  //     boxShadow : "none", //デフォルトで影がついてるので消す。
  //   },
  //   footerToolBar : {
  //     height : "2.3rem", //親要素のrem倍
  //     minHeight : "2.3rem",
  //   },
  // }))
  const router = useRouter();
  const classes = useStyles();
  // export default function MenuAppBar() {
  // const [auth, setAuth] = useState(true);
  const selector = useSelector((state) => state)
  //上記よりこっちの方が処理漏れ少ない？
  const uid = getUserId(selector);
  
  const handleGoMypage = () => {
    router.push('/menu/mypage')
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

  const appBarTheme = createMuiTheme({
  // const appBarTheme = createMuiTheme({
    overrides: {
      MuiAppBar: {
        positionFixed: {
          top: "auto",
          bottom: "-1px", //最下部がちらつくので-1しておく
          boxShadow : "none", //デフォルトで影がついてるので消す。
        }
      }
    }
  })

  return (
    <>
      {/* <a>aaa</a> */}
      {/* <Box> */}
      {/* <Box className={classes.masterBox}> //スクロールが一番下までいくようになる設定 ...なの？ */}
      {/* <Box sx={{ flexGrow: 1 }}> //スクロールが一番下までいくようになる設定 */}
        {/* <React.Fragment> */}
          {/* <CssBaseline /> */}
          {/* <ElevationScroll> */}
          {/* <div className={classes.appBarPosition}> */}
          {/* <ThemeProvider theme={appBarTheme}> */}
            {/* <AppBar>  */}
            <AppBar classes={{positionFixed: classes.appBarPosition}}> 
            {/* <AppBar className={classes.appBarPosition}>  */}
            {/* <AppBar position="fixed" className={classes.appBarPosition}>  */}
            {/* 下記のsxはなぜか効かない */}
            {/* <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}> */}
              <Toolbar variant="dense" className={classes.footerToolBar}>
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
              </Toolbar>
            </AppBar>
          {/* </ThemeProvider> */}
          {/* </div> */}
          {/* </ElevationScroll> */}
        {/* </React.Fragment> */}
      {/* </Box> */}
    </>
  )
}

export default Footer



// const Footer = () => {
//   const selector = useSelector((state) => state)
  
//   console.log("Footer Start")
  
//   const loginStatus = getIsSignedIn(selector)
//   const userId = getUserId(selector)

//   console.log("Footer End")
//   return(
//   <footer>
//     <ul className={styles.undermenu}>
//       <li>
//         <Link
//           href={{
//           pathname: loginStatus ? "/menu/mypage" : "/auth/signin" ,
//           query: loginStatus ? { id : userId} : {hist : "Mypage"} ,
//         }}>
//             <a>mypage</a>
//         </Link> 
//       </li>
//       <li>
//         <Link href="/menu/notification">
//           <a>notification</a>
//         </Link>
//       </li>
//       <li>
//         <Link href="/">
//           <a>news</a>
//         </Link>
//       </li>
//       <li>
//         <Link href={{
//           pathname: "/menu/search",
//           query: {hist : "Search"},
//         }}>
//           <a>search</a>
//         </Link>
//       </li>
//     </ul>
//   </footer>
//   )
// }
// export default Footer