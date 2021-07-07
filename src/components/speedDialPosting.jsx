import React ,{useState ,useEffect} from 'react';
import { useRouter } from 'next/router'
//redux
import {useDispatch,useSelector} from "react-redux"
import {getUserId ,getUserName} from '../reducks/users/selectors'
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

import postWInfoCreate from '../foundations/wInfo'
import { addPostedWork } from '../reducks/users/operations'

import useSWR,{ mutate } from 'swr'


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

const fetcher = async (url) => {
  console.log("fetcher start")
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  console.log("got data")
  console.log(data)
  return data
}

export default function SpeedDialPosting(props) {
  const selector = useSelector((state) => state)
  const dispatch = useDispatch()
  
  const uid = getUserId(selector)
  const userName = getUserName(selector);

  const classes = useStyles();
  const router = useRouter()


  const privateUserRef = db.collection('privateUsers').doc(uid)

  // let actions = []
  const [actions,setActions] = useState([])

  // const [isLiked ,setIsLiked] = useState(true);
  let isLiked = false //初期値をfalseにしないと登録がなかったときに「いいね」が表示されない
  const [open, setOpen] = useState(false);

  // const [isPublic , setIsPublic] = useState(true)
  let isPublic = true

  let privateUserData = {
    userBookmark: []
  }

  const { data , error } = useSWR(
    () => props.workId ? `/api/firebase/get/privateUsers/postedWorksId/${props.workId}_${props.uid}` : null, fetcher
    // () => props.workId ? `../api/firebase/get/privateUsers/postedWorksId/${props.workId}_${uid}` : null, fetcher
    ,{
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  console.log(JSON.stringify(data)+"+data@J")
  console.log(error+"+error useSWR")

  //useEffect
  useEffect(() => {
    if(data){
      console.log(data.isLiked+"+data.isLiked")
      console.log(props.firstPostFlag)
      if(data.isLiked){ //いいねされていた場合、いいねボタンを消す
        // setIsLiked(true)
        isLiked = true
      } else {
        isLiked = false
      }
    }
    if(isLiked) {
      setActions([
        { icon: <CreateIcon />, name: (props.firstPostFlag == 0) ? '評価投稿' : '評価を編集', function: post},
        { icon: <CollectionsBookmarkIcon />, name: 'ブックマーク' , function: bookmark},
      ]);
      console.log(isLiked+"action defined")
    } else {
      setActions([
        { icon: <CreateIcon />, name: (props.firstPostFlag == 0) ? '評価投稿' : '評価を編集', function: post},
        { icon: <CollectionsBookmarkIcon />, name: 'ブックマーク' , function: bookmark},
        { icon: <FavoriteIcon />, name: 'いいね！' , function: like},
        { icon: <FavoriteTwoToneIcon />, name: 'いいね！(非公開)' , function: likeHikoukai},
      ]);
      console.log(isLiked+"action defined")
    }
    // if(isLiked) {
    //   actions = [
    //     { icon: <CreateIcon />, name: (props.firstPostFlag == 0) ? '評価投稿' : '評価を編集', function: post},
    //     { icon: <CollectionsBookmarkIcon />, name: 'ブックマーク' , function: bookmark},
    //   ];
    //   console.log(isLiked+"action defined")
    // } else {
    //   actions = [
    //     { icon: <CreateIcon />, name: (props.firstPostFlag == 0) ? '評価投稿' : '評価を編集', function: post},
    //     { icon: <CollectionsBookmarkIcon />, name: 'ブックマーク' , function: bookmark},
    //     { icon: <FavoriteIcon />, name: 'いいね！' , function: like},
    //     { icon: <FavoriteTwoToneIcon />, name: 'いいね！(非公開)' , function: likeHikoukai},
    //   ];
    //   console.log(isLiked+"action defined")
    // }
  },[data])


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
    // privateUserData.userBookmark = [...privateUserData.userBookmark ,{workId: props.workId ,workName:props.workName ,workMedia:props.workMedia}]
    privateUserData.userBookmark = { [props.workId] : { workName:props.workName ,workMedia:props.workMedia } }
    // setOpen(true);

    if(uid != "uid initial"){
        privateUserRef
        .set(privateUserData,
        {merge : true } // 有効　→　指定しないフィールドを消さない
        ).then(() => {
        console.log("workBookmark set DB")
        }).catch((error) => {
        alert('assesworkBookmark set DB fail')
        throw new Error(error)
        })
    } else {
        console.log("ログインしてください")
    }
        
    console.log("ブックマークが押されました")
  };

  const like = async() => {
    // setOpen(true);
    if(uid != "uid initial"){
      // //未評価ユーザの場合、評価済みユーザの場合。（このifいらなそう
      // if(props.firstPostFlag == 0 || props.firstPostFlag == 2){
      console.log("作品にいいねで評価しました。")
      const url = `/api/firebase/posting/${uid}`
      // const url = `../pages/api/firebase/posting/${uid}`
      const postingData = {
        workName:props.workName,
        workMedia:props.workMedia,
        workId:props.workId,
        firstPostFlag:props.firstPostFlag,
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

      const res = await fetch(url, {
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
      // console.log(JSON.parse(data))

      if (res.status !== 200) {
        throw new Error(data.message)
      }

      //親が再描写されることを期待。また、後にfalseにする昨日も追加する。
      props.setIsLiked(true)

      setActions([
          { icon: <CreateIcon />, name: (props.firstPostFlag == 0) ? '評価投稿' : '評価を編集', function: post},
          { icon: <CollectionsBookmarkIcon />, name: 'ブックマーク' , function: bookmark},
      ]);
      console.log(isLiked+"action defined in click")

      // return true

      // await dispatch(postWInfoCreate(
      //     props.workName, // workName,
      //     props.workMedia, // workMedia,
      //     "",// workScore,
      //     uid,// uid,
      //     userName,// userName,
      //     [],// goCheckBoxState,
      //     [],// goTagCheckBoxState,
      //     // workComment,
      //     // isPublic,
      //     // isSpoiler,
      //     // isLiked,
      //     // tokenMap,
      //     // firstPostFlag,
      //     // preWorkId,
      //     // history)
      // ).then( async(workId) => {
      //     console.log(workId+"+workId posting m")
      //     // 登録したユーザのDB情報に登録した作品のWorkIdを追加(postedWorksId(db))
      //     await dispatch(addPostedWork(
      //         uid,
      //         workId,
      //         workName,
      //         isPublic,
      //         isSpoiler,
      //         isLiked,
      //         workScore,
      //         goCheckBoxState,
      //         goTagCheckBoxState,
      //         workComment,
      //         firstPostFlag,
      //     )
      // )
    }
    console.log(props.firstPostFlag)
    console.log("いいねが押されました")
  };

  const likeHikoukai = () => {
    // setOpen(true);
    if(uid != "uid initial"){
      console.log("作品にいいねで評価しました。")
      // setIsPublic(false)
      isPublic = false
      like()
    }
    console.log(props.firstPostFlag)
    console.log("いいね(非公開)が押されました")
  };

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