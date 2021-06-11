import React, {useState, useEffect, useCallback} from 'react'
import { PrimaryButton, TextInput ,CheckIconBox} from "../../../styles/UIkit"
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
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
const Post = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  // const { id, onework ,workId} = router.query

  // const [workData, setWorkData] = useState({})
  const userId = getUserId(selector)
  const userName = getUserName(selector)

  // let workName = "initial workName" 
  //letで定義すると、際レンダリング時に再初期化されてしまう。
  //その為、dataでデータを取得するギミックがある場合は
  //useStateを使った方がいい（と思う）
  const [workName, setWorkName] = useState("not definded")
  const [infoCount, setInfoCount] = useState(0)
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

  const [assessmentData ,setAssessmentData] = useState([])
  // const [assessmentData ,setAssessmentData] = useState([{userName : "ini" , uid: "ini"}])

  const [isAssessmenter, setIsAssessmenter] = useState(0)
  const [isNonPublicAssessment, setIsNonPublicAssessment] = useState(0)

  // const [userId, setUserId] = useState("")
  // const [userName, setUserName] = useState("")

  const [winfoTag, setWinfoTag] = useState([])

    // let data = undefined

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
    () => workIdCheck() ? `../api/firebase/assessment/${workId}` : null , fetcher,
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

            setWorkScore(wInfoData.winfoScore)
            // setWorkScore(sum/wInfoData.workScore.length)
            setWorkInfo(wInfoData.winfoInfomation)

            setCheckBoxState(wInfoData.winfoCategory)
            setWinfoTag(wInfoData.winfoTag)

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
              data.forEach((doc) => {
                // tmpAssessmentData.push(doc)
                setAssessmentData(prevAssessmentWorksId => {
                  return ([
                    ...prevAssessmentWorksId,
                    doc
                  ])
                })

                //一つでも非公開以外があればフラグを立てる
                //(「公開可能情報なし」と表示しない)
                if(doc.uid != "非公開") {
                  setIsAssessmenter(1)
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
        await db.collection('privateUsers').doc(userId)
        .collection('postedWorksId').doc(workId)
        .get()
        .then((snapshot) => {
          console.log(snapshot+"+snapshot")
          // console.log(JSON.stringify(snapshot)+"+snapshot@J")
          console.log(JSON.stringify(snapshot.data())+"+snapshot.data()@J")
          if(snapshot.data()){
            setIsNonPublicAssessment(1)
          }
        })
        .catch((error) => {
          alert('privateUsers DB get fail')
          throw new Error(error)
        })
      }
    })()
  // },[workId,data,userId])
  },[data])

  console.log(data+"+data")
  // console.log(workName+"+workName")

  // if(data && typeof workName != "undefined"){
  if(data && workName != "not definded"){
  // if(data && workName){
    let isLoginUserAssessment = false
    return (
      <>
        <Header />
        <p>作品ページ</p>
        <h2>作品名: {workName}</h2>
        <h2>score: {workScore != -1 ? workScore : "評価なし"}</h2>

        <h2>評価数：{infoCount}</h2>

        {workScore == [""] && (
          <h2>score: 未評価 </h2>
        )}
        
        <h2>情報:{workInfo}</h2>
        <h2>category:{checkBoxState.map(cate => (
          <span>{cate} </span>
        ))}</h2>

        <h3>tag:{Object.keys(winfoTag).map(tokens => (
          <>
          {/* {(1) && ( */}
          {winfoTag[tokens] 
           ? (
            <span>
            {/* <span>{tokens}:{winfoTag[tokens]} </span> */}
            {tokens+":"+winfoTag[tokens]+" "}
            </span>
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

        <h2>クリエーター：{workCreator ? workCreator : "no data at Creator" }</h2>


        <p>シリーズ：{workSeries ? workSeries : "no data at workSeries"}</p>

        <p>メディア：{workMedia}</p>
        <p>出版社：{workPublisher}</p>
        <p>発表：{workStart}</p>
        <p>完結：{workFinish}</p>
        <p>画：{workImage}</p>

        <h3>評価を見る</h3>
        {(assessmentData.length != 0 && isAssessmenter == 1) && (
          <>
            <ul>
              {assessmentData.map(mapAssessmentData => ( 
                <>
                  {mapAssessmentData.uid != "非公開" && (
                    <>
                      <li>
                        <Link href="/post/[id]/[postUserId]" 
                          as={`/post/${workId}/${mapAssessmentData.uid}`}>
                          <a>{mapAssessmentData.userName}</a>
                        </Link>
                      </li>
                      {mapAssessmentData.uid == userId && (
                        isLoginUserAssessment = true
                      )}
                    </>
                  )}
                </>
              ))}
            </ul>
          </>
        )}
        {isAssessmenter == 0 && (<p> 公開可能情報なし </p>) }

        {/* <h3>あなたの評価</h3> */}
        {/* <a>userId:::: {userId}</a> */}
        {isLoginUserAssessment == true && (
          <Link href="/post/[id]/[postUserId]" 
            as={`/post/${workId}/${userId}`}>
            <a>{userName}の評価</a>
          </Link>
        )}

        {(isLoginUserAssessment != true && isNonPublicAssessment == 0)&& (
          <Link href={{
            pathname: "/post/posting",
            query: {
              searchWord: workName,
              infoMedia : workMedia,
              workId : workId,
              firstPostFlag : 0,
            }
          }}>
            <a>[{workName}]を評価する。</a>
          </Link>
        )}

        {(isLoginUserAssessment != true && isNonPublicAssessment == 1)&& (
          <Link href={{
            pathname: "/post/posting",
            query: {
              searchWord: workName,
              infoMedia : workMedia,
              workId : workId,
              firstPostFlag : 2,
            }
          }}>
            <a>[{workName}]の評価を編集する。</a>
          </Link>
        )}
        {/*    
          step2 
          <h2>ーこの作品が読めるアプリー</h2> 
          <h2>同じジャンルの人気作</h2>
        */}
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

export default Post
