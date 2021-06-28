import React ,{useState} from 'react';
import { useRouter } from 'next/router'
//redux
import {useDispatch,useSelector} from "react-redux"
import {getUserId} from '../reducks/users/selectors'
//FireStore
import { auth, db, FirebaseTimestamp } from "../firebase/index";
//material-UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CreateIcon from '@material-ui/icons/Create';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';

const useStyles = makeStyles((theme) => ({
  root: {
    // height: 380,
    transform: 'translateZ(0px)',
    flexGrow: 1,
    
    position: 'fixed',
    top : "auto",
    bottom : "30em",
    left : "auto",
    right : "25em",
  },
  speedDial: {
    position: 'fixed',
    // position: 'absolute',
    // position: 'relative',
    bottom : "-26em",
    right : "-24em",
    // left : "60em"
    // bottom: theme.spacing(2),
    // right: theme.spacing(2),
  },
  backdropStyle: {

  }
}));


export default function SpeedDialPosting(props) {
  const selector = useSelector((state) => state)
  
  const uid = getUserId(selector)

  const classes = useStyles();
  const router = useRouter()

  const privateUserRef = db.collection('privateUsers').doc(uid)

  const [open, setOpen] = useState(false);

//   const [hidden, setHidden] = useState(false);

//   const handleVisibility = () => {
//     setHidden((prevHidden) => !prevHidden);
//   };

  let privateUserData = {
    userBookmark: []
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const post = () => {
    console.log("投稿が押されました。")
    console.log("wN:"+props.workName+" wM:"+props.workMedia+" wI:"+props.workId+" fpf:"+props.firstPostFlag)
    router.push({
        pathname: "/post/posting",
        query: {
            searchWord: props.workName,
            infoMedia : props.workMedia,
            workId : props.workId,
            firstPostFlag : props.firstPostFlag,
        }
    }
    )
  };

  const bookmark = () => {
    //   配列に追加しないとダメ
    privateUserData.userBookmark = [...privateUserData.userBookmark ,{workId: props.workId ,workName:props.workName ,workMedia:props.workMedia}]
    // setOpen(true);

    privateUserRef
    .set(privateUserData,
            {merge : true } // 有効　→　指定しないフィールドを消さない
    ).then(() => {
        console.log("workBookmark set DB")
    }).catch((error) => {
        alert('assesworkBookmark set DB fail')
        throw new Error(error)
    })
    console.log("ブックマークが押されました")
  };

  const like = () => {
    // setOpen(true);
    console.log("いいねが押されました")
  };

  const actions = [
    { icon: <CreateIcon />, name: (props.firstPostFlag == 0) ? '評価投稿' : '評価を編集', function: post},
    { icon: <CollectionsBookmarkIcon />, name: 'ブックマーク' , function: bookmark},
    //   { icon: <PrintIcon />, name: 'Print' },
    //   { icon: <ShareIcon />, name: 'Share' },
    { icon: <FavoriteIcon />, name: 'いいね！' , function: like},
  ];

  return (
    <div className={classes.root}>
      {/* <Button onClick={handleVisibility}>Toggle Speed Dial</Button> */}
      <Backdrop open={open} className={classes.backdropStyle}/>
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        className={classes.speedDial}
        // hidden={hidden}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => {
                action.function()
                handleClose()
            }}
          />
        ))}
      </SpeedDial>
    </div>
  );
}