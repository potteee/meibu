// この位置に人ごとの作品採点情報をおく
// [postUserId].js
import React, {useState, useEffect, useCallback,useReducer} from 'react'
import { useRouter } from 'next/router'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import ApplicationBar from '../../../components/applicationBar'
import SpeedDialPosting from '../../../components/speedDialPosting'
import {SSG_WAIT_SEC} from 'src/foundations/share/GlobalConstant'

import { db } from '../../../firebase/index'
import { collection, doc, query, where, getDocs ,getDoc ,setDoc ,Timestamp } from "firebase/firestore";

import {useDispatch, useSelector} from "react-redux";
import {getUserId ,getUserName,getUserAssessmentWorks,getInstantChangedWorksId ,getIsSignedIn} from '../../../reducks/users/selectors'

import CreateIcon from '@mui/icons-material/Create';

import Link from 'next/link'

import post from 'src/components/speedDial/post'
import GLoading from '../../../components/GLoading'

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
  workInfomation : "",
  workUpdateTime : "",
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
        createTime : dBData[0].createTime 
          ? dBData[0].createTime.toDate().toLocaleString("ja") 
          : null
        , //最近追加２０２１０８０６ 
        updateTime : dBData[0].updateTime.toDate().toLocaleString("ja"),
      }
      : null  
    ,
    wInfo: {
      ...dBData[1],
    },
    postedWorksId : {
      ...dBData[2],
      created_at : dBData[2].created_at.toDate().toLocaleString("ja"),
      updated_at : dBData[2].updated_at.toDate().toLocaleString("ja")
    }
  }

  return setDBData
}

const handlerPostUserId = (props) => {

  console.log("main props")
  console.table(props)

  const selector = useSelector((state) => state)
  const RdGetUid = getUserId(selector)
  const RdUserName = getUserName(selector)
  const RdUserAssessmentWorks = getUserAssessmentWorks(selector)
  const RdInstantChangedWorksId = getInstantChangedWorksId(selector)
  const isSignedIn = getIsSignedIn(selector)

  const router = useRouter()
  const { isReady } = useRouter()

  const [state,dispatch] = useReducer(reducer, initialState)

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
        workInfomation : wInfoSnapshot.winfoInfomation,
        workCreateTime : postedWorksIdSnapshot.created_at,
        workUpdateTime : postedWorksIdSnapshot.updated_at,
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
        
        {!state.isPublic && (<a>※このページは他のユーザには公開されません</a>)}
        
        <Link href="/user/[uid]" 
          as={`/user/${postUserId}/`}>
          <h3>評価者(L)：{state.userName}</h3>
        </Link>

        <Link href="/post/[postWorkId]" 
          as={`/post/${postWorkId}`}>
          <h3>作品名(L)：{state.workName}</h3>
        </Link>
        {/* <h3>作品名(L)：{workName}</h3> */}
        <h4>メディア：{state.workMedia}</h4>

        <h3>いいね：{state.isLiked ? "いいね" : "だめね"}</h3>
        <h3>採点：{state.workScore != -1 ? state.workScore : "採点なし"}</h3>
        <h3>カテゴリ：{
          state.workCategory.map(mapWorkCategory => (
            <a> {mapWorkCategory} </a>
          ))
          }
        </h3>
        <h3>タグ：{ state.workTag.length != 0 
          ? state.workTag.map(mapWorkTag => (
            <a>{mapWorkTag} </a>
          ))
          : <a>タグなし</a>
        }
              
        </h3>
        <h3>作品に対するコメント：{state.workComment}</h3>
        <h3>投稿日時：{state.workUpdateTime}</h3>

        {/* リダックスのユーザ情報と作品のユーザ情報が同一の場合 */}
        {(postUserId == RdGetUid) 
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
        ) : null }

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

        <br/>
        <h3>評価に対するコメント：{state.assessmentComment}</h3>
        <h3>いいね：{state.assessmentLike}</h3>

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
