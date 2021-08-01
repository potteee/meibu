import React, {useReducer, useEffect ,useState} from 'react';
import Link from 'next/link'

import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'

import { useRouter } from 'next/router'
import { db } from '../../firebase/index'
import GLoading from '../../components/GLoading';

// const initialState = {
//   isLoading : true , 
//   userName : "",
//   userSex : "",
//   userProfile : "",
//   userImage : "",
//   worksData : [],
// }

// const reducer = (state, action) => {
//   switch (action.type){
//     case "loadDB" : {
//       return {
//         ...state,
//         isLoading : false,
//         userName : action.payload.userName,
//         userSex : action.payload.userSex,
//         userProfile : action.payload.userProfile,
//         userImage : action.payload.userImage,
//         worksData : action.payload.worksData,
//       }
//     }
//   }
// }

const userPage = ( props ) => {

  const router = useRouter()
  const { isReady } = useRouter()
  const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう
  const userId = /^\/user\//.test(query) ? query.split('\/')[2] : "no data query"
  
  const [isLoading ,setIsLoading] = useState(true)
  // const [ state , dispatch ] = useReducer(reducer, initialState)
  console.log(JSON.stringify(props)+"+props user uid")

  // const setDBData = (props) => {
  //   dispatch({type:"loadDB",
  //     payload : {
  //       userName : props.users.userName,
  //       userSex : props.users.userSex,
  //       userProfile : props.users.userProfile,
  //       userImage : props.users.userImage,
  //       worksData : props.pubPostedWorksId,
  //     }
  //   })
  // }

  // const fetcher = async() => { 
  //   const url = `/api/firebase/user/${userId}`
  //   console.log(url+"+url")
  //   const res = await fetch(url)

  //   const data = await res.json()
  //   if (res.status !== 200) {
  //     throw new Error(data.message)
  //   }

  //   return data
  // }  
    
  useEffect(() => {
    (async() => {
      if(isReady) {
        setIsLoading(false)
        // const dBData = await fetcher()
        // console.log(JSON.stringify(dBData,null,2)+"+dBData")
        // setDBData(dBData)
      }
    })()
  },[isReady])

  if(isLoading){
    return (
      <GLoading/>
    )
  } else {
    return (
      <>
        <ApplicationBar title="ユーザページ"/>

        <h3>ユーザ情報</h3>
        <p>お名前 : {props.userName}</p>
        <p>性別：
          {props.userSex == 0 && ("未登録")}
          {props.userSex == 1 && ("男性")}
          {props.userSex == 2 && ("女性")}
        </p>
        <p>プロフィール : {props.userProfile}</p>
        <p>プロフ画 : {props.userImage}</p>

        {/* 指定ユーザが投稿した作品の一覧を表示してリンクを貼る */}
        <p>投稿した作品 : {props.worksData.map(token => (
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
  
  const paths = uids.map((map) => (
    { params: {uid : map} }
  ))
  
  return {paths: paths,fallback : true}
}




// params には pathsの要素が一つずつ入ってその回数分getStaticPropsが呼び出される
export async function getStaticProps({ params }) { 
  // const initialState = {
  //   isLoading : true ,
  //   // userId : "", 
  //   userName : "",
  //   userSex : "",
  //   userProfile : "",
  //   userImage : "",
  //   worksData : [],
  // }
  
  // const reducer = (state, action) => {
  //   switch (action.type){
  //     case "loadDB" : {
  //       return {
  //         ...state,
  //         isLoading : false,
  //         // userId : action.payload.userId,
  //         userName : action.payload.userName,
  //         userSex : action.payload.userSex,
  //         userProfile : action.payload.userProfile,
  //         userImage : action.payload.userImage,
  //         worksData : action.payload.worksData,
  //       }
  //     }
  //   }
  // }

  const makeProps = async() => {
    // const router = useRouter()
    // const { isReady } = useRouter()
    // const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう
    // const userId = /^\/user\//.test(query) ? query.split('\/')[2] : "no data query"
    // const [ state , dispatch ] = useReducer(reducer, initialState)
  
    const setDBData = (props) => {
      // dispatch({type:"loadDB",
      const payload = {
        // userId : userId,
        userName : props.users.userName,
        userSex : props.users.userSex,
        userProfile : props.users.userProfile,
        userImage : props.users.userImage,
        worksData : props.pubPostedWorksId,
      }
      // console.log("payload ssg")
      // console.log(JSON.stringify(payload,null,2))
      return payload
    }
  
    const fetcher = async() => { 
      const url = `${process.env.NEXT_PUBLIC_URL}/api/firebase/user/${params.uid}`
      // const url = `/api/firebase/user/${params.uid}`
      // console.log(url+"+url")
      const res = await fetch(url)
  
      const data = await res.json()
      if (res.status !== 200) {
        throw new Error(data.message)
      }
  
      return data
    }  

    const dBData = await fetcher()
    // setDBData(dBData)

    return setDBData(dBData)

  }

  const propsValue = await makeProps()

  return {
    props: propsValue ,
    revalidate: 60,
  }
}

export default userPage