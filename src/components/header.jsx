import React,{useCallback, useState, useEffect} from "react"
import Link from 'next/link'
// import useSWR from 'swr'
// import { useUser } from '../foundations/auth/useUser'

import {getIsSignedIn,getUserName} from '../reducks/users/selectors'
import styles from '../styles/components.module.css'
import {useDispatch, useSelector} from "react-redux";

//material UI
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
///位置固定
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';


function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const Header = (props) => {
  const selector = useSelector((state) => state)
  const userName = getUserName(selector)
  const loginStatus = getIsSignedIn(selector)

  // export default function MenuAppBar() {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {/* <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={auth}
                onChange={handleChange}
                aria-label="login switch"
              />
            }
            label={auth ? 'Logout' : 'Login'}
          />
        </FormGroup> */}

        <React.Fragment>
          <CssBaseline />
            <ElevationScroll {...props}>
              <AppBar position="static">
                <Toolbar>
                  <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Photos
                  </Typography>
                  {auth && (
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
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                      </Menu>
                    </div>
                  )}
                </Toolbar>
              </AppBar>
            </ElevationScroll>
            <Toolbar />
              {/* <Container>
              <Box sx={{ my: 2 }}>
                {[...new Array(12)]
                  .map(
                    () => `Cras mattis consectetur purus sit amet fermentum.
                            Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                            Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
                  )
                  .join('\n')}
              </Box>
            </Container> */}
        </React.Fragment>
      </Box>
  {/* // );
  // return (
      // <> */}
      <header>
        <ul className={styles.topmenu}>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link
              href={{
              pathname: loginStatus ? "/auth/signout" : "/auth/signup",
              query: { hist : "Signup" },
            }}>
              <a>SignUp</a>
            </Link>
          </li>
          <li>
            {/* //ログインしているときにはsignout画面に遷移 */}
            <Link
              href={{
              pathname: loginStatus ? "/auth/signout" : "/auth/signin",
              query: { hist : "Signin" },
            }}>
              <a>SignIn</a>
            </Link>
          </li>
          <li>
            <Link href="/auth/signout">
              <a>SignOut</a>
            </Link>
          </li>
          <li>
            {/* //ログインしていないときはlogin.jsx画面？に遷移 */}
            <Link
              href={{
              pathname: loginStatus ? "/menu/search" : "/auth/signin",
              query: { hist : "Posting" },
            }}>
              <a>投稿</a>
            </Link>
          </li>
        </ul>
        {loginStatus === true 
          ? <a>ログイン状態：{userName}でログイン中</a>
          : <a>ログイン状態：ログアウト中</a>
        }
      </header>
    </>
  )
}

export default Header
// export default Index