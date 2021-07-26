import React ,{useState ,useEffect} from 'react';
import { useRouter } from 'next/router'
//redux
import {useDispatch,useSelector} from "react-redux"
import {getUserBirthday, getUserBookmark, getUserId ,getUserName} from '../reducks/users/selectors'

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
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import CreateIcon from '@material-ui/icons/Create';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import CollectionsBookmarkOutlinedIcon from '@material-ui/icons/CollectionsBookmarkOutlined';

import postWInfoCreate from '../foundations/wInfo'
import { addPostedWork, updateUsers } from '../reducks/users/operations'

export default function SpeedDialPosting(props) {
  console.log("SpeedDialPosting Start")
  const selector = useSelector((state) => state)
  const dispatch = useDispatch()
  
  const uid = getUserId(selector)
  let userBookmarks =getUserBookmark(selector)
  const userName = getUserName(selector);

  const useStyles = makeStyles((theme) => ({
    root: {
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
      bottom : "-26em",
      right : "-24em",
    },
    backdropStyle: {

    }
  }));
  const classes = useStyles();
  const router = useRouter()

  const [actions,setActions] = useState([])
  
  const [open, setOpen] = useState(false);
  
  let isPublic = true
  
  const privateUserRef = db.collection('privateUsers').doc(uid)

  const inputSetActions = (action) => {
    console.log(props.isLiked+"+props.isLiked")
    console.log(props.isBookmark+"+props.isBookmark")
    if (uid == "uid initial"){
      console.log("uid initial")
      return false
    }
    if(action == 0){
      console.log("setActions 0")
      setActions([]);
    }
    else if(action == 1){
      console.log("setActions 1")
      props.setIsBookmark((prevIsBookmark) => {
        console.log(prevIsBookmark+"+prevIsBookmark")
        setActions([
          { icon: <CreateIcon />, name: (props.pfirstPostFlag == 0) ? '評価投稿' : '評価を編集', function: post},
          { icon: (prevIsBookmark) ? <CollectionsBookmarkOutlinedIcon /> : <CollectionsBookmarkIcon />, name: (prevIsBookmark) ? 'ブックマーク解除' : 'ブックマーク' , function: bookmark},
        ]);
        return prevIsBookmark
      });
    }
    else if(action == 2){
      console.log("setActions 2")
      props.setIsBookmark((prevIsBookmark) => {
        console.log(prevIsBookmark+"+prevIsBookmark")
        setActions([
          { icon: <CreateIcon />, name: (props.pfirstPostFlag == 0) ? '評価投稿' : '評価を編集', function: post},
          { icon: (prevIsBookmark) ? <CollectionsBookmarkOutlinedIcon /> : <CollectionsBookmarkIcon />, name: (prevIsBookmark) ? 'ブックマーク解除' : 'ブックマーク' , function: bookmark},
          { icon: <FavoriteIcon />, name: 'いいね！' , function: like},
          { icon: <FavoriteTwoToneIcon />, name: 'いいね！(非公開)' , function: likeHikoukai},
        ]);
        return prevIsBookmark
      });
    }
    else if(action == 3){
      console.log("setActions 3")
      setActions([
        { icon: <CreateIcon />, name: (props.pfirstPostFlag == 0) ? '評価投稿' : '評価を編集', function: post},
      ]);
    }
  }

  useEffect(() => {
    console.log(props.workName+"+props.workName+++")

    if(!props.workName){
      inputSetActions(0)
    } else {
      if(props.hist == "work"){
        if(props.isLiked) {
          inputSetActions(1)
          console.log(props.isLiked+"action defined")
        } else {
          inputSetActions(2)
          console.log(props.isLiked+"action defined")
        }
      } else if(props.hist == "assessment"){
        inputSetActions(3)
      }
    }
  },[props.isBookmark,props.isLiked])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const post = () => {
    console.log("投稿が押されました。")
    console.log("wN:"+props.workName+" wM:"+props.workMedia+" wI:"+props.workId+" fpf:"+props.pfirstPostFlag)
    router.push({
      pathname: "/post/posting",
      query: {
        searchWord: props.workName,
        infoMedia : props.workMedia,
        workId : props.workId,
        firstPostFlag : props.pfirstPostFlag,
      }
    })
  };
  
  const bookmark = async() => {
    let privateUserData = {}
    let privateUserReduxData = {}
    
    const urlBookmarkDelete = `/api/firebase/userBookmark/${props.workId}_${uid}`
    
    props.setIsBookmark( async(prevIsBookmark) => {
      //ブックマーク解除
      if(prevIsBookmark){
        console.log("ブックマーク解除が押されました")
        privateUserData = {...selector.users}
        privateUserReduxData = {...selector.users}
        
        console.log("before privateUserData")
        console.dir(privateUserData)
        console.dir(props.workId)
        console.log(delete privateUserData.userBookmark[props.workId])
        console.log("after privateUserData")
        console.dir(privateUserData)
  
        //DB
        await Promise.all([
          fetch(urlBookmarkDelete)
          .then(async(res)=> {
            console.log("fetcher finish")
            const data = await res.json()
  
            if (res.status !== 200) {
              throw new Error(data.message)
            }
          }).catch((error) => {
            alert('Couldnt delete Bookmark')
            throw new Error(error)
          }),
          
          //Redux
          dispatch(updateUsers(privateUserReduxData)),
          
          //Display
          props.setIsBookmark(false)
          ])
          
      //ブックマーク登録
      } else {
        console.log("ブックマーク登録が押されました")
        privateUserData = {
          userBookmark: { [props.workId] : { workName:props.workName ,workMedia:props.workMedia }}
        }
  
        privateUserReduxData = {...selector.users,...privateUserData}
        
        const selectorsUserBookmark = getUserBookmark(selector)
          
        Object.keys(selectorsUserBookmark).map((map) => {
          privateUserData.userBookmark = {...privateUserData.userBookmark , [map] : selectorsUserBookmark[map]} 
        })
        
        console.log(JSON.stringify(privateUserData,null,2)+"privateUserData@J")
        console.dir(privateUserData+"privateUserData@J")
        
        await Promise.all([
          //DB
          privateUserRef
          .set(
            privateUserData,
            {merge : true } // 有効　→　指定しないフィールドを消さない
          ).then(()=>{
            console.log("workBookmark set DB")
          }).catch((error) => {
            alert('assesworkBookmark set DB fail')
            throw new Error(error)
          }),

          //Redux
          dispatch(updateUsers(privateUserData)),
            
          //display
          props.setIsBookmark(true)
        ])
      }
      console.log(props.isBookmark+"+props.isBookmark@sdp")
      console.log(prevIsBookmark+"+prevIsBookmark@sdp")

      return prevIsBookmark
    })

    if(props.isLiked == true){
      console.log("inputSetActions 1")
      // inputSetActions(1)
    } else{
      console.log("inputSetActions 2")
      // inputSetActions(2)
    }
  };
    
  const like = async() => {
    if(uid != "uid initial"){
      // //未評価ユーザの場合、評価済みユーザの場合。（このifいらなそう
      console.log("作品にいいねで評価しました。")
      const urlPosting = `/api/firebase/posting/${uid}`
      const postingData = {
        workName:props.workName,
        workMedia:props.workMedia,
        workId:props.workId,
        firstPostFlag:props.pfirstPostFlag,
        isLiked:true,
        hist:"liked" ,
        userName:userName ,
        isSpoiler: false,
        workTag: [],
        worksLikedCount : 0,
        assessmentWorkTag : [],
        assessmentComment : [],
        workScore : -1,
        workComment : "",
        isPublic : isPublic,
      }

      console.log(JSON.stringify(postingData)+"+postingData@J")

      props.setIsLiked(true,isPublic)

      const res = await fetch(urlPosting, {
        // 送信先URL
        method: 'post', 
        // 通信メソッド    
        header: {'Content-Type': 'application/json'}, 
        // JSON形式のデータのヘッダー    
        // body: searchTokenMap 
        body: JSON.stringify(postingData) 
        // JSON形式のデータ  })
      })
      console.log("fetcher finish")

      const data = await res.json()
      console.log("res.json() finish")
      console.log(data)

      if (res.status !== 200) {
        throw new Error(data.message)
      }
      
      inputSetActions(1)

    }
    console.log(props.pfirstPostFlag)
    console.log("いいねが押されました")
  };

  const likeHikoukai = () => {
    if(uid != "uid initial"){
      console.log("作品にいいねで評価しました。")
      isPublic = false
      like()
    }
    console.log(props.pfirstPostFlag)
    console.log("いいね(非公開)が押されました")
  };

  return (
    <div className={classes.root}>
    {/* // <div classes={{root:classes.root}}> */}
      {/* <Button onClick={handleVisibility}>Toggle Speed Dial</Button> */}
      <Backdrop open={open} className={classes.backdropStyle}/>
      {actions.length >= 1
        ? (<SpeedDial
          ariaLabel="SpeedDial tooltip example"
          classes={{root:classes.speedDial}}
          // className={classes.speedDial}
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
        </SpeedDial>)
        : (<SpeedDial
          ariaLabel="SpeedDial tooltip example"
          classes={{root:classes.speedDial}}
          // className={classes.speedDial}
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