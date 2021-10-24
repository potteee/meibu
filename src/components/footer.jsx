import React from "react"
import { useRouter } from 'next/router'

//Redux
import {useSelector} from 'react-redux'
import {getIsSignedIn } from "../reducks/users/selectors";

//makeStyles
import {SCAppBar,SCToolBar} from "src/styles/SC/components/footer/position"

//material UI
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';

///アイコン
import HomeIcon from '@mui/icons-material/Home';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import SearchIcon from '@mui/icons-material/Search';

///位置固定

const Footer = () => {
  const router = useRouter();
  const selector = useSelector((state) => state)
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
    router.push({
      pathname: '/menu/search',
      query: {
        hist : "Search",
      }
    })
  }

  return (
    <>
      <SCAppBar> 
        <SCToolBar variant="dense">
          <Grid container item xs={12} justifyContent="space-between" direction="row">
            <Grid container item xs={2} justifyContent="center" alignItems="center">
              <IconButton
                onClick={handleGoMypage}
                color="inherit"
              >
                <HomeIcon sx={{ fontSize: 30}} />
              </IconButton>
            </Grid>
            <Grid container item xs={2} justifyContent="center" alignItems="center">
              <IconButton
                onClick={handleGoNotification}
                color="inherit"
              >
                <NotificationsNoneIcon sx={{ fontSize: 30}} />
              </IconButton>
            </Grid>
            <Grid container item xs={2} justifyContent="center" alignItems="center">
              <IconButton
                onClick={handleGoNews}
                color="inherit"
              >
                <AnnouncementOutlinedIcon sx={{ fontSize: 30}} />
              </IconButton>
            </Grid>
            <Grid container item xs={2} justifyContent="center" alignItems="center">
              <IconButton
                onClick={handleGoSearch}
                color="inherit"
              >
                <SearchIcon sx={{ fontSize: 30}} />
              </IconButton>
            </Grid>
          </Grid>
        </SCToolBar>
      </SCAppBar>
    </>
  )
}
export default Footer