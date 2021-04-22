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

  const [assessmentUserName ,setAssessmentUserName] = useState([])


    // let data = undefined

  const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう
  console.log(query+"+query")
  const workId = /^\/post\//.test(query) ? query.split('\/post\/')[1] : ""

  console.log(workId+"=workId")


  const { data , error } = useSWR(
    () => workId && `../api/firebase/assessment/${workId}`, fetcher,
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
              let tmpAssessmentUserName = []

              if(data) {
                // if(data.userName != undefined || data.userName != "") {
                if(data.length != 0) {
                  console.log(data.userName+"+data.uid")
                  data.forEach((doc) => {
                    tmpAssessmentUserName.push(doc.userName+" ")
                  })
                  setAssessmentUserName(tmpAssessmentUserName)
                } else {
                  console.log("data.userName no exist")
                }
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
        {workId != undefined && (
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
            <span>{cate}/</span>
          ))}</h2>
          <h2>クリエーター：{workCreator ? workCreator : "no data at Creator" }</h2>


          <p>シリーズ：{workSeries ? workSeries : "no data at workSeries"}</p>

          <p>メディア：{workMedia}</p>
          <p>出版社：{workPublisher}</p>
          <p>発表：{workStart}</p>
          <p>完結：{workFinish}</p>
          <p>画：{workImage}</p>

          <h2>この作品を評価した人：{assessmentUserName}(評価ページにリンク（未））</h2>
          
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
