import React, {useReducer, useEffect, useCallback} from 'react';
import Link from 'next/link'

import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'

import {useDispatch, useSelector} from "react-redux";
import {getUserId, getUserName, getRole} from '../../reducks/users/selectors'
// import {getUserId, getUserProfile} from '
import { parseCookies } from 'nookies'
import { useRouter } from 'next/router'
import { db } from '../../firebase/index'
import { LocationDisabled } from '@material-ui/icons';
import GLoading from '../../components/GLoading';

const initialState = {
  isLoading : true , 
  userName : "",
  userSex : "",
  userProfile : "",
  userImage : "",
  worksData : [],
  // worksName : "",
}

const reducer = (state, action) => {
  switch (action.type){
    case "loadDB" : {
      return {
        ...state,
        isLoading : false,
        userName : action.payload.userName,
        userSex : action.payload.userSex,
        userProfile : action.payload.userProfile,
        userImage : action.payload.userImage,
        worksData : action.payload.worksData,
        // worksName : action.payload.worksName,
      }
    }
  }
}

const userPage = () => {
  
  const router = useRouter()
  const { isReady } = useRouter()
  const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう
  const userId = /^\/user\//.test(query) ? query.split('\/')[2] : "no data query"
  
  const [ state , dispatch ] = useReducer(reducer, initialState)
  // const result = {users : snapshot.data() ,pubPostedWorksId : pubPostedWorksId}

  const setDBData = (props) => {
    dispatch({type:"loadDB",
      payload : {
        userName : props.users.userName,
        userSex : props.users.userSex,
        userProfile : props.users.userProfile,
        userImage : props.users.userImage,
        worksData : props.pubPostedWorksId,
        // worksName : "",
      }
    })
  }

  const fetcher = async() => { 
    const url = `/api/firebase/user/${userId}`
    console.log(url+"+url")
    const res = await fetch(url)

    const data = await res.json()
    if (res.status !== 200) {
      throw new Error(data.message)
    }

    return data
  }  
  
  
  //// from Redux
  /// users
  // const userName = getUserName(selector)
  // const role = getRole(selector)

  /// both

  //// from DataBase
  /// users
  // const [userSex, setUserSex] = useState("")
  // const [userProfile, setUserProfile] = useState("")
  // const [userImage, setUserImage] = useState("")

  // /// users->userWorkIds
  // const [worksIds ,setWorkIds] = useState([])

  // /// display worksName
  // const [worksName ,setWorksName] = useState([])
  
  // const [useEffectFin ,setUseEffectFin] = useState(false)

  // const users = getUserId(selector)
  // console.log(JSON.stringify(parseCookies().userID)+"+parse.cookie@_mypage")
  // console.log(JSON.stringify(selector)+"+selector@mypage")
  // // console.log(name+"+query.name@mypage")
  // console.log(uid+"+query.id@mypage")
  
  // const noLoginState = () => {
  //   console.log("start noLoginState")
  //   router.push('/')
  // }

  // useSWR start　
  // // SWRじゃなくていいパターん。
  // const { data , error } = useSWR(
  //   () => (userId && userId != "[uid]") ? `/api/firebase/user/${userId}` : null, fetcher
  //   ,{
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: false
  //   }
  // )
  // console.log(error+"+api error")
  // console.log(JSON.stringify(data)+"+api tmpWorkName")


  // useSWR end
    
  useEffect(() => {
    (async() => {
      if(isReady) {
        const dBData = await fetcher()
        console.log(JSON.stringify(dBData,null,2)+"+dBData")
        setDBData(dBData)
      }
    })()
  },[isReady])

  // if(data && uid != "uid initial" && useEffectFin){
  if(state.isLoading){
    return (
      <GLoading/>
    )
  } else {
    return (
      <>
        <ApplicationBar title="ユーザページ"/>

        <h3>ユーザ情報</h3>
        <p>お名前 : {state.userName}</p>
        <p>性別：
          {state.userSex == 0 && ("未登録")}
          {state.userSex == 1 && ("男性")}
          {state.userSex == 2 && ("女性")}
        </p>
        <p>プロフィール : {state.userProfile}</p>
        <p>プロフ画 : {state.userImage}</p>

        {/* 指定ユーザが投稿した作品の一覧を表示してリンクを貼る */}
        <p>投稿した作品 : {state.worksData.map(token => (
          <Link href="/post/[postWorkId]/[postUserId]"
              as={`/post/${token.workId}/${userId}`}
          >
            <a>{token.workName} </a>
          </Link>
        ))}
        </p> 
        <Footer />
      </>
    )
  }
}

export async function getStaticPaths() {

  let uids = false
  const snapshot = await db.collection('users').get()

  snapshot.forEach((doc) => {
    if(uids == false) {
      uids = [doc.data().uid]
    } else {
      uids = [...uids , doc.data().uid]
    }
  })

////////////////
  
  const paths = uids.map((map) => (
    { params: {uid : map} }
  ))
  
  return {paths: paths,fallback : true}
}

export async function getStaticProps({ params }) {

  return {
    props: { params },
    revalidate: 60,
  }
}

export default userPage