import React,{useState } from "react"
import { useRouter } from 'next/router'

//Redux
import {useSelector} from 'react-redux'
import {getUserId} from "../reducks/users/selectors";

//material UI

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';

const ApplicationBar = (props) => {
  const router = useRouter();
  const classes = {
    authdiv: {
      position : "relative",
      left : "auto",
      right : "6px",
    },
      title: {
        position : "relative",
    },
    appBarPositionHeader: {
      boxShadow : "none", //デフォルトで影がついてるので消す
    },
    masterBox : {
      flexGrow: 10,
      minHeight : "0.0rem",
    },
  }
  const selector = useSelector((state) => state)
  const uid = getUserId(selector);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorLeftEl, setAnchorLeftEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <AppBar sx={classes.appBarPositionHeader}>
        <Toolbar variant="dense">
          <Grid container xs={12} justify="space-between" direction="row">
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
            <Grid container item xs={10} justifyContent="center" alignItems="center">
              <Typography variant="h5">
                {props.title}
              </Typography>
            </Grid>
            <Grid container item xs={1} sx={classes.authdiv}>
            {(uid != "uid initial") 
              ? (
                <>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircleIcon />
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
                </>
                )
              : (
                <>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="default"
                  >
                    <AccountCircleIcon />
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
                    <MenuItem onClick={handleSignIn}>ログイン</MenuItem>
                    <MenuItem onClick={handleSignUp}>新規登録</MenuItem>
                  </Menu>
                </>
              )
            }
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default ApplicationBar