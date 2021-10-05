import React, {useState, useEffect, useCallback,useReducer} from 'react'
import { PrimaryButton,TextInput ,CheckIconBox} from "../../styles/UIkit"

//style
// import { H2CenterLine } from "src/styles/SC/shared/typografy/centerLine"
import { HighLightBar } from "src/styles/SC/shared/typografy/highLightBar"
import { MiddleTitle } from "src/styles/SC/shared/typografy/middleTitle"
import { SCTypografyh5,SCTypografyh5Top } from 'src/styles/SC/shared/typografy/h5'
import { SCtagChip } from 'src/styles/SC/shared/chip/tagChip'
import { ExplanationTextDefault } from 'src/styles/SC/shared/typografy/ExplanationTextDefault'
import { TitleSpacing } from 'src/styles/SC/shared/grid/titleSpacing'
import ItemExplanationSet from 'src/components/ItemExplanationSet'
import ExplanationChildSet from 'src/components/ExplanationChildSet'

import {
  ONE_CLICK_APPEARANCE_IN_POSTING,
  FIRST_POSTED_FLAG_ANOTHER_ONLY_POSTED,
  FIRST_POSTED_FLAG_NOT_POSTED,
  FIRST_POSTED_FLAG_I_POSTED,
} from 'src/foundations/share/GlobalConstant'

//material UI
import FormGroup from '@mui/material/FormGroup'
// import FormControl from '@mui/material/FormControl';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
// import { makeStyles } from '@mui/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import PublishIcon from '@mui/icons-material/Publish';
import Collapse from '@mui/material/Collapse';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
// import TextField from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import NativeSelect from '@mui/material/NativeSelect';
import { ListItemIcon,ListItemSecondaryAction,IconButton } from '@mui/material';
// import RootRef from "@mui/material/RootRef";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import clsx from 'clsx';
import Checkbox from '@mui/material/Checkbox';

///material icon 
import PublicIcon from '@mui/icons-material/Public';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../../components/header'
import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'
import { parseCookies } from 'nookies'
import { is, set } from 'immutable'
import {useDispatch,useSelector} from 'react-redux'
import PostingButton from '../../components/PostingButton'

import {getUserId,getUserName,getIsSignedIn ,getUserAssessmentWorks} from "../../reducks/users/selectors";
// import { postWorkCreate } from '../../reducks/works/operations'
import { addPostedWork } from '../../reducks/users/operations'

import postWInfoCreate from '../../foundations/wInfo'
import checkSameWork from '../../foundations/wInfo/checkSameWork'
import { tokenize } from '../api/allStringSearch/text-processor';

import { db } from "../../firebase/index";
import { collection, doc, query, where, getDocs ,getDoc ,setDoc ,Timestamp } from "firebase/firestore";

import {textToNumber} from 'src/foundations/share/textToNumber';
import DateToString from 'src/foundations/share/DateToString';
import ArraySort from '../../foundations/share/ArraySort'

import {tagMap,tagExtraData} from "../../models/tagMap"
import {categoryMap} from "../../models/categoryMap"
import {bunruiMap} from "../../models/bunruiMap"
import {winfoCreatorList} from "../../models/winfoCreatorList"
import {winfoMusicList} from "../../models/winfoMusicList"
import {countryList} from "../../models/countryList"
import PleaseSignUpIn from '../menu/PleaseSignUpIn'
import GLoading from '../../components/GLoading';

import { DragDropContext,Droppable,Draggable} from 'react-beautiful-dnd';
import { fontSize, width } from '@mui/system'
import { isConditionalExpression } from 'typescript'
import { titleSpacing } from '../../styles/SC/shared/grid/titleSpacing'
import { red } from '@mui/material/colors'

const useStyles = {
  autoCompleteStyle : {
    padding: "20px",
    // '& #tagSearch-option' : {
    '& .MuiAutocomplete-option' : {
      padding : "0px",
      minHeight : "0.7em",
    }
    // }
  },
  autoCompleteStylePop : {
    maxHeight : "12em",
  },

  postingInlineH2: {
    display : "inline", //改行させない
    // padding : "30px 0px 0px 0px", //margin,paddin意味ない
    position : "relative",
    top : 10,
  },
  // postingInlineNetabareBox: {
  //   display : "inline",
  //   // padding : "30px 0px 0px 0px", //margin,paddin意味ない
  //   position : "relative",
  //   top : 5,
  //   left : 20,
  // },
  postingInlineNetabareText: {
    fontSize : "10px",
  },
  // postingNetabarePosition: {
  //   position : "relative",
  //   justifyContent:"center",
  //   alignItems:"flex-end",
  //   maxWidth : 630,
  //   marginLeft: 'auto',
  //   marginRight: 'auto',
  // },
  postingCommentPosition: {
    position : "relative",
    top : "-2.0em",
    justifyContent:"center",
    alignItems:"flex-end"
  },
  postingWinfoDatas: {
    position : "relative",
    // top : "-2.0em",
    justifyContent:"center",
    alignItems:"center",
    flexDirection:"column",
  },
  postingWinfoOneData: {
    marginTop:"0.7em",
  },
  postingWinfoCreator: {
    marginTop:"0.7em",
    // justifyContent:"center",
    justifyContent:"space-around",
  },
  winfoCreatorNodalDeleteIcon: {
    position : "absolute",
    left : "0.1em",
    bottom : "0.1em",
  },
  winfoCreatorNodalCancelUpdateButton: {
    // position : "absolute",
    right : "1.1em",
    // bottom : "3em",
  },
  postingWinfoCreatorDialog: {
    justifyContent:"space-around",
  },
  flexCenter: {
    justifyContent:"center",
    alignItems:"center"
  },

  cateInputCheck: {
    margin : "0px",
    padding: "0px 0px 0px 0px",
    boxSizing: "content-box" // <-- add this
  },
  tagInputCheck: {
    margin : "0px",
    padding: "0px 0px 0px 0px",
    boxSizing: "content-box" // <-- add this
  },
  commentField: {
    maxWidth : 630,
  },
  mediaFormControl: {
    margin : "0px 0px 4px 0px",
    minWidth: 120,
  },
  winfoCreatorFormControl: {
    margin : "0px 0px 0px 0px",
  },
  tagMasterGrid: {
    justifyContent : "space-evenly",
  },
  cateMasterGrid: {
    justifyContent : "space-between",
  },
  cateItemGrid: {
    position : "relative",
  },
  firstTagItemGrid: {
    position : "relative",
    top : "-2px",
    left : "-2px",
    // marginBottom : "14px",
    justifyContent : "flex-start",
    // '& > *': {
    //   margin: theme.spacing(0.5),
    // },
  },
  secondTagItemGrid: {
    justifyContent : "center",
    // '& > *': {
    //   margin: theme.spacing(0.5),
    // },
  },
  tagItemSelectGrid: {
    justifyContent : "center",
    alignItems : "center",
    flexDirection : "row",
  },

  cateFormControlLabel: {
    textAlign : "center",
    margin: "0px 0px 10px 0px",
    boxSizing: "content-box", // <-- add this
  },
  tagFormControlLabel: {
    textAlign : "center",
    margin: "0px 0px 10px 0px",
    boxSizing: "content-box", // <-- add this
  },
  tagFormControlLabelHidden: {
    textAlign : "center",
    margin: "0px 0px 22px 0px",
    boxSizing: "content-box", // <-- add this
    display: "none",
  },
  tagAppeareButton:{
    paddingLeft : "0 !important",
    color : "darkgreen !important",
  },
  tagFormGroup:{
    position: "relative",
  },
  gridTagKey: {
    flexGrow: 1,
    textAlign : "center",
    margin : "0px"
  },
  inputTagKey: {
    flexGrow: 1,
    textAlign : "center",
    margin : "0px 0px 7px 0px"
  },
  h3TagKey: {
    margin : "12px 0px 0px 0px",
  },
  h3WorksTitle: {
    margin : "9px 0px 0px 0px",
    color : "#393e4f", //青褐あおかち
    fontSize : "1.2em",
    fontWeight : "bold",
  },
  h5WorksLikeTitle: {
    margin : "9px 0px 0px 0px",
    color : "#393e4f", //青褐あおかち
    fontSize : "0.8em",
  },
  likedPosition: {
    justifyContent : "center",
    alignItems : "center",
    flexDirection : "column",
  },
  ScorePosition: {
    position : "relative",
    top : "-4px",
    maxWidth : 45,
    textAlign : "center",
  },
  watchTimesPosition: {
    // marginTop : "0!important",
    position : "relative",
    top : "-6px",
    minWidth : "20px!important",
    marginLeft : "0!important",
  },
  likedIconPosition: {
    position : "relative",
    left : "9.5px",
  },

  h4LinkTag: {
    fontSize : "12.5px",
    textDecoration: 'underline',
    margin : "0px 0px",
    color : "#000080",
  },
  inputHissu: {
    color : "red",
  },
  inputSmallHissu: {
    position : "relative",
    top : -6,
    fontSize : 12,
    color : "red",
  },
  FCHissu: {
    margin : "0px 0px 4px 0px",
  },
  textFieldInputProps: {
    textAlign : "center",
  },
  FCfreeWordSearchTag: {
    margin : "0px 0px 0px 0px",
    // minWidth : "14em",
    width : "80%"
  },
  // freeWordSearchTag: {
  //   position : "relative",
  //   top : -10,
  //   width : "100%",
  //   justifyContent : "center",
  //   alignItems : "center",
  // },
  netabareGrid: {
    justifyContent : "flex-end",
    // alignItems : "flex-end",
    display : "flex",
  },
  netabareLabel: {
    margin : "0.2em 0.5em",
  },
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    

    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
  postingTypology : {
    fontSize : 20,
  },
  isPublicSignal : {
    position: 'fixed',
    top : "2.4em",
    right : "0.6em",
  },
  winfoCreatorList : {
    listStyle : "none",
    maxWidth : "100%",
    width : "100%",
  },
  winfoCreatorListItems : {
    // height:"3em",
    height : "auto",
    alignItems:"center",
    paddingTop : 0,
    paddingBottom : 0,
  },
  displayText : {
    overflowWrap: "break-word",
  },
  iconButton : {
    padding : "5px",
  },
}

//任意入力の作品情報
const initialState = {
  isLoading : true,
  winfoEditor : "",
  winfoInfomation : "",
  winfoCreator : [],
  // winfoPublisher : [],
  winfoCountry : [],
  winfoStart : "",
  winfoFinish : "",
  winfoImage : "",
  statisticsData :[],
  winfoParent : {},
  winfoChild : [],
  winfoSeries : [],
  winfoMusic : [],
  winfoPages : "",
  winfoMinutes : "",
  winfoPlatform : [],
}

const reducer = (state, action) => {
  let putState = {...state,...action.payload} ///宣言的に書くっていう観点で言うとこれほんとに意味ない。
  // putState = { ...putState ,sdpActions : sdpActions }

  switch (action.type){
    case "loadDB": {
      return {
        ...action.payload,
      }
    }
    case "postButtonClicked" : {
      return {
        ...putState,
      }
    }
    case "changeWinfo" : {
      return {
        ...putState,
      }
    }
    default :{
      throw new Error("not exect action")
    }
  }
}

// 作品投稿ページ
const Posting = () => {

  //default
  const router = useRouter()
  const RDDispatch = useDispatch()
  
  //Redux
  const selector = useSelector((state) => state)
  const RdUserId = getUserId(selector);
  const RdIsSignin = getIsSignedIn(selector);
  const RdUserName = getUserName(selector);
  const RdAssessmentWorks = getUserAssessmentWorks(selector)

  //style
  const classes = useStyles;

  const asPath = router.asPath // pathNameだとURL部のみ（/post/posting)だけ取得
  const props = router.query
  const { isReady } = useRouter()
  const [isLoading,setIsLoading] = useState(true)
  
  //props
  let hist = props.hist
  let preWorkName = props.searchWord
  let qInfoMedia = props.infoMedia
  let preWorkId = props.workId
  let firstPostFlag = props.firstPostFlag
  
  const oriQuery = /^\/post\/posting\?searchWord=/.test(asPath) ? asPath.split('\/post\/posting')[1] : ""

  if(oriQuery){
    if(hist == "SignIn"){ // サインインから来た時は上書きする。
      firstPostFlag = preWorkId 
      ? Object.keys(RdAssessmentWorks).includes(preWorkId) 
        ? 2 //評価編集
        : 0 //自分は未評価投稿
      : 1 //新規評価
    }
  } else {
    console.log("no oriQuery")
  }

  //useReduce
  const [state,dispatch] = useReducer(reducer, initialState)

  //useState

  ////input
  const [workName, setWorkName] = useState(preWorkName) //必須

  const [workMedia, setWorkMedia] = useState(qInfoMedia); //必須
  const [open, setOpen] = useState(false);

  const [workScore, setWorkScore] = useState("")
  const [workWatchYear, setWorkWatchYear] = useState(new Date())
  const [workWatchTimes, setWorkWatchTimes] = useState("")
  const [workComment, setWorkComment] = useState("")
  
  const [showGenre, setShowGenre] = useState(false) //必須
  const [tagAutoCompleteValue ,setTagAutoCompleteValue] = useState("useStateInitial")
  
  const [isPublic,setIsPublic] = useState(true)
  const [isSpoiler,setIsSpoiler] = useState(false)
  const [isLiked,setIsLiked] = useState(false)
  
  const [winfoOneCreatorKind,setWinfoOneCreatorKind] = useState("")
  const [winfoOneCreatorName,setWinfoOneCreatorName] = useState("")
  
  const [winfoOneCreatorDialogKind,setWinfoOneCreatorDialogKind] = useState("")
  const [winfoOneCreatorDialogName,setWinfoOneCreatorDialogName] = useState("")

  const [winfoOneCreatorDialogIndex, setWinfoOneCreatorDialogIndex] = useState("")
  const [winfoOneCreatorDialogId, setWinfoOneCreatorDialogId] = useState("")

  const [winfoOneMusicKind,setWinfoOneMusicKind] = useState("")
  const [winfoOneMusicName,setWinfoOneMusicName] = useState("")
  
  const [winfoOneMusicDialogKind,setWinfoOneMusicDialogKind] = useState("")
  const [winfoOneMusicDialogName,setWinfoOneMusicDialogName] = useState("")

  const [winfoOneMusicDialogIndex, setWinfoOneMusicDialogIndex] = useState("")
  const [winfoOneMusicDialogId, setWinfoOneMusicDialogId] = useState("")

  ////showmore
  const firstCheckBoxDisp = 22
  const totalCountGenre = tagExtraData.Genre.count
  const totalCountImpression = totalCountGenre + tagExtraData.Impression.count
  const totalCountOriginal = totalCountImpression + tagExtraData.Original.count
  const totalCountPosition = totalCountOriginal + tagExtraData.Position.count  

  const [showMoreGenre ,setShowMoreGenre] = useState(firstCheckBoxDisp)
  const [showMoreImpression ,setShowMoreImpression] = useState(totalCountGenre + firstCheckBoxDisp)
  const [showMoreOriginal ,setShowMoreOriginal] = useState( 
    (tagExtraData.Original.count <= firstCheckBoxDisp)
      ? totalCountImpression + tagExtraData.Original.count
      : totalCountImpression + firstCheckBoxDisp
    )
  const [showMorePosition ,setShowMorePosition] = useState(totalCountOriginal + firstCheckBoxDisp)

  ////tagResult
  let tagResult = {}

  Object.keys(tagMap).map((map) => 
    tagResult = {...tagResult, [map] : false}
  )

  const [tagCheckBox, setTagCheckBox] = useState(tagResult)

  ////cateResult
  let cateResult = {}

  Object.keys(categoryMap).map((map) => 
    cateResult = {...cateResult, [map] : false}
  )

  const [checkBoxState, setCheckBoxState] = useState(cateResult)

  ////openDialog
  const [openCreatorDialog, setOpenCreatorDialog] = useState(false);
  const [openMusicDialog, setOpenMusicDialog] = useState(false);

  const handleClickOpenCreatorDialog = () => {
    console.log("openDialog")
    setOpenCreatorDialog(true);
  };
  const handleClickOpenMusicDialog = () => {
    console.log("openDialog")
    setOpenMusicDialog(true);
  };
  
  const handleCloseCreatorDialog = () => {
    console.log("closeCreatorDialog")
    setOpenCreatorDialog(false);
  };
  const handleCloseMusicDialog = () => {
    console.log("closeMusicDialog")
    setOpenMusicDialog(false);
  };

  //input function
  const changeIsPublic = (publicState) => {
    setIsPublic(publicState)
  }

  const inputWorkName = useCallback((event) => {
    setWorkName(event.target.value)
  }, [])
  
  const inputWorkScore = useCallback((event) => {
    setWorkScore(textToNumber(event.target.value))
  },[])
  // },[workScore])
  const inputWorkWatchTimes = (event) => {
    setWorkWatchTimes(event.target.value)
  }

  const inputWorkWatchYear = (newValue) => {
    setWorkWatchYear(newValue)
  }

  // const handleSliderChange = useCallback((event, newValue) => {
  //   setWorkScore(newValue)
  //   // console.log("handleSliderChange")
  // },[workScore])

  const inputTagAutoCompleteValue = useCallback((value,reason) => {
    // console.log(JSON.stringify(value)+"+value@inputTagAutoCompleteValue")
    // console.log(reason+"+reason")
    setTagAutoCompleteValue(reason == "reset" ? "" : value)
  },[])
  // },[tagAutoCompleteValue])
  
  const cateCheckHandleChange = useCallback(({name,isClicked}) => {
    console.log(name+"name")
    console.log(isClicked ? "isClicked true" : "isClicked false")
    // setCheckBoxState({...checkBoxState,[event.target.name]: event.target.checked})
    setCheckBoxState({...checkBoxState, [name] : !isClicked})
  },[checkBoxState])

  const tagCheckBoxHandleChange = useCallback(({name,isClicked}) => {
    setTagCheckBox((preTagCheckBox) => { 
      return {...preTagCheckBox, [name] : !isClicked}
    })
  },[])
  
  const inputWorkComment = useCallback((event) => {
    setWorkComment(event.target.value)
  }, [])

  const isSpoilerHandleChange = useCallback((event) => {
    setIsSpoiler(event.target.checked)
    // },[checkBoxState])
  },[isSpoiler])

  const isLikedHandleChange = useCallback(() => {
    setIsLiked(isLiked => !isLiked)
  },[isLiked])

  const handleChange = (event) => {
    setWorkMedia(event.target.value);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  //検索用トークンマップ作成用関数
  const buildTokenMap = (word) => {
    const tokenMap = {}
    tokenize(word).forEach(token => {
      tokenMap[token] = true
    })
    return tokenMap
  }

  const inputWinfoInfomation = (event) => {
    dispatch({type:"changeWinfo",
      payload : {
        winfoInfomation : event.target.value
      }
    })
  }

  const inputWinfoOneCreatorKind = (event) => {
    setWinfoOneCreatorKind(event.target.value)
  }
  
  const inputWinfoOneCreatorName = (event) => {
    setWinfoOneCreatorName(event.target.value)
  }
  const inputWinfoOneCreatorDialogKind = (event) => {
    setWinfoOneCreatorDialogKind(event.target.value)
  }

  const inputWinfoOneCreatorDialogName = (event) => {
    setWinfoOneCreatorDialogName(event.target.value)
  }

  const inputWinfoOneMusicKind = (event) => {
    setWinfoOneMusicKind(event.target.value)
  }
  
  const inputWinfoOneMusicName = (event) => {
    setWinfoOneMusicName(event.target.value)
  }
  const inputWinfoOneMusicDialogKind = (event) => {
    setWinfoOneMusicDialogKind(event.target.value)
  }

  const inputWinfoOneMusicDialogName = (event) => {
    setWinfoOneMusicDialogName(event.target.value)
  }

  console.log(winfoOneCreatorKind+"+winfoOneCreatorKind")
  console.log(winfoOneCreatorName+"+winfoOneCreatorName")
  console.log("+winfoOneCreatorName")
  console.dir(state.winfoCreator)


  const inputWinfoCreatorAdd = () => {
    console.log("inputWinfoCreatorAdd start")
    const item = {
      index: state.winfoCreator.length,//要素の長さが一番indexとなり、逆順に表示しているので、一番上に来る
      id : DateToString(new Date,1),
      kind : winfoOneCreatorKind,
      name : winfoOneCreatorName,
    }

    var tmpArray = [item,...state.winfoCreator]

    for(let i = 0;i < state.winfoCreator.length + 1 ;i++){
      console.log(JSON.stringify(tmpArray[i])+"tmpArray[i]@J");
      tmpArray[i].index = i
      console.log(tmpArray[i].index+"+tmpArray[i].index")
    }

    dispatch({type:"changeWinfo",payload : {
      // winfoCreator : [item,...state.winfoCreator]
      winfoCreator : [...tmpArray]
    }})

    setWinfoOneCreatorKind("")
    setWinfoOneCreatorName("")
  }

  
  const inputWinfoCreatorUpdate = () => {
    const item = {
      // index: winfoOneCreatorDialogIndex,
      index: winfoOneCreatorDialogIndex,
      id : winfoOneCreatorDialogId,///持ってくる　上も同じ
      kind : winfoOneCreatorDialogKind,
      name : winfoOneCreatorDialogName,
    }

    const beforeItem = {
      index: winfoOneCreatorDialogIndex,
      id : winfoOneCreatorDialogId,
      kind : state.winfoCreator[winfoOneCreatorDialogIndex].kind,
      name : state.winfoCreator[winfoOneCreatorDialogIndex].name,
    }

    console.log(JSON.stringify(item)+"+item")
    console.log(JSON.stringify(beforeItem)+"+beforeItem")
    console.log(JSON.stringify(state.winfoCreator[winfoOneCreatorDialogIndex])+"+state.winfoCreator[winfoOneCreatorDialogIndex]")

    console.log(state.winfoCreator.length+"+state.winfoCreator.length")
    console.log(winfoOneCreatorDialogIndex+"+winfoOneCreatorDialogIndex")
    
    //変更対象の要素の位置を特定
    const editArrayLocation = state.winfoCreator.findIndex(({index}) => 
      index === winfoOneCreatorDialogIndex
    )

    if(editArrayLocation == -1){
      alert("editArrayLocation is -1")
    }

    var tmpArray = state.winfoCreator
    
    //要素の位置をずらさずに配列の内容を更新
    tmpArray[editArrayLocation] = {...item} 
    
    console.log(editArrayLocation+"+editArrayLocation")
    console.log(JSON.stringify(tmpArray[editArrayLocation])+"+tmpArray[editArrayLocation]")

    //要修正　既に保存されている変更対象の要素を変更（もしくは削除して追加）する
    dispatch({type:"changeWinfo",payload : {
      winfoCreator : tmpArray
    }})

    console.log("complete dispatch type UpdateWinfoCreator tmpArray")

    setWinfoOneCreatorDialogKind("")
    setWinfoOneCreatorDialogName("")
    setWinfoOneCreatorDialogIndex("")
    setWinfoOneCreatorDialogId("")
  }

  const inputWinfoCreatorDelete = () => {
    //変更対象の要素の位置を特定
    const editArrayLocation = state.winfoCreator.findIndex(({index}) => 
      index === winfoOneCreatorDialogIndex
    )

    var tmpArray = state.winfoCreator
    
    //要素の位置をずらさずに配列の内容を更新
    tmpArray.splice(editArrayLocation, 1) //ここで要素削除

    for(let i = editArrayLocation;i < state.winfoCreator.length - 1;i++){
      console.log(JSON.stringify(tmpArray[i])+"tmpArray[i]@J");
      tmpArray[i].index = i
      // tmpArray[i].index = wi_nfoOneCreatorDialogIndex
      console.log(tmpArray[i].index+"+tmpArray[i].index")
    }

    //対象要素削除後の状態に更新
    dispatch({type:"changeWinfo",payload : {
      winfoCreator : tmpArray
    }})

    console.log("complete dispatch type DeleteWinfoCreator tmpArray")

    setWinfoOneCreatorDialogKind("")
    setWinfoOneCreatorDialogName("")
    setWinfoOneCreatorDialogIndex("")
    setWinfoOneCreatorDialogId("")
  }

  // const inputWinfoPublisher = (event) => {
  //   dispatch({type:"changeWinfo",
  //     payload : {
  //       winfoPublisher : event.target.value
  //     }
  //   })
  // }

  const inputWinfoCountry = (event) => {
    dispatch({type:"changeWinfo",
      payload : {
        winfoCountry : event.target.value
      }
    })
  }
  const inputWinfoStart = (event) => {
    dispatch({type:"changeWinfo",
      payload : {
        winfoStart : event.target.value
      }
    })
  }
  const inputWinfoFinish = (event) => {
    dispatch({type:"changeWinfo",
      payload : {
        winfoFinish : event.target.value
      }
    })
  }
  const inputWinfoMusicAdd = () => {
    console.log("inputWinfoMusicAdd start")
    const item = {
      index: state.winfoMusic.length,//要素の長さが一番indexとなり、逆順に表示しているので、一番上に来る
      id : DateToString(new Date,1),
      kind : winfoOneMusicKind,
      name : winfoOneMusicName,
    }

    var tmpArray = [item,...state.winfoMusic]

    for(let i = 0;i < state.winfoMusic.length + 1 ;i++){
      console.log(JSON.stringify(tmpArray[i])+"tmpArray[i]@J");
      tmpArray[i].index = i
      console.log(tmpArray[i].index+"+tmpArray[i].index")
    }

    dispatch({type:"changeWinfo",payload : {
      // winfoMusic : [item,...state.winfoMusic]
      winfoMusic : [...tmpArray]
    }})

    setWinfoOneMusicKind("")
    setWinfoOneMusicName("")
  }

  
  const inputWinfoMusicUpdate = () => {
    const item = {
      // index: winfoOneMusicDialogIndex,
      index: winfoOneMusicDialogIndex,
      id : winfoOneMusicDialogId,///持ってくる　上も同じ
      kind : winfoOneMusicDialogKind,
      name : winfoOneMusicDialogName,
    }

    const beforeItem = {
      index: winfoOneMusicDialogIndex,
      id : winfoOneMusicDialogId,
      kind : state.winfoMusic[winfoOneMusicDialogIndex].kind,
      name : state.winfoMusic[winfoOneMusicDialogIndex].name,
    }

    console.log(JSON.stringify(item)+"+item")
    console.log(JSON.stringify(beforeItem)+"+beforeItem")
    console.log(JSON.stringify(state.winfoMusic[winfoOneMusicDialogIndex])+"+state.winfoMusic[winfoOneMusicDialogIndex]")

    console.log(state.winfoMusic.length+"+state.winfoMusic.length")
    console.log(winfoOneMusicDialogIndex+"+winfoOneMusicDialogIndex")
    
    //変更対象の要素の位置を特定
    const editArrayLocation = state.winfoMusic.findIndex(({index}) => 
      index === winfoOneMusicDialogIndex
    )

    if(editArrayLocation == -1){
      alert("editArrayLocation is -1")
    }

    var tmpArray = state.winfoMusic
    
    //要素の位置をずらさずに配列の内容を更新
    tmpArray[editArrayLocation] = {...item} 
    
    console.log(editArrayLocation+"+editArrayLocation")
    console.log(JSON.stringify(tmpArray[editArrayLocation])+"+tmpArray[editArrayLocation]")

    //要修正　既に保存されている変更対象の要素を変更（もしくは削除して追加）する
    dispatch({type:"changeWinfo",payload : {
      winfoMusic : tmpArray
    }})

    console.log("complete dispatch type UpdateWinfoMusic tmpArray")

    setWinfoOneMusicDialogKind("")
    setWinfoOneMusicDialogName("")
    setWinfoOneMusicDialogIndex("")
    setWinfoOneMusicDialogId("")
  }

  const inputWinfoMusicDelete = () => {
    //変更対象の要素の位置を特定
    const editArrayLocation = state.winfoMusic.findIndex(({index}) => 
      index === winfoOneMusicDialogIndex
    )

    var tmpArray = state.winfoMusic
    
    //要素の位置をずらさずに配列の内容を更新
    tmpArray.splice(editArrayLocation, 1) //ここで要素削除

    for(let i = editArrayLocation;i < state.winfoMusic.length - 1;i++){
      console.log(JSON.stringify(tmpArray[i])+"tmpArray[i]@J");
      tmpArray[i].index = i
      // tmpArray[i].index = wi_nfoOneMusicDialogIndex
      console.log(tmpArray[i].index+"+tmpArray[i].index")
    }

    //対象要素削除後の状態に更新
    dispatch({type:"changeWinfo",payload : {
      winfoMusic : tmpArray
    }})

    console.log("complete dispatch type DeleteWinfoMusic tmpArray")

    setWinfoOneMusicDialogKind("")
    setWinfoOneMusicDialogName("")
    setWinfoOneMusicDialogIndex("")
    setWinfoOneMusicDialogId("")
  }

  const inputWinfoPages = (event) => {
    dispatch({type:"changeWinfo",
      payload : {
        winfoPages : textToNumber(event.target.value)
      }
    })
  }
  const inputWinfoMinutes = (event) => {
    dispatch({type:"changeWinfo",
      payload : {
        winfoMinutes : textToNumber(event.target.value)
      }
    })
  }

  // winfoCreatorDrag Function
  function winfoCreatorHandleOnDragEnd(result) {

    console.log("result")
    console.dir(result)

    if(result.destination === null){ //droppable外にドロップすると、nullになる
      console.log("result.destination.index is null")
      return false
    }

    const items = Array.from(state.winfoCreator);

    //移動した要素を削除し、reorderedItemに削除したアイテムを格納。
    const [reorderedItem] = items.splice(result.source.index, 1);
    
    //移動した要素を追加
    items.splice(result.destination.index, 0, reorderedItem);

    for(let i = 0;i < items.length;i++){
      items[i].index = i
      console.log(JSON.stringify(items[i])+"items["+i+"]")
    }

    console.dir(reorderedItem)
    console.log("reorderedItem")
    console.log(items+"+items")

    dispatch({type:"changeWinfo",payload : {
      winfoCreator : items
    }})

    return true
  }
  // winfoMusicDrag Function
  function winfoMusicHandleOnDragEnd(result) {

    console.log("result")
    console.dir(result)

    if(result.destination === null){ //droppable外にドロップすると、nullになる
      console.log("result.destination.index is null")
      return false
    }

    const items = Array.from(state.winfoMusic);

    //移動した要素を削除し、reorderedItemに削除したアイテムを格納。
    const [reorderedItem] = items.splice(result.source.index, 1);
    
    //移動した要素を追加
    items.splice(result.destination.index, 0, reorderedItem);

    for(let i = 0;i < items.length;i++){
      items[i].index = i
      console.log(JSON.stringify(items[i])+"items["+i+"]")
    }

    console.dir(reorderedItem)
    console.log("reorderedItem")
    console.log(items+"+items")

    dispatch({type:"changeWinfo",payload : {
      winfoMusic : items
    }})

    return true
  }

  useEffect(() => {
    setIsLoading(isReady ? false : true)
　},[isReady])

  useEffect(() => {
    if(oriQuery && RdIsSignin){
      (async() => {

        if(preWorkName && qInfoMedia){
          setWorkName(preWorkName)
          setWorkMedia(qInfoMedia)
        }

        let DBdata = []
        // DBから値を取得する際にPromise.allを使う
        if(firstPostFlag == FIRST_POSTED_FLAG_I_POSTED ||
          firstPostFlag == FIRST_POSTED_FLAG_ANOTHER_ONLY_POSTED){
          DBdata = await Promise.all([
            // db.collection('privateUsers').doc(RdUserId).collection('postedWorksId').doc(preWorkId).get()
            getDoc(doc(db, 'privateUsers', RdUserId, 'postedWorksId' ,preWorkId))
            .then((snapshot) => {
              return snapshot.data()
            }).catch((error) => {
              alert('failed to get postedWorksId')
              throw new Error(error)
            })
          ,
            getDoc(doc(db, 'wInfo',preWorkId))
            // db.collection('wInfo').doc(preWorkId).get()
            .then((snapshot) => {
              return snapshot.data()
            }).catch((error) => {
              alert('failed to get wInfo')
              throw new Error(error)
            })
          ])

          console.log(JSON.stringify(DBdata[0])+"+DBdata[0]@J")
          console.log(JSON.stringify(DBdata[1])+"+DBdata[1]@J") 

          DBdata[1].winfoCategory.map((cate) => {
            console.log(cate+"+cates")
            Object.keys(categoryMap).map((map) => {
              if(categoryMap[map] == cate){
                setCheckBoxState(checkBoxState => ({...checkBoxState , [map]:true}))
              }
            })
          })

          dispatch({type:"loadDB" ,
            payload : {
              isLoading : false,
              /////要変更(DBから持ってきた値を入力する。)
              winfoEditor : DBdata[1].winfoEditor,
              winfoInfomation : DBdata[1].winfoInfomation,
              // winfoCreator : DBdata[1].winfoCreator,
              winfoCreator : DBdata[1].winfoCreator.sort(ArraySort("index","asc")),
              // winfoCreator : DBdata[1].winfoCreator.sort(ArraySort("index","desc")),
              // winfoPublisher : DBdata[1].winfoPublisher,
              winfoCountry : DBdata[1].winfoCountry,
              winfoStart : DBdata[1].winfoStart,
              winfoFinish : DBdata[1].winfoFinish,
              winfoImage : DBdata[1].winfoImage,
              statisticsData : DBdata[1].statisticsData,
              winfoParent : DBdata[1].winfoParent,
              winfoChild : DBdata[1].winfoChild,
              winfoSeries : DBdata[1].winfoSeries,
              winfoMusic : DBdata[1].winfoMusic.sort(ArraySort("index","asc")),
              winfoPages : DBdata[1].winfoPages,
              winfoMinutes : DBdata[1].winfoMinutes,
              winfoPlatform : DBdata[1].winfoPlatform,
            }
          })

          // updateWinfoCreatorDragState(
          //   DBdata[1].winfoCreator.sort(ArraySort("index","desc")) //順番をindexの順に揃える処理をのちに入れる
          // )
        }

        //既に評価済みの評価を編集する場合
        if(firstPostFlag == FIRST_POSTED_FLAG_I_POSTED){
          console.log("FIRST_POSTED_FLAG_I_POSTED start")
          if(RdUserId != "uid initial"){
            console.log(RdUserId+"+RdUserId +++")
            console.log(preWorkId+"preWorkId +++")

            DBdata[0].assessmentWorkTag.map((tag) => {
              console.log(tag+"+tags")
              Object.keys(tagMap).map((map) => {
                if([tagMap[map].key] == tag){
                  setTagCheckBox(tagCheckBox => ({...tagCheckBox , [map]:true}))
                }
              })
            })            
            setWorkScore(DBdata[0].workScore != -1 ? DBdata[0].workScore : "")
            setWorkWatchTimes(DBdata[0].workWatchTimes ? DBdata[0].workWatchTimes : 1)
            setWorkWatchYear(DBdata[0].workWatchYear ? new Date(DBdata[0].workWatchYear.toDate()) : new Date())
            // setWorkWatchYear(DBdata[0].workWatchYear ? new Date(Math.floor(DBdata[0].workWatchYear * 10) / 10) : "")
            setWorkComment(DBdata[0].workComment)
            setIsPublic(DBdata[0].isPublic)
            setIsSpoiler(DBdata[0].isSpoiler)
            setIsLiked(DBdata[0].isLiked)

            if(state.winfoEditor == RdUserId ){//編集権保持者の場合
              console.log("I'm Editor")
              
            }

          } else {
            console.log(RdUserId+"+RdUserId")
          }
        }
        //未評価の既に登録されている作品
        else if(firstPostFlag == FIRST_POSTED_FLAG_ANOTHER_ONLY_POSTED){
          console.log("FIRST_POSTED_FLAG_ANOTHER_ONLY_POSTED start")
          DBdata[1].winfoCategory.map((cate) => {
            console.log(cate+"+cates")
            Object.keys(categoryMap).map((map) => {
              if(categoryMap[map] == cate){
                setCheckBoxState(checkBoxState => ({...checkBoxState , [map]:true}))
              }
            })
          })
        } else {
          console.log("firstPostFlag= "+firstPostFlag)
        }
      })()
    } else if(!RdIsSignin && oriQuery) { //サインインしていない人が作品登録しようとした
      router.replace({
        pathname: '/menu/PleaseSignUpIn',
        query: {
          hist : "Posting",
          searchWord : preWorkName,
          // searchWord: state.workName,
          infoMedia : workMedia,
          workId : preWorkId,
          firstPostFlag : firstPostFlag,
        }
      })
    } else { //!oriQueryの場合。URL直接指定やリロード時
      router.replace({
        pathname: '/menu/search',
        query: {
          hist : "Posting",
        }
      })
    }
    //setStandbyState(true)
  },[])
  
  // console.log(JSON.stringify(checkBoxState)+"+checkBoxState@J chuu")
  // console.log(checkBoxState+"+checkBoxState chuu")

  const postButtonClicked = async(pushIsPublic) => {
    //バリデーション
    if(workMedia == ""){
      alert("分類を入力してください！")
      return false
    }
    if(workName == ""){
      alert("作品名を入力してください！")
      return false
    }

    if((workScore <= -1 || workScore >= 101 ) && workScore != ""){
      alert("100以下、0以上を入力してください！")
      return false
    }

    console.log(pushIsPublic+"+pushIsPublic")

    //チェックされた項目だけを配列として抽出する
    let validCheckBosState = false
    let goCheckBoxState = []
    Object.keys(checkBoxState).map((map,index) => {
      if(checkBoxState[map] == true){
        console.log(map+"+map+"+index)
        console.log(categoryMap[map]+"+CategoryMap")
        // goCheckBoxState.push(categoryMap[map])
        goCheckBoxState =  [...goCheckBoxState,categoryMap[map]]
        validCheckBosState = true
      }
    })

    if(validCheckBosState == false){
      alert("カテゴリを選択してください！")
      return false
    }

    let goTagCheckBoxState = []
    Object.keys(tagCheckBox).map((map,index) => {
      if(tagCheckBox[map] == true){
        console.log(map+"+map+"+index)
        console.log(tagMap[map].key+"+tagMap")
        goTagCheckBoxState = [...goTagCheckBoxState,tagMap[map].key]
      }
    })

    //検索用トークンマップ作成
    const tokenMap = buildTokenMap(
      workName,
    )

    // ユーザに紐づく作品データをDBに登録(redux/works(db))
    // const workId = await RDDispatch(postWorkCreate(workName,workScore,goCheckBoxState,workComment,RdUserId))

    console.log(RdUserName+"+RdUserName a")
    // 作品の固有データをDBに登録
    // 新規登録なのでScoreは入力値のまま　*-*- (wInfo)
    await RDDispatch(postWInfoCreate( //セキュアなでーたがあるならapi下でやった方がいい。
      workName,
      workMedia,
      workScore,
      workWatchYear,
      workWatchTimes,
      RdUserId,
      RdUserName,
      goCheckBoxState,
      goTagCheckBoxState,
      workComment,
      pushIsPublic,
      // setIsPublic((preIsPublic) => {return preIsPublic}),
      isSpoiler,
      isLiked,
      tokenMap,
      state,
      firstPostFlag,
      //ここに編集権文字者しか編集できないデータを入れたい。
      preWorkId,
    )).then( async(workId) => {
      console.log(workId+"+workId posting m")
      // 登録したユーザのDB情報に登録した作品のWorkIdを追加(postedWorksId(db))
      await RDDispatch(addPostedWork( //workIdを使ってるからPromise.allにはできない。
        RdUserId,
        workId,
        workName,
        workMedia,
        pushIsPublic,
        isSpoiler,
        isLiked,
        workScore,
        workWatchYear,
        workWatchTimes,
        goCheckBoxState,
        goTagCheckBoxState,
        workComment,
        firstPostFlag,
      ))

      router.push({
        pathname: '/post/'+workId+'/'+RdUserId,
      })
    }).catch((error) => {
      alert('failed get workId')
      throw new Error(error)
    })
  }

  console.log(JSON.stringify(tagCheckBox)+"+tagCheckBox")

  // if(!isReady || !standbyState){
  if(isLoading || !oriQuery || !RdIsSignin){
    return(
      <GLoading />
    )
  } else {
    return (
      <>
        <ApplicationBar title="新規登録"/>

        <HighLightBar>作品情報</HighLightBar>

        {(firstPostFlag == FIRST_POSTED_FLAG_ANOTHER_ONLY_POSTED ||
          firstPostFlag == FIRST_POSTED_FLAG_I_POSTED ) && (
          <>

            <ItemExplanationSet middleTitle="作品名" text={
              <Link
                href="/post/[postWorkId]/"
                as={`/post/${preWorkId}/`}
                >
                {workName}
              </Link>
            }/>

            <ItemExplanationSet middleTitle="メディア" text={workMedia}/>

            {/* <TitleSpacing container item xs={12}>
              <Grid container item xs={4} alignItems={"center"}>
              <MiddleTitle>
                    {"カテゴリ"}
              </MiddleTitle>
              </Grid>
              <Grid container item xs={8} alignItems={"center"} */}
            <ItemExplanationSet middleTitle="カテゴリ" text={
              Object.keys(checkBoxState).map((map) => (
                <>{checkBoxState[map] == true && (
                  // <Grid container item xs={5} 
                  //   justify={"flex-start"}
                  //   sx={classes.h4LinkTag}
                  // >
                  <>  {categoryMap[map]}</>
                  // </Grid>
                )}</>
              ))
            }/>
{/* 
                    {Object.keys(checkBoxState).map((map) => (
                      <>{checkBoxState[map] == true && (
                        <Grid container item xs={5} 
                          justify={"flex-start"}
                          sx={classes.h4LinkTag}
                        >
                          {categoryMap[map]}
                        </Grid>
                      )}</>
                    ))}
              </Grid>
            </TitleSpacing> */}
          </>
        )}
          
        {/* // 新規登録 */}
        {firstPostFlag == FIRST_POSTED_FLAG_NOT_POSTED && (
          <>
            {/* <h2>新規登録/評価</h2> */}
            <ApplicationBar title="新規登録/評価"/>

            <ItemExplanationSet middleTitle="作品名" titleFlex="center" text={
              <TextField
                fullWidth={true} 
                // label={<a sx={classes.inputHissu}>(作品情報は全項目 必須/投稿後編集不可)</a>} 
                multiline={false} required={true} variant={"standard"}
                rows={1}  value={workName} type={"text"} onChange={inputWorkName}
              />
            }/>
            <ItemExplanationSet middleTitle="メディア" titleFlex="center" text={
              <FormControl variant="standard" sx={classes.mediaFormControl}>
                {/* <InputLabel id="controlled-open-select-label">
                  (必須)
                </InputLabel> */}
                <NativeSelect
                  id="controlled-open-select"
                  // open={open}
                  // onClose={handleClose}
                  // onOpen={handleOpen}
                  value={workMedia}
                  onChange={handleChange}
                >
                  {/* <option aria-label="(必須)" value="" /> */}
                  <option value={""} style={{color : "red"}}>〈 必須 〉</option>

                  {Object.keys(bunruiMap).map((map) => (
                    <option value={bunruiMap[map]}>{bunruiMap[map]}</option>
                  ))}
                </NativeSelect>
              </FormControl>}
            />
            <ItemExplanationSet middleTitle="カテゴリ" titleFlex="flex-start" text={
              <>              
                {/* <a sx={classes.inputSmallHissu}>(必須)</a> */}
                <Grid container spacing={1} classes={{ root: classes.cateMasterGrid}}>
                  {Object.keys(checkBoxState).map((map) => (
                    <Grid
                      container item xs spacing={0}
                      sx={classes.secondTagItemGrid}
                    >
                      <Chip
                        size="small"
                        label={categoryMap[map]}
                        clickable
                        color={checkBoxState[map] ? "primary" : "default" }
                        variant={checkBoxState[map] ? "default" :"outlined"}
                        onClick={() => { return cateCheckHandleChange({
                          name : map ,
                          isClicked : checkBoxState[map]
                        })}}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            }/>
          </>
        )}

        <HighLightBar style={{marginTop:"1.8em"}}>評価</HighLightBar>

        <TitleSpacing container item xs={12}>
        <Grid container item xs={4} alignItems={"center"}>
          <MiddleTitle>
            Like
          </MiddleTitle>
        </Grid>

        <Grid container item xs={8} alignItems={"center"} sx={classes.likedIconPosition}>
          <FormControl>
            {isLiked
              ? <FavoriteIcon
                onClick={isLikedHandleChange}
                />
              : <FavoriteBorder
                onClick={isLikedHandleChange}
              />
            }
          </FormControl>
        </Grid>

        </TitleSpacing>

        <ItemExplanationSet middleTitle="採点" text={
          <TextField
            fullWidth={false} label={""} multiline={false} required={true} variant="standard"
            rows={1} value={workScore} type={"text"} onChange={inputWorkScore}
            inputProps={{min: 0, style: { textAlign: 'center' }}}
            sx={classes.ScorePosition}//.Muiを編集したい時はこれ。Part2  
            // sx={classes.ScorePosition}//.Muiを編集したい時はこれ。Part2  
          />
        }/>

        <ItemExplanationSet middleTitle="視聴年" titleFlex="center" text={
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={['year']}
              label="初回視聴年"
              maxDate={new Date()}
              value={workWatchYear}
              onChange={inputWorkWatchYear}
              renderInput={(params) => <TextField {...params} helperText={null} />}
            />
          </LocalizationProvider>
        }/>

        <ItemExplanationSet middleTitle="視聴回数" text={
          <FormControl 
            variant="standard"
            // sx={{ m: 1, minWidth: 30 }} 
            sx={classes.watchTimesPosition}
          >
            <NativeSelect
              value={workWatchTimes}
              onChange={inputWorkWatchTimes}
              // defaultValue={workWatchTimes} //適用されてない
            >
              <option value={1}>1回</option>
              <option value={2}>2回</option>
              <option value={3}>3回</option>
              <option value={4}>4回</option>
              <option value={5}>5回以上</option>
            </NativeSelect>
          </FormControl>
        }/>

        {/* <Grid container item xs={12} spacing={0} sx={classes.scorePosition}> */}
        {/* <TitleSpacing container item xs={12}> */}
          {/* <Grid container item xs={4} alignItems={"center"}> */}
            {/* <Typography sx={classes.h5WorksLikeTitle}>タグ</Typography>  */}
        {/* </Grid> */}
        <ItemExplanationSet
          middleTitle="タグ"
          titleFlex={
            Object.values(tagCheckBox).includes(true)
            ? "flex-start"
            : "flex-end"
          } 
          text=
          {<>
            {(() => {
            let postedTag = []
            for(let j = 0;j < Object.keys(tagMap).length;j++){
              if(tagCheckBox[Object.keys(tagMap)[j]]){
                postedTag = [...postedTag , 
                  <SCtagChip
                    size="small"
                    label={[tagMap[Object.keys(tagMap)[j]].key]}
                    // clickable
                    color="primary"
                    onDelete={() => { return tagCheckBoxHandleChange({
                      name : Object.keys(tagMap)[j] ,
                      isClicked : true
                    })}}
                  />
                ]
              } 
            }
            return <Grid
              container item xs spacing={0}
              sx={classes.firstTagItemGrid}
            > 
              {postedTag}
            </Grid>
            })()}
            <FormControl sx={classes.FCfreeWordSearchTag}>
              <Autocomplete
                PaperComponent={({ children }) => (
                  <Paper 
                    sx={{
                    // classes={{ // ❌
                        // option : { // ❌
                        '& .MuiAutocomplete-option' : {
                          minHeight : '0.7em!important', //デフォルトで大きい数値になっているから上書き
                          padding : '2px!important',
                      //   },
                      }
                    }}
                  >
                    {children}
                  </Paper>
                )}
                sx={{
                  '& .MuiAutocomplete-input' : { //適用
                    // color : "red",
                  },
                  '& .MuiInput-root' : { //適用
                    '& .MuiInput-input' : {
                      // padding : "20px",
                    },
                  },
                  // option : {
                  // // '& .MuiAutocomplete-option' : {
                  //   minHeight : '0.7em', //デフォルトで大きい数値になっているから上書き
                  //   padding : "2px",
                  // },
                  // '& .MuiAutocomplete-paper' : {             
                  //   '& .MuiInput-root' : {             
                  //     '& .MuiAutocomplete-listbox' : {
                  //       '& .MuiAutocomplete-option' : {
                  //         minHeight : '0.7em', //デフォルトで大きい数値になっているから上書き
                  //         padding : "2px",
                  //       }
                  //     }
                  //   }
                  // }
                }}
                // classes={{
                //   // option : {   
                //   '& .MuiAutocomplete-paper' : {             
                //     '& .MuiInput-root' : {             
                //       '& .MuiAutocomplete-listbox' : {
                //         '& .MuiAutocomplete-option' : {
                //           minHeight : '0.7em', //デフォルトで大きい数値になっているから上書き
                //           padding : "2px",
                //         }
                //       }
                //     }
                //   }
                // }}
                id="tagSearch"
                options={Object.values(tagMap)}
                getOptionLabel={(option) => option.key}
                clearOnEscape
                inputValue = {tagAutoCompleteValue}
                onInputChange = {(event,newInputValue,reason) => {
                  inputTagAutoCompleteValue(newInputValue,reason)
                }}
                onChange = {(event,selectedValue) => {
                  tagCheckBoxHandleChange({
                    name : selectedValue?.originalKey ,
                    isClicked : false
                  })
                  return true
                }}
                renderInput={(params) => 
                  <TextField {...params} label="タグを検索" margin="none" variant="standard"/>
                }
              />
            </FormControl>

            <Collapse in={showGenre} timeout={300}>
              <Grid container item spacing={0} justify={"flex-start"} alignItems="center">  
                <Button
                  sx={classes.tagAppeareButton} 
                  onClick={() => {
                    setShowGenre(!showGenre)
                }}> 
                  {(showGenre == true) ? "タグ候補を非表示" : null}
                </Button>
              </Grid>
            </Collapse>
          </>
        }
        />

        {/* タグ候補 表示部 */}
        <Collapse in={showGenre} timeout={1000}>
          <Grid container sx={classes.tagMasterGrid}>
            {(() => {
              let tagList = []
              let displayFlag = true
              
              for(let j = 0;j < Object.keys(tagMap).length;j++){
                tagList = [...tagList , 
                  <>

                    {(() => {
                      switch(j) {
                        case 0 : //ジャンル
                          console.log(displayFlag ? "true" +"+displayFlag@0" :　"false" + "+displayFlag@0")
                          displayFlag = true //→ついき：多分なくてもいい。
                          return <Grid container item xs={12} justify="center" sx={classes.inputTagKey }><h3 sx={classes.h3TagKey}>{tagExtraData.Genre.key}</h3></Grid>;
                        case showMoreGenre : 
                          // console.log(displayFlag ? "true" +"+displayFlag@showMoreGenre" : "false" +"+displayFlag@showMoreGenre")
                          // console.log(showMoreGenre+"+showMoreGenre") 
                          displayFlag = false
                          if(showMoreGenre != totalCountGenre){
                            break
                          }

                        case totalCountGenre : //印象
                          displayFlag = true
                          return <Grid container item xs={12} justify="center" classes={{ root: classes.inputTagKey }} ><h3 sx={classes.h3TagKey}>{tagExtraData.Impression.key}</h3></Grid>;
                        case showMoreImpression :
                          // console.log(j+"+showMoreImpression")
                          displayFlag = false
                          if(showMoreImpression != totalCountImpression){
                            break
                          }
                          
                        case totalCountImpression : // 原作
                          displayFlag = true
                          return <Grid container item xs={12} justify="center" sx={classes.inputTagKey }><h3 sx={classes.h3TagKey}>{tagExtraData.Original.key}</h3></Grid>;
                        case showMoreOriginal :
                            // case totalCountImpression + 5 :
                          // console.log(j+"+showMoreOriginal")
                          displayFlag = false                                
                          if(showMoreOriginal != (totalCountOriginal)){
                            break
                          }
                          
                        case totalCountOriginal : // 人
                          displayFlag = true
                          return <Grid container item xs={12} justify="center" sx={classes.inputTagKey} ><h3 sx={classes.h3TagKey}>{tagExtraData.Position.key}</h3></Grid>;
                        case showMorePosition :
                          // console.log(j+"+showMorePosition")
                          displayFlag = false
                          if(showMorePosition != (totalCountPosition)){
                            break
                          }
                        default :
                          break
                      }
                    })()}

                    {/* //チップ(タグ) 表示部 */}
                    <Collapse in={displayFlag} timeout={1000}>
                      <Grid
                        container item xs spacing={0}
                        sx={classes.secondTagItemGrid}
                      >
                        <SCtagChip
                          size="small"
                          label={[tagMap[Object.keys(tagMap)[j]].key]}
                          clickable
                          color={tagCheckBox[Object.keys(tagMap)[j]] ? "primary" : "default" }
                          onClick={() => { return tagCheckBoxHandleChange({
                            name : Object.keys(tagMap)[j] ,
                            isClicked : tagCheckBox[Object.keys(tagMap)[j]]
                          })}}
                        />
                      </Grid>
                    </Collapse>

                    {/* //Tag開閉処理部分 //もっと見る表示部分 */}
                    {(() => {
                      switch(j) {
                        case (showMoreGenre - 1) :
                          return (
                            <Grid container item spacing={0} justify={
                              (showMoreGenre != totalCountGenre) 
                                ? "flex-end" 
                                : "flex-start"
                              }
                              alignItems="flex-start"
                            >  
                              <Button onClick={() => {
                                // setShowMoreGenre(showMoreGenre + 3) 
                                setShowMoreGenre((preShowMoreGenre) => { 
                                  if(showMoreGenre != totalCountGenre){　 //全てが表示されていない
                                    preShowMoreGenre = preShowMoreGenre + ONE_CLICK_APPEARANCE_IN_POSTING
                                    console.log(preShowMoreGenre+"+preShowMoreGenre")
                                    console.log(totalCountGenre+"+totalCountGenre")
                                    if (preShowMoreGenre > (totalCountGenre)) {
                                      return totalCountGenre
                                    } else {
                                      console.log("preShowMoreGenre")
                                      return preShowMoreGenre
                                    }
                                  } else {// 現在Maxに達しているか
                                    return firstCheckBoxDisp
                                  }
                                })
                              }}> 
                                {(showMoreGenre == totalCountGenre) ? "　縮める" :  "もっと見る　"}
                              </Button>
                            </Grid>
                          )
                        case (showMoreImpression - 1) :
                          return (
                            <Grid container item spacing={0} justify={
                              (showMoreImpression != totalCountImpression)
                                ? "flex-end" 
                                : "flex-start"
                              }
                              alignItems="flex-start"
                            >  
                              <Button onClick={() => {
                                // setShowMoreGenre(showMoreGenre + 3) 
                                setShowMoreImpression((preShowMoreImpressions) => { 
                                  if(showMoreImpression != (totalCountImpression)){ //全てが表示されてるかいなか
                                    preShowMoreImpressions = preShowMoreImpressions + ONE_CLICK_APPEARANCE_IN_POSTING
                                    if (preShowMoreImpressions > (totalCountImpression)) {
                                        return totalCountImpression
                                    } else {
                                      return preShowMoreImpressions
                                    }
                                  } else {
                                    return (totalCountGenre + firstCheckBoxDisp)
                                  }
                                })
                              }}> 
                                {(showMoreImpression == (totalCountImpression) ) ? "　縮める" :  "もっと見る　"}
                              </Button>
                            </Grid>
                          )
                        // case (showMoreOriginal - 1) :
                        // return (
                        //   <Grid container item spacing={0} justify={
                        //     (showMoreOriginal != (totalCountOriginal))
                        //       ? "flex-end" 
                        //       : "flex-start"
                        //     }
                        //     alignItems="flex-start"
                        //   >  
                        //     <Button onClick={() => {
                        //       // setShowMoreGenre(showMoreGenre + 3) 
                        //       setShowMoreOriginal((preShowMoreOriginal) => { 
                        //         if(showMoreOriginal != (totalCountOriginal)){ //全てが表示されてるかいなか
                        //           preShowMoreOriginal = preShowMoreOriginal + ONE_CLICK_APPEARANCE_IN_POSTING
                        //           if (preShowMoreOriginal > (totalCountOriginal)) {
                        //               return (totalCountOriginal)
                        //           } else {
                        //             return preShowMoreOriginal
                        //           }
                        //         } else {
                        //           return (totalCountImpression + firstCheckBoxDisp)
                        //         }
                        //       })
                        //     }}> 
                        //       {(showMoreOriginal == (totalCountOriginal) ) ? "　縮める" :  "もっと見る　"}
                        //     </Button>
                        //   </Grid>
                        // )
                        case (showMorePosition - 1) :
                          return (
                            <Grid container item spacing={0} justify={
                              (showMorePosition != (totalCountPosition))
                                ? "flex-end" 
                                : "flex-start"
                              }
                              alignItems="flex-start"
                            >  
                              <Button onClick={() => {
                                // setShowMoreGenre(showMoreGenre + 3) 
                                setShowMorePosition((preShowMorePosition) => { 
                                  if(showMorePosition != (totalCountPosition)){ //全てが表示されてるかいなか
                                    preShowMorePosition = preShowMorePosition + ONE_CLICK_APPEARANCE_IN_POSTING
                                    if (preShowMorePosition > (totalCountPosition)) {
                                      console.log("retorun max ")
                                      return (totalCountPosition)
                                    } else {
                                      return preShowMorePosition
                                    }
                                  } else {
                                    return (totalCountOriginal + firstCheckBoxDisp)
                                  }
                                })
                              }}> 
                                {(showMorePosition == (totalCountPosition) ) ? "　縮める" :  "もっと見る　"}
                              </Button>
                            </Grid>
                          )
                        default :
                          break                          
                      }
                    })()}
                  </>
                ]
              }
              return <>{tagList}</>
            })()}
          </Grid>
        </Collapse>
        <ExplanationChildSet middleTitle="" text={
          <Grid container item spacing={0} justify={"flex-start"} alignItems="center">  
            <Button 
              sx={classes.tagAppeareButton}
              size="small"
              // variant="outlined"
              onClick={() => {
                setShowGenre(!showGenre)
            }}> 
              {(showGenre == true) ? "タグ候補を非表示" : "タグ候補を表示"}
            </Button>
          </Grid>
        }/>

        {/* <Grid container xs sx={classes.likedPosition}>
          <Typography sx={classes.h5WorksLikeTitle}>
            コメント
          </Typography>
        </Grid> */}
        <ItemExplanationSet middleTitle="コメント" text={
          <FormControl fullWidth>
            <TextField
            id="standard-multiline-flexible"
            fullWidth={true}
            // label={"コメント"}
            multiline variant="standard"
            // required={true}
            maxRows={4} value={workComment} type={"text"} onChange={inputWorkComment}
            // sx={classes.commentField} 
            placeholder={"感想、評価などを5000字以内"}
            />
          </FormControl>
        }/>
        <Grid container xs={12} sx={classes.netabareGrid}>
  　　　　　<FormControlLabel
            sx={classes.netabareLabel}
            control={
              <Switch size="small" checked={isSpoiler} onChange={isSpoilerHandleChange} />
            }
            label = {
              <span sx={classes.postingInlineNetabareText}>ネタバレ</span>
            }
            labelPlacement="bottom"
          />
        </Grid>

        {/* <Grid container xs={12} justify={"center"} sx={classes.postingCommentPosition}> */}
        {/* <Grid container xs={12} flexGrow={1} justify={"center"} sx={classes.postingCommentPosition}> */}

        {/* </Grid> */}

        {/* 投稿ボタン */}
        <PostingButton 
          changeIsPublic={changeIsPublic} 
          postButtonClicked={postButtonClicked}
        />

        {/* <h2>作品情報を入力(オプション)</h2> */}
        <HighLightBar style={{marginTop:"1.8em"}}> {"作品詳細情報"} </HighLightBar>
        <>
          {(state.winfoEditor == RdUserId || firstPostFlag == FIRST_POSTED_FLAG_NOT_POSTED)
            ? <>
              <ItemExplanationSet middleTitle="作品情報" titleFlex={"center"} text={
                <TextField
                  fullWidth={true} multiline variant="standard"
                  maxRows={4} value={state.winfoInfomation} type={"text"} onChange={inputWinfoInfomation}
                  placeholder={"作品のストーリーや概要など"}
                />}
              />
              <ItemExplanationSet middleTitle="作成関係者" titleFlex={"flex-end"} text={
              <Grid item container xs={12} sx={classes.postingWinfoCreator}>
                <Grid item container xs={4} justify={"center"}>
                  <FormControl sx={classes.winfoCreatorFormControl}>
                    <InputLabel id="demo-controlled-open-select-label">分類</InputLabel>
                    <NativeSelect
                      id="NativeSelect-winfoCreator"
                      value={winfoOneCreatorKind}
                      onChange={inputWinfoOneCreatorKind}
                    >
                      <option aria-label="未選択" value="" />
                      {Object.keys(winfoCreatorList).map((map) => (
                        <option value={winfoCreatorList[map]}>
                          {winfoCreatorList[map]}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>

                </Grid>
                <Grid item container xs={5} >
                  <TextField
                    id="standard-multiline-flexible"
                    fullWidth={true} label={"名称"} multiline variant="standard"
                    maxRows={4} 
                    value={winfoOneCreatorName} 
                    type={"text"} 
                    onChange={inputWinfoOneCreatorName}
                    sx={classes.commentField} 
                    // placeholder={"名称"}
                  />
                </Grid>
                <Grid item container xs={1} justify="flexStart" alignItems="center">
                  <FormControl>
                    <AddCircleOutlineIcon
                      onClick={inputWinfoCreatorAdd}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            }/>
              <Grid item container xs={12} justify="center" alignItems="center">
                <DragDropContext onDragEnd={winfoCreatorHandleOnDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided,snapshot) => (
                      // <RootRef rootRef={provided.innerRef}>
                      <List 
                        ref={provided.innerRef} 
                        sx={classes.winfoCreatorList}
                      >
                        {state.winfoCreator.map(({id , kind, name }, index) => {
                          return (
                            <Draggable key={id} draggableId={id} index={index}>
                              {(provided,snapshot) => (
                                // <RootRef rootRef={provided.innerRef}>
                                  <ListItem
                                    ref={provided.innerRef} 
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={classes.winfoCreatorListItems}
                                  >
                                    <Grid container xs>
                                    {/* <Grid container xs justyfy="flexStart"> */}
                                      <Grid container item xs={2} justify="flex-end">
                                        <ListItemIcon
                                          onClick={() => {
                                            console.log("Clicked winfoEdit")
                                            setWinfoOneCreatorDialogKind(kind)
                                            setWinfoOneCreatorDialogName(name)
                                            setWinfoOneCreatorDialogIndex(index)
                                            setWinfoOneCreatorDialogId(id)
                                            handleClickOpenCreatorDialog()
                                          }}
                                        >
                                          <IconButton
                                            sx={classes.iconButton}  
                                          >
                                            <EditIcon/>
                                          </IconButton>
                                        </ListItemIcon>
                                      </Grid>
                                      <Grid container item xs={10} alignItems="center">
                                        <ListItemText 
                                          sx={classes.displayText}
                                          primary={kind+"  /  "+name}
                                        />
                                      </Grid>
                                    </Grid>
                                </ListItem>
                                // </RootRef>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </List>
                      // </RootRef>
                    )}
                  </Droppable>
                </DragDropContext>
              </Grid>

              <Dialog open={openCreatorDialog} onClose={handleCloseCreatorDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">項目を編集</DialogTitle>
                <DialogContent>
                  <Grid item container xs={12} justify={"center"} sx={classes.postingWinfoCreatorDialog}>
                    <Grid item container xs={4} >
                      <FormControl sx={classes.winfoCreatorFormControl}>
                        <InputLabel id="demo-controlled-open-select-label">分類</InputLabel>
                        <NativeSelect
                          id="NativeSelect-winfoCreator"
                          value={winfoOneCreatorDialogKind}
                          onChange={inputWinfoOneCreatorDialogKind}
                        >
                          <option aria-label="未選択" value="" />
                          {Object.keys(winfoCreatorList).map((map) => (
                            <option value={winfoCreatorList[map]}>
                              {winfoCreatorList[map]}
                            </option>
                          ))}
                        </NativeSelect>
                      </FormControl>
                    </Grid>
                    <Grid item container xs={5} >
                      <TextField
                        id="standard-multiline-flexible"
                        fullWidth={true} label={"作成関係者"} multiline variant="standard"
                        maxRows={4} 
                        value={winfoOneCreatorDialogName} 
                        type={"text"} 
                        onChange={inputWinfoOneCreatorDialogName}
                        sx={classes.commentField} 
                        placeholder={"名称"}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <IconButton
                    sx={classes.winfoCreatorNodalDeleteIcon}
                    onClick={() => {
                      console.log("delete clicked")
                      inputWinfoCreatorDelete()
                      handleCloseCreatorDialog()
                    }}
                  >
                  <DeleteIcon fontSize="small"/>
                  </IconButton>

                  <Button 
                    onClick={handleCloseCreatorDialog}
                    color="primary"
                    sx={classes.winfoCreatorNodalCancelUpdateButton}
                  >
                    キャンセル
                  </Button>
                  <Button 
                    onClick={() => {
                      inputWinfoCreatorUpdate()
                      handleCloseCreatorDialog()
                    }}
                    color="primary"
                    sx={classes.winfoCreatorNodalCancelUpdateButton}
                  >
                      更新
                  </Button>
                </DialogActions>
              </Dialog>
              <Grid item container xs={12} justify={"center"} sx={classes.postingWinfoOneData}>
                <FormControl sx={classes.winfoCreatorFormControl}>
                  <InputLabel id="demo-controlled-open-country-select-label">制作国</InputLabel>
                  <NativeSelect
                    id="NativeSelect-winfoCreator-country"
                    value={state.winfoCountry}
                    onChange={inputWinfoCountry}
                  >
                    <option aria-label="未選択" value="" />
                    {Object.keys(countryList).map((map) => (
                      <option value={countryList[map]}>
                        {countryList[map]}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                {/* <TextField
                  id="standard-multiline-flexible"
                  fullWidth={true} label={"国"} multiline variant="standard"
                  // required={true}
                  maxRows={4} value={state.winfoCountry} type={"text"} onChange={inputWinfoCountry}
                  sx={classes.commentField} 
                  placeholder={"制作国"}
                /> */}
              </Grid>
              <Grid item container xs={12} justify={"flex-start"} sx={classes.postingWinfoOneData}>
                {/* <DesktopDatePicker
                  label="リリース"
                  inputFormat="MM/dd/yyyy"
                  value={state.winfoStart}
                  onChange={inputWinfoStart}
                  renderInput={(params) => <TextField {...params} />}
                /> */}
                <TextField
                  InputLabelProps={{ shrink: true }} 
                  id="standard-multiline-flexible"
                  fullWidth={false} label={"リリース"} variant="standard"
                  // required={true}
                  value={state.winfoStart} type={"date"} onChange={inputWinfoStart}
                  sx={classes.commentField} 
                  placeholder={"リリース時期"}
                />
              </Grid>
              <Grid item container xs={12} justify={"flex-start"} sx={classes.postingWinfoOneData}>
                <TextField
                  InputLabelProps={{ shrink: true }} 
                  id="standard-multiline-flexible"
                  fullWidth={false} label={"完結"} variant="standard"
                  // required={true}
                  value={state.winfoFinish} type={"date"} onChange={inputWinfoFinish}
                  sx={classes.commentField} 
                  placeholder={"完結した時期"}
                />
              </Grid>
              <Grid item container xs={12} justify={"center"} sx={classes.postingWinfoOneData}>
                <p>画像登録フォーム</p>
              </Grid>
              {/* Step2 */}
              {/* <Grid item container xs={12} justify={"center"} sx={classes.postingWinfoOneData}>
                <p>親選択フォーム</p>
              </Grid>
              <Grid item container xs={12} justify={"center"} sx={classes.postingWinfoOneData}>
                <p>子選択フォーム</p>
              </Grid>
              <Grid item container xs={12} justify={"center"} sx={classes.postingWinfoOneData}>
                <p>シリーズフォーム(選択と自由入力フォーム)</p>
              </Grid> */}
              {/* <Grid item container xs={12} justify={"center"} sx={classes.postingWinfoOneData}>
                <TextField
                  id="standard-multiline-flexible"
                  fullWidth={true} label={"主題歌"} multiline variant="standard"
                  // required={true}
                  maxRows={4} value={state.winfoMusic} type={"text"} onChange={inputWinfoMusic}
                  sx={classes.commentField} 
                  placeholder={"主題歌(登録と同時にworkIdが発行される?)"}
                />
              </Grid> */}
{/* 
              //////////////////主題歌 */}
              <Grid item container xs={12} sx={classes.postingWinfoCreator}>
                <Grid item container xs={4} justify={"center"}>
                  <FormControl sx={classes.winfoCreatorFormControl}>
                    <InputLabel id="demo-controlled-open-select-label">分類</InputLabel>
                    <NativeSelect
                      id="NativeSelect-winfoMusic"
                      value={winfoOneMusicKind}
                      onChange={inputWinfoOneMusicKind}
                    >
                      <option aria-label="未選択" value="" />
                      {Object.keys(winfoMusicList).map((map) => (
                        <option value={winfoMusicList[map]}>
                          {winfoMusicList[map]}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>

                </Grid>
                <Grid item container xs={5} >
                  <TextField
                    id="standard-multiline-flexible"
                    fullWidth={true} label={"楽曲"} multiline variant="standard"
                    maxRows={4} 
                    value={winfoOneMusicName} 
                    type={"text"} 
                    onChange={inputWinfoOneMusicName}
                    sx={classes.commentField} 
                    placeholder={"名称"}
                  />
                </Grid>
                <Grid item container xs={1} justify="flexStart" alignItems="center">
                  <FormControl>
                    <AddCircleOutlineIcon
                      onClick={inputWinfoMusicAdd}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              
              <Grid item container xs={12} justify="center" alignItems="center">
                <DragDropContext onDragEnd={winfoMusicHandleOnDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided,snapshot) => (
                      // <RootRef rootRef={provided.innerRef}>
                      <List 
                        ref={provided.innerRef} 
                        sx={classes.winfoCreatorList}
                      >
                        {state.winfoMusic.map(({id , kind, name }, index) => {
                          return (
                            <Draggable key={id} draggableId={id} index={index}>
                              {(provided,snapshot) => (
                                // <RootRef rootRef={provided.innerRef}>
                                  <ListItem
                                    ref={provided.innerRef} 
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={classes.winfoCreatorListItems}
                                  >
                                    <Grid container xs={12}
                                    >
                                    {/* <Grid container xs justyfy="flexStart"> */}
                                      <Grid container item xs={2} justify="flex-end">
                                        <ListItemIcon
                                          onClick={() => {
                                            console.log("Clicked winfoEdit")
                                            setWinfoOneMusicDialogKind(kind)
                                            setWinfoOneMusicDialogName(name)
                                            setWinfoOneMusicDialogIndex(index)
                                            setWinfoOneMusicDialogId(id)
                                            handleClickOpenMusicDialog()
                                          }}
                                        >
                                          <IconButton
                                            sx={classes.iconButton}  
                                          >
                                            <EditIcon/>
                                          </IconButton>
                                        </ListItemIcon>
                                      </Grid>
                                      <Grid container item xs={10} alignItems="center">
                                        <ListItemText 
                                          sx={classes.displayText}
                                          primary={kind+"  /  "+name}
                                        />
                                      </Grid>
                                    </Grid>
                                </ListItem>
                                // </RootRef>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </List>
                      // </RootRef>
                    )}
                  </Droppable>
                </DragDropContext>
              </Grid>          

              <Dialog open={openMusicDialog} onClose={handleCloseMusicDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">項目を編集</DialogTitle>
                <DialogContent>
                  <Grid item container xs={12} justify={"center"} sx={classes.postingwinfoCreatorDialog}>
                    <Grid item container xs={4} >
                      <FormControl sx={classes.winfoCreatorFormControl}>
                        <InputLabel id="demo-controlled-open-select-label">分類</InputLabel>
                        <NativeSelect
                          id="NativeSelect-winfoMusic"
                          value={winfoOneMusicDialogKind}
                          onChange={inputWinfoOneMusicDialogKind}
                        >
                          <option aria-label="未選択" value="" />
                          {Object.keys(winfoMusicList).map((map) => (
                            <option value={winfoMusicList[map]}>
                              {winfoMusicList[map]}
                            </option>
                          ))}
                        </NativeSelect>
                      </FormControl>
                    </Grid>
                    <Grid item container xs={5} >
                      <TextField
                        id="standard-multiline-flexible"
                        fullWidth={true} label={"作成関係者"} multiline variant="standard"
                        maxRows={4} 
                        value={winfoOneMusicDialogName} 
                        type={"text"} 
                        onChange={inputWinfoOneMusicDialogName}
                        sx={classes.commentField} 
                        placeholder={"名称"}
                      />
                    </Grid>
                  </Grid>

                </DialogContent>

                <DialogActions>
                  <IconButton
                    sx={classes.winfoCreatorNodalDeleteIcon}
                    onClick={() => {
                      console.log("delete clicked")
                      inputWinfoMusicDelete()
                      handleCloseMusicDialog()
                    }}
                  >
                  <DeleteIcon fontSize="small"/>
                  </IconButton>

                  <Button 
                    onClick={handleCloseMusicDialog}
                    color="primary"
                    sx={classes.winfoCreatorNodalCancelUpdateButton}
                  >
                    キャンセル
                  </Button>
                  <Button 
                    onClick={() => {
                      inputWinfoMusicUpdate()
                      handleCloseMusicDialog()
                    }}
                    color="primary"
                    sx={classes.winfoCreatorNodalCancelUpdateButton}
                  >
                      更新
                  </Button>
                </DialogActions>
              </Dialog>

              {/* <Grid item container xs={12} justify={"center"} sx={classes.postingWinfoOneData}>
                <TextField
                  id="standard-multiline-flexible"
                  fullWidth={false} label={"ページ数"} variant="standard"
                  // required={true}
                  inputProps={{min: 0, style: { textAlign: 'center' }}}
                  value={state.winfoPages} type={"text"} onChange={inputWinfoPages}
                  sx={classes.commentField} 
                  placeholder={"数字入力"}
                />
              </Grid>
              <Grid item container xs={12} justify={"center"} sx={classes.postingWinfoOneData}>
                <TextField
                  id="standard-multiline-flexible"
                  fullWidth={false} label={"時間(分)"} variant="standard"
                  inputProps={{min: 0, style: { textAlign: 'center' }}}
                  // required={true}
                  value={state.winfoMinutes} type={"text"} onChange={inputWinfoMinutes}
                  sx={classes.commentField} 
                  placeholder={"数字入力"}
                />
              </Grid> */}
            </>
            : <>
              <ItemExplanationSet middleTitle="作品情報" text=
                {state.winfoInfomation ? state.winfoInfomation : "未投稿"}
              />

              <ItemExplanationSet middleTitle="作成関係者" text=
                {state.winfoCreator.length 
                  ? state.winfoCreator.map((map) => (
                    <><ExplanationTextDefault>
                      {map.kind+` `+map.name}
                    </ExplanationTextDefault></>
                  ))
                  : "投稿なし"
                }
              />

              <ItemExplanationSet middleTitle="制作国" text=
                {state.winfoCountry ? state.winfoCountry : "未投稿"}
              />

              <ItemExplanationSet middleTitle="リリース" text=
                {state.winfoStart ? state.winfoStart : "未投稿"}
              />
              
              <ItemExplanationSet middleTitle="完結" text=
                {state.winfoFinish ? state.winfoFinish : "未投稿"}
              />

              <ItemExplanationSet middleTitle="主題歌" text=
  
              {state.winfoCreator.length 
                ? state.winfoMusic.map((map) => { return (
                  <ExplanationTextDefault>
                    {map.kind+` `+map.name}
                  </ExplanationTextDefault>
                )})
                : <ExplanationTextDefault>{"未登録"}</ExplanationTextDefault>
              }/>

              {/* 以下４項目は運用に関して再考 */}
              {/* <p>ページ数:{state.winfoPages}</p>
              <p>時間:{state.winfoMinutes}</p>
              <p>統計情報:{state.statisticsData}</p>
              <p>プラットフォーム:{state.winfoPlatform}</p> */}

            {/* 以下２つはS2
            <p>親:{state.winfoParent == {} ? state.winfoParent : "no parent data"}</p>
            <p>子:{state.winfoChild}</p> */}

            </>
          }
          {/* 投稿ボタン */}
          <PostingButton 
            changeIsPublic={changeIsPublic} 
            postButtonClicked={postButtonClicked}
          />
        </>
        {/* <p>※新規登録なので、作品情報もオプションで入力してもらうようにする</p> */}

        {(firstPostFlag != FIRST_POSTED_FLAG_NOT_POSTED && !isPublic) ? <VisibilityOffIcon sx={classes.isPublicSignal}/> : null}
        {(firstPostFlag != FIRST_POSTED_FLAG_NOT_POSTED && isPublic) ? <PublicIcon sx={classes.isPublicSignal}/> : null}
          {/* </> */}
        <Footer />
      </>
    )
  }
}

export default Posting