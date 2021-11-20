import React, {useEffect ,useState} from 'react';
import { collection, doc, query, where, getDocs ,getDoc ,setDoc, updateDoc ,Timestamp } from "firebase/firestore";

import Link from 'next/link'

import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'

import { useRouter } from 'next/router'
import { db } from '../../firebase/index'
import GLoading from '../../components/GLoading';
import { isBuffer } from 'util';

const userPage = ( props = null ) => {

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
  // const snapshot = await db.collection('users').get()
  const snapshot = await getDocs(collection(db, 'users'))
  
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

  const makeProps = async() => {
  
    const setDBData = (props) => {
      const payload = {
        userName : props.users.userName,
        userSex : props.users.userSex,
        userProfile : props.users.userProfile,
        userImage : props.users.userImage,
        worksData : props.pubPostedWorksId,
      }
      return payload
    }
  
    const fetcher = async() => { 
      // const url = `/api/firebase/user/${params.uid}`

      let url = null
      if(process.env.NEXT_PUBLIC_NODE_ENV === "development"){
        url = `api/firebase/user/${params.uid}`
      } else {
        url = `${process.env.url}/api/firebase/user/${params.uid}/${process.env.NEXT_PUBLIC_NODE_ENV === "preview"
          ? 'preview'
          : ''
        }`
      }
      // const url = `https://${process.env.url}/api/firebase/user/${params.uid}`
      // const url = `${process.env.NEXT_PUBLIC_URL}/api/firebase/user/${params.uid}`
      console.log(url+"+user url")
      const res = await fetch(url)
  
      const data = await res.json()
      if (res.status !== 200) {
        throw new Error(data.message)
      }
  
      return data
    }  

    const dBData = await fetcher()

    return setDBData(dBData)

  }

  const propsValue = await makeProps()

  return {
    props: propsValue ,
    revalidate: 60,
  }
}

export default userPage