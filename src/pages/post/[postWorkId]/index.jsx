import React, {useState, useEffect, useCallback} from 'react'
import { PrimaryButton, TextInput ,CheckIconBox} from "../../../styles/UIkit"

//MaterialUi
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';

import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import ApplicationBar from '../../../components/applicationBar'
import SpeedDialPosting from '../../../components/speedDialPosting'
import ObjectSort from '../../../foundations/share/objectSort'

import {db} from '../../../firebase/index'
import { parseCookies } from 'nookies'
import { set } from 'immutable'
import {useDispatch,useSelector} from 'react-redux'

import {getUserId,getUserName} from "../../../reducks/users/selectors";
// import { postWorkCreate } from '../../../reducks/works/operations'
import { addPostedWork } from '../../../reducks/users/operations'

//API
import useSWR,{ mutate } from 'swr'

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()
  console.log(data+"+data of fetcher")

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

//作品情報閲覧ページ
const Post = ({params}) => {
  const [standbyState,setStandbyState] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  // const { id, onework ,workId} = router.query

  // const [workData, setWorkData] = useState({})
  const userId = getUserId(selector)
  const userName = getUserName(selector)

  const useStyles = makeStyles((thema) => ({
    h5WorksTitle: {
      margin : "0px 0px 0px 0px",
      color : "#393e4f", //青褐あおかち
      fontSize : "0.8em",
      // marginBlockStart: "0.0em",
      // marginBlockEnd: "0.0em",
    },
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

  }))

  const classes = useStyles();


  // let workName = "initial workName" 
  //letで定義すると、際レンダリング時に再初期化されてしまう。
  //その為、dataでデータを取得するギミックがある場合は
  //useStateを使った方がいい（と思う）
  const [workName, setWorkName] = useState("not definded")
  const [infoCount, setInfoCount] = useState(0)
  const [likedCount, setLikedCount] = useState(0)
  const [workScore, setWorkScore] = useState("")
  const [workComment, setWorkComment] = useState("")
  const [checkBoxState, setCheckBoxState] = useState([])
  const [workCreator ,setWorkCreator] = useState("")
  const [workInfo, setWorkInfo] = useState("")

  const [workSeries, setWorkSeries] = useState("")
  const [workMedia, setWorkMedia] = useState("")
  const [workPublisher ,setWorkPublisher] = useState("")
  const [workStart, setWorkStart] = useState("")
  const [workFinish, setWorkFinish] = useState("")
  const [workImage, setWorkImage] = useState("")

  const [assessmentData ,setAssessmentData] = useState([]) //評価者一覧のデータ
  // const [assessmentData ,setAssessmentData] = useState([{userName : "ini" , uid: "ini"}])

  const [isAssessmenter, setIsAssessmenter] = useState(false)
  const [isAssessed, setIsAssessed] = useState(false) //ログインユーザ評価有無
  const [isMyAssessmentPublic, setIsMyAssessmentPublic] = useState(false)

  const [isBookmark ,setIsBookmark] = useState(false)
  const [isLiked ,setIsLiked] = useState(false)

  // const [userId, setUserId] = useState("")
  // const [userName, setUserName] = useState("")

  const [winfoTag, setWinfoTag] = useState([])

    // let data = undefined

  //useCallback => レンダリング葉されないが副作用(useEffect)は走るらしい。　
  //=>いや、レンダリングも走っちゃってるっぽいなぁ。。。
  const isLikedStateChange = useCallback((state,isPublic) => {
    console.log(state+"+isLikedStateChange")
    console.log(isPublic+"+isPublic")
    setIsLiked(state)
    setIsMyAssessmentPublic(isPublic)

    if(state){
      setLikedCount((preLikedCount) => {
        console.log("pre likedCount + 1")
        return preLikedCount + 1
      })
    }
    if(!isAssessed){
      setInfoCount((preInfoCount) => {
        return preInfoCount + 1
      })
      setIsAssessed(true)
    }

  },[isMyAssessmentPublic,isLiked,likedCount,infoCount,isAssessed])
  // },[]) 
  // },[isLiked]) 
  const inputWinfoTag = useCallback((value) => {
    console.log(JSON.stringify(value)+"+inputWinfoTag")
    setWinfoTag(value)
  },[winfoTag])

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

  const { data , error } = useSWR(
    () => workIdCheck() ? `/api/firebase/assessment/${workId}` : null , fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  console.log(error+"+api error")
  console.log(JSON.stringify(data)+"+api assessment")

  useEffect(() => {
    (async() => {
      console.log("useEffect Out")

      if(workId != undefined) {
        console.log("useEffect Done")
        console.log(workId+"+workId effect")

        if(userId != "uid initial"){
          //////これ上に持っていくことで　薄いいいねが表示されなくなるかも
          await db.collection('privateUsers').doc(userId)
          .collection('postedWorksId').doc(workId)
          .get()
          .then(async(postSnapshot) => {
            console.log(postSnapshot+"+postSnapshot")
            await db.collection('privateUsers').doc(userId)
            .get()
            .then((privateSnapshot) => {
              console.log(privateSnapshot+"+privateSnapshot")
              console.log(privateSnapshot.data()+"+privateSnapshot.data()")
              console.log(JSON.stringify(privateSnapshot.data())+"+privateSnapshot.data()@J")

              if(privateSnapshot.data()["userBookmark"]){//このifはいずれ消す。初期DBだとuserBookmarkのフィールドがないため、この分岐が必要
                console.log(Object.keys(privateSnapshot.data()["userBookmark"])+"OBkey userBookmark")
                if(Object.keys(privateSnapshot.data()["userBookmark"]).includes(workId)){
                  setIsBookmark(true)
                }
              }
              
              console.log(JSON.stringify(postSnapshot.data())+"+postSnapshot.data()@J")
              if(postSnapshot.data()){
                setIsAssessed(true)
                console.log("setisassessed")
                if(postSnapshot.data()["isPublic"] == true){
                  setIsMyAssessmentPublic(true)
                  console.log("setIsMyassessmentPublic true")
                } else {
                  setIsMyAssessmentPublic(false)
                  console.log("setIsMyassessmentPublic true")
                }
                if(postSnapshot.data()["isLiked"] == true){
                  setIsLiked(true)
                  // isLikedStateChange(true)
                } else {
                  // isLikedStateChange(false)
                  setIsLiked(false)
                }
              }
            })
            // console.log(JSON.stringify(postSnapshot)+"+postSnapshot@J")
          })
          .catch((error) => {
            alert('privateUsers DB get fail')
            throw new Error(error)
          })
        }


        await db.collection('wInfo').doc(workId).get()
        .then(doc => {
          let wInfoData = doc.data()
          if (wInfoData){
            console.log(JSON.stringify(wInfoData)+"+wInfoData JSONstr")
            // setWorkwInfoData(wInfoData)
            // console.log(JSON.stringify(wInfoData.workName)+"wInfoData.workName@J")
            // // let workName = wInfoData.workName
            // console.log(JSON.stringify(workName)+"workName@J")
            setWorkName(wInfoData.workName)
            setInfoCount(wInfoData.winfoCount)

            setLikedCount(wInfoData.winfoLikedCount)

            setWorkScore(wInfoData.winfoScore)
            // setWorkScore(sum/wInfoData.workScore.length)
            setWorkInfo(wInfoData.winfoInfomation)

            setCheckBoxState(wInfoData.winfoCategory)
            // setWinfoTag(wInfoData.winfoTag)
            // if(winfoTag.length == 0){
            inputWinfoTag(ObjectSort(wInfoData.winfoTag,"asc"))
            // inputWinfoTag(wInfoData.winfoTag)
            // }

            setWorkCreator(wInfoData.winfoCreator)

            setWorkSeries(wInfoData.winfoSeries)
            setWorkMedia(wInfoData.winfoMedia)
            setWorkPublisher(wInfoData.winfoPublisher)
            setWorkStart(wInfoData.winfoStart)
            setWorkFinish(wInfoData.winfoFinish)
            setWorkImage(wInfoData.winfoImage)

            console.log(JSON.stringify(wInfoData)+"+works wInfoData")
            console.log(JSON.stringify(checkBoxState)+"+works checkBoxState")
            // console.log(JSON.stringify(workData)+"+workData")
            //assessment内データなのでAPIからとってくる必要ある・・・？
            //投稿者情報を取得（isPublic==true以外は除外) 
            if(data && assessmentData.length == 0) {
              setAssessmentData([...data])
              data.forEach((doc) => {
                // setAssessmentData(prevAssessmentWorksId => {
                //   return ([
                //     ...prevAssessmentWorksId,
                //     doc
                //   ])
                // })
                //一つでも非公開以外があればフラグを立てる
                //(「公開可能情報なし」と表示しない)
                if(doc.uid != "非公開") {
                  setIsAssessmenter(true)
                }
              })
            } else {
              console.log("data no exist")
            }
          }
        })
        .catch((error) => {
          alert('works DB get fail')
          throw new Error(error)
        })

      }

      setStandbyState(true)

    })()
  // },[workId,data,userId])
  // },[data,isLiked])
   //isLikedが[]内にある理由いいねしたときに「評価投稿数」「いいね数」を更新するため
  },[data])//いや、ここでisLikedを立ててしまうと、speeddialでいいねになる旅にdbアクセスが走るので表示あ遅くなる

  console.log(JSON.stringify(data)+"+data@J")
  // console.log(workName+"+workName")
  console.log(standbyState+"+standbyStatesta")

  // if(data && typeof workName != "undefined"){
  if(data && (workName != "not definded") && standbyState){
  // if(data && workName){
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
            <Typography className={classes.h5WorksTitle}>
              {"作品名"}
            </Typography>        

            <h3 className={classes.h3WorksName}>
              {workName +" ("+workMedia+")"}
            </h3>

            <Typography className={classes.h5WorksTitle}>
              {"スコア"}
            </Typography> 

            <h3 className={classes.h3WorksName}>
              {workScore != -1 ? workScore : "評価なし"}
            </h3>

            <Typography className={classes.h5WorksTitle}>
              {"評価投稿数"}
            </Typography> 

            <h3 className={classes.h3WorksName}>
              {infoCount}
            </h3>

            <Typography className={classes.h5WorksTitle}>
              {"いいね数"}
            </Typography> 

            <h3 className={classes.h3WorksName}>
              {likedCount ? likedCount : 0}
            </h3>

            {/* いらなそうだけど・・・
            {workScore == [""] && (
              <h2>score: 未評価 </h2>
            )} */}

            <Typography className={classes.h5WorksTitle}>
              {"情報"}
            </Typography> 

            <h3 className={classes.h3WorksName}>
              {workInfo}
            </h3>

            <Typography className={classes.h5WorksTitle}>
              {"カテゴリ"}
            </Typography> 
            
            <h3 className={classes.h3WorksName}>{checkBoxState.map(cate => (
              <span>{cate} </span>
            ))}</h3>

            <Typography className={classes.h5WorksTitle}>
              {"タグ/属性"}
            </Typography>

            <h3 className={classes.h3WorksName}>{Object.keys(winfoTag).map(tokens => (
              <>
              {/* {(1) && ( */}
              {winfoTag[tokens] 
              ? (
                <div >
                {/* <span>{tokens}:{winfoTag[tokens]} </span> */}
                {tokens+":"+winfoTag[tokens]+" "}
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

            <Typography className={classes.h5WorksTitle}>
              {"クリエーター"}
            </Typography> 
            
            <h3 className={classes.h3WorksName}>
              {workCreator ? workCreator : "no data at Creator" }
            </h3>

          　 <Typography className={classes.h5WorksTitle}>
              {"シリーズ"}
            </Typography> 
            
            <h3 className={classes.h3WorksName}>
              {workSeries ? workSeries : "no data at workSeries"}
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
                  searchWord: workName,
                  infoMedia : workMedia,
                  workId : workId,
                  firstPostFlag : isAssessed ? 2 : 0 ,
                }
              }}>
                <a>[{workName}] {isAssessed ? "の評価を編集する。" : "を評価する。"} </a>
              </Link>
              <SpeedDialPosting
                workName={workName} 
                workMedia={workMedia} 
                workId={workId} 
                isLiked={isLiked}
                // setIsLiked={setIsLiked}
                uid={userId}
                setIsLiked={isLikedStateChange}
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

export async function getStaticPaths() {
  // const response = await fetch(
  //   process.env.HOST + '/api/pages'
  // )

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
    { params: { postWorkId: map }}
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

  return {
    props: {params},
    revalidate: 10,
  }
}

export default Post
