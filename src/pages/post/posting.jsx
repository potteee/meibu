import React, {useState, useEffect, useCallback} from 'react'
import { PrimaryButton,TextInput ,CheckIconBox} from "../../styles/UIkit"
import { H2CenterLine } from "src/styles/SC/shared/typografy/centerLine"

import {ONE_CLICK_APPEARANCE_IN_POSTING} from 'src/foundations/share/GlobalConstant'

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

import clsx from 'clsx';
import Checkbox from '@material-ui/core/Checkbox';

///material icon 
import PublicIcon from '@material-ui/icons/Public';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

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

import {tagMap,tagExtraData} from "../../models/tagMap"
import {categoryMap} from "../../models/categoryMap"
import {bunruiMap} from "../../models/bunruiMap"
import PleaseSignUpIn from '../menu/PleaseSignUpIn'
import GLoading from '../../components/GLoading';

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
    // display : "inline",
    // // padding : "30px 0px 0px 0px", //margin,paddin意味ない
    // position : "relative",
    // top : 2,
    // left : 3,
    fontSize : "10px",
  },
  postingNetabarePosition: {
    position : "relative",
    // left : "1.0em",
    // justify:"center",
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
  bunruiFormControl: {
    // margin: theme.spacing(1),
    margin : "0px 0px 4px 0px",
    minWidth: 120,
  },
  tagMasterGrid: {
    // position : "relative",
    justifyContent : "space-evenly",
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
  // tagItemGridHidden: {
  //   position : "relative",
  //   display : "none"
  // },
  // tagFormControlHide: {
  //   display : "none",
  // },
  // tagFormControl: {
  //   // display : "none",
  // },
  cateFormControlLabel: {
    textAlign : "center",
    margin: "0px 0px 10px 0px",
    boxSizing: "content-box", // <-- add this
    // display: "none",
    // display: "inline-block",
    // width: "auto",
    // height: "80px",
  },
  tagFormControlLabel: {
    textAlign : "center",
    margin: "0px 0px 10px 0px",
    boxSizing: "content-box", // <-- add this
    // display: "none",
    // display: "inline-block",
    // width: "auto",
    // height: "80px",
  },
  tagFormControlLabelHidden: {
    textAlign : "center",
    margin: "0px 0px 22px 0px",
    boxSizing: "content-box", // <-- add this
    display: "none",
    // display: "inline-block",
    // width: "auto",
    // height: "80px",
  },
  tagFormGroup:{
    position: "relative",
    // position: relative,
  },
  gridTagKey: {
    flexGrow: 1,
    textAlign : "center",
    // margin: theme.auto,
    margin : "0px"
  },
  inputTagKey: {
    flexGrow: 1,
    textAlign : "center",
    // margin: theme.auto,
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
    // justifyContent : "center",
    // alignItems : "center",
    // marginLeft : "4px",
    position : "relative",
    marginBottom : "5px",
    top : -5,
  },
  // h2CenterLine: {
  //   display: "flex",
  //   alignItems: "center", /* 垂直中心 */
  //   justifyContent: "center", /* 水平中心 */
  //   fontSize : "1.4em",
    
  //   // '&:before, &:after' :{
  //   //   // borderTop: "3px solid",
  //   //   // borderTopWidth: 1,
  //   //   // borderWidth: 5, borderWidth: 5,
  //   //   // borderColor: 'red',
  //   //   // borderStyle: 'solid',
  //   //   // content : "",
  //   //   // width : "3em", /* 線の長さ */
  //   // },
  //   '&:before' : {
  //     content: 'abc',
  //     position : "relative",
  //     // position : "fixed",
  //     // flexGrow: 1,
  //     // left : "10px",
  //     width : "3em", /* 線の長さ */
  //     borderWidth: 1,
  //     borderTopWidth: 1,
  //     // borderWidth: 5,
  //     borderColor: 'red',
  //     borderStyle: 'solid',
  //     // display : "inline-block",
  //     // paddintTop: "-0.7em", /* 文字の右隣 */
  //     marginRight: "3em", /* 文字の右隣 */
  //     marginLeft: "3em", /* 文字の右隣 */
  //   },
  //   '&:after': {
  //     // marginLeft: "1em", /* 文字の左隣 */
  //   },
  // },

  h4LinkTag: {
    fontSize : "12.5px",
    textDecoration: 'underline',
    margin : "0px 4px",
    color : "#000080",
  },
  inputHissu: {
    // margin : "0px 0px 4px 0px",
    color : "red",
  },
  inputSmallHissu: {
    // margin : "0px 0px 4px 0px",
    position : "relative",
    top : -6,
    fontSize : 12,
    color : "red",
  },
  FCHissu: {
    margin : "0px 0px 4px 0px",
    // color : "red",
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
    // component : "h3",

    // color : "red",
    // fontSize : 20,
  },
  // postingSubBox : {
  //   margin : "0px 5px 0px 15px"
  // },
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

}))

const StyledCheckbox = (props) => {
  const classes = useStyles();

  return (
    <Checkbox
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      inputProps={{ 'aria-label': 'decorative checkbox' }}
      checked={props.isSr} 
      onChange={props.isSH} 
      name={"ネタバレコメント"}
      // {...props}
    />
  );
}

// 作品投稿ページ
const Posting = () => {

  const router = useRouter()
  // const { id } = router.query
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)

  // console.log(JSON.stringify(selector,null,2)+"+selector")
  //上記よりこっちの方が処理漏れ少ない？
  const RdUserId = getUserId(selector);
  const RdIsSignin = getIsSignedIn(selector);
  const RdUserName = getUserName(selector);
  const RdAssessmentWorks = getUserAssessmentWorks(selector)
  const classes = useStyles();

  const asPath = router.asPath // pathNameだとURL部のみ（/post/posting)だけ取得
  // const { hist,searchWord,infoMedia ,workId,firstPostFlag } = router.query
  const props = router.query
  const { isReady } = useRouter()

  // const query = router.query.searchWord // これだと初回useEffect時に読んでくれない
  // console.log(asPath+"+asPath first")
  const oriQuery = /^\/post\/posting\?searchWord=/.test(asPath) ? asPath.split('\/post\/posting')[1] : ""
  // console.log(oriQuery+"+oriQuery")
  // const qInfoMedia = router.query.infoMedia 

  // console.log("bunruiMap")
  // console.log(bunruiMap)
  // console.log(Object.keys(bunruiMap)+"Ob bunruiMap")
  // console.log(bunruiMap[Object.keys(bunruiMap)[0]]+"+Ob")

  let hist = props.hist
  let preWorkName = props.searchWord
  let qInfoMedia = props.infoMedia
  let preWorkId = props.workId
  let firstPostFlag = props.firstPostFlag
  // let query = ""
  // let qInfoMedia = ""
  // let preWorkId = ""
  // let firstPostFlag = ""

  if(oriQuery){
    // query = /\&/.test(oriQuery.split('?searchWord=')[1]) ? (oriQuery.split('?searchWord=')[1]).split('&')[0] : oriQuery.split('?searchWord=')[1]
    // console.log(query+"+query first")
    // query = decodeURIComponent(query.replace(/\+/g,' '))
    // console.log(query+"+query second")

    // qInfoMedia = decodeURIComponent(/\&/.test(oriQuery.split('&infoMedia=')[1]) ? (oriQuery.split('&infoMedia=')[1]).split('&')[0] : oriQuery.split('&infoMedia=')[1])
    // console.log(qInfoMedia+"+qInfoMedia first")

    // preWorkId = decodeURIComponent(/\&/.test(oriQuery.split('&workId=')[1]) ? (oriQuery.split('&workId=')[1]).split('&')[0] : oriQuery.split('&workId=')[1])
    // console.log(preWorkId+"+preWorkId first")

    // firstPostFlag = decodeURIComponent(/\&/.test(oriQuery.split('&firstPostFlag=')[1]) ? (oriQuery.split('&firstPostFlag=')[1]).split('&')[0] : oriQuery.split('&firstPostFlag=')[1])
    // console.log(firstPostFlag+"+firstPostFlag first")

    if(hist == "SignIn"){ // サインインから来た時は上書きする。
      firstPostFlag = preWorkId 
      ? Object.keys(RdAssessmentWorks).includes(preWorkId) 
        ? 2 //評価編集
        : 0 //自分は未評価投稿
      : 1 //新規評価
      // console.log(firstPostFlag+"firstPostFlag@SignInChanged")
    }
  } else {
    console.log("no oriQuery")
  }

  // console.log(query+"++query")
  // console.log(querysWorkName+"+querysWorkName")
  const [workName, setWorkName] = useState(preWorkName)

  const [workMedia, setWorkMedia] = useState(qInfoMedia);
  const [open, setOpen] = useState(false);

  const [workScore, setWorkScore] = useState("")
  const [workComment, setWorkComment] = useState("")

  const [showGenre, setShowGenre] = useState(false)

  const [tagAutoCompleteValue ,setTagAutoCompleteValue] = useState("useStateInitial")

  const firstCheckBoxDisp = 22
  const totalCountGenre = tagExtraData.Genre.count
  const totalCountImpression = totalCountGenre + tagExtraData.Impression.count
  const totalCountOriginal = totalCountImpression + tagExtraData.Original.count
  const totalCountPosition = totalCountOriginal + tagExtraData.Position.count  

  //showmore
  const [showMoreGenre ,setShowMoreGenre] = useState(firstCheckBoxDisp)
  const [showMoreImpression ,setShowMoreImpression] = useState(totalCountGenre + firstCheckBoxDisp)
  const [showMoreOriginal ,setShowMoreOriginal] = useState( 
    (tagExtraData.Original.count <= firstCheckBoxDisp)
      ? totalCountImpression + tagExtraData.Original.count
      : totalCountImpression + firstCheckBoxDisp
    )
  // const [showMoreOriginal ,setShowMoreOriginal] = useState(totalCountImpression + firstCheckBoxDisp)
  const [showMorePosition ,setShowMorePosition] = useState(totalCountOriginal + firstCheckBoxDisp)

  // const [standbyState , setStandbyState] = useState(false)

  let tagResult = {}

  Object.keys(tagMap).map((map) => 
    tagResult = {...tagResult, [map] : false}
  )

  const [tagCheckBox, setTagCheckBox] = useState(tagResult)
  
  let cateResult = {}

  Object.keys(categoryMap).map((map) => 
    cateResult = {...cateResult, [map] : false}
  )

  const [checkBoxState, setCheckBoxState] = useState(cateResult)

  const [isPublic,setIsPublic] = useState(true)
  // let isPublic = true
  const [isSpoiler,setIsSpoiler] = useState(false)
  // const [workInfo, setWorkInfo] = useState("")
  const [isLiked,setIsLiked] = useState(false)
  
  // console.log(id+"+id@post/index")
  
  const changeIsPublic = useCallback((state) => {
    setIsPublic(state)
  }, [])

  const inputWorkName = useCallback((event) => {
    setWorkName(event.target.value)
  }, [])
  
  const inputWorkScore = useCallback((event) => {
    setWorkScore(event.target.value === '' ? '' : Number(event.target.value))
    // setWorkScore(event.target.value)
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
  
  const checkBoxHandleChange = useCallback((event) => {
    setCheckBoxState({...checkBoxState,[event.target.name]: event.target.checked})
  },[checkBoxState])

  const tagCheckBoxHandleChange = useCallback(({name,isClicked}) => {
    setTagCheckBox({...tagCheckBox, [name] : !isClicked})
    // setTagCheckBox({...tagCheckBox,[event.target.name]: event.target.checked})
    // console.log(JSON.stringify(tagCheckBox)+"tagCheckBox")
    // console.log(name+"+event.target.name")
    // console.log(isClicked+"+event.target.isClicked")
  },[tagCheckBox])
  // const tagCheckBoxHandleChange = useCallback((event) => {
  //   setTagCheckBox({...tagCheckBox,[event.target.name]: event.target.checked})
  // },[tagCheckBox])
  
  const inputWorkComment = useCallback((event) => {
    setWorkComment(event.target.value)
  }, [])

  const isSpoilerHandleChange = useCallback((event) => {
    setIsSpoiler(event.target.checked)
    // },[checkBoxState])
  },[isSpoiler])

  const isLikedHandleChange = useCallback(() => {
    // setIsLiked(event.target.checked)
    // console.log("isLikedHandleChange")
    setIsLiked(isLiked => !isLiked)
  },[isLiked])
  
  // const inputWorkInfo = useCallback((event) => {
    //   setWorkInfo(event.target.value)
    // }, [])

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

  //useEffect
  useEffect(() => {
    if(oriQuery && RdIsSignin){
      (async() => {
        if(preWorkName && qInfoMedia){
          setWorkName(preWorkName)
          setWorkMedia(qInfoMedia)
        }
        console.log(workName+"+workName")
        console.log(tagCheckBox+"+tagCheckBox")
        console.log(firstPostFlag+"+firstPostFlag")
  
        //既に評価済みの評価を編集する場合
        if(firstPostFlag == 2){
          if(RdUserId != "RdUserId initial"){
            console.log("firstPostFlag = 2 effect start")
            console.log(RdUserId+"+RdUserId +++")
            console.log(preWorkId+"preWorkId +++")
            await db.collection('privateUsers').doc(RdUserId)
            .collection('postedWorksId').doc(preWorkId)
            .get()
            .then((snapshot) => {
              // console.log(JSON.stringify(snapshot)+"+snapshot@J")
              console.log("+snapshot")
              console.log(snapshot)
              console.log(snapshot.data()+"+snapshot.data()")
              console.log(JSON.stringify(snapshot.data())+"+snapshot.data()@J")
              // console.log(snapshot.data().assessmentCategory+"+snapshot.data().assessmentCategory") 
              console.log(snapshot.data().assessmentWorkTag+"+snapshot.data().assessmentWorkTag") 
            
              snapshot.data().assessmentWorkTag.map((tag) => {
                console.log(tag+"+tags")
                Object.keys(tagMap).map((map) => {
                  if([tagMap[map].key] == tag){
                    setTagCheckBox(tagCheckBox => ({...tagCheckBox , [map]:true}))
                  }
                })
              })            
              setWorkScore(snapshot.data().workScore != -1 ? snapshot.data().workScore : "")
              // setWorkScore(snapshot.data().workScore != -1 ? snapshot.data().workScore : "")
              setWorkComment(snapshot.data().workComment)
              setIsPublic(snapshot.data().isPublic)
              // isPublic = snapshot.data().isPublic
              setIsSpoiler(snapshot.data().isSpoiler)
              setIsLiked(snapshot.data().isLiked)
              console.log(snapshot.data().isLiked+"+setIsLiked")
            })
            .catch((error) => {
              alert('failed fistPostFlag 2 get postedWorksId')
              throw new Error(error)
            })
          } else {
            console.log(RdUserId+"+RdUserId")
          }
          await db.collection('wInfo').doc(preWorkId)
          .get()
          .then((snapshot) => {
            console.log(JSON.stringify(snapshot.data())+"+snapshot.data()@J")
            snapshot.data().winfoCategory.map((cate) => {
              console.log(cate+"+cates")
              Object.keys(categoryMap).map((map) => {
                if(categoryMap[map] == cate){
                  setCheckBoxState(checkBoxState => ({...checkBoxState , [map]:true}))
                }
              })
            })
          })
          .catch((error) => {
            alert('failed fistPostFlag 0 get wInfo')
            throw new Error(error)
          })
        }
        //未評価の既に登録されている作品
        if(firstPostFlag == 0){
          console.log("firstPostFlag = 0 effect start")
          await db.collection('wInfo').doc(preWorkId)
          .get()
          .then((snapshot) => {
            console.log(JSON.stringify(snapshot.data())+"+snapshot.data()@J")
            snapshot.data().winfoCategory.map((cate) => {
              console.log(cate+"+cates")
              Object.keys(categoryMap).map((map) => {
                if(categoryMap[map] == cate){
                  setCheckBoxState(checkBoxState => ({...checkBoxState , [map]:true}))
                }
              })
            })
          })
          .catch((error) => {
            alert('failed fistPostFlag 0 get wInfo')
            throw new Error(error)
          })
        }
      })()
    } else if(!RdIsSignin && oriQuery) {
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
    } else { 
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
    // const workId = await dispatch(postWorkCreate(workName,workScore,goCheckBoxState,workComment,RdUserId))

    console.log(RdUserName+"+RdUserName a")
    // 作品の固有データをDBに登録
    // 新規登録なのでScoreは入力値のまま　*-*- (wInfo)
    await dispatch(postWInfoCreate( //セキュアなでーたがあるならapi下でやった方がいい。
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
      firstPostFlag,
      preWorkId,
    )).then( async(workId) => {
      console.log(workId+"+workId posting m")
      // 登録したユーザのDB情報に登録した作品のWorkIdを追加(postedWorksId(db))
      await dispatch(addPostedWork( //これ上のとPromise.all()で良さそ。
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

        {(firstPostFlag == 0 || firstPostFlag == 2 ) && (
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
                    {"分類"}
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
        {firstPostFlag == 1 && (
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
            <FormControl className={classes.bunruiFormControl}>
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
            <FormGroup row>
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
            </FormGroup>
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
          {/* <Grid container item xs={10} justifyContent={"center"}>
            <Slider
              value={typeof workScore === 'number' ? workScore : 0}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
              />    
          </Grid> */}
        </Grid>
        <Grid container item xs={12} spacing={0} className={classes.scorePosition} style={{marginTop:"10px"}}>
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
            {/* <Grid item xs={12}> */}
            {postedTag}
            {/* </Grid> */}
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

        {/* <PrimaryButton label={"投稿"} onClick={postButtonClicked} /> */}

        <h2>作品情報を入力(オプション)</h2>
        <p>※新規登録なので、作品情報もオプションで入力してもらうようにする</p>

        {(firstPostFlag != 1 && !isPublic) ? <VisibilityOffIcon className={classes.isPublicSignal}/> : null}
        {(firstPostFlag != 1 && isPublic) ? <PublicIcon className={classes.isPublicSignal}/> : null}
          {/* </> */}
        <Footer />
      </>
    )
  }
}

export default Posting