import React,{useCallback, useState, useEffect} from "react"
import { useRouter } from 'next/router'

//Redux
import {useDispatch,useSelector} from 'react-redux'
import {getUserId,getUserName} from "../reducks/users/selectors";

//material UI
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';

///位置固定
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
// import Container from '@material-ui/core/container';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

const ApplicationBar = (props) => {
  const router = useRouter();
  const useStyles = makeStyles((theme) => ({
    authdiv: {
      // display: 'block', 
      position : "relative",
      // left : 8, 
      left : "auto",
      right : "6px",
    },
      title: {
        // display: 'block', 
        position : "relative",
        // left : "0.5em", 
    },
    appBarPositionHeader: {
      boxShadow : "none", //デフォルトで影がついてるので消す
    },
    masterBox : {
      flexGrow: 10,
      minHeight : "0.0rem",
    },
  }))
  const classes = useStyles();
  // export default function MenuAppBar() {
  // const [auth, setAuth] = useState(true);
  const selector = useSelector((state) => state)
  //上記よりこっちの方が処理漏れ少ない？
  const uid = getUserId(selector);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorLeftEl, setAnchorLeftEl] = useState(null);

  // const handleChange = (event) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleLeftChange = (event) => {
  //   setAuth(event.target.checked);
  // };

  const handleLeftMenu = (event) => {
    setAnchorLeftEl(event.currentTarget);
  };

  const handleLeftClose = () => {
    setAnchorLeftEl(null);
  };

  const handleMypage = () => {
    setAnchorEl(null);
    router.push('/menu/mypage')
  }

  const handleSignOut = () => {
    setAnchorEl(null);
    router.push('/auth/signout')
  }

  const handleSignIn = () => {
    setAnchorEl(null);
    router.push('/auth/signin')
  }

  const handleSignUp = () => {
    setAnchorEl(null);
    router.push('/auth/signup')
  }

  console.log("...props")
  console.log(props)

  return (
    <>
      {/* <Box sx={{ flexGrow: 1 }}> */}
      {/* <Box className={classes.masterBox}> */}
      <CssBaseline />
        {/* <ElevationScroll> */}
        {/* <ElevationScroll {...props}> */}
          {/* <AppBar position="static"> */}
      {/* <AppBar position="fixed" className={classes.appBarPositionHeader}> */}
      <AppBar classes={{positionFixed:classes.appBarPositionHeader}}>
        <Toolbar variant="dense">
          <Grid container item xs={12} justify="space-between" direction="row">
            <Grid container item xs={1}>
              <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleLeftMenu}>
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorLeftEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorLeftEl)}
                onClose={handleLeftClose}>
                <MenuItem >このサイトについて(準備中)</MenuItem>
                <MenuItem >Q & A(準備中)</MenuItem>
                <MenuItem >問合せ(準備中)</MenuItem>
                <MenuItem >設定(準備中)</MenuItem>
              </Menu>
            </Grid>
            <Grid container item xs={10} justify="center" alignItems="center">
              <Typography variant="h5">
              {/* <Typography variant="h5" className={classes.title}> */}
              {/* <Typography variant="h4" component="div" sx={{ center: 20 }}> */}
                {props.title}
              </Typography>
            </Grid>
            <Grid container item xs={1} className={classes.authdiv}>
            {(uid != "uid initial") 
              ? (
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleMypage}>マイページ</MenuItem>
                    <MenuItem onClick={handleSignOut}>ログアウト</MenuItem>
                  </Menu>
                </div>
                )
              : (
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="default"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                    <MenuItem onClick={handleSignIn}>ログイン</MenuItem>
                    <MenuItem onClick={handleSignUp}>新規登録</MenuItem>
                  </Menu>
                </div>
              )
            }
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
        {/* </ElevationScroll> */}
        {/* <Toolbar /> */}
        {/* </Box> */}
    </>
  )
}

export default ApplicationBar