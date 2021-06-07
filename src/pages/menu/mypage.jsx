import React, {useState, useEffect, useCallback} from 'react';
import Link from 'next/link'
import { TextInput,PrimaryButton } from "../../styles/UIkit"

import Header from '../../components/header'
import Footer from '../../components/footer'
import {useDispatch, useSelector} from "react-redux";
import {getIsSignedIn, getUserId, getUserName, getRole} from '../../reducks/users/selectors'
// import {getUserId, getUserProfile} from '
import { parseCookies } from 'nookies'
import { useRouter } from 'next/router'
// import {useLocation} from 'react-router-dom'
// import { UsersReducer } from '../../reducks/users/reducers';
import { db } from '../../firebase/index'

import mypageEdit from './mypageEdit'

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
const MyPage = () => {
// export default function MyPage() {
  const selector = useSelector((state) => state)
  const userID = parseCookies().userID
  const router = useRouter()
  const { query } = useRouter()

  // const { name,id } = router.query
  const dispatch = useDispatch()
  // var queryNameFlag = 0
  // const location = useLocation();

  //// from Redux
  const userName = getUserName(selector)
  const role = getRole(selector)
  const uid = getUserId(selector)  
  const isSignedIn = getIsSignedIn(selector)

  //// from DataBase
  /// users
  const [userSex, setUserSex] = useState("")
  const [userProfile, setUserProfile] = useState("")
  const [userImage, setUserImage] = useState("")

  /// privateUsers
  const [userEmail ,setUserEmail] = useState("")
  const [userLiveIn ,setUserLiveIn] = useState("")
  const [userWebsite ,setUserWebsite] = useState("")
  const [userBirthday ,setUserBirthday] = useState("")

  /// postedWorkId
  const [workIds ,setWorkIds] = useState([])

  /// display worksData
  // const [worksData ,setWorksData] = useState([])
  let worksData


  let noWorkFlag = true

  // let uid = "uid initial"

  // const users = getUserId(selector)
  console.log(JSON.stringify(parseCookies().userID)+"+parse.cookie@_mypage")
  console.log(JSON.stringify(selector)+"+selector@mypage")
  // console.log(name+"+query.name@mypage")
  console.log(query.id+"+query.id@mypage")
  
  const noLoginState = () => {
    console.log("start noLoginState")
    router.push('/')
  }
  // useSWR start
  
  //　ここにapiで作品名を検索する機能を入れたい。→入れた
  //  ★初期ログイン直後に読み込んでくれるようにしないと。
  const { data , error } = useSWR(
    // () => query.id ? `../api/firebase/postedWorksId/${query.id}` : null, fetcher
    () => uid ? `../api/firebase/postedWorksId/${uid}` : null, fetcher
    // const {data, error } = useSWR(['../api/firebase',22], (url,id) => fetcher(url, {id}),
    // イニシャル値を設定してしまうと、レンダリング直後に読みに行ってくれない。
    // ,{ initialData: {names: 'SWRinitialWorksName',id: '99'}},
    // { revalidateOnMount: true },
    // { refreshWhenOffline: true }
    ,{
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  // const tmpWorkName = data

  console.log(error+"+api error")
  console.log(JSON.stringify(data)+"+api tmpWorkName")

  // useSWR end
    
  // setUid(getUserId(selector))
  // useEffectの中でdb呼び出すときはこの書き方（ifをつかう）
  // if使わないとapp呼び出されたときにレンダリングされてuidがないからエラーになる。
  // 手前でreturnsしてもダメ
  useEffect(() => {
    (async() => {    
      console.log(JSON.stringify(selector)+"+selector2@mypage")
      console.log(uid+"+uid useEffect out")
      // console.log(uid+"+uid useEffect out")
      
      //DB
      if(uid && uid != "uid initial"){
        // await setUid(await getUserId(selector))
        console.log(uid+"+uid useEffect in")
        
        await db.collection('users').doc(uid).get()
        .then(snapshot => {
          let dbData = snapshot.data()
          console.log(dbData+"+data collection email")
          setUserSex(dbData.userSex)
          setUserProfile(dbData.userProfile)
          setUserImage(dbData.userImage)
        })
        .catch((error) => {
          alert('Get users DB fail')
          throw new Error(error)
        })
        
        await db.collection('privateUsers').doc(uid).get()
        .then(snapshot => {
          let dbData = snapshot.data()
          console.log(dbData+"+data collection email")
          setUserEmail(dbData.email)
          setUserLiveIn(dbData.userLiveIn)
          setUserWebsite(dbData.userWebsite)
          setUserBirthday(dbData.userBirthday)
        })
        .catch((error) => {
          alert('Get privateUsers DB fail')
          throw new Error(error)
        })
      }
    })()
  },[data])

  if (error) return <div>Failed to load</div>
  // if (!data) return <div>Loading...</div>

  // let tmpWorksId = []
  let dataFlag = false

  if(data) {
    if(data.worksData.length != 0){
      dataFlag = true
      console.log(JSON.stringify(data.worksData)+"+data.worksData@J")
      noWorkFlag = false // 一度trueになってしまっているのでfalseに戻す。
      worksData = data.worksData
      console.log("登録した作品がありました。")
    } 
  } 
  if(dataFlag == false){
    worksData = ["投稿したデータはありませんんん"]
    noWorkFlag = true
    console.log("投稿した作品はありません！")
  }

  if(isSignedIn === false){
    //ブラウザ更新時orログインから飛んできたときに'/'に行かないように。
    //ログインしているにもかかわらず、isSignedInがfalseだったとき
    if(userID || query.id){
      //query(name)delete
      // queryNameFlag = 1
      // url.searchParams.delete('name');
      return (
        <>
        <p>...loading...</p>
        </>
      )
    //ログアウト状態時
    //この条件つけないとSSR時にdispatchしてしまってエラーになる
    } else if (typeof window !== 'undefined') {
      return (
        <>
        {dispatch(noLoginState)}
        </>
      )
    } else {
      console.log("else patern")
    }
  } else {
    console.log("isSignedIn true")
  }

  // if(data && userSex != ""){

    // 最後にsetしているuseBirthdayをチェック
  if(data && userBirthday != ""){
    return (
      <>
      {/* {myInfo} */}
        <Header />
        <h2>MyPage</h2>
        {/* Reduxからのデータを表示する部分と
        DBからのデータを表示する部分を分けて高速化。 */}

        {/* Redux部 */}
        <h3>公開ユーザ情報</h3>
        <Link href="/user/[uid]" 
          as={`/user/${uid}`}>
          <h3>お名前(L)：{userName}</h3>
        </Link>
        {/* <p>お名前 : {userName}</p> */}
        <p>性別：
          {userSex == 0 && ("未登録")}
          {userSex == 1 && ("男性")}
          {userSex == 2 && ("女性")}
        </p>
        <p>プロフィール : {userProfile}</p>
        <p>プロフ画 : {userImage}</p>
        {/* <p>userEmail : {emailFunc}</p> */}

        <h3>プライベート情報</h3>
        <p>メール : {userEmail}</p>
        <p>お住まい : {userLiveIn}</p>
        <p>Web/SNS : {userWebsite}</p>
        <p>誕生日 : {userBirthday}</p>
        
        {/* 自身が投稿した作品の一覧を表示してリンクを貼る */}
        
        <p>投稿した作品：</p>
        {worksData.length != 0 
          ? <>{!noWorkFlag 
            ? <>
              {worksData.map((map) => (
                <>
                <Link
                  href="/post/[postWorkId]/[postUserId]"
                  as={`/post/${map.workId}/${uid}/`}
                >
                  {map.workName}
                </Link>
                <br/>
                </>
              ))}
            </>
            : <>"投稿した作品はありません"</>
          }</> 
          : <>"読み込み中・・・"</>
        }
        

        <h3>非公開情報</h3>
        <p>role : {role}</p>
        <p>uid : {uid}</p>
        
        <Link 
          href={{
            pathname: "/menu/mypageEdit",
            query: { hist : "mypage" },
          }} 
        >
          <a>mypageを編集する</a>
        </Link>

        {/* <PrimaryButton
          label={"mypageを編集する"}
          onClick={ () => router.push('/menu/mypageEdit')}
        /> */}

        <Footer />
      </>
    )
  } else {
    return <>loading...</>
  }
}

export default MyPage