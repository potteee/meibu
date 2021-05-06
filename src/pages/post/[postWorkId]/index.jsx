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

import {getUserId, getWorkId} from "../../../reducks/users/selectors";
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
  const [workName, setWorkName] = useState("")
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

  const [assessmentData ,setAssessmentData] = useState([{userName : "ini" , uid: "ini"}])

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
              setWorkName(wInfoData.workName)
              setInfoCount(wInfoData.winfoCount)

              setWorkScore(wInfoData.winfoScore)
              // setWorkScore(sum/wInfoData.workScore.length)
              setWorkInfo(wInfoData.winfoInfomation)

              setCheckBoxState(wInfoData.winfoCategory)

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
              // setWorkComment(data.workComment)
              // setWorkComment(data.assessment.)
              let tmpAssessmentData = []

              //投稿者情報を取得（isPublic==true以外は除外) 
              if(data) {
                // if(data.userName != undefined || data.userName != "") {
                // if(data.length != 0) {
                  console.log(JSON.stringify(data[0])+"+data[0]@JSON")
                  console.log(data.length+"+data.length")
                  console.log(JSON.stringify(data)+"+data")
                  data.forEach((doc) => {
                    tmpAssessmentData.push(doc)
                  })
                // } else {
                //   tmpAssessmentData.push({userName : "非公開"})
                //   console.log("data.userName no exist")
                // }
                setAssessmentData(tmpAssessmentData)
                console.log(JSON.stringify(tmpAssessmentData)+"tmpAssessmentData@J")
                console.log(JSON.stringify(assessmentData[0]) +"+assessmentData@J");
                console.log(JSON.stringify(assessmentData[1]) +"+assessmentData@J1");
                console.log(JSON.stringify(assessmentData)[0] +"+assessmentData@J");
                console.log(assessmentData[0]+"+assessmentData");
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
    })()
  },[workId,data])

  return (
    <>
      <Header />
      <h2>作品ページ</h2>
{/*       {workId != undefined && ( */}
       {( workId != undefined) && (
//        {( workId != undefined && assessmentData.length != 0) && (
        <div>
          <h2>作品名: {workName}</h2>
          {/* {console.log(workData)} */}
          {workScore != [""] && (
          　　　<h2>score: {workScore}</h2>
          )}

          <h2>評価数：{infoCount}</h2>

          {workScore == [""] && (
            <h2>score: 未評価 </h2>
          )}
          
          <h2>情報:{workInfo}</h2>
          <h2>category:{checkBoxState.map(cate => (
            <span>{cate} </span>
          ))}</h2>
          <h2>クリエーター：{workCreator ? workCreator : "no data at Creator" }</h2>


          <p>シリーズ：{workSeries ? workSeries : "no data at workSeries"}</p>

          <p>メディア：{workMedia}</p>
          <p>出版社：{workPublisher}</p>
          <p>発表：{workStart}</p>
          <p>完結：{workFinish}</p>
          <p>画：{workImage}</p>


          <h2>この作品を評価した人</h2>
          {(assessmentData[0].uid != "非公開") ? (
            <ul>
              {assessmentData.map(mapAssessmentData => (
                <a>
                  <li>
                    <Link href="/post/[id]/[postUserId]" 
                      as={`/post/${workId}/${mapAssessmentData.uid}`}>
                      <h2>{mapAssessmentData.userName}</h2>
                    </Link>
                  </li>
                </a>
              ))}
            </ul>
          ) : (<a> 非公開iii </a>)
          }

          {/*    
            step2 
            <h2>ーこの作品が読めるアプリー</h2> 
            <h2>同じジャンルの人気作</h2>
          */}

        </div>
      )}
      <Footer />
    </>
  )
}

export default Post
