import React, {useState, useEffect, useCallback,useReducer} from 'react'
import { PrimaryButton, TextInput ,CheckIconBox} from "../../../styles/UIkit"

//MaterialUi
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';

import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import ApplicationBar from '../../../components/applicationBar'
import SpeedDialPosting from '../../../components/speedDialPosting'
import ObjectSort from '../../../foundations/share/objectSort'

import { SCTypografyh5 } from 'src/styles/SC/shared/typografy/h5'

import {db} from '../../../firebase/index'
import { parseCookies } from 'nookies'
import { set } from 'immutable'
import {useDispatch,useSelector} from 'react-redux'

import {getUserId,getUserName} from "../../../reducks/users/selectors";
// import { postWorkCreate } from '../../../reducks/works/operations'
import { addPostedWork } from '../../../reducks/users/operations'

//API
// import useSWR,{ mutate } from 'swr'
// import { actionTypes } from 'redux-localstorage';

// const fetcher = async (url) => {
//   const res = await fetch(url)
//   const data = await res.json()
//   console.log(data+"+data of fetcher")

//   if (res.status !== 200) {
//     throw new Error(data.message)
//   }
//   return data
// }

const initialState = {
  workName : "not definded",
  infoCount : 0,
  likedCount : 0,
  workScore : "",
  workComment : "",
  winfoCategory : [],
  workCreator : "",
  workInfo : "",
  workSeries : "",
  workMedia : "",
  workPublisher : "",
  workStart : "",
  workFinish : "",
  workImage : "",
  winfoTag　: []
  
  // assessmentData : [], //評価者一覧のデータ
  // isAssessmenter : false,
  // isAssessed : false, //ログインユーザ評価有無
  // isMyAssessmentPublic : false,
}

const reducer = (state, action) => {
  switch (action.type){
    case "loadDB": {
      return {
        ...state,
        ...action.payload,
      }
    }
    case "likedCountChange" : {
      return {
        ...state,
        likedCount : action.likedCount,
      }
    }
    case "infoCountChange" : {
      return {
        ...state,
        infoCount : action.infoCount,
      }
    }

    default :{
      throw new ERROR("not exect action")
    }
  }
}

//作品情報閲覧ページ
const Post = () => {
// const Post = ({params}) => {
  // const [standbyState,setStandbyState] = useState(false)
  const [state,dispatch] = useReducer(reducer, initialState)

  const router = useRouter()
  // const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  // const { id, onework ,workId} = router.query

  // const [workData, setWorkData] = useState({})
  const userId = getUserId(selector)
  const userName = getUserName(selector)

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


  // let workName = "initial workName" 
  //letで定義すると、際レンダリング時に再初期化されてしまう。
  //その為、dataでデータを取得するギミックがある場合は
  //useStateを使った方がいい（と思う）
  // const [workName, setWorkName] = useState("not definded")
  // const [infoCount, setInfoCount] = useState(0)
  // const [likedCount, setLikedCount] = useState(0)
  // const [workScore, setWorkScore] = useState("")
  // const [workComment, setWorkComment] = useState("")
  // const [winfoCategory, setCheckBoxState] = useState([])
  // const [workCreator ,setWorkCreator] = useState("")
  // const [workInfo, setWorkInfo] = useState("")

  // const [workSeries, setWorkSeries] = useState("")
  // const [workMedia, setWorkMedia] = useState("")
  // const [workPublisher ,setWorkPublisher] = useState("")
  // const [workStart, setWorkStart] = useState("")
  // const [workFinish, setWorkFinish] = useState("")
  // const [workImage, setWorkImage] = useState("")

  // // const [assessmentData ,setAssessmentData] = useState([{userName : "ini" , uid: "ini"}])
  
  // const [winfoTag, setWinfoTag] = useState([])
  
  const [isAssessed, setIsAssessed] = useState(false) //ログインユーザ評価有無
  const [isBookmark ,setIsBookmark] = useState(false)
  const [isLiked ,setIsLiked] = useState(false)
  const [isAssessmenter, setIsAssessmenter] = useState(false)
  const [isMyAssessmentPublic, setIsMyAssessmentPublic] = useState(false)
  const [assessmentData ,setAssessmentData] = useState([]) //評価者一覧のデータ

  //useCallback => レンダリング葉されないが副作用(useEffect)は走るらしい。　
  //=>いや、レンダリングも走っちゃってるっぽいなぁ。。。
  const isLikedStateChange = useCallback((status,isPublic) => {
    console.log(status+"+isLikedStateChange")
    console.log(isPublic+"+isPublic")
    setIsLiked(status)
    setIsMyAssessmentPublic(isPublic)

    if(status){
      // setLikedCount((preLikedCount) => {
      //   console.log("pre likedCount + 1")
      //   return preLikedCount + 1
      // })
      dispatch({type:"likedCountChange", likedCount: state.likedCount + 1 })
    }
    if(!isAssessed){
      // setInfoCount((preInfoCount) => {
      //   return preInfoCount + 1
      // })
      dispatch({type:"infoCountChange", infoCount: state.infoCount + 1 })
      setIsAssessed(true)
    }
  },[isMyAssessmentPublic,isLiked,state.likedCount,state.infoCount,isAssessed])

  // const inputWinfoTag = useCallback((value) => {
  //   console.log(JSON.stringify(value)+"+inputWinfoTag")
  //   setWinfoTag(value)
  // },[winfoTag])

  const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう
  console.log(query+"+query")
  const workId = /^\/post\//.test(query) ? query.split('\/post\/')[1] : ""

  console.log(workId+"=workId")

  const workIdCheck = () => {
    console.log("workIdCheck start")
    if(!workId){
      return false 
    } else {
      if(workId == "[postWorkId]"){
        console.log(workId+"false postWorkId")
        return false
      } else {
        console.log("return true")
        return true
      }
    }
  }

  // const { data , error } = useSWR(
  //   () => workIdCheck() ? `/api/firebase/assessment/${workId}` : null , fetcher,
  //   {
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: false
  //   }
  // )
  // console.log(error+"+api error")
  // console.log(JSON.stringify(data)+"+api assessment")

  const getDBData = async() => {
    let assessmentUrl = null
    let dBData = [] 
    
    if(workId != undefined){
      if(userId != "uid initial"){
        if(await workIdCheck()){
          // const assessmentUrl = "abC"
          assessmentUrl = `/api/firebase/assessment/${workId}`
          // console.log(assessmentUrl+"+assessmentUrl")
        } else {
          throw new Error("failed get workId")
        }
        console.log("workId:"+workId+",userId:"+userId)

        dBData = await Promise.all([
          db.collection('privateUsers').doc(userId)
          .collection('postedWorksId').doc(workId)
          .get()
          .then((res) => {
            console.log("successed to get postedWorksId")
            const data = res.data()
            return data
          })
          .catch((error) => {
            alert('powtedWorksId DB get fail')
            throw new Error(error)
          }),
          
          db.collection('privateUsers').doc(userId)
          .get()
          .then((res) => {
            console.log("successed to get privateUsers")
            const data = res.data()
            return data
          })
          .catch((error) => {
            alert('privateUsers DB get fail')
            throw new Error(error)
          }),
          
          fetch(assessmentUrl)
          .then(async(res)=> {
            const data = await res.json()
            console.log("successed to get assessment")
            return data
            if (res.status !== 200) {
              throw new Error(data.message)
            }
          }).catch((error) => {
            alert('assessment DB get fail')
            throw new Error(error)
          }),
          
          db.collection('wInfo').doc(workId).get()
          .then((res) => {
            console.log("successed to get wInfo")
            const data = res.data()
            return data
          })
          .catch((error) => {
            alert('wInfo DB get fail')
            throw new Error(error)
          }),
        ])
      } else {
        console.log("workId:"+workId+",userId:undefined")
        const dBData = await db.collection('wInfo').doc(workId).get()
        .then((res) => {
          console.log("successed to get wInfo")
          const data = res.data()
          return data
        })
        .catch((error) => {
          alert('wInfo DB get fail')
          throw new Error(error)
        })
      }
    } else {
      console.log("workId:undefined")
      throw new Error("failed to get workId")
    }

    console.log("dBData")
    console.table(dBData)

    const postedWorksIdSnapshot = dBData[0]
    const privateUsersSnapshot = dBData[1]
    const assessmentSnapshot = dBData[2]
    const wInfoSnapshot = dBData[3]

    await dispatch({type:"loadDB" ,
      payload : {
        workName : wInfoSnapshot.workName,
        infoCount : wInfoSnapshot.winfoCount,
        likedCount : wInfoSnapshot.winfoLikedCount,
        workScore : wInfoSnapshot.winfoScore,
        workComment : wInfoSnapshot.winfoComment,
        winfoCategory : wInfoSnapshot.winfoCategory,
        workCreator : wInfoSnapshot.winfoCreator,
        workInfo : wInfoSnapshot.winfoInfomation,
        workSeries : wInfoSnapshot.winfoSeries,
        workMedia : wInfoSnapshot.winfoMedia,
        workPublisher : wInfoSnapshot.winfoPublisher,
        workStart : wInfoSnapshot.winfoStart,
        workFinish : wInfoSnapshot.winfoFinish,
        workImage : wInfoSnapshot.winfoImage,
        winfoTag: (ObjectSort(wInfoSnapshot.winfoTag,"asc"))
      }
    })

    console.log(Object.keys(privateUsersSnapshot["userBookmark"])+"+privateUserSnapshotf userBookmark")

    if(Object.keys(privateUsersSnapshot["userBookmark"]).includes(workId)){
      console.log("got it")
      console.log("got it")
      console.log("got it")
      setIsBookmark(true)
    } else {
      console.log("dont got it")
    }

    if(postedWorksIdSnapshot){
      setIsAssessed(true)
      console.log("setisassessed")
      if(postedWorksIdSnapshot["isPublic"] == true){
        setIsMyAssessmentPublic(true)
        console.log("setIsMyassessmentPublic true")
      } else {
        setIsMyAssessmentPublic(false)
        console.log("setIsMyassessmentPublic true")
      }
      if(postedWorksIdSnapshot["isLiked"] == true){
        setIsLiked(true)
      } else {
        setIsLiked(false)
      }
    }

    if(assessmentSnapshot && assessmentData.length == 0) {
      setAssessmentData([...assessmentSnapshot])
      assessmentSnapshot.forEach((doc) => {
        //一つでも非公開以外があればフラグを立てる
        //(「公開可能情報なし」と表示しない)
        console.log(JSON.stringify(doc,null,2)+"+doc")
        if(doc.uid != "非公開") {
          setIsAssessmenter(true)
        }
      })
    }
  }
  
  
  useEffect(() => {
    (async() => {
      getDBData()
      // console.log("useEffect Out")
      
      // if(workId != undefined) {
      //   console.log("useEffect Done")
      //   console.log(workId+"+workId effect")

      //   if(userId != "uid initial"){
      //     //////これ上に持っていくことで　薄いいいねが表示されなくなるかも
      //     await db.collection('privateUsers').doc(userId)
      //     .collection('postedWorksId').doc(workId)
      //     .get()
      //     .then(async(postSnapshot) => {
      //       console.log(postSnapshot+"+postSnapshot")
      //       await db.collection('privateUsers').doc(userId)
      //       .get()
      //       .then((privateSnapshot) => {
      //         console.log(privateSnapshot+"+privateSnapshot")
      //         console.log(privateSnapshot.data()+"+privateSnapshot.data()")
      //         console.log(JSON.stringify(privateSnapshot.data())+"+privateSnapshot.data()@J")

      //         if(privateSnapshot.data()["userBookmark"]){//このifはいずれ消す。初期DBだとuserBookmarkのフィールドがないため、この分岐が必要
      //           console.log(Object.keys(privateSnapshot.data()["userBookmark"])+"OBkey userBookmark")
                // if(Object.keys(privateSnapshot.data()["userBookmark"]).includes(workId)){
                //   setIsBookmark(true)
                // }
              // }
              
              // console.log(JSON.stringify(postSnapshot.data())+"+postSnapshot.data()@J")
              // if(postSnapshot.data()){
              //   setIsAssessed(true)
              //   console.log("setisassessed")
              //   if(postSnapshot.data()["isPublic"] == true){
              //     setIsMyAssessmentPublic(true)
              //     console.log("setIsMyassessmentPublic true")
              //   } else {
              //     setIsMyAssessmentPublic(false)
              //     console.log("setIsMyassessmentPublic true")
              //   }
              //   if(postSnapshot.data()["isLiked"] == true){
              //     setIsLiked(true)
              //   } else {
              //     setIsLiked(false)
              //   }
              // }
        //     })
        //   })
        //   .catch((error) => {
        //     alert('privateUsers DB get fail')
        //     throw new Error(error)
        //   })
        // }
        // await db.collection('wInfo').doc(workId).get()
        // .then(doc => {
        //   let wInfoData = doc.data()
          // if (wInfoData){
          //   console.log(JSON.stringify(wInfoData)+"+wInfoData JSONstr")
          //   setWorkName(wInfoData.workName)
          //   setInfoCount(wInfoData.winfoCount)
          //   setLikedCount(wInfoData.winfoLikedCount)
          //   setWorkScore(wInfoData.winfoScore)
          //   setWorkInfo(wInfoData.winfoInfomation)
          //   setCheckBoxState(wInfoData.winfoCategory)
          //   inputWinfoTag(ObjectSort(wInfoData.winfoTag,"asc"))
          //   setWorkCreator(wInfoData.winfoCreator)
          //   setWorkSeries(wInfoData.winfoSeries)
          //   setWorkMedia(wInfoData.winfoMedia)
          //   setWorkPublisher(wInfoData.winfoPublisher)
          //   setWorkStart(wInfoData.winfoStart)
          //   setWorkFinish(wInfoData.winfoFinish)
          //   setWorkImage(wInfoData.winfoImage)

      //       console.log(JSON.stringify(wInfoData)+"+works wInfoData")
      //       console.log(JSON.stringify(winfoCategory)+"+works winfoCategory")
      //       if(data && assessmentData.length == 0) {
      //         setAssessmentData([...data])
      //         data.forEach((doc) => {
      //           //一つでも非公開以外があればフラグを立てる
      //           //(「公開可能情報なし」と表示しない)
      //           if(doc.uid != "非公開") {
      //             setIsAssessmenter(true)
      //           }
      //         })
      //       } else {
      //         console.log("data no exist")
      //       }
      //     }
      //   })
      //   .catch((error) => {
      //     alert('works DB get fail')
      //     throw new Error(error)
      //   })
      // }
    })()
   //isLikedが[]内にある理由いいねしたときに「評価投稿数」「いいね数」を更新するため
  },[])//いや、ここでisLikedを立ててしまうと、speeddialでいいねになる旅にdbアクセスが走るので表示あ遅くなる

  console.log(isLiked+"+isLiked")
  console.log(isBookmark+"+isBookmark")
  if(state.workName != "not definded"){
  // if(data && (workName != "not definded") && standbyState){

    let isLoginUserAssessment = false
    return (
      <>     
        {/* <div className="c-section-container"> */}
        {/* <div className="module-spacer--medium" /> */}
  　　     <ApplicationBar title="作品情報"/>

          {/* //なぜかこのページだけ全体が20pxくらい下に下がってしまうのでfixで調整 */}
          {/* いいね：{isLiked ? "○" : "×"}
          公開　：{isMyAssessmentPublic ? "○" : "×"}
          ブックマーク：{isBookmark ? "○" : "×"} */}

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
            {state.workScore != -1 ? state.workScore : "評価なし"}
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

          {/* return内でfor使えない？ */}
          {/* <h3>tag:{Object.keys(winfoTag).forEach((tokens) => (
            <span>{tokens}:{winfoTag[tokens]} </span>
          ))}</h3> */}

          <SCTypografyh5>
            {"クリエーター"}
          </SCTypografyh5> 
          
          <h3 className={classes.h3WorksName}>
            {state.workCreator ? state.workCreator : "no data at Creator" }
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
          {(assessmentData.length != 0 && isAssessmenter == true) && (
            <>
              <ul>
                {assessmentData.map(mapAssessmentData => ( 
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
          {isAssessmenter == false && (<p> 公開可能情報なし </p>) }

          {/* <h3>あなたの評価</h3> */}
          {/* <a>userId:::: {userId}</a> */}
          {isLoginUserAssessment == true && (
            <>
              <Link href="/post/[id]/[postUserId]" 
                as={`/post/${workId}/${userId}`}>
                <p>{userName}自身の評価をみる</p>
              </Link>
            </>
          )}

          <>
            <Link href={{
              pathname: "/post/posting",
              query: {
                searchWord: state.workName,
                infoMedia : state.workMedia,
                workId : state.workId,
                firstPostFlag : isAssessed ? 2 : 0 ,
              }
            }}>
              <a>[{state.workName}] {isAssessed ? "の評価を編集する。" : "を評価する。"} </a>
            </Link>
            <SpeedDialPosting
              workName={state.workName} 
              workMedia={state.workMedia} 
              workId={workId} 
              isLiked={isLiked}
              isBookmark={isBookmark}
              // setIsLiked={setIsLiked}
              uid={userId}
              setIsLiked={isLikedStateChange}
              setIsBookmark={setIsBookmark}
              firstPostFlag={isAssessed ? 2 : 0} 
              hist={"work"}
            />
          </>
        </Box>
        {/*    
          step2 
          <h2>ーこの作品が読めるアプリー</h2> 
          <h2>同じジャンルの人気作</h2>
        */}
        {(isLiked && isMyAssessmentPublic) ? <FavoriteIcon className={classes.isLikedSignal}/> : null}
        {(isLiked && !isMyAssessmentPublic) ? <FavoriteTwoToneIcon className={classes.isLikedSignal}/> : null}
        {(isBookmark && !isLiked) ? <CollectionsBookmarkIcon className={classes.isLikedSignal}/> : null}
        {(isBookmark && isLiked) ? <CollectionsBookmarkIcon className={classes.isBookmarkSignal}/> : null}
        <Footer />
      </>
    )
  } else {
    return(
      <>
      ...loading...
      </>
    )
  }

}

// export async function getStaticPaths() {
//   // const response = await fetch(
//   //   process.env.HOST + '/api/pages'
//   // )

//   let postWorkId = false
//   const snapshot = await db.collection('wInfo').get()

//   snapshot.forEach((doc) => {
//     if(postWorkId == false) {
//       postWorkId = [doc.data().workId]
//     } else {
//       postWorkId = [...postWorkId , doc.data().workId]
//     }
//   })

//   console.log("postWorkId")
//   console.table(postWorkId)
  
//   const paths = postWorkId.map((map) => (
//     { params: { postWorkId: map }}
//   ))
  
//   console.log("paths")
//   console.table(paths)
  
//   // return {paths:[],fallback : true}
//   return {paths: paths,fallback : true}

// }

// export async function getStaticProps({ params }) {
//   // 受け取ったパスパラーメータをもとに処理を行う
//   console.log("params@staticProps")
//   console.table(params)

//   return {
//     props: {params},
//     revalidate: 10,
//   }
// }

export default Post
