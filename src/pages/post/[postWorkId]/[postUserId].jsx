// この位置に人ごとの作品採点情報をおく
// [postUserId].js
import React, {useState, useEffect, useCallback,useReducer} from 'react'
import { useRouter } from 'next/router'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import ApplicationBar from '../../../components/applicationBar'
import SpeedDialPosting from '../../../components/speedDialPosting'

import {db} from '../../../firebase/index'

import {useDispatch, useSelector} from "react-redux";
import {getUserId ,getUserName} from '../../../reducks/users/selectors'

import CreateIcon from '@material-ui/icons/Create';

import Link from 'next/link'

import useSWR,{ mutate } from 'swr'

import post from 'src/components/speedDial/post'
import postWInfoCreate from '../../../foundations/wInfo'

import ObjectSort from '../../../foundations/share/objectSort'

//ユーザごとの作品ページを検索
const initialState = {
  isLoading : true,
  userName : "",
  workName : "",
  workMedia : "",
  workScore : "",
  workCategory : "",
  workTag : [],
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

const handlerPostUserId = (props) => {

  console.log("main props")
  console.table(props)

  const selector = useSelector((state) => state)
  const RdGetUid = getUserId(selector)
  const RdUserName = getUserName(selector)

  const router = useRouter()
  const { isReady } = useRouter()

  const [state,dispatch] = useReducer(reducer, initialState)


  const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう
  console.log(query+"+query at postUserId")
  const postWorkId = /^\/post\//.test(query) ? query.split('\/')[2] : "no data query"
  const postUserId = /^\/post\//.test(query) ? query.split('\/')[3] : "no data query"
  console.log(postUserId+"+postUserId")
  console.log(postWorkId+"+postWorkId")

  //useReducerに。
  // const [userName, setUserName] = useState("")
  // // const [loginUserId, setLoginUserId] = useState("")
  // const [workName, setWorkName] = useState("")
  // const [workMedia, setWorkMedia] = useState("")
  // const [workScore, setWorkScore] = useState("")
  // const [workCategory, setWorkCategory] = useState([])
  // const [workTag, setWorkTag] = useState([])
  // const [isLiked, setIsLiked] = useState(false)
  // const [workComment ,setWorkComment] = useState("")
  // const [workUpdateTime, setWorkUpdateTime] = useState("")
  // const [assessmentComment, setAssessmentComment] = useState([""])
  // const [assessmentLike, setAssessmentLike] = useState(0)
  // const [isPublic, setIsPublic] = useState(false)
  // const [loginUserData,setLoginUserData] = useState(0)

  // // const [standbyState , setStandbyState] = useState(false)


  //isReadyにおきかえ。
  // const postIdCheck = () => {
  //   console.log("postIdCheck start")
  //   if(!postWorkId){
  //     return false 
  //   } else {
  //     if(!postUserId){
  //       return false
  //     } else {
  //       if(postWorkId == "[postWorkId]"){
  //         console.log(postWorkId+"false postWorkId")
  //         return false
  //         } else {
  //           if (postUserId == "[postUserId]"){
  //             console.log(postUserId+"false postUserId")
  //             return false
  //           } else {
  //             console.log("return true")
  //             return true
  //         }
  //       }
  //     }
  //   }
  // } 
  
  // const { data , error } = useSWR(
  //     () => postIdCheck() 
  //       ? `/api/firebase/assessmentSearchUser/${postWorkId}_${postUserId}`
  //       : null,
  //       fetcher,
  //     {
  //       revalidateOnFocus: false,
  //       revalidateOnReconnect: false
  //     }
  // )

  // console.log(error+"+api error")
  // console.log(JSON.stringify(data)+"+api assessmentSearchUser")

  const getDBData = async() => {
    const assessmentSnapshot = props.assessment
    const wInfoSnapshot = props.wInfo
    const postedWorksIdSnapshot = props.postedWorksId

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
        // workTag : (ObjectSort(wInfoSnapshot.winfoTag,"asc")),
        isLiked : postedWorksIdSnapshot.isLiked,
        workInfomation : wInfoSnapshot.winfoInfomation,
        // (new Date(data.updated_at._seconds * 1000).toLocaleString("ja"))
        // workCreateTime : new Date(assessmentSnapshot?.createTime._seconds * 1000).toLocaleString("ja"), //?はいずれ消す。
        // workUpdateTime : new Date(assessmentSnapshot.updateTime._seconds * 1000).toLocaleString("ja"),
        workCreateTime : postedWorksIdSnapshot.created_at,
        workUpdateTime : postedWorksIdSnapshot.updated_at,
        assessmentComment : assessmentSnapshot 
          ? assessmentSnapshot.workComment
          : undefined
        , 
        assessmentLike : assessmentSnapshot 
          ? assessmentSnapshot.isLiked
          : undefined  
        ,
        isPublic : postedWorksIdSnapshot.isPublic,
        loginUserData : postedWorksIdSnapshot ? 1 : 2 ,//評価している１：していない２
       }
    })
  }

  useEffect(() => {
    (async() => {
      if(isReady) {
        getDBData()
      }
      // console.log("useEffect Out")
      //Redux
      // if(postWorkId != "no data query" && postUserId != "no data query") {
      //   console.log("useEffect Done")
      //   if(data) {
      //     // if(data.userName != undefined || data.userName != "") {
      //     if(data.length != 0) {
      //       console.log(JSON.stringify(data)+"+data[0]@JSON")
      //       setUserName(data.userName)
      //       setWorkName(data.workName)
      //       setWorkMedia(data.winfoMedia)
      //       setWorkScore(data.workScore)
      //       setWorkCategory(data.winfoCategory)
      //       setWorkTag(data.assessmentWorkTag)
      //       data.isLiked ? setIsLiked(data.isLiked) : setIsLiked(false)
      //       setWorkComment(data.workComment)
      //       setWorkUpdateTime(new Date(data.updated_at._seconds * 1000).toLocaleString("ja"))
      //       // setWorkUpdateTime(new Date(data.updateTime._seconds * 1000).toLocaleString("ja"))
      //       setAssessmentComment(data.assessmentComment)
      //       setAssessmentLike(data.worksLikedCount)

      //       setIsPublic(data.isPublic)

      //       setStandbyState(true)
      //     } else {
      //       console.log("data.userName no exist")
      //     }
      //   } else {
      //     console.log("data no exist")
      //   }
      // }
    })()
  },[isReady])

  // useEffect(() => { // ログインユーザが評価しているか？
  //   (async() => {
  //     console.log("start useEffect2")
  //     const res2 = await fetch(`/api/firebase/get/privateUsers/postedWorksId/${postWorkId}_${RdGetUid}`)
  //     const data2 = await res2.json()
  //     console.log(data2+"+data2 of fetcher")
  //     // console.log(data2.data()+"+data2.data() of fetcher")
  //     console.log(JSON.stringify(data2)+"+data2@J of fetcher")
  //     setLoginUserData(() => {
  //       return data2.uid ? 1 : 2 //評価している１：していない２
  //     })
  //     if (res2.status !== 200) {
  //       throw new Error(data2.message)
  //     }
  //   })()
  // },[])

  console.log("reducer Data")
  console.log(JSON.stringify(state,null,2)+"+reducer Data")

  if(state.isLoading){
    return <>loading...loginUserData:{state.loginUserData} RdGetUid:{RdGetUid}</>
  // if(loginUserData && standbyState){
  // if(loginUserData && standbyState && RdGetUid != "uid initial"){
  } else {
    return (
      <>
        {/* <Header /> */}
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

        <SpeedDialPosting
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

  // let postWorkId = false
  // let userId = false
  let postedCombination = false;

  // ? `/api/firebase/assessmentSearchUser/${postWorkId}_${postUserId}`

  //対象は・・・
  //サブコレクションでpostedWorksIdを全部撮ってくれば網羅できる。

  const makeParams = async() => {
  // const fetcher = async() => {
    // const url = `${process.env.NEXT_PUBLIC_URL}/api/firebase/get/postedWorksId`
    // const res = await fetch(url)

    const privateUsers = await db.collection('privateUsers').get()
    // let privateUsersId = []
    let postedWorksIdDatas = []
    // privateUsers.docs.forEach(async(doc) => {
    //   // privateUsersId = [...privateUsersId ,doc.id]
    //   console.log(doc.id+"privateUsers doc.id")

    //   postedWorksIdDatas = [
    //     ...postedWorksIdDatas,
    //     await db.collection('privateUsers').doc(doc.id).collection('privateUsersId').get()
    //   ]     
    // ]) 
    // }) 


    postedWorksIdDatas = await Promise.all(
      privateUsers.docs.map(async(map) => {
        return await db.collection('privateUsers').doc(map.id).collection('postedWorksId').get()
        // const foo = await db.collection('privateUsers').doc(map.id).collection('postedWorksId').get()
        // return foo
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

  // Object.keys(postedWorksIdData).forEach((doc) => {
  //   if(postedCombination == false) {
  //     postedCombination = [{ 
  //       "postedWorkId" : postedWorksIdData[doc]["workId"] ,
  //       "userId" : postedWorksIdData[doc]["uid"]
  //     }]
  //   } else {
  //     postedCombination = [
  //       ...postedCombination ,
  //       { 
  //         "postedWorkId" : postedWorksIdData[doc]["workId"] ,
  //         "userId" : postedWorksIdData[doc]["uid"]
  //       }
  //     ]
  //   }
  // })

  // console.log("postedCombination")
  // console.table(postedCombination)
  
  // const paths = postedCombination.map((map) => (
  //   { params: { postWorkId: map.postedWorkId , postUserId : map.userId}}
    // { params: { postWorkId: map }}
      // ))

  const paths = await makeParams()
  
  console.log("postedUserId paths")
  console.table(paths)
  
  // return {paths:[],fallback : true}
  return {paths: paths,fallback : true}

}

export async function getStaticProps({ params }) {
  // 受け取ったパスパラーメータをもとに処理を行う
  console.log("params@staticProps")
  console.table(params)

  // const assessmentUrl = `${process.env.NEXT_PUBLIC_URL}/api/firebase/assessment/${params.postWorkId}`
  // console.log(assessmentUrl+"+assessmentUrl")

  const dBData = await Promise.all([

    //dBData[0]
    // fetch(assessmentUrl)
    db.collection('wInfo').doc(params.postWorkId)
    .collection('assessment').doc(params.postUserId).get()
    .then((res)=> {
      const data = res.data()
      // const data = await res.json()
      console.log("successed to get assessment")
      // if (res.status !== 200) {
      //   throw new Error(data.message)
      // }
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

    //dBData[2]
    db.collection('privateUsers').doc(params.postUserId)
    .collection('postedWorksId').doc(params.postWorkId)
    .get()
    .then((res) => {
      console.log("successed to get postedWorksId")
      const data = res.data()
      return data
    })
  ])

  console.log("+dBData[0]")
  // console.table(dBData)
  console.log(dBData[0])
  console.log("+dBData[1]")
  console.log(dBData[1])
  console.log("+dBData[2]")
  console.log(dBData[2])

  // console.log(dBData[0].updateTime.toDate()+"+dateDate") //063762164725.492000000+dateDate
  // console.log(new Date(Math.floor(dBData[0].updateTime * 25.51))+"+dateDate2")
  // console.log(new Date(dBData[0].updateTime * 10).toLocaleString("ja")+"+dateDate3")

  const setDBData = {
    assessment: dBData[0] 
      ? {
        ...dBData[0],
  //    setWorkUpdateTime(new Date(data.updated_at._seconds * 1000).toLocaleString("ja"))
        updateTime : dBData[0].updateTime.toDate().toLocaleString("ja"),
      }
     : undefined  
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

  return {
    props: setDBData,
    revalidate: 60,
  }
}

export default handlerPostUserId
