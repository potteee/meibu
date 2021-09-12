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
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import { ListItemIcon,ListItemSecondaryAction,IconButton } from '@material-ui/core';
import RootRef from "@material-ui/core/RootRef";


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';


import clsx from 'clsx';
import Checkbox from '@material-ui/core/Checkbox';

///material icon 
import PublicIcon from '@material-ui/icons/Public';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';

import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../../components/header'
import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'
import { parseCookies } from 'nookies'
import { is, set } from 'immutable'
import {useDispatch,useSelector} from 'react-redux'

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
import PleaseSignUpIn from '../menu/PleaseSignUpIn'
import GLoading from '../../components/GLoading';

import { DragDropContext,Droppable,Draggable} from 'react-beautiful-dnd';
import { width } from '@material-ui/system'

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
    display : "inline", //改行させない
    // padding : "30px 0px 0px 0px", //margin,paddin意味ない
    position : "relative",
    top : 10,
  },
  postingInlineNetabareBox: {
    display : "inline",
    // padding : "30px 0px 0px 0px", //margin,paddin意味ない
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
    color : "#393e4f", //青褐あおかち
    fontSize : "0.8em",
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
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
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
  postingGrid : {
    margin : "40px 0px 20px 0px",    
  },
  postingButton : {
    padding : "8px 29px",
    margin : "0px 0.5rem",
  },
  postingBox : {
    margin : "0px 5px 0px 15px",
  },
  postingTypology : {
    fontSize : 20,
  },
  postingSubTypology : {
    fontSize : 11,
  },
  isPublicSignal : {
    position: 'fixed',
    top : "2.4em",
    right : "0.6em",
  },
  winfoCreatorList : {
    listStyle : "none",
    maxWidth : "95%",
    width : "90%",
  },
  winfoCreatorListItems : {
    height:"3em",
    alignItems:"center",
  }
}))

//任意入力の作品情報
const initialState = {
  isLoading : true,
  winfoEditor : "",
  winfoInfomation : "",
  winfoCreator : [],
  winfoPublisher : [],
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
  const classes = useStyles();

  const asPath = router.asPath // pathNameだとURL部のみ（/post/posting)だけ取得
  const props = router.query
  const { isReady } = useRouter()
  
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
  const [workComment, setWorkComment] = useState("")
  
  const [showGenre, setShowGenre] = useState(false) //必須
  const [tagAutoCompleteValue ,setTagAutoCompleteValue] = useState("useStateInitial")
  
  const [isPublic,setIsPublic] = useState(true)
  const [isSpoiler,setIsSpoiler] = useState(false)
  const [isLiked,setIsLiked] = useState(false)

  // const initailWinfoOneCreator = {
  //   index : "",
  //   id : "",
  //   kind:"",
  //   name:"",
  // }
  
  const [winfoOneCreatorKind,setWinfoOneCreatorKind] = useState("")
  const [winfoOneCreatorName,setWinfoOneCreatorName] = useState("")

  // const [winfoCreatorDragState, updateWinfoCreatorDragState] = useState([initailWinfoOneCreator]);

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
    // setWinfoOneCreator({
    //   winfoCreator : {
    //     kind : event.target.value,
    //     name : winfoOneCreator.winfoCreator.name
    //   }
    // })
    setWinfoOneCreatorKind(event.target.value)
  }
  const inputWinfoOneCreatorName = (event) => {
    // setWinfoOneCreator({
      //   winfoCreator : {
        //     kind : winfoOneCreator.winfoCreator.kind,
        //     creatorName :  event.target.value,
        //   }
        // })
    setWinfoOneCreatorName(event.target.value)
  }

  console.log(winfoOneCreatorKind+"+winfoOneCreatorKind")
  console.log(winfoOneCreatorName+"+winfoOneCreatorName")

  //データ構成考えなくては…。
  //reducerに持たせるのはDBと直接関連づけたいから
  //個々の配列要素はuseStateで持たせるか//winfoOneCreator
  //+が押されたらリセットされる。あくまで入力フィールドに乗っている時のstate
  const inputWinfoCreator = () => {
    const items = {
      index: state.winfoCreator.length,//要素の長さが一番indexとなり、逆順に表示しているので、一番上に来る
      id : DateToString(new Date,1),
      kind : winfoOneCreatorKind,
      name : winfoOneCreatorName,
    }

    dispatch({type:"changeWinfo",payload : {
      winfoCreator : [items,...state.winfoCreator]
      // winfoCreator : [...state.winfoCreator, items]
    }})

    // updateWinfoCreatorDragState([...state.winfoCreator, items])
    setWinfoOneCreatorKind("")
    setWinfoOneCreatorName("")
  }


  const inputWinfoPublisher = (event) => {
    dispatch({type:"changeWinfo",
      payload : {
        winfoPublisher : event.target.value
      }
    })
  }
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
  const inputWinfoMusic = (event) => {
    dispatch({type:"changeWinfo",
      payload : {
        winfoMusic : event.target.value
      }
    })
  }
  const inputWinfoPages = (event) => {
    dispatch({type:"changeWinfo",
      payload : {
        winfoPages : event.target.value
      }
    })
  }
  const inputWinfoMinutes = (event) => {
    dispatch({type:"changeWinfo",
      payload : {
        winfoMinutes : event.target.value
      }
    })
  }

  // winfoCreatorDrag Function
  function winfoCreatorHandleOnDragEnd(result) {

    if(!result.destination.index){
      console.log("result.destination.index is null")
      return false
    }

    const items = Array.from(state.winfoCreator);

    //移動した要素を削除
    const [reorderedItem] = items.splice(result.source.index, 1);
    // const [reorderedItem] = items.splice(state.winfoCreator.length - 1 - result.source.index, 1);
    
    //移動した要素を追加
    items.splice(result.destination.index, 0, reorderedItem);
    // items.splice(state.winfoCreator.length - 1 - result.destination.index , 0, reorderedItem);
    // console.log(result.source.index+"+result.source.index")
    // console.log(result.destination.index+"+result.destination.index")

    for(let i = 0;i < items.length;i++){
      items[i].index = items.length - 1 - i
      console.log(JSON.stringify(items[i])+"items["+i+"]")
    }

    console.dir(reorderedItem)
    console.log("reorderedItem")
    console.log(items+"+items")

    // updateWinfoCreatorDragState(items);
    dispatch({type:"changeWinfo",payload : {
      winfoCreator : items
    }})

    return(true)
  }

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
              /////要変更(DBから持ってきた値を入力する。)
              winfoEditor : DBdata[1].winfoEditor,
              winfoInfomation : DBdata[1].winfoInfomation,
              // winfoCreator : DBdata[1].winfoCreator,
              winfoCreator : DBdata[1].winfoCreator.sort(ArraySort("index","desc")),
              winfoPublisher : DBdata[1].winfoPublisher,
              winfoCountry : DBdata[1].winfoCountry,
              winfoStart : DBdata[1].winfoStart,
              winfoFinish : DBdata[1].winfoFinish,
              winfoImage : DBdata[1].winfoImage,
              statisticsData : DBdata[1].statisticsData,
              winfoParent : DBdata[1].winfoParent,
              winfoChild : DBdata[1].winfoChild,
              winfoSeries : DBdata[1].winfoSeries,
              winfoMusic : DBdata[1].winfoMusic,
              winfoPages : DBdata[1].winfoPages,
              winfoMinutes : DBdata[1].winfoMinutes,
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
  if(!isReady || !oriQuery || !RdIsSignin){
    return(
      <GLoading />
    )
  } else {
    return (
      <>
        <ApplicationBar title="新規登録"/>

        <H2CenterLine> {"作品情報"} </H2CenterLine>

        {(firstPostFlag == FIRST_POSTED_FLAG_ANOTHER_ONLY_POSTED ||
          firstPostFlag == FIRST_POSTED_FLAG_I_POSTED ) && (
          <>
            <Grid container item xs={12} justify={"center"}>
              <Typography className={classes.h5WorksTitle}>
                {"作品名"}
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

            <Grid container xs={12} justifyContent={"center"}>
              <Grid container item xs={6} justifyContent={"center"}>
                <Grid container item xs={12} justify={"center"}>
                  <Typography className={classes.h5WorksTitle}>
                    {/* {"分類"} */}
                    {"メディア"}
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
                    {"カテゴリ"}
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
          
        {/* // 新規登録 */}
        {firstPostFlag == FIRST_POSTED_FLAG_NOT_POSTED && (
          <>
            {/* <h2>新規登録/評価</h2> */}
            <ApplicationBar title="新規登録/評価"/>
            <h2 className={classes.postingH2}>作品名</h2>
              <TextInput
                fullWidth={true} label={<a className={classes.inputHissu}>(必須)</a>} multiline={false} required={true}
                rows={1}  value={workName} type={"text"} onChange={inputWorkName}
                // className={classes.FCHissu}
              />
            <h2 className={classes.postingH2}>メディア</h2>
            <FormControl className={classes.mediaFormControl}>
              <InputLabel id="demo-controlled-open-select-label"><a className={classes.inputHissu}>(必須)</a></InputLabel>
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
            <h2 className={classes.postingH2}> カテゴリ　</h2> 
            <a className={classes.inputSmallHissu}>(必須)</a>
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

        <H2CenterLine style={{marginTop:"10px"}}> 　評価　 </H2CenterLine>

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
              {"採点"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth={true} label={""} multiline={false} required={true}
              // fullWidth={true} label={"点数(0-100)"} multiline={false} required={true}
              rows={1} value={workScore} type={"text"} onChange={inputWorkScore}
              inputProps={{min: 0, style: { textAlign: 'center' }}}
              // InputProps= {classes.textFieldInputProps} //.Muiを編集したい時はこれ。Part2  
              className = {classes.FCtensuu} //.Muiを編集したい時はこれ。Part2  
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={0} className={classes.scorePosition}>
          <Typography className={classes.h5WorksLikeTitle}>タグ</Typography> 
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

        {/* フリーワード検索部 */}
        <Grid container xs spacing={0} className={classes.freeWordSearchTag}>
          <FormControl className={classes.FCfreeWordSearchTag}>
            <Autocomplete
              classes={{
                option: classes.autoCompleteStyle,
                listbox: classes.autoCompleteStylePop
                }}//.Muiを編集したい時はこれ。
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
              renderInput={(params) => <TextField {...params} label="タグを検索" margin="none" />}
              />
          </FormControl>
        </Grid> 

        <Collapse in={showGenre} timeout={300}>
          <Grid container item spacing={0} justify={"center"} alignItems="center">  
            <Button onClick={() => {
              setShowGenre(!showGenre)
            }}> 
              {(showGenre == true) ? "タグ候補を非表示" : null}
            </Button>
          </Grid>
        </Collapse>

        {/* タグ候補 表示部 */}
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
                            case 0 : //ジャンル
                              console.log(displayFlag ? "true" +"+displayFlag@0" :　"false" + "+displayFlag@0")
                              displayFlag = true //→ついき：多分なくてもいい。
                              return <Grid container item xs={12} justify="center" classes={{ root: classes.inputTagKey }} ><h3 className={classes.h3TagKey}>{tagExtraData.Genre.key}</h3></Grid>;
                            case showMoreGenre : 
                              // console.log(displayFlag ? "true" +"+displayFlag@showMoreGenre" : "false" +"+displayFlag@showMoreGenre")
                              // console.log(showMoreGenre+"+showMoreGenre") 
                              displayFlag = false
                              if(showMoreGenre != totalCountGenre){
                                break
                              }

                            case totalCountGenre : //印象
                              displayFlag = true
                              return <Grid container item xs={12} justify="center" classes={{ root: classes.inputTagKey }} ><h3 className={classes.h3TagKey}>{tagExtraData.Impression.key}</h3></Grid>;
                            case showMoreImpression :
                              // console.log(j+"+showMoreImpression")
                              displayFlag = false
                              if(showMoreImpression != totalCountImpression){
                                break
                              }
                              
                            case totalCountImpression : // 原作
                              displayFlag = true
                              return <Grid container item xs={12} justify="center" classes={{ root: classes.inputTagKey }} ><h3 className={classes.h3TagKey}>{tagExtraData.Original.key}</h3></Grid>;
                            case showMoreOriginal :
                                // case totalCountImpression + 5 :
                              // console.log(j+"+showMoreOriginal")
                              displayFlag = false                                
                              if(showMoreOriginal != (totalCountOriginal)){
                                break
                              }
                              
                            case totalCountOriginal : // 人
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

                        {/* //チップ(タグ) 表示部 */}
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
          </FormControl>
        </FormGroup>

        <Grid container item spacing={0} justify={"center"} alignItems="center">  
          <Button onClick={() => {
            setShowGenre(!showGenre)
          }}> 
            {(showGenre == true) ? "タグ候補を非表示" : "タグ候補を表示"}
          </Button>
        </Grid>

        <Grid container xs className={classes.likedPosition}>
          <Typography className={classes.h5WorksLikeTitle}>
            コメント
          </Typography>
        </Grid>
        {/* <h2 className={classes.h3WorksTitle}>コメント</h2> */}
        {/* <h2 className={classes.postingInlineH2}>コメント</h2> */}

        <Grid container xs={12} className={classes.postingNetabarePosition}>
          <Grid container item xs={12} justify={"flex-end"}>
            <FormControlLabel
              control={
                <Switch size="small" checked={isSpoiler} onChange={isSpoilerHandleChange} />
              }
              label = {
                <span className={classes.postingInlineNetabareText}>ネタバレ</span>
              }
              labelPlacement="bottom"
            />
          </Grid>
        </Grid>

        <Grid container xs={12} justify={"center"} className={classes.postingCommentPosition}>
        {/* <Grid container xs={12} flexGrow={1} justify={"center"} className={classes.postingCommentPosition}> */}
          <TextField
            id="standard-multiline-flexible"
            fullWidth={true} label={"コメント"} multiline
            // required={true}
            maxRows={4} value={workComment} type={"text"} onChange={inputWorkComment}
            className={classes.commentField} 
            placeholder={"感想、評価などを5000字以内"}
          />
        </Grid>

        {/* 投稿ボタン */}
        <FormGroup row>
          <Grid container item xs={12} classes={{root : classes.postingGrid}}
          >
            <Grid container item xs={6} justify="center">
              <Button
                variant="contained"
                color="default"
                size="large"
                // className={classes.button}
                // startIcon={<SaveAltIcon />}
                startIcon={<SaveAltIcon 
                  // classes={{root: classes.postingIcon}}
                />}
                // fullWidth="true"
                classes={{root : classes.postingButton}}
                onClick={() => {
                  // isPublic = false;
                  // changeIsPublic(false)
                  changeIsPublic((preIsPublic) => false)
                  postButtonClicked(false)
                }}
              >
                <Grid container item xs={12}>
                  <Grid item xs={12} className={classes.postingBox}>
                    <Typography classes={{root : classes.postingTypology}}>
                      投稿
                  </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.postingBox}>
                    <Typography classes={{root : classes.postingSubTypology}}>
                      個人記録
                  </Typography>
                  </Grid>
                </Grid>
              </Button>
            </Grid>

            <Grid container item xs={6} justify="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                // className={classes.button}
                startIcon={<PublishIcon />}
                classes={{root : classes.postingButton}}
                onClick={() => {
                  // isPublic = true;
                  changeIsPublic(true)
                  postButtonClicked(true)
                }}
              >
                <Grid container item xs={12}>
                  <Grid item xs={12} className={classes.postingBox}>
                    <Typography classes={{root : classes.postingTypology}}>
                      投稿
                  </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.postingBox}>
                    <Typography classes={{root : classes.postingSubTypology}}>
                      一般公開
                  </Typography>
                  </Grid>
                </Grid>
              </Button>
            </Grid>
          </Grid>
        </FormGroup>

        {/* <h2>作品情報を入力(オプション)</h2> */}
        <H2CenterLine> {"作品詳細情報"} </H2CenterLine>
        {/* <p>編集者ID:{state.winfoEditor ? state.winfoEditor : "未定義"}</p> */}
        {/* <p>編集者ID:{state.winfoEditor ? state.winfoEditor : "未定義"}</p> */}
        <>
          {(state.winfoEditor == RdUserId || firstPostFlag == FIRST_POSTED_FLAG_NOT_POSTED)
            ? <>
              {/* <Grid container xs={12} justify={"center"} className={classes.postingWinfoDatas}> */}
                <Grid container item xs justify={"center"} className={classes.postingWinfoOneData}>
                  <TextField
                    fullWidth={true} label={"作品情報"} multiline
                    maxRows={4} value={state.winfoInfomation} type={"text"} onChange={inputWinfoInfomation}
                    className={classes.commentField} 
                    placeholder={"作品のストーリーや概要など"}
                  />
                </Grid>
                <Grid item container xs={12} justify={"center"} className={classes.postingWinfoCreator}>
                  <Grid item container xs={4} >
                    <FormControl className={classes.winfoCreatorFormControl}>
                      <InputLabel id="demo-controlled-open-select-label">(分類)</InputLabel>
                      {/* <InputLabel id="demo-controlled-open-select-label"><a className={classes.inputHissu}>(必須)</a></InputLabel> */}
                      <NativeSelect
                        // labelId=""
                        id="NativeSelect-winfoCreator"
                        value={winfoOneCreatorKind}
                        onChange={inputWinfoOneCreatorKind}
                      >

                        <option aria-label="未選択" value="" />
                        {/* <MenuItem value="">
                          <em>未選択</em>
                        </MenuItem> */}

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
                      fullWidth={true} label={"作成関係者"} multiline
                      maxRows={4} 
                      value={winfoOneCreatorName} 
                      // value={winfoOneCreator.winfoCreator.creatorName} 
                      type={"text"} 
                      onChange={inputWinfoOneCreatorName}
                      className={classes.commentField} 
                      placeholder={"名称"}
                    />
                    {/* //作成関係者フィールド //表示順はwinfoCreatorListに記載した順
                      分類選択　入力フィールド　+(addButton)
                      　　分類　入力された文字(編集不可) 削除(ゴミ箱ボタン) 　
                    
                    */}
                  </Grid>
                  <Grid item container xs={1} justify="flexStart" alignItems="center">
                    <FormControl>
                      <AddCircleOutlineIcon
                        onClick={inputWinfoCreator}
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
                          className={classes.winfoCreatorList}// ここにsnapshot入れてもいい
                        >
                        {/* <ul
                          className={classes.winfoCreatorList}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        > */}
                          {state.winfoCreator.map(({id , kind, name }, index) => {
                            return (
                              // <div key={id}>
                              <Draggable key={id} draggableId={id} index={index}>
                                {(provided,snapshot) => (
                                  <RootRef rootRef={provided.innerRef}>
                                    <ListItem
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={classes.winfoCreatorListItems}
                                      // style={getItemStyle(
                                      //   snapshot.isDragging,
                                      //   provided.draggableProps.style
                                      // )}
                                    >
                                  {/* <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  > */}
                                    {/* <div> */}
                                      <Grid container xs justyfy="flexStart">
                                        <Grid container item xs={2}>
                                          <ListItemIcon
                                            onClick={() => {
                                              console.log("Clicked winfoEdit")
                                            }
                                            }
                                          >
                                            <IconButton>
                                              <EditIcon/>
                                            </IconButton>
                                          </ListItemIcon>
                                        </Grid>
                                        <Grid container item xs={10} alignItems="center">
                                          <ListItemText 
                                            // style={{alignItems:"center" }}
                                            primary={kind+"  /  "+name}
                                          />
                                        </Grid>
                                      </Grid>
                                      {/* <a>{kind+"  /  "}</a>
                                      <a>{name}</a> */}
                                    {/* </div> */}
                                  {/* </li> */}
                                  </ListItem>
                                  </RootRef>
                                )}
                              </Draggable>
                              // {/* </div> */}
                            );
                          })}
                          {provided.placeholder}
                        {/* </ul> */}
                        </List>
                        </RootRef>
                      )}
                    </Droppable>
                    {/* <Droppable droppableId="delete">
                      {(provided, snapshot) => (
                        <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}>
                          Drop to delete
                          ...
                        </div>
                      )}
                    </Droppable> */}
                  </DragDropContext>
                </Grid>               

                <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                  <TextField
                    id="standard-multiline-flexible"
                    fullWidth={true} label={"出版社"} multiline
                    // required={true}
                    maxRows={4} value={state.winfoPublisher} type={"text"} onChange={inputWinfoPublisher}
                    className={classes.commentField} 
                    placeholder={"出版社"}
                  />
                </Grid>
                <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                  <TextField
                    id="standard-multiline-flexible"
                    fullWidth={true} label={"国"} multiline
                    // required={true}
                    maxRows={4} value={state.winfoCountry} type={"text"} onChange={inputWinfoCountry}
                    className={classes.commentField} 
                    placeholder={"制作国"}
                  />
                </Grid>
                <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                  <TextField
                    id="standard-multiline-flexible"
                    fullWidth={true} label={"リリース"} multiline
                    // required={true}
                    maxRows={4} value={state.winfoStart} type={"text"} onChange={inputWinfoStart}
                    className={classes.commentField} 
                    placeholder={"リリース時期"}
                  />
                </Grid>
                <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                  <TextField
                    id="standard-multiline-flexible"
                    fullWidth={true} label={"完結"} multiline
                    // required={true}
                    maxRows={4} value={state.winfoFinish} type={"text"} onChange={inputWinfoFinish}
                    className={classes.commentField} 
                    placeholder={"完結した時期"}
                  />
                </Grid>
                <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                  <p>画像登録フォーム</p>
                </Grid>

                {/* Step2 */}
                {/* <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                  <p>親選択フォーム</p>
                </Grid>
                <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                  <p>子選択フォーム</p>
                </Grid>
                <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                  <p>シリーズフォーム(選択と自由入力フォーム)</p>
                </Grid> */}
                <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                  <TextField
                    id="standard-multiline-flexible"
                    fullWidth={true} label={"主題歌"} multiline
                    // required={true}
                    maxRows={4} value={state.winfoMusic} type={"text"} onChange={inputWinfoMusic}
                    className={classes.commentField} 
                    placeholder={"主題歌(登録と同時にworkIdが発行される?)"}
                  />
                </Grid>
                <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                  <TextField
                    id="standard-multiline-flexible"
                    fullWidth={true} label={"ページ数"} multiline
                    // required={true}
                    maxRows={4} value={state.winfoPages} type={"text"} onChange={inputWinfoPages}
                    className={classes.commentField} 
                    placeholder={"数字入力"}
                  />
                </Grid>
                <Grid item container xs={12} justify={"center"} className={classes.postingWinfoOneData}>
                  <TextField
                    id="standard-multiline-flexible"
                    fullWidth={true} label={"時間(分)"} multiline
                    // required={true}
                    maxRows={4} value={state.winfoMinutes} type={"text"} onChange={inputWinfoMinutes}
                    className={classes.commentField} 
                    placeholder={"数字入力"}
                  />
                </Grid>
              {/* </Grid> */}
            </>
            : <>
              <p>作品情報:{state.winfoInfomation}</p>
              <p>作者:{state.winfoCreator.length ? state.winfoCreator[0].kind+":"+state.winfoCreator[0].name : "no data at Creator"}</p>
              <p>出版社:{state.winfoPublisher}</p>
              <p>制作国:{state.winfoCountry}</p>
              <p>リリース:{state.winfoStart}</p>
              <p>完結:{state.winfoFinish}</p>
              <p>画像:{state.winfoImage}</p>
              <p>統計情報:{state.statisticsData}</p>
              <p>親:{state.winfoParent == {} ? state.winfoParent : "no parent data"}</p>
              <p>子:{state.winfoChild}</p>
              <p>シリーズ:{state.winfoSeries}</p>
              <p>主題歌:{state.winfoMusic}</p>
              <p>ページ数:{state.winfoPages}</p>
              <p>時間:{state.winfoMinutes}</p>
            </>
          }
        </>
        {/* <p>※新規登録なので、作品情報もオプションで入力してもらうようにする</p> */}

        {(firstPostFlag != FIRST_POSTED_FLAG_NOT_POSTED && !isPublic) ? <VisibilityOffIcon className={classes.isPublicSignal}/> : null}
        {(firstPostFlag != FIRST_POSTED_FLAG_NOT_POSTED && isPublic) ? <PublicIcon className={classes.isPublicSignal}/> : null}
          {/* </> */}
        <Footer />
      </>
    )
  }
}

export default Posting