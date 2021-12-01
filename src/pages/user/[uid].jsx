import React, {useEffect ,useState} from 'react';
import { collection, doc, query, where, getDocs ,getDoc ,setDoc, updateDoc ,Timestamp } from "firebase/firestore";

import Link from 'next/link'

import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'

import { useRouter } from 'next/router'
import { db } from '../../firebase/index'
import GLoading from '../../components/GLoading';

const userPage = ( props ) => {

  const router = useRouter()
  const { isReady } = useRouter()
  const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう
  const userId = /^\/user\//.test(query) ? query.split('\/')[2] : "no data query"
  
  const [isLoading ,setIsLoading] = useState(true)
  console.log(JSON.stringify(props)+"+props user uid")

  useEffect(() => {
    (async() => {
      if(isReady) {
        setIsLoading(false)
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
          {(props.userSex == 0 || props.userSex == null) && ("未登録")}
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

  let uids = []
  // let uids = false
  // const snapshot = await db.collection('users').get()
  const snapshot = await getDocs(collection(db, 'users'))
  
  snapshot.forEach((doc) => {
    // if(uids == false) {
    //   uids = [doc.data().uid]
    // } else {
      uids = [...uids , doc.data().uid]
    // }
  })
  
  const paths = uids.map((map) => (
    { params: {uid : map} }
  ))
  
  return {paths: paths,fallback : true}
}

// params には pathsの要素が一つずつ入ってその回数分getStaticPropsが呼び出される
export async function getStaticProps({ params }) { 

  const makeProps = async() => {
  
    const setDBData = (props) => {
      const payload = {
        userName : props.users.userName || null,
        userSex : props.users.userSex || null,
        userProfile : props.users.userProfile || null,
        userImage : props.users.userImage || null,
        worksData : props.pubPostedWorksId || null,
      }
      return payload
    }
  
    const fetcher = async() => { 
      // const url = `/api/firebase/user/${params.uid}`

      // let url = null
      // if(process.env.NEXT_PUBLIC_NODE_ENV === "development"){
      //   url = `${process.env.NEXT_PUBLIC_URL}/api/firebase/user/${params.uid}`
      // } else {
      //   url = `${process.env.url}/api/firebase/user/${params.uid}`
      // }
      // const url = `https://${process.env.url}/api/firebase/user/${params.uid}`
      // const url = `${process.env.NEXT_PUBLIC_URL}/api/firebase/user/${params.uid}`
      // console.log(url+"+user url")
      // const res = await fetch(url)

      const dBData = await Promise.all([
        getDoc(doc(db, 'users', params.uid))
        .then(async(res) => {
          console.log("success to get users")
          // const data = await res.json()
          if(res == undefined){
            console.log("pubPostedWorksIdRes res == undefined")
            return null
          }
          return res.data()
        }).catch((error) => {
          console.log('users DB get fail')
          throw new Error(error)
        }),
        
        getDocs(collection(db, 'users', params.uid, 'pubPostedWorksId'))
        .then(async(res) => {
          console.log("success to get pubPostedWorksIdRes")
          if(res == undefined){
            console.log("pubPostedWorksIdRes res == undefined")
            return null
          }
          // const data = await res.json()
          return res
        }).catch((error) => {
          console.log("failed to get pubPostedWorksIdRes")
          throw new Error(error)
        })
      ])

      console.log(JSON.stringify(dBData[0])+"dBData[0]@j")
      console.log(JSON.stringify(dBData[1])+"dBData[1]@j")
      // return {users : userData.data(),pubPostedWorksId: pubPostedWorksIdData.data()}

      let pubPostedWorksId = []

      dBData[1].docs.map(ss2 => {
        console.log(JSON.stringify(ss2.data())+"++ss2.data()")
        pubPostedWorksId = [
          ...pubPostedWorksId,
          // ss2.data()
          {
            ...ss2.data(),
            workWatchYear : ss2.data().workWatchYear.toDate().toLocaleString("ja")
          }
        ]
      })

      return {
        users : dBData[0],
        pubPostedWorksId : pubPostedWorksId
      }
    }  

    const dBData = await fetcher()

    return await setDBData(dBData)

  }

  const propsValue = await makeProps()

  return {
    props: propsValue ,
    revalidate: 60,
  }
}

export default userPage