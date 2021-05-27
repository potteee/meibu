// この位置に人ごとの作品採点情報をおく
// [postUserId].js
import React, {useState, useEffect, useCallback} from 'react'
import { useRouter } from 'next/router'
import Header from '../../../components/header'
import Footer from '../../../components/footer'

import {useDispatch, useSelector} from "react-redux";
import {getUserId, getUserName, getRole} from '../../../reducks/users/selectors'

import Link from 'next/link'

import useSWR,{ mutate } from 'swr'

//ユーザごとの作品ページを検索
const fetcher = async (url) => {
  // const res = await fetch(url,{
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body : JSON.stringify(postWorkId)
  // })
  const res = await fetch(url)
  const data = await res.json()
  console.log(data+"+data of fetcher")

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

const handlerPostUserId = () => {
  const selector = useSelector((state) => state)
  const router = useRouter()
  const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう
  console.log(query+"+query at postUserId")
  const postWorkId = /^\/post\//.test(query) ? query.split('\/')[2] : "no data query"
  const postUserId = /^\/post\//.test(query) ? query.split('\/')[3] : "no data query"
  console.log(postUserId+"+postUserId")
  console.log(postWorkId+"+postWorkId")

  const [userName, setUserName] = useState("")
  // const [loginUserId, setLoginUserId] = useState("")
  const [workName, setWorkName] = useState("")
  const [workMedia, setWorkMedia] = useState("")
  const [workScore, setWorkScore] = useState("")
  const [workCategory, setWorkCategory] = useState([])
  const [workTag, setWorkTag] = useState([])
  const [workComment ,setWorkComment] = useState("")
  const [workUpdateTime, setWorkUpdateTime] = useState("")
  const [assessmentComment, setAssessmentComment] = useState([""])
  const [assessmentLike, setAssessmentLike] = useState(0)
  const [isPublic, setIsPublic] = useState(false)

  const postIdCheck = () => {
    console.log("postIdCheck start")
    if(!postWorkId){
      return false 
    } else {
      if(!postUserId){
        return false
      } else {
        if(postWorkId == "[postWorkId]"){
          console.log(postWorkId+"false postWorkId")
          return false
          } else {
            if (postUserId == "[postUserId]"){
              console.log(postUserId+"false postUserId")
              return false
            } else {
              console.log("return true")
              return true
          }
        }
      }
    }
  } 
  
  const { data , error } = useSWR(
      // `../../api/firebase/assessmentSearchUser/${postUserId}_${postWorkId}`, fetcher,
      () => postIdCheck() ? `../../api/firebase/assessmentSearchUser/${postWorkId}_${postUserId}`:null, fetcher,
      // () => postUserId && [`../../api/firebase/assessmentSearchUser/${postUserId}`,postWorkId.json()], fetcher,
      
      // postUserId ? [`../../api/firebase/assessmentSearchUser/${postUserId}`,postWorkId] 
      // : null ,(url, postWorkId) => query(url,{postWorkId})) , 
      
      // [`../../api/firebase/assessmentSearchUser/${postUserId}`,postWorkId],
      // (url, postWorkId) => fetcher(url, {postWorkId}),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      }
  )
  console.log(error+"+api error")
  console.log(JSON.stringify(data)+"+api assessmentSearchUser")

  useEffect(() => {
    (async() => {
      console.log("useEffect Out")
      //Redux

      if(postWorkId != "no data query" && postUserId != "no data query") {
        console.log("useEffect Done")
        if(data) {
          // if(data.userName != undefined || data.userName != "") {
          if(data.length != 0) {
            console.log(JSON.stringify(data)+"+data[0]@JSON")
            setUserName(data.userName)
            setWorkName(data.workName)
            setWorkMedia(data.winfoMedia)
            setWorkScore(data.workScore)
            setWorkCategory(data.assessmentCategory)
            setWorkTag(data.assessmentWorkTag)
            setWorkComment(data.workComment)
            setWorkUpdateTime(new Date(data.updated_at._seconds * 1000).toLocaleString("ja"))
            // setWorkUpdateTime(new Date(data.updateTime._seconds * 1000).toLocaleString("ja"))
            setAssessmentComment(data.assessmentComment)
            setAssessmentLike(data.worksLikedCount)

            setIsPublic(data.isPublic)

          } else {
            console.log("data.userName no exist")
          }
        } else {
          console.log("data no exist")
        }
      }
    })()
  },[data])

  return (
    <>
      <Header />
      <h2>ユーザごとの作品評価ページ</h2>
      
      {!isPublic && (<a>※このページは他のユーザには公開されません</a>)}
      
      <Link href="/user/[uid]" 
        as={`/user/${postUserId}/`}>
        <h3>評価者(L)：{userName}</h3>
      </Link>

      <Link href="/post/[postWorkId]" 
        as={`/post/${postWorkId}`}>
        <h3>作品名(L)：{workName}</h3>
      </Link>
      {/* <h3>作品名(L)：{workName}</h3> */}
      <h4>メディア：{workMedia}</h4>
      <h3>採点：{workScore != -1 ? workScore : "採点なし"}</h3>
      <h3>カテゴリ：{
        workCategory.map(mapWorkCategory => (
          <a> {mapWorkCategory} </a>
        ))
        }
      </h3>
      <h3>タグ：{
        workTag.map(mapWorkTag => (
        <a>{mapWorkTag} </a>
        ))
      }
            
      </h3>
      <h3>作品に対するコメント：{workComment}</h3>
      <h3>投稿日時：{workUpdateTime}</h3>

      {/* リダックスのユーザ情報と作品のユーザ情報が同一の場合 */}
      {(postUserId == selector.users.uid) && (
        <Link href={{
          pathname: "/post/posting",
          query: { 
            searchWord : workName,
            workId : postWorkId,
            infoMedia : workMedia,
            firstPostFlag : 2, // 自分の作品を編集
            },
        }}>
          <a>編集する</a>
        </Link>
      )}
      <br/>
      <h3>評価に対するコメント：{assessmentComment}</h3>
      <h3>いいね：{assessmentLike}</h3>

      <Footer />
    </>
  )
}

export default handlerPostUserId
