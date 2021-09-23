import React, {useState, useEffect, useCallback,useReducer} from 'react'
import { PrimaryButton, TextInput ,CheckIconBox} from "../../../styles/UIkit"

//MaterialUi
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { useRouter } from 'next/router'
import Link from 'next/link'
import Footer from '../../../components/footer'
import ApplicationBar from '../../../components/applicationBar'
import SpeedDialPosting from '../../../components/speedDialPosting'
// import SpeedDialPosting , {bookmark ,post, like , likeHikoukai} from '../../../components/speedDialPosting'
import ObjectSort from '../../../foundations/share/objectSort'

import { SCTypografyh5 } from 'src/styles/SC/shared/typografy/h5'

import {db , FirebaseTimestamp} from '../../../firebase/index'
import {useSelector} from 'react-redux'

import {getUserId,getUserName,getUserBookmark,getUserAssessmentWorks,getInstantChangedWorksId, getIsSignedIn} from "../../../reducks/users/selectors";
// import { postWorkCreate } from '../../../reducks/works/operations'

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import CreateIcon from '@material-ui/icons/Create';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import CollectionsBookmarkOutlinedIcon from '@material-ui/icons/CollectionsBookmarkOutlined';

import GLoading from 'src/components/GLoading'
import like ,{likeHikoukai} from 'src/components/speedDial/like'
import bookmark from 'src/components/speedDial/bookmark'
import post from 'src/components/speedDial/post'

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
  winfoTag　: [],
  isLiked : false,
  isBookmark : false,
  sdpActions : [],
  isAssessed : false,
  isAssessmenter : false, // isPublic == true で評価しているユーザが一人でもいるか。
  isMyAssessmentPublic : false,
  assessmentData : [], //評価者一覧のデータ
}

const reducer = (state, action) => {

  console.log("state")
  console.table(state)

  console.log("action.payload")
  console.table(action.payload)

  //更新データがあればそれに書き換える。
  let putState = {...state,...action.payload} ///宣言的に書くっていう観点で言うとこれほんとに意味ない。
  //ただ、State分の再描写はしなくなっているからそれの恩恵は受けられている。

  let sdpActions = []

  console.log("putState")
  console.dir(putState)
  // console.log(JSON.stringify(putState,null,2)+"+putState") //なぜかブックマーク登録時にエラーになる

  if(putState.isLiked){
    sdpActions = [
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
      }
    ]
  } else{
    sdpActions = [
      { 
        icon: <CreateIcon />,
        name: (!putState.isAssessed) ? '評価投稿' : '評価を編集',
        function: post,
      },
      {
        icon: (putState.isBookmark) 
          ? <CollectionsBookmarkOutlinedIcon /> 
          : <CollectionsBookmarkIcon />,
        name: (putState.isBookmark) 
          ? 'ブックマーク解除' 
          : 'ブックマーク' ,
        function: bookmark
      },
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

    default :{
      throw new Error("not exect action")
    }
  }
}

const getOriginalDBData = async(params,history) => {

  let assessmentUrl = ""

  console.log(history+"+history")

  console.log(process.env.url+"+process.env.url")

  if (history == 'Post'){
    assessmentUrl = `/api/firebase/assessment/${params.postWorkId}`

  } else {
    assessmentUrl = `${process.env.url}/api/firebase/assessment/${params.postWorkId}`
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
    db.collection('wInfo').doc(params.postWorkId).get()
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
  ])

  console.log(dBData+"+dBData")

  return {assessment: dBData[0], wInfo: dBData[1]}

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

  const RdUserName = getUserName(selector)
  const RdIsBookmark = getUserBookmark(selector)
  const RdAssessmentWorks = getUserAssessmentWorks(selector)
  const RdInstantChangedWorksId = getInstantChangedWorksId(selector)

  const timestamp = FirebaseTimestamp.now()

  const useStyles = makeStyles((thema) => ({
    h3WorksName: {
      margin : "0px 4px 9px 4px",
    },
    boxTotalStyle : {
      position : "relative",
      top : "-1.3rem",
    },
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
  }))

  const classes = useStyles();

  console.log(workId+"=workId")

  const getDBData = async() => {

    let assessmentSnapshot = {}
    let wInfoSnapshot = {}

    const isIncludesICW = Object.keys(RdInstantChangedWorksId).includes(workId)

    console.log(isIncludesICW+"isIncludesICW")

    if(isIncludesICW &&
    RdInstantChangedWorksId?.[workId].timestamp.seconds >= timestamp.seconds - SSG_WAIT_SEC){
    //更新から１０分以内であれば、DBからデータ持ってくる

      console.log("get original db")
      const params = { 
        postWorkId : workId,
        postUserId : 'index',
      }

      const history = 'Post' 
      const DBData = await getOriginalDBData(params,history)

      assessmentSnapshot = DBData.assessment
      wInfoSnapshot = DBData.wInfo

    } else {
      console.log("get props")
      assessmentSnapshot = props.assessment
      wInfoSnapshot = props.wInfo
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
    // console.log(RdAssessmentWorks[workId])
    // console.log(RdAssessmentWorks[workId].["isLiked"])

    await dispatch({type:"loadDB" ,
      payload : {
        //wInfoSnapshot
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
        winfoTag : (ObjectSort(wInfoSnapshot.winfoTag,"asc")),
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
        //スピードダイアルのボタン
        sdpActions : [],
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
        <Box className={classes.boxTotalStyle}> 
          <SCTypografyh5>
            {"作品名"}
          </SCTypografyh5>        

          <h3 className={classes.h3WorksName}>
            {state.workName +" ("+state.workMedia+")"}
          </h3>

          <SCTypografyh5>
            {"スコア"}
          </SCTypografyh5> 

          <h3 className={classes.h3WorksName}>
            {state.workScore != -1 ? Math.floor(state.workScore * 10) / 10  : "評価なし"}
          </h3>

          <SCTypografyh5>
            {"評価投稿数"}
          </SCTypografyh5> 

          <h3 className={classes.h3WorksName}>
            {state.infoCount}
          </h3>

          <SCTypografyh5>
            {"いいね数"}
          </SCTypografyh5> 

          <h3 className={classes.h3WorksName}>
            {state.likedCount ? state.likedCount : 0}
          </h3>

          {/* いらなそうだけど・・・
          {workScore == [""] && (
            <h2>score: 未評価 </h2>
          )} */}

          <SCTypografyh5>
            {"情報"}
          </SCTypografyh5> 

          <h3 className={classes.h3WorksName}>
            {state.workInfo}
          </h3>

          <SCTypografyh5>
            {"カテゴリ"}
          </SCTypografyh5> 
          
          <h3 className={classes.h3WorksName}>{state.winfoCategory.map(cate => (
            <span>{cate} </span>
          ))}</h3>

          <SCTypografyh5>
            {"タグ/属性"}
          </SCTypografyh5>

          <h3 className={classes.h3WorksName}>{Object.keys(state.winfoTag).map(tokens => (
            <>
            {/* {(1) && ( */}
            {state.winfoTag[tokens] 
            ? (
              <div >
              {/* <span>{tokens}:{winfoTag[tokens]} </span> */}
              {tokens+":"+state.winfoTag[tokens]+" "}
              </div >
            )
            : (
              ''
            )}
            </>
          ))}</h3>

          <SCTypografyh5>
            {"クリエーター"}
          </SCTypografyh5> 
          
          <h3 className={classes.h3WorksName}>
            {state.workCreator.length ? state.workCreator[0].kind+":"+state.workCreator[0].name : "no data at Creator" }
          </h3>

        　 <SCTypografyh5>
            {"シリーズ"}
          </SCTypografyh5> 
          
          <h3 className={classes.h3WorksName}>
            {state.workSeries ? state.workSeries : "no data at workSeries"}
          </h3>

          {/* <h2>クリエーター：{workCreator ? workCreator : "no data at Creator" }</h2> */}
          {/* <p>シリーズ：{workSeries ? workSeries : "no data at workSeries"}</p> */}

          {/* <p>出版社：{workPublisher}</p>
          <p>発表：{workStart}</p>
          <p>完結：{workFinish}</p>
          <p>画：{workImage}</p> */}

          <h3>みんなの評価</h3>
          {(state.assessmentData.length != 0 && state.isAssessmenter == true) && (
            <>
              <ul>
                {state.assessmentData.map(mapAssessmentData => ( 
                  <>
                    {(mapAssessmentData.uid != "非公開" && mapAssessmentData.uid != userId ) && (
                      <>
                        <li>
                          <Link href="/post/[id]/[postUserId]" 
                            as={`/post/${workId}/${mapAssessmentData.uid}`}>
                            <a>{mapAssessmentData.userName}</a>
                          </Link>
                        </li>
                      </>
                    )}
                    {mapAssessmentData.uid == userId && (
                      isLoginUserAssessment = true
                    )}
                  </>
                ))}
              </ul>
            </>
          )}
          {state.isAssessmenter == false && (<p> 公開可能情報なし </p>) }

          {/* <h3>あなたの評価</h3> */}
          {/* <a>userId:::: {userId}</a> */}
          {isLoginUserAssessment == true && (
            <>
              <Link href="/post/[id]/[postUserId]" 
                as={`/post/${workId}/${userId}`}>
                <p>{RdUserName}自身の評価をみる</p>
              </Link>
            </>
          )}

          <>
            <Link href={{
              pathname: "/post/posting",
              query: {
                searchWord: state.workName,
                infoMedia : state.workMedia,
                workId : workId,
                firstPostFlag : state.isAssessed ? 2 : 0 ,
              }
            }}>
              <a>[{state.workName}] {state.isAssessed ? "の評価を編集する。" : "を評価する。"} </a>
            </Link>
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
              />) 
            }
          </>
        </Box>

        {(state.isLiked && state.isMyAssessmentPublic) ? <FavoriteIcon className={classes.isLikedSignal}/> : null}
        {(state.isLiked && !state.isMyAssessmentPublic) ? <FavoriteTwoToneIcon className={classes.isLikedSignal}/> : null}
        {(state.isBookmark && !state.isLiked) ? <CollectionsBookmarkIcon className={classes.isLikedSignal}/> : null}
        {(state.isBookmark && state.isLiked) ? <CollectionsBookmarkIcon className={classes.isBookmarkSignal}/> : null}
        <Footer />
      </>
    )
  }
}

export async function getStaticPaths() {

  let postWorkId = false
  const snapshot = await db.collection('wInfo').get()

  snapshot.forEach((doc) => {
    if(postWorkId == false) {
      postWorkId = [doc.data().workId]
    } else {
      postWorkId = [...postWorkId , doc.data().workId]
    }
  })

  console.log("postWorkId")
  console.table(postWorkId)

  const paths = postWorkId.map((map) => (
    { params: { postWorkId: map , postUserId : 'index'}}
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
