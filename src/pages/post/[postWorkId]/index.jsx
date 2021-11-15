import React, {useState, useEffect, useCallback,useReducer} from 'react'
import { TextInput ,CheckIconBox} from "../../../styles/UIkit"

//MaterialUi
// import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';

import { useRouter } from 'next/router'
import Link from 'next/link'
import Footer from '../../../components/footer'
import ApplicationBar from '../../../components/applicationBar'
import SpeedDialPosting from '../../../components/speedDialPosting'
// import SpeedDialPosting , {bookmark ,post, like , likeHikoukai} from '../../../components/speedDialPosting'
import ObjectSort from '../../../foundations/share/objectSort'

//style
import { SCTypografyh5,SCTypografyh5Top } from 'src/styles/SC/shared/typografy/h5'
import { ExplanationTextDefault } from 'src/styles/SC/shared/typografy/ExplanationTextDefault'
import { CSHighLightSkewBar } from "src/styles/SC/shared/typografy/highLightSkewBar"
import ItemExplanationSet from 'src/components/ItemExplanationSet'
import { TitleSpacing } from 'src/styles/SC/shared/grid/titleSpacing'
import { MiddleTitle } from "src/styles/SC/shared/typografy/middleTitle"

import {db} from '../../../firebase/index'
import {useSelector} from 'react-redux'
import {collection, doc, query, where, getDocs ,getDoc ,setDoc , Timestamp} from "firebase/firestore";

import {getUserId,getUserName,getUserBookmark,getUserAssessmentWorks,getInstantChangedWorksId, getIsSignedIn} from "../../../reducks/users/selectors";
// import { postWorkCreate } from '../../../reducks/works/operations'

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';

import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import GLoading from 'src/components/GLoading'
import DeleteWork from 'src/components/DeleteWork'

import like ,{likeHikoukai} from 'src/components/speedDial/like'
import bookmark from 'src/components/speedDial/bookmark'
import post from 'src/components/speedDial/post'
import workDelete from 'src/components/speedDial/workDelete'


import {SSG_WAIT_SEC} from 'src/foundations/share/GlobalConstant'

const initialState = {
  isLoading : true,
  workName : "not definded",
  infoCount : 0,
  likedCount : 0,
  workScore : "",
  // workComment : "",
  winfoCategory : [],
  workCreator : "",
  workInfo : "",
  workSeries : "",
  workMedia : "",
  // workPublisher : "",
  workStart : "",
  workFinish : "",
  workImage : "",
  workCountry : "",
  workMusic : [],
  winfoTag　: [],
  isLiked : false,
  isBookmark : false,
  sdpActions : [],
  isAssessed : false,
  isAssessmenter : false, // isPublic == true で評価しているユーザが一人でもいるか。
  isMyAssessmentPublic : false,
  assessmentData : [], //評価者一覧のデータ
  // MyAssessmentWorkTag : [],
  // MyAssessmentIsLiked : false,
  // MyAssessmentWorkScore : "",
  deletable : false,
}

const reducer = (state, action) => {

  console.log("state")
  console.table(state)

  console.log("action.payload")
  console.table(action.payload)

  //更新データがあればそれに書き換える。
  let putState = {...state,...action.payload} ///宣言的に書くっていう観点で言うとこれほんとに意味ない。
  //ただ、State分の再描写はしなくなっているからそれの恩恵は受けられている。
  console.log("putState")
  console.dir(putState)
  // console.log(JSON.stringify(putState,null,2)+"+putState") //なぜかブックマーク登録時にエラーになる

  let sdpActions = [
    { icon: <CreateIcon />, 
      name: (!putState.isAssessed) 
        ? '評価投稿' 
        : '評価を編集',
      function : post,
    },
    { icon: (putState.isBookmark) 
        ? <CollectionsBookmarkOutlinedIcon /> 
        : <CollectionsBookmarkIcon />,
      name: (putState.isBookmark)
        ? 'ブックマーク解除' 
        : 'ブックマーク' ,
      function : bookmark ,
    },
  ]
  if(!putState.isLiked){
    sdpActions = [ ...sdpActions,
      { 
        icon: <FavoriteTwoToneIcon />,
        name: 'いいね！(非公開)' ,
        function: likeHikoukai
      },
      { 
        icon: <FavoriteIcon />,
        name: 'いいね！' ,
        function: like
      },
    ]
  }
  if(putState.deletable){ // 自身が作品作成者であり、他の評価者がいない場合。
    sdpActions = [ ...sdpActions,
      { icon: <DeleteIcon />,
        name: "作品を削除",
        function : workDelete ,
      },
    ]
  }

  putState = { ...putState ,sdpActions : sdpActions }

  switch (action.type){
    case "loadDB": {
      return {
        ...putState,
        // sdpActions : sdpActions,
        // isLoading : false
      }
    }

    case "infoCountChange" : {
      return {
        ...putState,
        // sdpActions : sdpActions,
      }
    }
    case "setIsBookmark" : {
      return {
        ...putState,
        // sdpActions : sdpActions,
      }
    }

    case "isLikeChange" : {
      return {
        ...putState,
      }
    }

    case "IS_LOADING" : {
      console.log("reducer IS_LOADING")
      return {
        ...state,
        ...action.payload.isLoading,
      }
    }

    default :{
      throw new Error("not exect action")
    }
  }
}

const getOriginalDBData = async(params,history) => {

  let assessmentUrl = ""

  console.log(history+"+history")

  console.log(process.env.url+"+process.env.url")

  //////////////////////////ここじゃね？・・？
  if (history == 'Post'){
    assessmentUrl = `/api/firebase/get/assessmentSimple/${params.postWorkId}`

  } else {
    assessmentUrl = `${process.env.url}/pages/api/firebase/get/assessmentSimple/${params.postWorkId}`
    // assessmentUrl = `${process.env.NEXT_PUBLIC_URL}/api/firebase/assessment/${params.postWorkId}`
  }
  console.log(assessmentUrl+"+assessmentUrl")

  const dBData = await Promise.all([
    //dBData[0]
    fetch(assessmentUrl)
    .then(async(res)=> {
      const data = await res.json()
      console.log("successed to get assessment")
      if (res.status !== 200) {
        throw new Error(data.message)
      }
      return data
    }).catch((error) => {
      // alert('assessment DB get fail')
      console.log('assessment DB get fail')
      throw new Error(error)
    }),
    
    //dBData[1]
    // db.collection('wInfo').doc(params.postWorkId).get()
    getDoc(doc(db,'wInfo',params.postWorkId))
    .then((res) => {
      console.log("successed to get wInfo")
      const data = res.data()
      return data
    })
    .catch((error) => {
      console.log('wInfo DB get fail')
      // alert('wInfo DB get fail')
      throw new Error(error)
    }),
    //dBData[2]
    // getDoc(doc(db, 'privateUsers', userId , 'postedWorksId', params.postWorkId))
    // .then((res) => {
    //   console.log("successed to get postedWorksId")
    //   const data = res.data()
    //   return data
    // })
    // .catch((error) => {
    //   console.log('postedWorksId DB get fail')
    //   throw new Error(error)
    // }),
  ])

  console.log(dBData+"+dBData")

  // return {assessment: dBData[0], wInfo: dBData[1]}
  return {assessment: dBData[0].workData, 
    wInfo: {
      ...dBData[1],
      createTime : dBData[1].createTime.toDate().toLocaleString("ja"),
      updateTime : dBData[1].updateTime.toDate().toLocaleString("ja"),
    },
    // postedWorksId : {
    //   ...dBData[2],
    //   created_at : dBData[2].created_at.toDate().toLocaleString("ja"),
    //   updated_at : dBData[2].updated_at.toDate().toLocaleString("ja"),
    //   workWatchYear : dBData[2].workWatchYear.toDate().toLocaleString("ja"),
    // }
  }
}

//作品情報閲覧ページ
const Post = (props) => {
  const selector = useSelector((state) => state)
  const userId = getUserId(selector)
  const isSignIn = getIsSignedIn(selector)

  const router = useRouter()
  const { isReady } = useRouter()
  const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう
  const workId = /^\/post\//.test(query) ? query.split('\/post\/')[1] : ""

  const [state,dispatch] = useReducer(reducer, initialState)

  const [workDeleteDialogFlag,setWorkDeleteDialogFlag] = useState(false)

  const RdUserName = getUserName(selector)
  const RdIsBookmark = getUserBookmark(selector)
  const RdAssessmentWorks = getUserAssessmentWorks(selector)
  const RdInstantChangedWorksId = getInstantChangedWorksId(selector)

  const timestamp = Timestamp.now()

  console.log(Timestamp.now()+"+Timestamp")
  // console.log(Timestamp+"+Timestamp")
  console.log(JSON.stringify(Timestamp)+"+Timestamp@J")

  const classes = {
    isLikedSignal : {
      position: 'fixed',
      top : "2.4em",
      right : "0.6em",
    },
    isBookmarkSignal : {
      position: 'fixed',
      top : "3.9em",
      right : "0.6em",
    },
    workMedia : {
      fontSize : "1rem",
      marginLeft : "1rem",
      position : "relative",
      top : "0.1rem",
    },
    workCategory : {
      fontSize : "0.6rem",
      marginLeft : "1rem",
      marginBottom : "0.7rem",
      position : "relative",
      // top : "0.1rem",
    },
  }

  // const classes = useStyles();

  console.log(workId+"=workId")

  const getDBData = async() => {

    let assessmentSnapshot = {}
    let wInfoSnapshot = {}
    let postedWorksIdSnapshot = {}

    const isIncludesICW = Object.keys(RdInstantChangedWorksId).includes(workId)

    console.log(isIncludesICW+"isIncludesICW")

    if(isIncludesICW &&
    RdInstantChangedWorksId?.[workId].timestamp.seconds >= timestamp.seconds - SSG_WAIT_SEC){
    //更新から１０分以内であれば、DBからデータ持ってくる

      console.log("get original db")
      const params = { 
        postWorkId : workId,
        // postUserId : 'index',
      }

      const history = 'Post' 
      const DBData = await getOriginalDBData(params,history)

      assessmentSnapshot = DBData.assessment
      wInfoSnapshot = DBData.wInfo

    } else {
      console.log("get props")
      assessmentSnapshot = props.assessment
      wInfoSnapshot = props.wInfo
      postedWorksIdSnapshot = props.postedWorksId
    }

    let isAssessmenterFlag = false
    if(assessmentSnapshot){
      assessmentSnapshot.some((doc) => {
        //一つでも非公開以外があればフラグを立てる
        //(「公開可能情報なし」と表示しない)
        console.log(JSON.stringify(doc,null,2)+"+doc")
        if(doc.uid != "非公開") {
          isAssessmenterFlag = true
          return true;
        }
      })
    }

    console.log("RdAssessmentWorks")
    console.table(RdAssessmentWorks)
    console.log(JSON.stringify(postedWorksIdSnapshot)+"+postedWorksIdSnapshot@J")

    await dispatch({type:"loadDB" ,
      payload : {
        isLoading : false,
        workName : wInfoSnapshot.workName,
        infoCount : wInfoSnapshot.winfoCount,
        likedCount : wInfoSnapshot.winfoLikedCount,
        workScore : wInfoSnapshot.winfoScore,
        // workComment : wInfoSnapshot.winfoComment,
        winfoCategory : wInfoSnapshot.winfoCategory,
        workCreator : wInfoSnapshot.winfoCreator,
        workInfo : wInfoSnapshot.winfoInfomation,
        workSeries : wInfoSnapshot.winfoSeries,
        workMedia : wInfoSnapshot.winfoMedia,
        // workPublisher : wInfoSnapshot.winfoPublisher,
        workStart : wInfoSnapshot.winfoStart,
        workFinish : wInfoSnapshot.winfoFinish,
        workImage : wInfoSnapshot.winfoImage,
        workCountry : wInfoSnapshot.winfoCountry,
        workMusic : wInfoSnapshot.winfoMusic,
        winfoTag : (ObjectSort(wInfoSnapshot.winfoTag,"desc",1)),
        //assessmentSnapshot
        assessmentData : (assessmentSnapshot && state.assessmentData.length == 0) ? [...assessmentSnapshot] : state.assessmentData,
        isAssessmenter : isAssessmenterFlag,
        //privateUsersSnapshot
        isBookmark : RdIsBookmark
          ? Object.keys(RdIsBookmark).includes(workId) ? true : false 
          : false 
        ,
        //postedWorksIdSnapshot
        //ログインユーザが「いいね」しているかどうか
        isLiked : RdAssessmentWorks?.[workId]?.["isLiked"], 
        //ログインユーザが既に評価しているか？
        isAssessed : Object.keys(RdAssessmentWorks).includes(workId) 
          ? true 
          : false
        , 
        //ログインユーザが評価した作品の公開有無
        isMyAssessmentPublic : RdAssessmentWorks?.[workId]?.["isPublic"] 
          ? true 
          : false
        ,
        sdpActions : [],
        // MyAssessmentWorkTag : postedWorksIdSnapshot.assessmentWorkTag,
        // MyAssessmentIsLiked : postedWorksIdSnapshot.isLiked,
        // MyAssessmentWorkScore : postedWorksIdSnapshot.workScore,
        deletable : wInfoSnapshot.deletable,
      }
    })
  }
  useEffect(() => {
    if(isReady){ //これ挟まないとnext/routerのバグ(初期表示時にasPathがundefinedになる)を踏んでしまう。
      getDBData()
    } 
  },[isReady]) //isReadyに変化があった場合は再描写してくれるからこれでいい。はず。
  console.log("state@[postWorkId]/index.js")
  console.table(state)
  console.log(JSON.stringify(RdInstantChangedWorksId)+"+RdInstantChangedWorkId")
  if(state.isLoading){
    return(
      <GLoading />
      )
  } else {
    let isLoginUserAssessment = false
    return (
      <>     
        <ApplicationBar title="作品情報"/>

        <Typography variant="h5" component="h1">
          {state.workName}
        </Typography>

        <Typography variant="h6" component="h3" align="left" sx={classes.workMedia}>
          {state.workMedia}
        </Typography>
        
        <Typography variant="h6" component="h4" align="left" sx={classes.workCategory}>
          {state.winfoCategory.map(cate => (
          <span>{cate} </span>
        ))}
        </Typography>

        <CSHighLightSkewBar>
          <div>詳細情報</div>
        </CSHighLightSkewBar>

        <ItemExplanationSet middleTitle="作品情報" text={
          state.workInfo ? state.workInfo : "未登録"
        }/>

        <ItemExplanationSet middleTitle="関係者" text=
          {state.workCreator.length 
            ? state.workCreator.map((map) => (
              <><ExplanationTextDefault>
                {map.kind+` `+map.name}
              </ExplanationTextDefault></>
            ))
            : "未投稿"
          }
        />
        
        <ItemExplanationSet middleTitle="制作国" text={
          state.workCountry ? state.workCountry : "未登録"
        }/>
        <ItemExplanationSet middleTitle="リリース" text={
          state.workStart ? state.workStart : "未登録"
        }/>
        <ItemExplanationSet middleTitle="完結" text={
          state.workFinish ? state.workFinish : "未登録"
        }/>
        <ItemExplanationSet middleTitle="主題歌" text=
          {state.workMusic.length 
            ? state.workMusic.map((map) => (
              <>
                <ExplanationTextDefault>
                  {map.kind+` `+map.name}
                </ExplanationTextDefault>
              </>
            ))
            : "未投稿"
          }
        />

        <CSHighLightSkewBar style={{marginTop : "30px"}}>
          <div>評価情報</div>
        </CSHighLightSkewBar>

        <ItemExplanationSet middleTitle="平均評価" text={
          state.workScore != -1 
            ? Math.floor(state.workScore * 10) / 10  
            : "評価なし"
        }/>
        
        <ItemExplanationSet middleTitle="評価数" text={
          state.infoCount ? state.infoCount : "未登録"
        }/>

        {/* <ExplanationTextDefault>
          {state.infoCount}
        </ExplanationTextDefault> */}

        <ItemExplanationSet middleTitle="いいね数" text={
          state.likedCount ? state.likedCount : "未登録"
        }/>

        {/* <SCTypografyh5>
          {"いいね数"}
        </SCTypografyh5>
        <ExplanationTextDefault>
          {state.likedCount ? state.likedCount : 0}
        </ExplanationTextDefault> */}

        {/* いらなそうだけど・・・
        {workScore == [""] && (
          <h2>score: 未評価 </h2>
        )} */}

        <TitleSpacing container item xs={12}>
          <Grid container item xs={3} justifyContent={"flex-start"}>
          <MiddleTitle>
            {/* {props.middleTitle} */}
            {"タグ"}
          </MiddleTitle>
          </Grid>

          <Grid container item xs={8} alignItems={"center"} style={{
            marginLeft : "0.9rem",
          }}>
            {/* {Object.keys(state.winfoTag).map(token => ( */}
            {(() => {
              let befNumber = 0;
              let tags = []
              for(let i = 0;i < Object.keys(state.winfoTag).length;i++){
                var token = Object.keys(state.winfoTag)[i]
                if(state.winfoTag[token] == 0){
                  befNumber = state.winfoTag[token]
                  continue;
                }
                
                tags = [...tags,
                  <>
                  <Grid container item xs={12}>
                    <Grid container item xs={2}> {/* 投稿件数表示部*/}
                    <ExplanationTextDefault>
                      {state.winfoTag[token] !== befNumber 
                        ? state.winfoTag[token]
                        : ""
                      }
                    </ExplanationTextDefault>
                    </Grid>
                    <Grid container item xs={10}> {/* タグ名表示部 */}
                    <ExplanationTextDefault>
                      {token}
                    </ExplanationTextDefault>
                    </Grid>
                  </Grid>
                  </>
                ]
                befNumber = state.winfoTag[token]
              }
              return <>{tags}</>;
            })()}
            {/* ))} */}
          </Grid>
        </TitleSpacing>

        {/* step2 */}
        {/* <p>シリーズ：{workSeries ? workSeries : "no data at workSeries"}</p> */}

        {/* <h3>この作品を評価した人</h3> */}

        <CSHighLightSkewBar style={{marginTop : "30px"}}>
          <div>評価者</div>
        </CSHighLightSkewBar>

        <ItemExplanationSet middleTitle="お名前" text={
          <>
            {(state.assessmentData.length != 0 && state.isAssessmenter == true) && (
              <>
                {state.assessmentData.map(mapAssessmentData => ( 
                  <>
                    {/* {(mapAssessmentData.uid != userId ) && ( //自身は非表示（別途表示） */}
                    {/* 表示してもいいか */}
                      <>
                        <ExplanationTextDefault>
                          <Link 
                            href="/post/[postWorkId]/[postUserId]" 
                            as={`/post/${workId}/${mapAssessmentData.uid}`}>
                            <a>
                              {mapAssessmentData.userName}
                              {mapAssessmentData.uid == "非公開" 
                                ? "　(非公開)"
                                : null
                              }
                            </a>
                          </Link>
                        </ExplanationTextDefault>
                      </>
                    {/* )} */}
                    {mapAssessmentData.uid == userId && (
                      isLoginUserAssessment = true
                    )}
                  </>
                ))}
              </>
            )}
            {state.isAssessmenter == false && <a> 公開可能情報なし </a>}
            {/* {state.isAssessmenter == false || (state.isAssessed && state.isMyAssessmentPublic) && (<p> 公開可能情報なし </p>)} */}
          </>
        }/>
        <ItemExplanationSet middleTitle="自己評価" text={
          state.isAssessed 
            ? state.isMyAssessmentPublic
              ? <Link 
                  href="/post/[postWorkId]/[postUserId]" 
                  as={`/post/${workId}/${userId}`}
                >
                  <a>公開評価</a>
                </Link>
              : <Link 
                  href="/post/[postWorkId]/[postUserId]" 
                  as={`/post/${workId}/${userId}`}
                >
                  <a>非公開評価</a>
                </Link>
            : "未評価"
        }/>

        {isSignIn && (<SpeedDialPosting
            workName={state.workName} 
            workMedia={state.workMedia} 
            workId={workId} 
            isLiked={state.isLiked}
            isBookmark={state.isBookmark}
            likedCount={state.likedCount}
            isAssessed={state.isAssessed}
            infoCount={state.infoCount}
            // uid={userId}
            isPublic={true}//常にtrueで渡して、非公開の時にlikeHikoukaiでfalseに変える
            pfirstPostFlag={state.isAssessed ? 2 : 0} 
            hist={"work"}
            sdpActions={state.sdpActions}
            dispatch={dispatch}
            setWorkDeleteDialogFlag={setWorkDeleteDialogFlag}
          />) 
        }

        {
          workDeleteDialogFlag
            ? <DeleteWork 
                setWorkDeleteDialogFlag={setWorkDeleteDialogFlag} 
                workId={workId}
                // workTag={state.workTag}
                // isLiked={state.isLiked}
                // workScore={state.workScore}
                // workWatchTimes={state.workWatchTimes}
                dispatch={dispatch}
              />
            : ""
        }
        {(state.isLiked && state.isMyAssessmentPublic) ? <FavoriteIcon sx={classes.isLikedSignal}/> : null}
        {(state.isLiked && !state.isMyAssessmentPublic) ? <FavoriteTwoToneIcon sx={classes.isLikedSignal}/> : null}
        {(state.isBookmark && !state.isLiked) ? <CollectionsBookmarkIcon sx={classes.isLikedSignal}/> : null}
        {(state.isBookmark && state.isLiked) ? <CollectionsBookmarkIcon sx={classes.isBookmarkSignal}/> : null}
        <Footer />
      </>
    )
  }
}

export async function getStaticPaths() {
  let postWorkId = []
  // const snapshot = await db.collection('wInfo').get()
  const snapshot = await getDocs(collection(db,'wInfo'))
  snapshot.forEach((doc) => {
    postWorkId = [...postWorkId , doc.data().workId]
    // if(postWorkId.length == 0) {
    //   postWorkId = [doc.data().workId]
    // } else {
    //   postWorkId = [...postWorkId , doc.data().workId]
    // }
  })

  console.log("postWorkId")
  console.table(postWorkId)

  const paths = postWorkId.map((map) => (
    // { params: { postWorkId: map , postUserId : 'index'}}
    { params: { postWorkId: map }}
    // { params: { postWorkId: map }}
  ))
  
  console.log("paths")
  console.table(paths)
  // return {paths:[],fallback : true}
  return {paths: paths,fallback : true}

}

export async function getStaticProps({ params }) {
  // 受け取ったパスパラーメータをもとに処理を行う
  console.log("params@staticProps")
  console.table(params)

  const history = 'Props'

  const setDBData = await getOriginalDBData(params,history)

  console.log("setDBData")
  console.table(setDBData)

  return {
    props: setDBData,
    revalidate: 60,
  }
}

export default Post
