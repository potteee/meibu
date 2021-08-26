//oneWork.js

import React, {useState, useEffect, useCallback} from 'react';
import { PrimaryButton, TextInput } from "../../styles/UIkit"
import { useRouter } from 'next/router'
import Link from 'next/link'

import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'

import {db} from '../../firebase/index'
import {useDispatch,useSelector} from 'react-redux'
import {getIsSignedIn, getUserId} from "../../reducks/users/selectors";

// import { getWorkData } from '../../reducks/works/operations'
import { DiscFull } from '@material-ui/icons'

import { tokenize } from '../api/allStringSearch/text-processor'

//API
import useSWR,{ mutate } from 'swr'

import GLoading from '../../components/GLoading';

const fetcher = async (url,searchTokenMap) => {
  console.log(searchTokenMap+"+searchTokemMap at fet")
  const res = await fetch(url, {
    // 送信先URL
    method: 'post', 
    // 通信メソッド    
    header: {'Content-Type': 'application/json'}, 
    // JSON形式のデータのヘッダー    
    // body: searchTokenMap 
    body: JSON.stringify(searchTokenMap) 
    // JSON形式のデータ  })
  })
  console.log("fetcher finish")

  const data = await res.json()
  console.log("res.json() finish")

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

const searchResult = () => {
  console.log("start searchResult() ")
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)

  const uid = getUserId(selector);
  const isSignIn = getIsSignedIn(selector);

  const router = useRouter()

  let hist = ""
  let searchWord = ""
  let routerPath = router.asPath; //URL取得。pathnameだと[id](str)で取得してしまう

  routerPath = /^\/menu\/searchResult\?/.test(routerPath) ? routerPath.split('\/menu\/searchResult\?')[1] : "no data query"

  console.log(routerPath+"+routerPath 1")

  hist = /\&/.test(routerPath.split('hist=')[1]) 
          ? (routerPath.split('hist=')[1]).split('&')[0] 
          : routerPath.split('hist=')[1]

  searchWord = 
      (/\&/.test(routerPath.split('searchWord=')[1]))
        ? ((routerPath.split('searchWord=')[1]).split('&')[0])
        : ((routerPath.split('searchWord=')[1]))

  searchWord =　decodeURIComponent(String(searchWord).replace(/\+/g,' '))
  
  console.log(searchWord+"+searchWord 2")
  console.log(hist+"+hist")

  const [workName, setWorkName] = useState("")
  const [checkBoxState, setCheckBoxState] = useState([])
  const [media, setMedia] = useState([])
  const [assessmentWorksId ,setAssessmentWorksId] = useState([])

  console.log(searchWord+"=searchWord")

  const searchTokenMap = {}
  tokenize(searchWord).forEach(token => {
    searchTokenMap[token] = true
  })

  console.log(searchTokenMap+"+searchTokenMap")
  console.log(JSON.stringify(searchTokenMap)+"+searchTokenMap@J")

  const {data, error} = useSWR(
    () => searchWord ? `/api/firebase/search/${searchWord}` : null ,url => fetcher(url,searchTokenMap)
    ,{
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  console.log(error+"+api error")
  console.log(JSON.stringify(data)+"++data@J")

  useEffect(() => {
    (async() => {
      console.log("useEffect Out")
      if(searchWord != undefined) {
        console.log("useEffect Done")
        try{
          console.log(uid+"uid searchR")
          //ログインユーザが評価した作品を取得し、検索結果と比較。
          if(uid != "uid initial"){
            console.log(uid+"+uid")
            const snapshot = await db.collection('privateUsers').doc(uid)
            .collection('postedWorksId')
            .get()

            console.log("getUserAsessmentWorks snapshot")
            console.log(snapshot)
            
            snapshot.docs.map((map,index) => {
              setAssessmentWorksId(prevAssessmentWorksId => {
                return ([...prevAssessmentWorksId , map.data().workId])
              })
              console.log(map.data().workId+"+snapshot.docs[].data().workId")
              // console.log(tmpWorkId+"+tmpWorkId+"+index)
            })
          } else {
            // return []
            console.log(uid+"+uid")
          }
        } catch (error) {
            alert('Get privateUsers DB fail')
            throw new Error(error)
        }
      }
    })()
  },[data]) 
  //uid->最初のレンダリングではselectorが読み込まれないので。
  //data->最初のレンダリング後にdataが書き換わった後に再度レンダリングされるがその際にassessmentWroksIdが
  //書き換わらないとloading...のままになってしまう。

  const createNewWork = () => {
    router.push({
      pathname: isSignIn ? '/post/posting' : '/menu/PleaseSignUpIn',
      query: {
        searchWord: searchWord,
        infoMedia : "",
        workId : "",
        firstPostFlag : 1,
        hist: "Posting",//Postingにすることで、ログイン後にPostingにいくようにする。
      }
    })
  }

  //前半の条件：データ取得後且つ、ユーザが評価した作品を取得後（何も評価したことがないユーザでもデフォルト値99が入っている
  //後半の条件：ログインしていなユーザが検索した場合assessmentWorksIdの条件は要らなくなるので、uid未定義をフラグとした。
  if((data && assessmentWorksId[0] != undefined) || (data && uid === "uid initial")) {
    if(data.length != 0){
      return (
        <>
　　　　   <ApplicationBar title="検索結果"/>
          <div>お探しの作品はありますか？</div>
          <ul>
            {hist == "Posting" && ( 
            <> 
              {data.map(map => (
                <>
                  <li>
                    <Link href={{
                      pathname: "/post/posting",
                      query: { 
                        searchWord : map.workName,
                        workId : map.workId,
                        infoMedia : map.winfoMedia,
                        firstPostFlag : assessmentWorksId.includes(map.workId) ? 2 : 0,
                      },
                    }}>
                      {assessmentWorksId.includes(map.workId) 
                        ? (map.workName+" : "+map.winfoMedia+"(評価済み)"+"("+map.winfoCount+")")
                        : (map.workName+" : "+map.winfoMedia+"("+map.winfoCount+")")
                      }
                    </Link>
                  </li>
                </>
              ))}
            </>
            )}
            {hist == "Search" && (
            <>
              {data.map(map => (
                <>
                  <li>
                    <Link href="/post/[postWorkId]"
                          as={`/post/${map.workId}`}
                    >
                      {assessmentWorksId.includes(map.workId) 
                        ? (map.workName+" : "+map.winfoMedia+"(評価済み)"+"("+map.winfoCount+")")
                        : (map.workName+" : "+map.winfoMedia+"("+map.winfoCount+")")
                      }
                    </Link>
                  </li>
                </>
              ))}
            </>
            )}
          </ul>
          <PrimaryButton label={"候補にないので新しい作品として登録する"} onClick={createNewWork} />
          <Footer />
        </>
      )
    } else {
      return (
        <>
          <ApplicationBar title="検索結果"/>
          <div className="c-section-container">
            <div>お探しの作品が見つかりません.</div>
            <PrimaryButton label={"新しい作品として登録する"} onClick={createNewWork} />

          </div>
          <Footer />
        </>
      )
    }
    // return <>  <GLoading/> </>
  } else {
    return <>
    {/* loading... */}
    <GLoading/>
    </>
  }
}

export default searchResult