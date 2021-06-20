import React, {useState, useEffect, useCallback} from 'react'
import { PrimaryButton, TextInput ,CheckIconBox} from "../../styles/UIkit"
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../../components/header'
import Footer from '../../components/footer'
import { parseCookies } from 'nookies'
import { set } from 'immutable'
import {useDispatch,useSelector} from 'react-redux'

import {getUserId,getUserName} from "../../reducks/users/selectors";
// import { postWorkCreate } from '../../reducks/works/operations'
import { addPostedWork } from '../../reducks/users/operations'

import postWInfoCreate from '../../foundations/wInfo'
import checkSameWork from '../../foundations/wInfo/checkSameWork'
import { tokenize } from '../api/firebase/allStringSearch/text-processor';

import { db, FirebaseTimestamp } from "../../firebase/index";

import {tagMap,tagExtraData} from "../../models/tagMap"
import {categoryMap} from "../../models/categoryMap"

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block', 
    marginTop: theme.spacing(2),
  },
  inputCheck: {
    // height: "20px",
    // margin : "20px 0px 0px 0px",
    margin : "0px",
    // top : "20px",
    padding: "0px 0px 0px 0px",
    boxSizing: "content-box" // <-- add this
  },
  bunruiFormControl: {
    margin: theme.spacing(6),
    minWidth: 120,
  },
  tagMasterGrid: {
    position : "relative",
    // height : "60px",
    // top : "20px",
    // color : "blue",
    // margin: theme.spacing(10),
    // // focused : false ,
    // fullWidth : true ,
    // margin : "normal",
    
    // labelPlacement : 'bottom', //これはreturn内でしか定義できない？
  },
  tagItemGrid: {
    position : "relative",
  },
  tagItemGridHidden: {
    position : "relative",
    display : "none"
  },
  tagFormControl: {
    
  },
  tagFormControlLabel: {
    textAlign : "center",
    margin: "0px 0px 22px 0px",
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
    margin : "0px 0px 20px 0px"
  },
  h3TagKey: {
    margin : "20px 0px 0px 0px",
  }
}))

// 作品投稿ページ
const Posting = () => {

  const router = useRouter()
  // const { id } = router.query
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  //上記よりこっちの方が処理漏れ少ない？
  const uid = getUserId(selector);
  const userName = getUserName(selector);
  const classes = useStyles();

  const asPath = router.asPath // pathNameだとURL部のみ（/post/posting)だけ取得
  // const query = router.query.searchWord // これだと初回useEffect時に読んでくれない
  // console.log(asPath+"+asPath first")
  const oriQuery = /^\/post\/posting\?searchWord=/.test(asPath) ? asPath.split('\/post\/posting')[1] : ""
  // console.log(oriQuery+"+oriQuery")
  // const qInfoMedia = router.query.infoMedia 

  let query = ""
  let qInfoMedia = ""
  let preWorkId = ""
  let firstPostFlag = ""

  if(oriQuery){
    query = decodeURIComponent(/\&/.test(oriQuery.split('?searchWord=')[1]) ? (oriQuery.split('?searchWord=')[1]).split('&')[0] : oriQuery.split('?searchWord=')[1])
    console.log(query+"+query first")

    qInfoMedia = decodeURIComponent(/\&/.test(oriQuery.split('&infoMedia=')[1]) ? (oriQuery.split('&infoMedia=')[1]).split('&')[0] : oriQuery.split('&infoMedia=')[1])
    console.log(qInfoMedia+"+qInfoMedia first")

    // const preWorkId = router.query.workId //既に存在する作品の場合定義される。
    preWorkId = decodeURIComponent(/\&/.test(oriQuery.split('&workId=')[1]) ? (oriQuery.split('&workId=')[1]).split('&')[0] : oriQuery.split('&workId=')[1])
    console.log(preWorkId+"+preWorkId first")

    // const firstPostFlag = router.query.firstPostFlag
    firstPostFlag = decodeURIComponent(/\&/.test(oriQuery.split('&firstPostFlag=')[1]) ? (oriQuery.split('&firstPostFlag=')[1]).split('&')[0] : oriQuery.split('&firstPostFlag=')[1])
    console.log(firstPostFlag+"+firstPostFlag first")
  } else {
  }


  console.log(query+"++query")
  // console.log(querysWorkName+"+querysWorkName")
  const [workName, setWorkName] = useState(query)

  const [workMedia, setWorkMedia] = useState(qInfoMedia);
  const [open, setOpen] = useState(false);

  const [workScore, setWorkScore] = useState("")
  const [workComment, setWorkComment] = useState("")

  const firstCheckBoxDisp = 6
  const totalCountGenre = tagExtraData.Genre.count
  const totalCountImpression = totalCountGenre + tagExtraData.Impression.count
  const totalCountOriginal = totalCountImpression + tagExtraData.Original.count
  const totalCountPosition = totalCountOriginal + tagExtraData.Position.count  

  //showmore
  const [showMoreGenre ,setShowMoreGenre] = useState(6)
  const [showMoreImpression ,setShowMoreImpression] = useState(totalCountGenre + 6)
  const [showMoreOriginal ,setShowMoreOriginal] = useState(totalCountImpression + 6)
  const [showMorePosition ,setShowMorePosition] = useState(totalCountOriginal + 6)

  let tagResult = {}

  Object.keys(tagMap).map((map) => 
    tagResult = {...tagResult, [map] : false}
    // tagResult = {...tagResult, [tagMap.[map].key] : false}
    // console.log(tagMap.map+"+inMap")
  )
   
  // console.log(tagResult)
  // console.log(JSON.stringify(tagResult))
  // console.log("++tagResult")
  // console.log(tagMap.Autodoa.key+"+tagMap.Autodoa.key")
  // console.log(JSON.stringify(tagMap.Autodoa)+"+tagMap.Autodoa")

  const [tagCheckBox, setTagCheckBox] = useState(tagResult)
  
  let cateResult = {}

  Object.keys(categoryMap).map((map) => 
    cateResult = {...cateResult, [map] : false}
  )

  const [checkBoxState, setCheckBoxState] = useState(cateResult)

  const [isPublic,setIsPublic] = useState(true)
  const [isSpoiler,setIsSpoiler] = useState(false)
  // const [workInfo, setWorkInfo] = useState("")
  
  // console.log(id+"+id@post/index")
  
  const inputWorkName = useCallback((event) => {
    setWorkName(event.target.value)
  }, [])
  
  const inputWorkScore = useCallback((event) => {
    setWorkScore(event.target.value)
  }, [])
  
  const checkBoxHandleChange = useCallback((event) => {
    setCheckBoxState({...checkBoxState,[event.target.name]: event.target.checked})
  },[checkBoxState])

  const tagCheckBoxHandleChange = useCallback((event) => {
    setTagCheckBox({...tagCheckBox,[event.target.name]: event.target.checked})
  },[tagCheckBox])
  
  // console.log(JSON.stringify(checkBoxState)+"+checkBoxState@J")
  // console.log(checkBoxState+"+checkBoxState")
  // console.log(JSON.stringify(tagCheckBox)+"+tagCheckBox@J")
  
  const inputWorkComment = useCallback((event) => {
    setWorkComment(event.target.value)
  }, [])

  const isPublicHandleChange = useCallback((event) => {
    setIsPublic(event.target.checked)
    // },[checkBoxState])
  },[isPublic])

  const isSpoilerHandleChange = useCallback((event) => {
    setIsSpoiler(event.target.checked)
    // },[checkBoxState])
  },[isSpoiler])
  
  // const inputWorkInfo = useCallback((event) => {
    //   setWorkInfo(event.target.value)
    // }, [])

  const handleChange = (event) => {
    setWorkMedia(event.target.value);
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
    (async() => {
      if(query && qInfoMedia){
        setWorkName(query)
        setWorkMedia(qInfoMedia)
      }
      console.log(workName+"+workName")
      console.log(tagCheckBox+"+tagCheckBox")
      console.log(firstPostFlag+"+firstPostFlag")

      //既に評価済みの評価を編集する場合
      if(firstPostFlag == 2){
        if(uid != "uid initial"){
          console.log("firstPostFlag = 2 effect start")
          console.log(uid+"+uid +++")
          console.log(preWorkId+"preWorkId +++")
          await db.collection('privateUsers').doc(uid)
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
                if([tagMap.[map].key] == tag){
                  setTagCheckBox(tagCheckBox => ({...tagCheckBox , [map]:true}))
                }
              })
            })            
            setWorkScore(snapshot.data().workScore != -1 ? snapshot.data().workScore : "")
            setWorkComment(snapshot.data().workComment)
            setIsPublic(snapshot.data().isPublic)
            setIsSpoiler(snapshot.data().isSpoiler)
          })
          .catch((error) => {
            alert('failed fistPostFlag 2 get postedWorksId')
            throw new Error(error)
          })
        } else {
          console.log(uid+"+uid")
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
  },[selector])
  
  console.log(JSON.stringify(checkBoxState)+"+checkBoxState@J chuu")
  console.log(checkBoxState+"+checkBoxState chuu")

  const postButtonClicked = async() => {
    //バリデーション
    if(workMedia == "" || workName == ""){
      alert("作品名、分類を入力してください！")
      return false
    }

    //& tranceform
    // setSearchWord(searchWord =>(searchWord.replace(/&/g,'＆'))
    // setWorkName(workName =>(workName.replace('&','＆')))

    //同じ作品名の作品を登録できるようにした　→　評価数と？？？で見分ける
    //新規登録するつもりがある時だけチェックして注意する
    // if(firstPostFlag == 1){
    //   const same = await checkSameWork(workName,workMedia)
    //   console.log(same+"+sameeeee")
    //   if(same){
    //     alert("同じ作品名の作品があります。作品名、分類を変更するか、既存の作品を評価してください")
    //     return false
    //   }
    // }

    //チェックされた項目だけを配列として抽出する
    let goCheckBoxState = []
    Object.keys(checkBoxState).map((map,index) => {
      if(checkBoxState[map] == true){
        console.log(map+"+map+"+index)
        console.log(categoryMap[map]+"+CategoryMap")
        // goCheckBoxState.push(categoryMap[map])
        goCheckBoxState =  [...goCheckBoxState,categoryMap[map]]
      }
    })

    //この条件そもそも入らなくない？？
    // if(goCheckBoxState == ""){
    //   goCheckBoxState =  [...goCheckBoxState,categoryMap[map]]
    //   // goCheckBoxState.push("None")
    // }

    let goTagCheckBoxState = []
    Object.keys(tagCheckBox).map((map,index) => {
      if(tagCheckBox[map] == true){
        console.log(map+"+map+"+index)
        console.log(tagMap.[map].key+"+tagMap")
        goTagCheckBoxState = [...goTagCheckBoxState,tagMap.[map].key]
      }
    })

    //検索用トークンマップ作成
    const tokenMap = buildTokenMap(
      workName,
    )

    // ユーザに紐づく作品データをDBに登録(redux/works(db))
    // const workId = await dispatch(postWorkCreate(workName,workScore,goCheckBoxState,workComment,uid))

    // 作品の固有データをDBに登録
    // 新規登録なのでScoreは入力値のまま　*-*- (wInfo)
    await dispatch(postWInfoCreate(
      workName,
      workMedia,
      workScore,
      uid,
      userName,
      goCheckBoxState,
      goTagCheckBoxState,
      workComment,
      isPublic,
      isSpoiler,
      tokenMap,
      firstPostFlag,
      preWorkId,
    )).then( async(workId) => {
      console.log(workId+"+workId posting m")
      // 登録したユーザのDB情報に登録した作品のWorkIdを追加(postedWorksId(db))
      await dispatch(addPostedWork(
        uid,
        workId,
        workName,
        isPublic,
        isSpoiler,
        workScore,
        goCheckBoxState,
        goTagCheckBoxState,
        workComment,
        firstPostFlag,
      ))

      router.push({
        pathname: '/post/'+workId+'/'+uid,
      })
    }).catch((error) => {
      alert('failed get workId')
      throw new Error(error)
    })
  }

  return (
    <>
      <Header />
      <div className="c-section-container">
        <div className="module-spacer--medium" />

        {/* // 新規登録 */}
        {firstPostFlag == 1 && (
          <>
            <h2>新規 作品記録フォーム</h2>
            <TextInput
            fullWidth={true} label={"作品名(必須)"} multiline={false} required={true}
            rows={1}  value={workName} type={"text"} onChange={inputWorkName}
            />
            <FormControl className={classes.bunruiFormControl}>
              <InputLabel id="demo-controlled-open-select-label">分類(必須)</InputLabel>
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
                <MenuItem value={"映画"}>映画</MenuItem>
                <MenuItem value={"ドラマ"}>ドラマ</MenuItem>
                <MenuItem value={"アニメ"}>アニメ</MenuItem>
                <MenuItem value={"動画(その他)"}>動画(その他)</MenuItem>
                <MenuItem value={"小説"}>小説</MenuItem>
                <MenuItem value={"マンガ"}>マンガ</MenuItem>
                <MenuItem value={"本(その他)"}>本(その他)</MenuItem>
                <MenuItem value={"ゲーム"}>ゲーム</MenuItem>
                <MenuItem value={"音楽"}>音楽</MenuItem>
                <MenuItem value={"絵"}>絵</MenuItem>
                <MenuItem value={"自転車"}>自転車</MenuItem>
                {/* <MenuItem value={}></MenuItem> */}
              </Select>
            </FormControl>
                    {/* (任意)3つまで選べるチェックボックスにしないとジャンル(恋愛・SF・ファンタジー) */}
            <div> カテゴリ　</div> 
            {/* <FormGroup root> */}
            <FormGroup row>
              {Object.keys(categoryMap).map((map)=> (
                <FormControlLabel
                    control={
                      <CheckIconBox
                      checked={checkBoxState[map]} onChange={checkBoxHandleChange} 
                      name={map} color={"primary"}
                      />
                    } label = {categoryMap[map]}
                />
              ))}
            </FormGroup>
          </>
        )}

        {/* // 他人が登録した作品を評価 */}
        {firstPostFlag == 0 && (
          <>
          <h2>作品 評価登録フォーム(新規評価)</h2>
          {/* <h3>作品名：{workName}</h3> */}
          <h3>作品名：
            <Link
              href="/post/[postWorkId]/"
              as={`/post/${preWorkId}/`}
            >
              {workName}
            </Link>
          </h3>
          <h3>分類　：{workMedia}</h3>
          <h3>カテゴリ：
          {Object.keys(checkBoxState).map((map) => (
            <a>{checkBoxState[map] == true && (
              <a>{categoryMap[map]} </a>
            )}</a>
          ))}
          </h3>
          </>
        )}
        {/* <p>作品名：テキストボックス※既存チェック</p> */}

        {/* //　既に評価している作品を登録 */}
        {firstPostFlag == 2 && (
          <>
          <h2>作品 評価登録フォーム(評価編集)</h2>
          <h3>作品名：            
            <Link
              href="/post/[postWorkId]/"
              as={`/post/${preWorkId}/`}
            >
              {workName}
            </Link>
          </h3>
          <h3>分類　：{workMedia}</h3>
          <h3>カテゴリ：
          {Object.keys(checkBoxState).map((map) => (
            <a>{checkBoxState[map] == true && (
              <a>{categoryMap[map]} </a>
            )}</a>
          ))}
          </h3>
          </>
        )}
      </div>

      {(() => {
        let iList = []
        for(let i = 0;i < 5;i++){
          iList = [...iList , <a>{i}</a>]
        }
        console.log("iList")
        console.log(iList)
        return <>{iList}</>
      })()}

      {/* ログインしていないと以下は表示されない */}
      {uid !== "uid initial" 
      ? (
          <div>
          {/* <div className="c-section-container"> */}
            <TextInput
            fullWidth={true} label={"(任意)点数(0-100)"} multiline={false} required={true}
            rows={1} value={workScore} type={"number"} onChange={inputWorkScore}
            />
            <div>タグ/属性</div> 
            {/* <FormGroup root> */}
            {/* <FormGroup row2> */}
            <FormGroup clsssName={classes.tagFormGroup}>
              <FormControl className={classes.tagFormControl} margin="none">
                {/* <Grid container alignItems="center" justify="center" className={classes.gridTagKey} spacing={2}> */}
                <Grid container classes={{ root: classes.tagMasterGrid}} whiteSpace="nowrap" alignContent="space-between" spacing={0}>
                {/* <Grid container whiteSpace="nowrap" alignItems="flex-start" spacing={0}> */}
                {/* <Grid container whiteSpace="nowrap" alignItems="center" className={classes.gridTagKey} spacing={0}> */}
                  {(() => {
                    let tagList = []
                    let displayFlag = true

                    // let showMoreGenre = 6
                    for(let j = 0;j < Object.keys(tagMap).length;j++){
                      tagList = [...tagList , 
                        <>
                          {(() => {
                            switch(j) {
                              case 0 : //ジャンル
                                return <Grid item xs={12} sm={16} justify="center" classes={{ root: classes.inputTagKey }} ><h3 className={classes.h3TagKey}>{tagExtraData.Genre.key}</h3></Grid>;
                              case showMoreGenre : 
                                displayFlag = false 
                                if(showMoreGenre != totalCountGenre){
                                  break
                                }
                              case totalCountGenre: //印象
                                displayFlag = true
                                return <Grid item xs={12} sm={16} justify="center" classes={{ root: classes.inputTagKey }} ><h3 className={classes.h3TagKey}>{tagExtraData.Impression.key}</h3></Grid>;
                              case showMoreImpression :
                                displayFlag = false
                                if(showMoreImpression != (totalCountImpression)){
                                  break
                                }
                              case totalCountImpression : // 原作
                                displayFlag = true
                                return <Grid item xs={12} sm={16} justify="center" classes={{ root: classes.inputTagKey }} ><h3 className={classes.h3TagKey}>{tagExtraData.Original.key}</h3></Grid>;
                              case showMoreOriginal :
                              // case totalCountImpression + 5 :
                                displayFlag = false                                
                                if(showMoreOriginal != (totalCountOriginal)){
                                  break
                                }
                                // break
                              case totalCountOriginal : //人
                                displayFlag = true
                                return <Grid item xs={12} sm={16} justify="center" classes={{ root: classes.inputTagKey }} ><h3 className={classes.h3TagKey}>{tagExtraData.Position.key}</h3></Grid>;
                              case showMorePosition :
                                displayFlag = false
                                if(showMorePosition != (totalCountPosition)){
                                  break
                                }
                                // break
                              default :
                                break
                            }
                          })()}

                          <Grid container item xs={4} sm={3} md={2} spacing={0} 
                          // <Grid container item xs={4} md={3} lg={2} spacing={0}
                           classes={displayFlag ? {root: classes.tagItemGrid} : {root: classes.tagItemGridHidden}} 
                           justify="space-evenly">
                            <FormControlLabel 
                              control={
                                <CheckIconBox
                                checked={tagCheckBox[Object.keys(tagMap)[j]]} onChange={tagCheckBoxHandleChange} 
                                name={Object.keys(tagMap)[j]} color={"secondary"}
                                classes={{ root: classes.inputCheck }}
                                />
                              }
                              label = {
                                [tagMap.[Object.keys(tagMap)[j]].key]
                              }
                              // className = {classes.formControlLabel}
                              
                              classes={{root: classes.tagFormControlLabel}}
                              // classes={displayFlag ? {root: classes.tagFormControlLabel} : { root: classes.tagFormControlLabelHidden}}
                                // : (classes={{ root: classes.tagFormControlLabelHidden}})
                              labelPlacement="bottom"
                              lineHeight={1}
                            />
                          </Grid>

                          {(() => {
                            switch(j) {
                              case (showMoreGenre -1) :
                               return (
                                  <Grid container item spacing={0} justify={
                                    (showMoreGenre != totalCountGenre) 
                                      ? "flex-end" 
                                      : "frex-start"
                                    }
                                    alignItems="flex-start"
                                  >  
                                  {/* : <Grid container item spacing={0} justify="flex-start" alignItems="flex-start">   */}
                                    <Button onClick={() => {
                                      // setShowMoreGenre(showMoreGenre + 3) 
                                      setShowMoreGenre((preShowMoreGenre) => { 
                                        if(showMoreGenre != totalCountGenre){　 //全てが表示されてるかいなか
                                          preShowMoreGenre = preShowMoreGenre + 51
                                          if (preShowMoreGenre > totalCountGenre) {
                                              return totalCountGenre
                                          } else {
                                            return preShowMoreGenre
                                          }
                                        } else {
                                          return 6
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
                                    (showMoreImpression != (totalCountImpression))
                                      ? "flex-end" 
                                      : "frex-start"
                                    }
                                    alignItems="flex-start"
                                  >  
                                  {/* : <Grid container item spacing={0} justify="flex-start" alignItems="flex-start">   */}
                                    <Button onClick={() => {
                                      // setShowMoreGenre(showMoreGenre + 3) 
                                      setShowMoreImpression((preShowMoreImpressions) => { 
                                        if(showMoreImpression != (totalCountImpression)){ //全てが表示されてるかいなか
                                          preShowMoreImpressions = preShowMoreImpressions + 51
                                          if (preShowMoreImpressions > (totalCountImpression)) {
                                              return (totalCountImpression)
                                          } else {
                                            return preShowMoreImpressions
                                          }
                                        } else {
                                          return (totalCountGenre + 6)
                                        }
                                      })
                                    }}> 
                                      {(showMoreImpression == (totalCountImpression) ) ? "　縮める" :  "もっと見る　"}
                                    </Button>
                                  </Grid>
                                )
                              case (showMoreOriginal - 1) :
                               return (
                                  <Grid container item spacing={0} justify={
                                    (showMoreOriginal != (totalCountOriginal))
                                      ? "flex-end" 
                                      : "frex-start"
                                    }
                                    alignItems="flex-start"
                                  >  
                                  {/* : <Grid container item spacing={0} justify="flex-start" alignItems="flex-start">   */}
                                    <Button onClick={() => {
                                      // setShowMoreGenre(showMoreGenre + 3) 
                                      setShowMoreOriginal((preShowMoreOriginal) => { 
                                        if(showMoreOriginal != (totalCountOriginal)){ //全てが表示されてるかいなか
                                          preShowMoreOriginal = preShowMoreOriginal + 51
                                          if (preShowMoreOriginal > (totalCountOriginal)) {
                                              return (totalCountOriginal)
                                          } else {
                                            return preShowMoreOriginal
                                          }
                                        } else {
                                          return (totalCountImpression + 6)
                                        }
                                      })
                                    }}> 
                                      {(showMoreOriginal == (totalCountOriginal) ) ? "　縮める" :  "もっと見る　"}
                                    </Button>
                                  </Grid>
                                )
                              case (showMorePosition - 1) :
                               return (
                                  <Grid container item spacing={0} justify={
                                    (showMorePosition != (totalCountPosition))
                                      ? "flex-end" 
                                      : "frex-start"
                                    }
                                    alignItems="flex-start"
                                  >  
                                  {/* : <Grid container item spacing={0} justify="flex-start" alignItems="flex-start">   */}
                                    <Button onClick={() => {
                                      // setShowMoreGenre(showMoreGenre + 3) 
                                      setShowMorePosition((preShowMorePosition) => { 
                                        if(showMorePosition != (totalCountPosition)){ //全てが表示されてるかいなか
                                          preShowMorePosition = preShowMorePosition + 51
                                          if (preShowMorePosition > (totalCountPosition)) {
                                              console.log("retorun max ")
                                              return (totalCountPosition)
                                          } else {
                                            return preShowMorePosition
                                          }
                                        } else {
                                          return (totalCountOriginal + 6)
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
                    // console.log(Object.keys(tagMap).length+"++Object.keys(tagMap).length")
                    // console.log("tagList")
                    // console.log(tagList)
                    return <>{tagList}</>
                  })()}
                </Grid>
              </FormControl>
            </FormGroup>

            <TextInput
                fullWidth={true} label={"コメント(5000字以内)"} multiline={true} required={true}
                rows={1} value={workComment} type={"text"} onChange={inputWorkComment}
            />

            <FormGroup row>
            <FormControlLabel
            control={
              <CheckIconBox
              checked={isSpoiler} onChange={isSpoilerHandleChange} 
              name={"ネタバレコメント"} color={"primary"}
              />
            } label = {"ネタバレコメント"}
            />
            </FormGroup>

            <FormGroup row>
            <FormControlLabel
            control={
              <CheckIconBox
              checked={isPublic} onChange={isPublicHandleChange} 
              name={"一般公開"} color={"primary"}
              />
            } label = {"投稿内容を一般公開する"}
            />
            </FormGroup>

          <PrimaryButton label={"投稿"} onClick={postButtonClicked} />

          <h2>作品情報を入力(オプション)</h2>
          <p>※新規登録なので、作品情報もオプションで入力してもらうようにする</p>
        </div>
      )
      : (
        // <div className="c-section-container">
        // </div>
        <>
        アカウントがある方はログイン、ない方はアカウント作成をしてください。
          <ul>
            <li>
              <Link
                href={{
                pathname: "/auth/signup",
                query: { hist : "Signup" },
              }}>
                <a>SignUp</a>
              </Link>
            </li>
            <li>
              {/* //ログインしているときにはsignout画面に遷移 */}
              <Link
                href={{
                pathname: "/auth/signin",
                query: { hist : "Signin" },
              }}>
                <a>SignIn</a>
              </Link>
            </li>
          </ul>
        </>
      )}
    <Footer />
    </>
  )
}

export default Posting