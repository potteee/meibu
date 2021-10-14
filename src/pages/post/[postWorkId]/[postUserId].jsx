// この位置に人ごとの作品採点情報をおく
// [postUserId].js
import React, {useState, useEffect, useCallback,useReducer} from 'react'
import { useRouter } from 'next/router'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import ApplicationBar from '../../../components/applicationBar'
import SpeedDialPosting from '../../../components/speedDialPosting'
import {SSG_WAIT_SEC} from 'src/foundations/share/GlobalConstant'
import ItemExplanationSet from 'src/components/ItemExplanationSet'

import { db } from '../../../firebase/index'
import { collection, doc, query, where, getDocs ,getDoc ,setDoc ,Timestamp } from "firebase/firestore";

import {useDispatch, useSelector} from "react-redux";
import {getUserId ,getUserName,getUserAssessmentWorks,getInstantChangedWorksId ,getIsSignedIn} from '../../../reducks/users/selectors'

import CreateIcon from '@mui/icons-material/Create';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';

import { TitleSpacing } from 'src/styles/SC/shared/grid/titleSpacing'
import { MiddleTitle } from "src/styles/SC/shared/typografy/middleTitle"
import { CSHighLightSkewBar,CSHighLightSkewInnerBar } from "src/styles/SC/shared/typografy/highLightSkewBar"

import Link from 'next/link'

import post from 'src/components/speedDial/post'
import GLoading from '../../../components/GLoading'

const classes = {
  workMedia : {
    fontSize : "1rem",
    marginLeft : "1rem",
    position : "relative",
    top : "0.1rem",
  },
  assesmenter : {
    color : "gray",
    fontSize : "1rem",
    marginRight : "0.6rem",
    // marginRight : "1em",
    // alignItem : flex-end
  },
  unpublic : {
    color : "gray",
    fontSize : "0.2rem",
    marginRight : "0.6rem",
  },
  score : {
    fontSize : "1.5em",
  },
  date : {
    marginTop : "1.5rem",
    marginBottom : "4rem",
    fontSize : "0.7rem",
  }
}

//ユーザごとの作品ページを検索
const initialState = {
  isLoading : true,
  userName : "",
  workName : "",
  workMedia : "",
  workScore : "",
  workCategory : "",
  workTag : [],
  workComment : "",
  isLiked : false,
  isSpoiler : false,
  workInfomation : "",
  workCreateTime : "-",
  workUpdateTime : "-",
  workWatchYear : "-",
  workWatchTimes : "-",
  assessmentComment : [""],
  assessmentLike : 0,
  isPublic : false,
  loginUserData : 0, //評価している１：していない２
}

const reducer = (state,action) => {
  switch(action.type){
    case "loadDB" : {
      return {
        ...state,
        ...action.payload,
      }
    }
  }
}

const getOriginalDBData = async(params,history) => {

  console.log(history+"+history")

  const dBData = await Promise.all([
  //dBData[0]
    // db.collection('wInfo').doc(params.postWorkId).collection('assessment').doc(params.postUserId).get()
    getDoc(doc(db, 'wInfo', params.postWorkId, 'assessment', params.postUserId))
    .then((res)=> {
      const data = res.data()
      console.log("successed to get assessment")
      return data
    }).catch((error) => {
      console.log('assessment DB get fail')
      throw new Error(error)
    }),
    
    //dBData[1]
    // db.collection('wInfo').doc(params.postWorkId).get()
    getDoc(doc(db, 'wInfo', params.postWorkId))
    .then((res) => {
      console.log("successed to get wInfo")
      const data = res.data()
      return data
    })
    .catch((error) => {
      console.log('wInfo DB get fail')
      throw new Error(error)
    }),

    //dBData[2]
    // db.collection('privateUsers').doc(params.postUserId).collection('postedWorksId').doc(params.postWorkId).get()
    getDoc(doc(db, 'privateUsers', params.postUserId, 'postedWorksId', params.postWorkId))
    .then((res) => {
      console.log("successed to get postedWorksId")
      const data = res.data()
      return data
    })
  ])

  console.log("+dBData[0]")
  console.log(dBData[0])
  console.log("+dBData[1]")
  console.log(dBData[1])
  console.log("+dBData[2]")
  console.log(dBData[2])

  const setDBData = {
    assessment: dBData[0] 
      ? {
        ...dBData[0],
        createTime : dBData[0].createTime //型変換して入れ直してあげないとSerializableErrorで怒られる
          ? dBData[0].createTime.toDate().toLocaleString("ja") 
          : null
        , //最近追加２０２１０８０６ 
        updateTime : dBData[0].updateTime.toDate().toLocaleString("ja"),
        workWatchYear : dBData[0].workWatchYear
          ? dBData[0].workWatchYear.toDate().toLocaleString("ja")
          : null
      }
      : null  
    ,
    wInfo: {
      ...dBData[1],
    },
    postedWorksId : {
      ...dBData[2],
      created_at : dBData[2].created_at.toDate().toLocaleString("ja"),
      updated_at : dBData[2].updated_at.toDate().toLocaleString("ja"),
      workWatchYear : dBData[2].workWatchYear.toDate().toLocaleString("ja"),
    }
  }

  return setDBData
}

const handlerPostUserId = (props) => {

  console.log("main props")
  console.table(props) //SGしたオブジェクトを格納

  const selector = useSelector((state) => state)
  const RdGetUid = getUserId(selector)
  const RdUserName = getUserName(selector)
  const RdUserAssessmentWorks = getUserAssessmentWorks(selector)
  const RdInstantChangedWorksId = getInstantChangedWorksId(selector)
  const isSignedIn = getIsSignedIn(selector)

  const router = useRouter()
  const { isReady } = useRouter()

  const [state,dispatch] = useReducer(reducer, initialState)
  const [showComment, setShowComment] = useState(false)

  const timestamp = Timestamp.now()

  const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう
  console.log(query+"+query at postUserId")
  const postWorkId = /^\/post\//.test(query) ? query.split('\/')[2] : "no data query"
  const postUserId = /^\/post\//.test(query) ? query.split('\/')[3] : "no data query"
  console.log(postUserId+"+postUserId")
  console.log(postWorkId+"+postWorkId")

  const getDBData = async() => {
    console.log("getDBData start")
    let assessmentSnapshot = {}
    let wInfoSnapshot = {}
    let postedWorksIdSnapshot = {}

    console.log(SSG_WAIT_SEC+"+SSG_WAIT_SEC")

    const isIncludesICW = Object.keys(RdInstantChangedWorksId).includes(postWorkId)

    console.log(isIncludesICW+"isIncludesICW")

    if(isIncludesICW &&
    RdInstantChangedWorksId?.[postWorkId].timestamp.seconds >= timestamp.seconds - SSG_WAIT_SEC){
    //更新から１０分以内であれば、DBからデータ持ってくる

      console.log("get original db")

      const params = { 
        postUserId : postUserId,
        postWorkId : postWorkId,
      }

      const DBData = await getOriginalDBData(params,"Main")

      assessmentSnapshot = DBData.assessment
      wInfoSnapshot = DBData.wInfo
      postedWorksIdSnapshot = DBData.postedWorksId

    } else {
      console.log("get props")
      assessmentSnapshot = props.assessment
      wInfoSnapshot = props.wInfo
      postedWorksIdSnapshot = props.postedWorksId
    }   

    await dispatch({type:"loadDB" ,
      payload : {
        isLoading : false,
        userName : assessmentSnapshot 
          ? assessmentSnapshot.userName
          : RdUserName
        ,
        workName : wInfoSnapshot.workName,
        workMedia : wInfoSnapshot.winfoMedia,
        workScore : postedWorksIdSnapshot.workScore,
        workCategory : wInfoSnapshot.winfoCategory,
        workTag : postedWorksIdSnapshot.assessmentWorkTag,
        workComment : postedWorksIdSnapshot.workComment,
        isLiked : postedWorksIdSnapshot.isLiked,
        isSpoiler : postedWorksIdSnapshot.isSpoiler,
        workInfomation : wInfoSnapshot.winfoInfomation,
        workCreateTime : postedWorksIdSnapshot.created_at,
        workUpdateTime : postedWorksIdSnapshot.updated_at,
        workWatchYear : postedWorksIdSnapshot.workWatchYear,
        workWatchTimes : postedWorksIdSnapshot.workWatchTimes,
        assessmentComment : assessmentSnapshot 
          ? assessmentSnapshot.assessmentComment
          // ? assessmentSnapshot.workComment
          : undefined
        , 
        assessmentLike : assessmentSnapshot 
          ? assessmentSnapshot.isLiked
          : undefined  
        ,
        isPublic : postedWorksIdSnapshot.isPublic,
        loginUserData : Object.keys(RdUserAssessmentWorks).includes(postWorkId) 
          ? 1 
          : 2 
        ,//評価している１：していない２
      }
    })
    console.log("dispatched loadDb")
  }

  // const getOriginalDBData = async() => {

  // }

  useEffect(() => {
    if(isReady) {
      getDBData()
    }
  },[isReady])

  console.log("reducer Data")
  console.log(JSON.stringify(state,null,2)+"+reducer Data")

  console.log(JSON.stringify(RdInstantChangedWorksId)+"+RdInstantChangedWorkId")

  console.log(postWorkId+"postedWorksId")

  if(state.isLoading){
    return <>
      {/* loading...loginUserData:{state.loginUserData} RdGetUid:{RdGetUid} */}
      <GLoading />
    </>
  } else {
    return (
      <>
        <ApplicationBar title="作品評価"/>
        {/* <h2>ユーザごとの作品評価ページ</h2> */}
        
        {/* 作品名 */}
        <Link 
          href="/post/[postWorkId]" 
          // href={`/post/[postWorkId]`} 
          as={`/post/${postWorkId}`}>
            <Typography variant="h5" component="h1" gutterBottom>
              {state.workName}
            </Typography>
        </Link>
        
        <Grid container item xs={12} justifyContent={"space-between"}>
          {/* メディア */}
          <Grid container item xs={5} justifyContent={"flex-start"} alignItems={"flex-end"}>
            {/* <Typography variant="h6" component="h6" gutterBottom align="right" sx={classes.assesmenter}> */}
            <Typography variant="h6" component="h6" align="center" sx={classes.workMedia}>
              {state.workMedia}
            </Typography>
          </Grid>

          {/* カテゴリ　→　不要（評価画面なのであえて記載する必要はない） */}

          <Grid container item xs={7} justifyContent={"flex-end"} alignItems={"flex-end"}>
            <Link href="/user/[uid]" 
              as={`/user/${postUserId}/`}
            >
            {/* 評価者名 */}
              <Typography variant="string" component="h4" sx={classes.assesmenter}>
                {state.userName}
              </Typography>
            </Link>

          </Grid>
        </Grid>
        {/* 非公開評価時のみ表示 */}
        {!state.isPublic && 
          //variant=stringだとalign効かない
          <Typography variant="h6" align="right" sx={classes.unpublic}>
            {"※非公開評価"}
          </Typography>
        }
        <CSHighLightSkewBar>
          <div>評価</div>
        </CSHighLightSkewBar>

        <TitleSpacing container item xs={12}>
          <Grid container item xs={4} alignItems={"center"}>
            <MiddleTitle>
              採点
            </MiddleTitle>
          </Grid>
          <Grid container item xs={2} alignItems={"center"}>
            <Typography sx={classes.score}>
            {state.workScore != -1 ? state.workScore : "-"}
            </Typography>
          </Grid>
          <Grid container item xs={4} alignItems={"center"}>
            {state.isLiked ? <FavoriteIcon/> : <FavoriteBorder/>}
          </Grid>
        </TitleSpacing>

        <ItemExplanationSet middleTitle="タグ" text={
          state.workTag.length != 0 
            ? state.workTag.map(mapWorkTag => (
              <a>{mapWorkTag} </a>
            ))
            : <a>タグなし</a>
        }/>
        <ItemExplanationSet middleTitle="コメント" text={
          state.isSpoiler 
            ? ( <>
              <Collapse in={showComment} timeout={300}>
                {state.workComment}
              </Collapse>
              <Button 
                size="small"
                onClick={() => {
                  setShowComment(!showComment)
              }}> 
                {showComment ? "非表示" : "ネタバレコメントを表示"}
              </Button>
            </> )
            : (state.workComment == "" 
              ? "未投稿"
              : state.workComment 
            )
        }/>
        
        <Grid container item xs={12} justifyContent={"flex-end"} sx={classes.date}>
          <Grid item container xs={3} direction={"column"} justifyContent={"center"} alignItems={"center"}>
            <Grid item>
              視聴年
            </Grid>
            <Grid item>
              {state.workWatchYear.slice(0,4)}
            </Grid>
          </Grid>
          <Grid item container xs={3} direction={"column"} justifyContent={"center"} alignItems={"center"}>
            <Grid item>
              視聴回数
            </Grid>
            <Grid item >
              {state.workWatchTimes == "" 
                ? "-"
                : state.workWatchTimes
              }
            </Grid>
          </Grid>
          <Grid item container xs={3} direction={"column"} justifyContent={"center"} alignItems={"center"}>
            <Grid item>
              投稿日
            </Grid>
            <Grid item>
              {state.workCreateTime.split(" ")[0]}
            </Grid>
          </Grid>
          <Grid item container xs={3} direction={"column"} justifyContent={"center"} alignItems={"center"}>
            <Grid item>
              編集日
            </Grid>
            <Grid item>
              {state.workUpdateTime.slice(0,10)}
            </Grid>
          </Grid>
        </Grid>

        {/* speedDialogで補完 */}
        {/* リダックスのユーザ情報と作品のユーザ情報が同一の場合 */}
        {/* {(postUserId == RdGetUid) 
        ? (
          <>
            <Link href={{
              pathname: "/post/posting",
              query: { 
                searchWord : state.workName,
                workId : postWorkId,
                infoMedia : state.workMedia,
                firstPostFlag : 2, // 自分の作品を編集
                },
            }}>
              <a>編集する</a>
            </Link>
          </>
        ) : null } */}

        {isSignedIn && (<SpeedDialPosting
          workName={state.workName}
          workMedia={state.workMedia}
          workId={postWorkId}
          isLiked={true} //いいねを表示させないようにするための暫定値。評価に対するいいね機能作成時に修正。
          // uid= {RdGetUid}
          pfirstPostFlag = {(state.loginUserData === 1) ? 2 : 0}
          hist={"assessment"}
          sdpActions = {[{
            icon: <CreateIcon />,
            name: (state.loginUserData === 2) 
              ? '評価投稿' 
              : '評価を編集',
            function: post,
          }]}
          // router={router}
        />
        )}

        {/* step2 */}
        {/* <h3>評価に対するコメント：{state.assessmentComment}</h3>
        <h3>いいね：{state.assessmentLike}</h3> */}

        <Footer />
      </>
    )
  }
}

export async function getStaticPaths() {
  // getStaticPathsではapiにアクセスできない。
  // 開発環境ではエラーが出ないから厄介。
  // エラーメッセージが Unexpected token < in JSON at position 0 →　切り分けに時間がかかった

  const makeParams = async() => {
    // const privateUsers = await db.collection('privateUsers').get()
    const privateUsers = await getDocs(collection(db, 'privateUsers'))
    let postedWorksIdDatas = []

    postedWorksIdDatas = await Promise.all(
      privateUsers.docs.map(async(map) => {
        return await getDocs(collection(db, 'privateUsers' ,map.id ,'postedWorksId'))
        // return await db.collection('privateUsers').doc(map.id).collection('postedWorksId').get()
      })
    )
    
    //uidごとのprivateUserId配列
    console.log("postedWorksIdDatas")
    console.table(postedWorksIdDatas)

    let postedWorksIdDataEdit = []

    postedWorksIdDatas.forEach((privateUsersIds) => {
      privateUsersIds.docs.forEach((privateUsersId) => {
        postedWorksIdDataEdit = [ 
          ...postedWorksIdDataEdit ,
          { params : { 
            postUserId : privateUsersId.data().uid ,
            postWorkId : privateUsersId.id ,
          }}
        ]
      })
    })

    console.log("postedWorksDataEdit")
    console.table(postedWorksIdDataEdit)

    return postedWorksIdDataEdit
  }

  const paths = await makeParams()
  
  console.log("postedUserId paths")
  console.table(paths)
  
  return {paths: paths,fallback : true}
}

export async function getStaticProps({ params }) {
  // 受け取ったパスパラーメータをもとに処理を行う
  console.log("params@staticProps")
  console.table(params)

  const setDBData = await getOriginalDBData(params,"Props")

  console.log("setDBData")
  console.table(setDBData)

  console.log(process.env.url+"+process.env.url")

  return {
    props: setDBData,
    revalidate: 60,
  }
}

export default handlerPostUserId
