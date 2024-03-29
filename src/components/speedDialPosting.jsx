import React ,{useState ,useEffect} from 'react';
import { useRouter } from 'next/router'
//redux
import {useDispatch,useSelector} from "react-redux"
import {getUserBirthday, getUserBookmark, getUserId ,getUserName} from '../reducks/users/selectors'

//FireStore
import { auth, db} from "../firebase/index";
//material-UI
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
// import SpeedDial from '@mui/lab/SpeedDial';
// import SpeedDialIcon from '@mui/lab/SpeedDialIcon';
// import SpeedDialAction from '@mui/lab/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CreateIcon from '@mui/icons-material/Create';

// import like from 'src/components/speedDial/like'
// import bookmark from 'src/components/speedDial/bookmark'
// import post from 'src/components/speedDial/post'
// import workDelete from 'src/components/speedDial/workDelete'

export default function SpeedDialPosting(props) {
  console.log("SpeedDialPosting Start")
  console.dir(props)
  const selector = useSelector((state) => state)
  const dispatchRedux = useDispatch()
  
  const uid = getUserId(selector)
  const userName = getUserName(selector);

  const classes = {
    root: {
      transform: 'translateZ(0px)',
      flexGrow: 1,
      position: 'fixed',
      top : "auto",
      bottom : "10em",
      left : "auto",
      right : "25em",
    },
    speedDial: {
      position: 'fixed',
      bottom : "4rem",
      right : "0.9rem",
      // bottom : "-26em",
      // right : "-24em",
    },
    backdropStyle: {

    }
  }

  const router = useRouter()
  const [open, setOpen] = useState(false);
  // const [open, setOpen] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }; 

  return (
    <div className={classes.root}>
      <Backdrop open={open} sx={classes.backdropStyle}/>
      {props?.sdpActions
        ? (<SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={classes.speedDial}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {props.sdpActions.map((action) => (
            action 
            ?  <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                // open={action.open}
                tooltipOpen
                onClick={() => {
                  handleClose()
                  action.function({
                    ...props,
                    dispatchRedux : dispatchRedux ,
                    uid : uid,
                    userName : userName,
                    selector : selector,
                    router : router
                  })
                }}
              />
            : null
          ))}
        </SpeedDial>)
        : (<SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={classes.speedDial}
          icon={<CreateIcon />}
          onClick={() => {
            router.push({
              pathname: '/menu/search',
              query: {
                hist : "SpeadDial",
              }
            })
          }}
          open={false}
        >
        </SpeedDial>
        )
      }
    </div>
  );
}