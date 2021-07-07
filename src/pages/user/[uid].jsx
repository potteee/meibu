import React, {useState, useEffect, useCallback} from 'react';
import Link from 'next/link'
import { TextInput,PrimaryButton } from "../../styles/UIkit"

import Header from '../../components/header'
import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'

import {useDispatch, useSelector} from "react-redux";
import {getUserId, getUserName, getRole} from '../../reducks/users/selectors'
// import {getUserId, getUserProfile} from '
import { parseCookies } from 'nookies'
import { useRouter } from 'next/router'
// import {useLocation} from 'react-router-dom'
// import { UsersReducer } from '../../reducks/users/reducers';
import { db } from '../../firebase/index'

//API
import useSWR,{ mutate } from 'swr'


const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
  // const result = {users : snapshot.data() ,pubPostedWorksId : pubPostedWorksId}

}
const userPage = () => {
// export default function MyPage() {
  const selector = useSelector((state) => state)
  const CookiesUserId = parseCookies().userID
  const router = useRouter()
  const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう
  const userId = /^\/user\//.test(query) ? query.split('\/')[2] : "no data query"
  console.log(userId+"+userId")
  // const { name,id } = router.query
  const dispatch = useDispatch()
  // var queryNameFlag = 0
  // const location = useLocation();

  //// from Redux
  /// users
  const userName = getUserName(selector)
  const role = getRole(selector)

  /// both
  const uid = getUserId(selector)

  //// from DataBase
  /// users
  const [userSex, setUserSex] = useState("")
  const [userProfile, setUserProfile] = useState("")
  const [userImage, setUserImage] = useState("")

//   /// privateUsers
//   const [userEmail ,setUserEmail] = useState("")
//   const [userLiveIn ,setUserLiveIn] = useState("")
//   const [userWebsite ,setUserWebsite] = useState("")
//   const [userBirthday ,setUserBirthday] = useState("")

  /// users->userWorkIds
  const [workIds ,setWorkIds] = useState([])

  /// display worksName
  const [worksName ,setWorksName] = useState([])
  
  const [useEffectFin ,setUseEffectFin] = useState(false)

  // const users = getUserId(selector)
  console.log(JSON.stringify(parseCookies().userID)+"+parse.cookie@_mypage")
  console.log(JSON.stringify(selector)+"+selector@mypage")
  // console.log(name+"+query.name@mypage")
  console.log(uid+"+query.id@mypage")
  
  const noLoginState = () => {
    console.log("start noLoginState")
    router.push('/')
  }

  // useSWR start
  const { data , error } = useSWR(
    () => (userId && userId != "[uid]") ? `/api/firebase/user/${userId}` : null, fetcher
    ,{
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  console.log(error+"+api error")
  console.log(JSON.stringify(data)+"+api tmpWorkName")


  // useSWR end
    
  useEffect(() => {
    (async() => {
      console.log(uid+"+uid useEffect out")
      
      //DB
      if(uid && uid != "uid initial"){
        // await setUid(await getUserId(selector))
        console.log(uid+"+uid useEffect in")
    
        // if (error) return <div>Failed to load</div>
        let tmpWorksId = []

        if(data) {
            console.log(JSON.stringify(data)+"+data@J")
            // console.log(JSON.stringify(data._fieldsProto)+"+data._fieldsProto@J")
            // console.log(JSON.stringify(data.docs)+"+data.docs@J")
            // console.log(JSON.stringify(data.ref())+"+data.data()@J")

            //ユーザ名
            // setUserName(data.users.userName)

            //性別
            setUserSex(data.users.userSex)

            //プロフィール
            setUserProfile(data.users.userProfile)

            //画像
            setUserImage(data.users.userImage)

  
            //作品たち
            setWorksName(data.pubPostedWorksId)

            setUseEffectFin(true) 
        } 
        // }
      }
    })()
  },[data])

  // if(data && uid != "initial uid" && worksName.length != 0){
  if(data && uid != "initial uid" && useEffectFin){
    return (
      <>
      {/* {myInfo} */}
        {/* <Header /> */}
        <ApplicationBar title="ユーザページ"/>

        {/* <h2>UserPage</h2> */}
        {/* Reduxからのデータを表示する部分と
        DBからのデータを表示する部分を分けて高速化。 */}

        {/* Redux部 */}
        <h3>ユーザ情報</h3>
        <p>お名前 : {userName}</p>
        <p>性別：
          {userSex == 0 && ("未登録")}
          {userSex == 1 && ("男性")}
          {userSex == 2 && ("女性")}
        </p>
        <p>プロフィール : {userProfile}</p>
        <p>プロフ画 : {userImage}</p>
        {/* <p>userEmail : {emailFunc}</p> */}

        
        {/* 自身が投稿した作品の一覧を表示してリンクを貼る */}
        <p>投稿した作品 : {worksName.map(token => (
          <Link href="/post/[postWorkId]"
              as={`/post/${token.workId}`}
          >
            <a>{token.workName} </a>
          </Link>
        ))}</p> 
        <Footer />
      </>
    )
  } else {
    return <>loading...</>
  }
}

export default userPage