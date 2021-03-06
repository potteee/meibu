import React, {useState, useEffect, useCallback,useReducer} from 'react'
import { PrimaryButton,TextInput ,CheckIconBox} from "../../styles/UIkit"
import { H2CenterLine } from "src/styles/SC/shared/typografy/centerLine"

import {
  ONE_CLICK_APPEARANCE_IN_POSTING,
  FIRST_POSTED_FLAG_ANOTHER_ONLY_POSTED,
  FIRST_POSTED_FLAG_NOT_POSTED,
  FIRST_POSTED_FLAG_I_POSTED,
} from 'src/foundations/share/GlobalConstant'

//material UI
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import PublishIcon from '@material-ui/icons/Publish';
import Collapse from '@material-ui/core/Collapse';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import TextField from '@material-ui/core/TextField';
import TextField from '@mui/material/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import { ListItemIcon,ListItemSecondaryAction,IconButton } from '@material-ui/core';
import RootRef from "@material-ui/core/RootRef";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

// import DesktopDatePicker from '@material-ui/lab/DesktopDatePicker';

import clsx from 'clsx';
import Checkbox from '@material-ui/core/Checkbox';

///material icon 
import PublicIcon from '@material-ui/icons/Public';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';


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

import { db, FirebaseTimestamp } from "../../firebase/index";

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
import { fontSize, width } from '@material-ui/system'
import { isConditionalExpression } from 'typescript'

const useStyles = makeStyles((theme) => ({
  autoCompleteStyle : {
    // '$root.MuiAutocomplete-option &' : {
      padding : "0px",
      minHeight : "0.7em",
      // minHeight : "30px",
    // }
  },
  autoCompleteStylePop : {
    maxHeight : "12em",
  },
  button: {
    // display: 'block', 
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  postingH2: {
    margin : "20px 0px 0px 0px",
  },
  postingInlineH2: {
    display : "inline", //??????????????????
    // padding : "30px 0px 0px 0px", //margin,paddin????????????
    position : "relative",
    top : 10,
  },
  postingInlineNetabareBox: {
    display : "inline",
    // padding : "30px 0px 0px 0px", //margin,paddin????????????
    position : "relative",
    top : 5,
    left : 20,
  },
  postingInlineNetabareText: {
    fontSize : "10px",
  },
  postingNetabarePosition: {
    position : "relative",
    justifyContent:"center",
    alignItems:"flex-end",
    maxWidth : 630,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
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
  postingWinfoCreatorList: {
    // width: '100%',
    maxWidth: "70%",
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
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
    // margin: theme.spacing(1),
    margin : "0px 0px 4px 0px",
    minWidth: 120,
  },
  winfoCreatorFormControl: {
    // margin: theme.spacing(1),
    margin : "0px 0px 0px 0px",
    // minWidth: 120,
  },
  tagMasterGrid: {
    // position : "relative",
    justifyContent : "space-evenly",
    // justifyContent : "space-evenly"
  },
  cateMasterGrid: {
    // position : "relative",
    justifyContent : "space-between",
    // justifyContent : "space-evenly"
  },
  cateItemGrid: {
    position : "relative",
  },
  firstTagItemGrid: {
    position : "relative",
    top : 6,
    marginBottom : 14,
    justifyContent : "center",
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  secondTagItemGrid: {
    justifyContent : "center",
    '& > *': {
      margin: theme.spacing(0.5),
    },
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
  h5WorksTitle: {
    margin : "9px 0px 0px 0px",
    color : "#393e4f", //??????????????????
    fontSize : "0.8em",
  },
  detailWorksInfomation: {
    fontSize : "1.3em",
  },
  h3WorksTitle: {
    margin : "9px 0px 0px 0px",
    color : "#393e4f", //??????????????????
    fontSize : "1.2em",
    fontWeight : "bold",
  },
  h5WorksLikeTitle: {
    margin : "9px 0px 0px 0px",
    color : "#393e4f", //??????????????????
    fontSize : "0.8em",
  },
  likedPosition: {
    justifyContent : "center",
    alignItems : "center",
    flexDirection : "column",
  },
  scorePosition: {
    justifyContent : "center",
    alignItems : "center",
    flexDirection : "column",
  },
  likedIconPosition: {
    position : "relative",
    marginBottom : "5px",
    top : -5,
  },

  h4LinkTag: {
    fontSize : "12.5px",
    textDecoration: 'underline',
    margin : "0px 4px",
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
  FCtensuu: {
    maxWidth : 45,
    textAlign : "center",
  },
  textFieldInputProps: {
    textAlign : "center",
  },
  FCfreeWordSearchTag: {
    margin : "0px 0px 4px 0px",
    minWidth : "14em",
  },
  freeWordSearchTag: {
    position : "relative",
    top : -10,
    justifyContent : "center",
    alignItems : "center",
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
}))

//???????????????????????????
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
  let putState = {...state,...action.payload} ///?????????????????????????????????????????????????????????????????????????????????
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

// ?????????????????????
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
  const classes = useStyles();

  const asPath = router.asPath // pathName??????URL????????????/post/posting)????????????
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
    if(hist == "SignIn"){ // ???????????????????????????????????????????????????
      firstPostFlag = preWorkId 
      ? Object.keys(RdAssessmentWorks).includes(preWorkId) 
        ? 2 //????????????
        : 0 //????????????????????????
      : 1 //????????????
    }
  } else {
    console.log("no oriQuery")
  }

  //useReduce
  const [state,dispatch] = useReducer(reducer, initialState)

  //useState

  ////input
  const [workName, setWorkName] = useState(preWorkName) //??????

  const [workMedia, setWorkMedia] = useState(qInfoMedia); //??????
  const [open, setOpen] = useState(false);

  const [workScore, setWorkScore] = useState("")
  const [workComment, setWorkComment] = useState("")
  
  const [showGenre, setShowGenre] = useState(false) //??????
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
  const changeIsPublic = useCallback((state) => {
    setIsPublic(state)
  }, [])

  const inputWorkName = useCallback((event) => {
    setWorkName(event.target.value)
  }, [])
  
  const inputWorkScore = useCallback((event) => {
    // const valueOfNumber = 
    // console.log(valueOfNumber+"valueOfNumber@posting")
    setWorkScore(textToNumber(event.target.value))
  },[workScore])

  const handleSliderChange = useCallback((event, newValue) => {
    setWorkScore(newValue)
    // console.log("handleSliderChange")
  },[workScore])

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
    setTagCheckBox({...tagCheckBox, [name] : !isClicked})
  },[tagCheckBox])
  
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

  //?????????????????????????????????????????????
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
      index: state.winfoCreator.length,//????????????????????????index??????????????????????????????????????????????????????????????????
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
      id : winfoOneCreatorDialogId,///??????????????????????????????
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
    
    //???????????????????????????????????????
    const editArrayLocation = state.winfoCreator.findIndex(({index}) => 
      index === winfoOneCreatorDialogIndex
    )

    if(editArrayLocation == -1){
      alert("editArrayLocation is -1")
    }

    var tmpArray = state.winfoCreator
    
    //?????????????????????????????????????????????????????????
    tmpArray[editArrayLocation] = {...item} 
    
    console.log(editArrayLocation+"+editArrayLocation")
    console.log(JSON.stringify(tmpArray[editArrayLocation])+"+tmpArray[editArrayLocation]")

    //???????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
    //???????????????????????????????????????
    const editArrayLocation = state.winfoCreator.findIndex(({index}) => 
      index === winfoOneCreatorDialogIndex
    )

    var tmpArray = state.winfoCreator
    
    //?????????????????????????????????????????????????????????
    tmpArray.splice(editArrayLocation, 1) //?????????????????????

    for(let i = editArrayLocation;i < state.winfoCreator.length - 1;i++){
      console.log(JSON.stringify(tmpArray[i])+"tmpArray[i]@J");
      tmpArray[i].index = i
      // tmpArray[i].index = wi_nfoOneCreatorDialogIndex
      console.log(tmpArray[i].index+"+tmpArray[i].index")
    }

    //???????????????????????????????????????
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
      index: state.winfoMusic.length,//????????????????????????index??????????????????????????????????????????????????????????????????
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
      id : winfoOneMusicDialogId,///??????????????????????????????
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
    
    //???????????????????????????????????????
    const editArrayLocation = state.winfoMusic.findIndex(({index}) => 
      index === winfoOneMusicDialogIndex
    )

    if(editArrayLocation == -1){
      alert("editArrayLocation is -1")
    }

    var tmpArray = state.winfoMusic
    
    //?????????????????????????????????????????????????????????
    tmpArray[editArrayLocation] = {...item} 
    
    console.log(editArrayLocation+"+editArrayLocation")
    console.log(JSON.stringify(tmpArray[editArrayLocation])+"+tmpArray[editArrayLocation]")

    //???????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
    //???????????????????????????????????????
    const editArrayLocation = state.winfoMusic.findIndex(({index}) => 
      index === winfoOneMusicDialogIndex
    )

    var tmpArray = state.winfoMusic
    
    //?????????????????????????????????????????????????????????
    tmpArray.splice(editArrayLocation, 1) //?????????????????????

    for(let i = editArrayLocation;i < state.winfoMusic.length - 1;i++){
      console.log(JSON.stringify(tmpArray[i])+"tmpArray[i]@J");
      tmpArray[i].index = i
      // tmpArray[i].index = wi_nfoOneMusicDialogIndex
      console.log(tmpArray[i].index+"+tmpArray[i].index")
    }

    //???????????????????????????????????????
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

    if(result.destination === null){ //droppable??????????????????????????????null?????????
      console.log("result.destination.index is null")
      return false
    }

    const items = Array.from(state.winfoCreator);

    //?????????????????????????????????reorderedItem???????????????????????????????????????
    const [reorderedItem] = items.splice(result.source.index, 1);
    
    //???????????????????????????
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

    if(result.destination === null){ //droppable??????????????????????????????null?????????
      console.log("result.destination.index is null")
      return false
    }

    const items = Array.from(state.winfoMusic);

    //?????????????????????????????????reorderedItem???????????????????????????????????????
    const [reorderedItem] = items.splice(result.source.index, 1);
    
    //???????????????????????????
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
???},[isReady])

  useEffect(() => {
    if(oriQuery && RdIsSignin){
      (async() => {

        if(preWorkName && qInfoMedia){
          setWorkName(preWorkName)
          setWorkMedia(qInfoMedia)
        }

        let DBdata = []
        // DB??????????????????????????????Promise.all?????????
        if(firstPostFlag == FIRST_POSTED_FLAG_I_POSTED ||
          firstPostFlag == FIRST_POSTED_FLAG_ANOTHER_ONLY_POSTED){
          DBdata = await Promise.all([
            db.collection('privateUsers').doc(RdUserId)
            .collection('postedWorksId').doc(preWorkId)
            .get()
            .then((snapshot) => {
              return snapshot.data()
            }).catch((error) => {
              alert('failed to get postedWorksId')
              throw new Error(error)
            })
          ,
            db.collection('wInfo').doc(preWorkId)
            .get()
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
              /////?????????(DB??????????????????????????????????????????)
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
          //   DBdata[1].winfoCreator.sort(ArraySort("index","desc")) //?????????index?????????????????????????????????????????????
          // )
        }

        //????????????????????????????????????????????????
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
            setWorkComment(DBdata[0].workComment)
            setIsPublic(DBdata[0].isPublic)
            setIsSpoiler(DBdata[0].isSpoiler)
            setIsLiked(DBdata[0].isLiked)

            if(state.winfoEditor == RdUserId ){//???????????????????????????
              console.log("I'm Editor")
              
            }

          } else {
            console.log(RdUserId+"+RdUserId")
          }
        }
        //?????????????????????????????????????????????
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
    } else if(!RdIsSignin && oriQuery) { //??????????????????????????????????????????????????????????????????
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
    } else { //!oriQuery????????????URL??????????????????????????????
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
    //?????????????????????
    if(workMedia == ""){
      alert("????????????????????????????????????")
      return false
    }
    if(workName == ""){
      alert("???????????????????????????????????????")
      return false
    }

    if((workScore <= -1 || workScore >= 101 ) && workScore != ""){
      alert("100?????????0????????????????????????????????????")
      return false
    }

    console.log(pushIsPublic+"+pushIsPublic")

    //???????????????????????????????????????????????????????????????
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
      alert("??????????????????????????????????????????")
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

    //????????????????????????????????????
    const tokenMap = buildTokenMap(
      workName,
    )

    // ???????????????????????????????????????DB?????????(redux/works(db))
    // const workId = await RDDispatch(postWorkCreate(workName,workScore,goCheckBoxState,workComment,RdUserId))

    console.log(RdUserName+"+RdUserName a")
    // ???????????????????????????DB?????????
    // ?????????????????????Score????????????????????????*-*- (wInfo)
    await RDDispatch(postWInfoCreate( //???????????????????????????????????????api??????????????????????????????
      workName,
      workMedia,
      workScore,
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
      //??????????????????????????????????????????????????????????????????????????????
      preWorkId,
    )).then( async(workId) => {
      console.log(workId+"+workId posting m")
      // ????????????????????????DB??????????????????????????????WorkId?????????(postedWorksId(db))
      await RDDispatch(addPostedWork( //workId?????????????????????Promise.all?????????????????????
        RdUserId,
        workId,
        workName,
        workMedia,
        pushIsPublic,
        isSpoiler,
        isLiked,
        workScore,
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

  // if(!isReady || !standbyState){
  if(isLoading || !oriQuery || !RdIsSignin){
    return(
      <GLoading />
    )
  } else {
    return (
      <>
        <ApplicationBar title="????????????"/>

        <H2CenterLine> {"????????????"} </H2CenterLine>

        {(firstPostFlag == FIRST_POSTED_FLAG_ANOTHER_ONLY_POSTED ||
          firstPostFlag == FIRST_POSTED_FLAG_I_POSTED ) && (
          <>
            <Grid container item xs={12} justify={"center"}>
              <Typography className={classes.h5WorksTitle}>
                {"?????????"}
              </Typography>                
            </Grid>
            <Grid container item xs={12} justify={"center"}>
              <div className={classes.h4LinkTag}>            
                <Link
                  href="/post/[postWorkId]/"
                  as={`/post/${preWorkId}/`}
                  >
                  {workName}
                </Link>
              </div>
            </Grid>

            <Grid container xs={12}>
              <Grid container item xs={6}>
                <Grid container item xs={12} justify={"center"}>
                  <Typography className={classes.h5WorksTitle}>
                    {/* {"??????"} */}
                    {"????????????"}
                  </Typography>
                </Grid>
                <Grid container item xs={12} justify={"center"}>
                  <div className={classes.h4LinkTag}>
                    {workMedia}
                  </div>
                </Grid>
              </Grid>

              <Grid container item xs={6} justifyContent={"center"}>
                <Grid container item xs={12} justify={"center"}>
                  <Typography className={classes.h5WorksTitle}>
                    {"????????????"}
                  </Typography>
                </Grid>
                <Grid container item xs={12} justify={"center"}>
                    {Object.keys(checkBoxState).map((map) => (
                      <>{checkBoxState[map] == true && (
                        <Grid container item xs={5} 
                          justify={"center"}
                          className={classes.h4LinkTag}
                        >
                          {categoryMap[map]}
                        </Grid>
                      )}</>
                    ))}
                </Grid>
              </Grid> 
            </Grid>
          </>
        )}
          
        {/* // ???????????? */}
        {firstPostFlag == FIRST_POSTED_FLAG_NOT_POSTED && (
          <>
            {/* <h2>????????????/??????</h2> */}
            <ApplicationBar title="????????????/??????"/>
            <h2 className={classes.postingH2}>?????????</h2>
              <TextInput
                fullWidth={true} label={<a className={classes.inputHissu}>(??????)</a>} multiline={false} required={true}
                rows={1}  value={workName} type={"text"} onChange={inputWorkName}
                // className={classes.FCHissu}
              />
            <h2 className={classes.postingH2}>????????????</h2>
            <FormControl className={classes.mediaFormControl}>
              <InputLabel id="demo-controlled-open-select-label"><a className={classes.inputHissu}>(??????)</a></InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={workMedia}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {Object.keys(bunruiMap).map((map) => (
                  <MenuItem value={bunruiMap[map]}>{bunruiMap[map]}</MenuItem>                
                ))}
              </Select>
            </FormControl>
            <h2 className={classes.postingH2}> ???????????????</h2> 
            <a className={classes.inputSmallHissu}>(??????)</a>
            {/* <FormGroup row>
              {Object.keys(categoryMap).map((map)=> (
                <Grid container item xs={4} sm={3} md={2} spacing={0} 
                  // <Grid container item xs={4} md={3} lg={2} spacing={0}
                  classes={{root: classes.cateItemGrid}} 
                  justify="space-evenly">
                  <FormControlLabel
                      control={
                        <CheckIconBox
                          checked={checkBoxState[map]} onChange={checkBoxHandleChange} 
                          name={map} color={"primary"}
                          classes={{ root: classes.cateInputCheck }}
                        />
                      }
                      classes={{root: classes.cateFormControlLabel}}
                      label = {categoryMap[map]}
                      labelPlacement="bottom"
                      lineHeight={1}
                  />
                </Grid>
              ))}
            </FormGroup> */}
            <Grid container spacing={1} classes={{ root: classes.cateMasterGrid}}>
              {Object.keys(checkBoxState).map((map) => (
                <Grid
                  container item xs spacing={0}
                  classes={{root: classes.secondTagItemGrid}}
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
        )}

        <H2CenterLine style={{marginTop:"10px"}}> ???????????? </H2CenterLine>

        <Grid container xs={12} spacing={0} className={classes.likedPosition}>
          <Grid item xs={6} className={classes.likedIconPosition}>
            <Typography className={classes.h5WorksLikeTitle}>
              {"Like"}
            </Typography>
          </Grid>
          <Grid item xs={6} className={classes.likedIconPosition}>
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
        </Grid>


        <Grid container xs={12} spacing={0} className={classes.scorePosition}>
          <Grid item xs={12}>
            <Typography className={classes.h5WorksLikeTitle}>
              {"??????"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth={true} label={""} multiline={false} required={true} variant="standard"
              // fullWidth={true} label={"??????(0-100)"} multiline={false} required={true}
              rows={1} value={workScore} type={"text"} onChange={inputWorkScore}
              inputProps={{min: 0, style: { textAlign: 'center' }}}
              // InputProps= {classes.textFieldInputProps} //.Mui?????????????????????????????????Part2  
              className = {classes.FCtensuu} //.Mui?????????????????????????????????Part2  
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={0} className={classes.scorePosition}>
          <Typography className={classes.h5WorksLikeTitle}>??????</Typography> 
        </Grid>
        {(() => {
          let postedTag = []
          for(let j = 0;j < Object.keys(tagMap).length;j++){
            // console.log(tagCheckBox[Object.keys(tagMap)[j]] ? "true+tagtag" : "false+tagtag")
            if(tagCheckBox[Object.keys(tagMap)[j]]){
              postedTag = [...postedTag , 
                <Chip
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
            classes={{root:classes.firstTagItemGrid}}
          > 
            {postedTag}
          </Grid>
        })()}

        {/* ??????????????????????????? */}
        <Grid container xs spacing={0} className={classes.freeWordSearchTag}>
          <FormControl className={classes.FCfreeWordSearchTag}>
            <Autocomplete
              classes={{
                option: classes.autoCompleteStyle,
                listbox: classes.autoCompleteStylePop
                }}//.Mui?????????????????????????????????
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
              renderInput={(params) => <TextField {...params} label="???????????????" margin="none" variant="standard"/>}
              />
          </FormControl>
        </Grid> 

        <Collapse in={showGenre} timeout={300}>
          <Grid container item spacing={0} justify={"center"} alignItems="center">  
            <Button onClick={() => {
              setShowGenre(!showGenre)
            }}> 
              {(showGenre == true) ? "????????????????????????" : null}
            </Button>
          </Grid>
        </Collapse>

        {/* ???????????? ????????? */}
        <FormGroup className={classes.tagFormGroup}>
          <FormControl margin="none">
            <Collapse in={showGenre} timeout={1000}>
              <Grid container classes={{ root: classes.tagMasterGrid}}>
                {(() => {
                  let tagList = []
                  let displayFlag = true
                  
                  for(let j = 0;j < Object.keys(tagMap).length;j++){
                    tagList = [...tagList , 
                      <>

                        {(() => {
                          switch(j) {
                            case 0 : //????????????
                              console.log(displayFlag ? "true" +"+displayFlag@0" :???"false" + "+displayFlag@0")
                              displayFlag = true //??????????????????????????????????????????
                              return <Grid container item xs={12} justify="center" classes={{ root: classes.inputTagKey }} ><h3 className={classes.h3TagKey}>{tagExtraData.Genre.key}</h3></Grid>;
                            case showMoreGenre : 
                              // console.log(displayFlag ? "true" +"+displayFlag@showMoreGenre" : "false" +"+displayFlag@showMoreGenre")
                              // console.log(showMoreGenre+"+showMoreGenre") 
                              displayFlag = false
                              if(showMoreGenre != totalCountGenre){
                                break
                              }

                            case totalCountGenre : //??????
                              displayFlag = true
                              return <Grid container item xs={12} justify="center" classes={{ root: classes.inputTagKey }} ><h3 className={classes.h3TagKey}>{tagExtraData.Impression.key}</h3></Grid>;
                            case showMoreImpression :
                              // console.log(j+"+showMoreImpression")
                              displayFlag = false
                              if(showMoreImpression != totalCountImpression){
                                break
                              }
                              
                            case totalCountImpression : // ??????
                              displayFlag = true
                              return <Grid container item xs={12} justify="center" classes={{ root: classes.inputTagKey }} ><h3 className={classes.h3TagKey}>{tagExtraData.Original.key}</h3></Grid>;
                            case showMoreOriginal :
                                // case totalCountImpression + 5 :
                              // console.log(j+"+showMoreOriginal")
                              displayFlag = false                                
                              if(showMoreOriginal != (totalCountOriginal)){
                                break
                              }
                              
                            case totalCountOriginal : // ???
                              displayFlag = true
                              return <Grid container item xs={12} justify="center" classes={{ root: classes.inputTagKey }} ><h3 className={classes.h3TagKey}>{tagExtraData.Position.key}</h3></Grid>;
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

                        {/* //?????????(??????) ????????? */}
                        <Collapse in={displayFlag} timeout={1000}>
                          <Grid
                            container item xs spacing={0}
                            classes={{root: classes.secondTagItemGrid}}
                          >
                            <Chip
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

                        {/* //Tag?????????????????? //??????????????????????????? */}
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
                                      if(showMoreGenre != totalCountGenre){??? //?????????????????????????????????
                                        preShowMoreGenre = preShowMoreGenre + ONE_CLICK_APPEARANCE_IN_POSTING
                                        console.log(preShowMoreGenre+"+preShowMoreGenre")
                                        console.log(totalCountGenre+"+totalCountGenre")
                                        if (preShowMoreGenre > (totalCountGenre)) {
                                          return totalCountGenre
                                        } else {
                                          console.log("preShowMoreGenre")
                                          return preShowMoreGenre
                                        }
                                      } else {// ??????Max?????????????????????
                                        return firstCheckBoxDisp
                                      }
                                    })
                                  }}> 
                                    {(showMoreGenre == totalCountGenre) ? "????????????" :  "??????????????????"}
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
                                      if(showMoreImpression != (totalCountImpression)){ //???????????????????????????????????????
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
                                    {(showMoreImpression == (totalCountImpression) ) ? "????????????" :  "??????????????????"}
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
                            //         if(showMoreOriginal != (totalCountOriginal)){ //???????????????????????????????????????
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
                            //       {(showMoreOriginal == (totalCountOriginal) ) ? "????????????" :  "??????????????????"}
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
                                      if(showMorePosition != (totalCountPosition)){ //???????????????????????????????????????
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
                                    {(showMorePosition == (totalCountPosition) ) ? "????????????" :  "??????????????????"}
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
          </FormControl>
        </FormGroup>

        <Grid container item spacing={0} justify={"center"} alignItems="center">  
          <Button onClick={() => {
            setShowGenre(!showGenre)
          }}> 
            {(showGenre == true) ? "????????????????????????" : "?????????????????????"}
          </Button>
        </Grid>

        <Grid container xs className={classes.likedPosition}>
          <Typography className={classes.h5WorksLikeTitle}>
            ????????????
          </Typography>
        </Grid>
        {/* <h2 className={classes.h3WorksTitle}>????????????</h2> */}
        {/* <h2 className={classes.postingInlineH2}>????????????</h2> */}

        <Grid container xs={12} className={classes.postingNetabarePosition}>
          <Grid container item xs={12} justify={"flex-end"}>
            <FormControlLabel
              control={
                <Switch size="small" checked={isSpoiler} onChange={isSpoilerHandleChange} />
              }
              label = {
                <span className={classes.postingInlineNetabareText}>????????????</span>
              }
              labelPlacement="bottom"
            />
          </Grid>
        </Grid>

        <Grid container xs={12} justify={"center"} className={classes.postingCommentPosition}>
        {/* <Grid container xs={12} flexGrow={1} justify={"center"} className={classes.postingCommentPosition}> */}
          <TextField
            id="standard-multiline-flexible"
            fullWidth={true} label={"????????????"} multiline variant="standard"
            // required={true}
            maxRows={4} value={workComment} type={"text"} onChange={inputWorkComment}
            className={classes.commentField} 
            placeholder={"????????????????????????5000?????????"}
          />
        </Grid>

        {/* ??????????????? */}
        <PostingButton 
          changeIsPublic={changeIsPublic} 
          postButtonClicked={postButtonClicked}
        />

        {/* <h2>?????????????????????(???????????????)</h2> */}
        <H2CenterLine> {"??????????????????"} </H2CenterLine>
        <>
          {(state.winfoEditor == RdUserId || firstPostFlag == FIRST_POSTED_FLAG_NOT_POSTED)
            ? <>
              <Grid container item xs={12} 
                // className={classes.postingWinfoCreator}
                justify="space-around"
              >
                <Grid container item xs={11} justify="center" 
                  className={classes.postingWinfoOneData}
                >
                  <TextField
                    fullWidth={true} label={"????????????"} multiline variant="standard"
                    maxRows={4} value={state.winfoInfomation} type={"text"} onChange={inputWinfoInfomation}
                    placeholder={"???????????????????????????????????????"}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12} className={classes.postingWinfoCreator}>
                <Grid item container xs={4} justify={"center"}>
                  <FormControl className={classes.winfoCreatorFormControl}>
                    <InputLabel id="demo-controlled-open-select-label">??????</InputLabel>
                    <NativeSelect
                      id="NativeSelect-winfoCreator"
                      value={winfoOneCreatorKind}
                      onChange={inputWinfoOneCreatorKind}
                    >
                      <option aria-label="?????????" value="" />
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
                    fullWidth={true} label={"???????????????"} multiline variant="standard"
                    maxRows={4} 
                    value={winfoOneCreatorName} 
                    type={"text"} 
                    onChange={inputWinfoOneCreatorName}
                    className={classes.commentField} 
                    placeholder={"??????"}
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
              
              <Grid item container xs={12} justify="center" alignItems="center">
                <DragDropContext onDragEnd={winfoCreatorHandleOnDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided,snapshot) => (
                      <RootRef rootRef={provided.innerRef}>
                      <List 
                        className={classes.winfoCreatorList}
                      >
                        {state.winfoCreator.map(({id , kind, name }, index) => {
                          return (
                            <Draggable key={id} draggableId={id} index={index}>
                              {(provided,snapshot) => (
                                <RootRef rootRef={provided.innerRef}>
                                  <ListItem
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={classes.winfoCreatorListItems}
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
                                            className={classes.iconButton}  
                                          >
                                            <EditIcon/>
                                          </IconButton>
                                        </ListItemIcon>
                                      </Grid>
                                      <Grid container item xs={10} alignItems="center">
                                        <ListItemText 
                                          className={classes.displayText}
                                          primary={kind+"  /  "+name}
                                        />
                                      </Grid>
                                    </Grid>
                                </ListItem>
                                </RootRef>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </List>
                      </RootRef>
                    )}
                  </Droppable>
                </DragDropContext>
              </Grid>          

              <Dialog open={openCreatorDialog} onClose={handleCloseCreatorDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">???????????????</DialogTitle>
                <DialogContent>
                  <Grid item container xs={12} justify={"center"} className={classes.postingWinfoCreatorDialog}>
                    <Grid item container xs={4} >
                      <FormControl className={classes.winfoCreatorFormControl}>
                        <InputLabel id="demo-controlled-open-select-label">??????</InputLabel>
                        <NativeSelect
                          id="NativeSelect-winfoCreator"
                          value={winfoOneCreatorDialogKind}
                          onChange={inputWinfoOneCreatorDialogKind}
                        >
                          <option aria-label="?????????" value="" />
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
                        fullWidth={true} label={"???????????????"} multiline variant="standard"
                        maxRows={4} 
                        value={winfoOneCreatorDialogName} 
                        type={"text"} 
                        onChange={inputWinfoOneCreatorDialogName}
                        className={classes.commentField} 
                        placeholder={"??????"}
                      />
                    </Grid>
                  </Grid>

                </DialogContent>
                <DialogActions>
                  <IconButton
                    className={classes.winfoCreatorNodalDeleteIcon}
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
                    className={classes.winfoCreatorNodalCancelUpdateButton}
                  >
                    ???????????????
                  </Button>
                  <Button 
                    onClick={() => {
                      inputWinfoCreatorUpdate()
                      handleCloseCreatorDialog()
                    }}
                    color="primary"
                    className={classes.winfoCreatorNodalCancelUpdateButton}
                  >
                      ??????
                  </Button>
                </DialogActions>
              </Dialog>

              <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                <FormControl className={classes.winfoCreatorFormControl}>
                  <InputLabel id="demo-controlled-open-country-select-label">?????????</InputLabel>
                  <NativeSelect
                    id="NativeSelect-winfoCreator-country"
                    value={state.winfoCountry}
                    onChange={inputWinfoCountry}
                  >
                    <option aria-label="?????????" value="" />
                    {Object.keys(countryList).map((map) => (
                      <option value={countryList[map]}>
                        {countryList[map]}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                {/* <TextField
                  id="standard-multiline-flexible"
                  fullWidth={true} label={"???"} multiline variant="standard"
                  // required={true}
                  maxRows={4} value={state.winfoCountry} type={"text"} onChange={inputWinfoCountry}
                  className={classes.commentField} 
                  placeholder={"?????????"}
                /> */}
              </Grid>
              <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                {/* <DesktopDatePicker
                  label="????????????"
                  inputFormat="MM/dd/yyyy"
                  value={state.winfoStart}
                  onChange={inputWinfoStart}
                  renderInput={(params) => <TextField {...params} />}
                /> */}
                <TextField
                  InputLabelProps={{ shrink: true }} 
                  id="standard-multiline-flexible"
                  fullWidth={false} label={"????????????"} variant="standard"
                  // required={true}
                  value={state.winfoStart} type={"date"} onChange={inputWinfoStart}
                  className={classes.commentField} 
                  placeholder={"??????????????????"}
                />
              </Grid>
              <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                <TextField
                  InputLabelProps={{ shrink: true }} 
                  id="standard-multiline-flexible"
                  fullWidth={false} label={"??????"} variant="standard"
                  // required={true}
                  value={state.winfoFinish} type={"date"} onChange={inputWinfoFinish}
                  className={classes.commentField} 
                  placeholder={"??????????????????"}
                />
              </Grid>
              <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                <p>????????????????????????</p>
              </Grid>

              {/* Step2 */}
              {/* <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                <p>?????????????????????</p>
              </Grid>
              <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                <p>?????????????????????</p>
              </Grid>
              <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                <p>????????????????????????(?????????????????????????????????)</p>
              </Grid> */}
              {/* <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                <TextField
                  id="standard-multiline-flexible"
                  fullWidth={true} label={"?????????"} multiline variant="standard"
                  // required={true}
                  maxRows={4} value={state.winfoMusic} type={"text"} onChange={inputWinfoMusic}
                  className={classes.commentField} 
                  placeholder={"?????????(??????????????????workId???????????????????)"}
                />
              </Grid> */}
{/* 
              //////////////////????????? */}
              <Grid item container xs={12} className={classes.postingWinfoCreator}>
                <Grid item container xs={4} justify={"center"}>
                  <FormControl className={classes.winfoCreatorFormControl}>
                    <InputLabel id="demo-controlled-open-select-label">??????</InputLabel>
                    <NativeSelect
                      id="NativeSelect-winfoMusic"
                      value={winfoOneMusicKind}
                      onChange={inputWinfoOneMusicKind}
                    >
                      <option aria-label="?????????" value="" />
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
                    fullWidth={true} label={"??????"} multiline variant="standard"
                    maxRows={4} 
                    value={winfoOneMusicName} 
                    type={"text"} 
                    onChange={inputWinfoOneMusicName}
                    className={classes.commentField} 
                    placeholder={"??????"}
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
                      <RootRef rootRef={provided.innerRef}>
                      <List 
                        className={classes.winfoCreatorList}
                      >
                        {state.winfoMusic.map(({id , kind, name }, index) => {
                          return (
                            <Draggable key={id} draggableId={id} index={index}>
                              {(provided,snapshot) => (
                                <RootRef rootRef={provided.innerRef}>
                                  <ListItem
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={classes.winfoCreatorListItems}
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
                                            className={classes.iconButton}  
                                          >
                                            <EditIcon/>
                                          </IconButton>
                                        </ListItemIcon>
                                      </Grid>
                                      <Grid container item xs={10} alignItems="center">
                                        <ListItemText 
                                          className={classes.displayText}
                                          primary={kind+"  /  "+name}
                                        />
                                      </Grid>
                                    </Grid>
                                </ListItem>
                                </RootRef>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </List>
                      </RootRef>
                    )}
                  </Droppable>
                </DragDropContext>
              </Grid>          

              <Dialog open={openMusicDialog} onClose={handleCloseMusicDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">???????????????</DialogTitle>
                <DialogContent>
                  <Grid item container xs={12} justify={"center"} className={classes.postingwinfoCreatorDialog}>
                    <Grid item container xs={4} >
                      <FormControl className={classes.winfoCreatorFormControl}>
                        <InputLabel id="demo-controlled-open-select-label">??????</InputLabel>
                        <NativeSelect
                          id="NativeSelect-winfoMusic"
                          value={winfoOneMusicDialogKind}
                          onChange={inputWinfoOneMusicDialogKind}
                        >
                          <option aria-label="?????????" value="" />
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
                        fullWidth={true} label={"???????????????"} multiline variant="standard"
                        maxRows={4} 
                        value={winfoOneMusicDialogName} 
                        type={"text"} 
                        onChange={inputWinfoOneMusicDialogName}
                        className={classes.commentField} 
                        placeholder={"??????"}
                      />
                    </Grid>
                  </Grid>

                </DialogContent>
                <DialogActions>
                  <IconButton
                    className={classes.winfoCreatorNodalDeleteIcon}
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
                    className={classes.winfoCreatorNodalCancelUpdateButton}
                  >
                    ???????????????
                  </Button>
                  <Button 
                    onClick={() => {
                      inputWinfoMusicUpdate()
                      handleCloseMusicDialog()
                    }}
                    color="primary"
                    className={classes.winfoCreatorNodalCancelUpdateButton}
                  >
                      ??????
                  </Button>
                </DialogActions>
              </Dialog>

              {/* <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                <TextField
                  id="standard-multiline-flexible"
                  fullWidth={false} label={"????????????"} variant="standard"
                  // required={true}
                  inputProps={{min: 0, style: { textAlign: 'center' }}}
                  value={state.winfoPages} type={"text"} onChange={inputWinfoPages}
                  className={classes.commentField} 
                  placeholder={"????????????"}
                />
              </Grid>
              <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                <TextField
                  id="standard-multiline-flexible"
                  fullWidth={false} label={"??????(???)"} variant="standard"
                  inputProps={{min: 0, style: { textAlign: 'center' }}}
                  // required={true}
                  value={state.winfoMinutes} type={"text"} onChange={inputWinfoMinutes}
                  className={classes.commentField} 
                  placeholder={"????????????"}
                />
              </Grid> */}

              {/* ??????????????? */}
              <PostingButton 
                changeIsPublic={changeIsPublic} 
                postButtonClicked={postButtonClicked}
              />
            </>
            : <>
              <Typography className={classes.h5WorksTitle}>????????????</Typography>
              <Typography className={classes.detailWorksInfomation}>{state.winfoInfomation ? state.winfoInfomation : "?????????"}</Typography>
              <Typography className={classes.h5WorksTitle}>??????</Typography>
              {state.winfoCreator.length 
                ? state.winfoCreator.map((map) => (
                  <><Typography>
                    {map.kind+` `+map.name}
                  </Typography></>
                ))
                : "????????????"
              }

              <Typography className={classes.h5WorksTitle}>?????????</Typography>
              <Typography className={classes.detailWorksInfomation}>{state.winfoCountry ? state.winfoCountry : "?????????"}</Typography>
              <Typography className={classes.h5WorksTitle}>????????????</Typography>
              <Typography className={classes.detailWorksInfomation}>{state.winfoStart ? state.winfoStart : "?????????"}</Typography>
              <Typography className={classes.h5WorksTitle}>??????</Typography>
              <Typography className={classes.detailWorksInfomation}>{state.winfoFinish ? state.winfoFinish : "?????????"}</Typography>
              <Typography className={classes.h5WorksTitle}>?????????</Typography>
              {state.winfoCreator.length 
                ? state.winfoMusic.map((map) => (
                  <><Typography>
                    {map.kind+` `+map.name}
                  </Typography></>
                ))
                : ""
              }

              {/* ?????????????????????????????????????????? */}
              {/* <p>????????????:{state.winfoPages}</p>
              <p>??????:{state.winfoMinutes}</p>
              <p>????????????:{state.statisticsData}</p>
              <p>????????????????????????:{state.winfoPlatform}</p> */}

            {/* ???????????????S2
            <p>???:{state.winfoParent == {} ? state.winfoParent : "no parent data"}</p>
            <p>???:{state.winfoChild}</p> */}
            </>
          }
        </>
        {/* <p>????????????????????????????????????????????????????????????????????????????????????????????????</p> */}

        {(firstPostFlag != FIRST_POSTED_FLAG_NOT_POSTED && !isPublic) ? <VisibilityOffIcon className={classes.isPublicSignal}/> : null}
        {(firstPostFlag != FIRST_POSTED_FLAG_NOT_POSTED && isPublic) ? <PublicIcon className={classes.isPublicSignal}/> : null}
          {/* </> */}
        <Footer />
      </>
    )
  }
}

export default Posting