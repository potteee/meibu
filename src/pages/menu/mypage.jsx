import React, {useState, useEffect, useCallback} from 'react';
import Link from 'next/link'
import { TextInput,PrimaryButton } from "../../styles/UIkit"

import Header from '../../components/header'
import Footer from '../../components/footer'
import {useDispatch, useSelector} from "react-redux";
import {getUserId, getUserName, getRole} from '../../reducks/users/selectors'
// import {getUserId, getUserProfile} from '
import { parseCookies } from 'nookies'
import { useRouter } from 'next/router'
// import {useLocation} from 'react-router-dom'
// import { UsersReducer } from '../../reducks/users/reducers';
import { db } from '../../firebase/index'

import mypageEdit from './mypageEdit'

//API
import useSWR,{ mutate } from 'swr'
// const fetcher = (url,{id}) => fetch(url,{id}).then((res) => res.json())
// const fetcher = async(url,{id}) => await fetch(url,{id}).then((res) => res.json())
// const fetcher = () => fetch('../api/firebase')

////　プリフェッチしようと思ったがqueryの値を使わなきゃいけないから難しそう・・・？
// function prefetch () {
//   mutate('/api/data', fetch('/api/data').then(res => res.json()))
//   // the second parameter is a Promise
//   // SWR will use the result when it resolves
// }

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
  // const router = useRouter()
  const { query } = useRouter()

  // const { name,id } = router.query
  const dispatch = useDispatch()
  // var queryNameFlag = 0
  // const location = useLocation();

  //// from Redux
  /// users
  const [userName, setUserName] = useState("")
  const [role, setRole] = useState("")
  /// both
  const [uid, setUid] = useState("")

  //// from DataBase
  /// users
  const [userSex, setUserSex] = useState("")
  const [userProfile, setUserProfile] = useState("")
  const [userImage, setUserImage] = useState("")

  /// privateUsers
  const [userEmail ,setUserEmail] = useState("")
  const [userLiveIn ,setUserLiveIn] = useState("")
  const [userWebsite ,setUserWebsite] = useState("")

  /// postedWorkId
  const [workIds ,setWorkIds] = useState([])

  /// display worksName
  const [worksName ,setWorksName] = useState("initialWorksName")
  
//   function hoge(){
//     //　Object||ArrayならリストにINして循環参照チェック
//     var checkList = [];
//     return function(key,value){
//         // 初回用
//         if( key==='' ){
//             checkList.push(value);
//             return value;
//         }
//         // Node,Elementの類はカット
//         // if( value instanceof Node ){
//         //     return undefined;
//         // }
//         // Object,Arrayなら循環参照チェック
//         if( typeof value==='object' && value!==null ){
//             return checkList.every(function(v,i,a){
//                 return value!==v;
//             }) ? value: undefined;
//         }
//         return value;       
//     }
// }


  // const users = getUserId(selector)
  console.log(JSON.stringify(parseCookies().userID)+"+parse.cookie@_mypage")
  console.log(JSON.stringify(selector)+"+selector@mypage")
  // console.log(name+"+query.name@mypage")
  console.log(query.id+"+query.id@mypage")

  // const safeStringify = require('fast-safe-stringify')

  // console.log(JSON.stringify({db})+"+ db ")
  // console.log(safeStringify({db})+"+ db ")
  
  const noLoginState = () => {
    console.log("start noLoginState")
    router.push('/')
  }
  // useSWR start
  
  //　ここにapiで作品名を検索する機能を入れたい。
  const { data, error } = useSWR(
    () => query.id && `../api/firebase/${query.id}`, fetcher
  // const {data, error } = useSWR(['../api/firebase',22], (url,id) => fetcher(url, {id}),
    // イニシャル値を設定してしまうと、レンダリング直後に読みに行ってくれない。
    // ,{ initialData: {names: 'SWRinitialWorksName',id: '99'}},
    // { revalidateOnMount: true },
    // { refreshWhenOffline: true }
  )
  // const tmpWorkName = data
  
  if (error) return <div>Failed to load</div>
  // if (!data) return <div>Loading...</div>

  // setWorksName(data.names)

  console.log(error+"+api error")
  console.log(JSON.stringify(data)+"+api tmpWorkName")

  // useSWR end
    
  // setUid(getUserId(selector))
  // useEffectの中でdb呼び出すときはこの書き方（ifをつかう）
  // if使わないとapp呼び出されたときにレンダリングされてuidがないからエラーになる。
  useEffect(() => {
    (async() => {
      //Redux
      setUserName(getUserName(selector))
      setRole(getRole(selector))
      setUid(getUserId(selector))
      
      let uid2 = getUserId(selector)  
      
      console.log(JSON.stringify(selector)+"+selector2@mypage")
      console.log(uid+"+uid useEffect out")
      console.log(uid2+"+uid2 useEffect out")
      
      //DB
      if(uid2 && uid2 != "uid initial"){
        // await setUid(await getUserId(selector))
        console.log(uid2+"+uid useEffect in")
        
        db.collection('users').doc(uid2).get()
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
        
        db.collection('privateUsers').doc(uid2).get()
        .then(snapshot => {
          let dbData = snapshot.data()
          console.log(dbData+"+data collection email")
          setUserEmail(dbData.email)
          setUserLiveIn(dbData.userLiveIn)
          setUserWebsite(dbData.userWebsite)
        })
        .catch((error) => {
          alert('Get privateUsers DB fail')
          throw new Error(error)
        })
        
        db.collection('privateUsers').doc(uid2)
        .collection('postedWorksId').where('workId','!=','99').get()
        .then((snapshot) => {
          console.log(snapshot+"+snapshot.data()")
          if(snapshot.empty){
            setWorkIds("投稿した作品はまだありません！")
            console.log("投稿した作品はありません！")
          }else{
            let tmpWorkIds = []
            snapshot.forEach((doc) => {
              // tmpWorkIds.push(doc.data().workId) →データ取りたいときはこれ。
              tmpWorkIds.push(doc.id)
              // list.push(snapshot.data())
              console.log(doc.id+"+doc.id")
            })
            
            
            console.log(JSON.stringify(snapshot.data)+"+snapshot.doc")
            console.log(JSON.stringify(snapshot.empty)+"+snapshot.empty")
            console.log(JSON.stringify(tmpWorkIds)+"+tmpWorkIds")
            
          }
          
          if(data){
            setWorksName(data.names)
          }
          
        })
        .catch((error) => {
          alert('Get worksId DB fail')
          throw new Error(error)
        })
      }
    })()
  // },[selector])
  },[selector,data,fetcher])



  if(selector.users.isSignedIn === false){
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
    }
  }

  return (
    <>
    {/* {myInfo} */}
      <Header />
      <h2>MyPage</h2>
      {/* Reduxからのデータを表示する部分と
      DBからのデータを表示する部分を分けて高速化。 */}

      {/* Redux部 */}
      <h3>公開ユーザ情報</h3>
      <p>お名前 : {userName}</p>
      <p>性別：
        {userSex == 0 && ("未登録")}
        {userSex == 1 && ("男性")}
        {userSex == 2 && ("女性")}
      </p>
      <p>プロフィール : {userProfile}</p>
      <p>プロフ画 : {userImage}</p>
      {/* <p>userEmail : {emailFunc}</p> */}

      <h3>プライベート情報</h3>
      <p>お住まい : {userLiveIn}</p>
      <p>メール : {userEmail}</p>
      {/* 自身が投稿した作品の一覧を表示してリンクを貼る */}
      <p>投稿した作品 : {worksName}</p>

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
}

export default MyPage