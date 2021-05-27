//oneWork.js

import React, {useState, useEffect, useCallback} from 'react';
import { PrimaryButton, TextInput } from "../../styles/UIkit"
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../../components/header'
import Footer from '../../components/footer'
import {db} from '../../firebase/index'
import {useDispatch,useSelector} from 'react-redux'

import { getWorkData } from '../../reducks/works/operations'
import { DiscFull } from '@material-ui/icons'

import { tokenize } from '../api/firebase/allStringSearch/text-processor'

//API
import useSWR,{ mutate } from 'swr'

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
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

const searchResult = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  // const { searchWord } = router.query.searchWord

  let searchWord = router.asPath; //URL取得。pathnameだと[id](str)で取得してしまう
  // console.log(query+"+query at postUserId")
  searchWord = /^\/menu\/searchResult\?/.test(searchWord) ? searchWord.split('\/menu\/searchResult\?')[1] : "no data query"
  // const workId = /^\/post\//.test(query) ? query.split('\/post\/')[1] : ""

  console.log(searchWord+"+searchWord 1")

  searchWord = decodeURIComponent(/\&/.test(searchWord.split('searchWord=')[1]) ? (searchWord.split('searchWord=')[1]).split('&')[0] : searchWord.split('searchWord=')[1])

  console.log(searchWord+"+searchWord 2")



  // const searchWord = router.query.searchWord
  // const [jres ,setJres] = useState([])
  let jres = []

  const [workName, setWorkName] = useState("")
  const [checkBoxState, setCheckBoxState] = useState([])
  const [media, setMedia] = useState([])
  const [assessmentWorksId ,setAssessmentWorksId] = useState("")
  // const [assessmentWorksId ,setAssessmentWorksId] = useState([])
  // let assessmentWorksId = []

  console.log(searchWord+"=searchWord")
  // console.log(jres+"==jres")

  const searchTokenMap = {}
  tokenize(searchWord).forEach(token => {
    searchTokenMap[token] = true
  })

  console.log(searchTokenMap+"+searchTokenMap")
  console.log(JSON.stringify(searchTokenMap)+"+searchTokenMap@J")

  const {data, error} = useSWR(
    // () => searchWord && `../api/firebase/search/${searchWord}` ,url => fetcher(url,searchTokenMap)
    () => searchWord ? `../api/firebase/search/${searchWord}` : null ,url => fetcher(url,searchTokenMap)
    ,{
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  console.log(error+"+api error")
  console.log(JSON.stringify(data)+"++data@J")

  // console.log(JSON.stringify(jres)+"+jres@J")
  // console.log(jres+"+jres")
  // console.log(typeof(jres)+"+jres.typeof")
  // console.log(jres.length+"+jres.length")

  useEffect(() => {
    (async() => {
      console.log("useEffect Out")
      if(searchWord != undefined) {
        console.log("useEffect Done")


        // if(data){
        //   if(data.length != 0){
        //     setJres(data) 
        //     console.log(JSON.stringify(data[0].workName)+"+data@J")
        //     console.log((data[0].workName)+"+data")
        //     console.log(JSON.stringify(jres)+"+jres@J")
        //     console.log(jres[0]+"+jres")
        //   }
        // }

        // getUserAssessmentWorks()
        // .then(token => {
        //   // assessmentWorksId = token
        //   setAssessmentWorksId(token)
        //   console.log(assessmentWorksId+"+assessmentWorksId")
        //   console.log(JSON.stringify(assessmentWorksId)+"+assessmentWorksId@J")
        // })
        getUserAssessmentWorks()
          .then(token => {//asyncの関数はthenで受け取る
            //setが実行されると関数全体が副作用で呼ばれるっぽいからuseEffectないに堆肥させている。
            //useEffectの外にsetを書くと無限ループするっぽい。
            //set->関数全体読み込み->set実行->関数全体読み込み、の繰り返し。
            setAssessmentWorksId(token)
            console.log(assessmentWorksId+"+assessmentWorksId")
            console.log(JSON.stringify(assessmentWorksId)+"+assessmentWorksId@J")
          }).catch((error) => {
              alert('ユーザ情報取得失敗')
              throw new Error(error)
              return false
          })
          console.log(Array.isArray(assessmentWorksId)+"Array.isArray(assessmentWorksId)")
      }
    })()
  },[selector,data]) 
  //selector->最初のレンダリングではselectorが読み込まれないので。
  //data->最初のレンダリング後にdataが書き換わった後に再度レンダリングされるがその際にassessmentWroksIdが
  //書き換わらないとloading...のままになってしまう。

  // },[assessmentWorksId])
  // },[data,fetcher,selector])

  if(data){
    if(data.length != 0){
      jres = data
      console.log(JSON.stringify(data[0].workName)+"+data@J")
      console.log((data[0].workName)+"+data")
      console.log(JSON.stringify(jres)+"+jres@J")
      console.log(jres[0]+"+jres")
    }
  }

  const getUserAssessmentWorks = async() => {
    try{
      console.log(selector.users.uid+"selector.users.uid searchR")
      if(selector.users.uid != "uid initial"){
        console.log(selector.users.uid+"+selector.users.uid")
        const snapshot = await db.collection('privateUsers').doc(selector.users.uid)
        .collection('postedWorksId')
        .get()
        
        let tmpWorkId = []
        snapshot.docs.map((map,index) => {
          console.log(map.data().workId+"+snapshot.docs[].data().workId")
          tmpWorkId.push(map.data().workId)
          console.log(tmpWorkId+"+tmpWorkId+"+index)
        })
        return tmpWorkId
          // setAssessmentWorksId(tmpWorkId)
      } else {
        return []
      }
    } catch (error) {
    throw error.response.status
    }
  }


  const dummy = () => {
    console.log("dummy done")
  }

  dummy()


  // getUserAssessmentWorks()
  // .then(token => {
  //   // assessmentWorksId = token
  //   setAssessmentWorksId(token)
  //   console.log(assessmentWorksId+"+assessmentWorksId")
  //   console.log(JSON.stringify(assessmentWorksId)+"+assessmentWorksId@J")
  // }).catch((error) => {
  //     // dispatch(hideLoadingAction())
  //     alert('ユーザ情報取得失敗')
  //     throw new Error(error)
  //     return false
  // })

  // assessmentWorksId = getUserAssessmentWorks()

  const createNewWork = () => {
    router.push({
      pathname: '/post/posting',
      // pathname: '/post/index',
      query: {
        searchWord: searchWord,
        infoMedia : "",
        workId : "NoData cos firstPost",
        firstPostFlag : 1,
      }
    })
  }

  console.log(JSON.stringify(jres)+"+jres@J")
  console.log(jres[0]+"+jres")

  // if(data && Array.isArray(assessmentWorksId)) {
  if(data && assessmentWorksId[0] != undefined) {
  // if(data && selector.users.uid != "uid initial") {
    if(jres.length != 0){
      return (
        <>
          <Header />
          <h2>検索結果ページ</h2>
          {/* render時にworkDataGetが読み込まれるうようにしたい */}
          <a>お探しの作品はありますか？</a>
          {/* <a>{assessmentWorksId.map(map => (
            <>{map}</>
          ))}</a> */}
          <ul>
            {jres.map(map => (
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
                      ? (map.workName+" : "+map.winfoMedia+"(評価済み)")
                      : (map.workName+" : "+map.winfoMedia)
                    }
                  </Link>
                </li>
              </>
            ))}
          </ul>
          <PrimaryButton label={"候補にないので新しい作品として登録する"} onClick={createNewWork} />
          <Footer />
        </>
      )
    } else {
      return (
        <>
          <Header />
          <div className="c-section-container">
            <div>お探しの作品が見つかりません.</div>
            <PrimaryButton label={"新しい作品として登録する"} onClick={createNewWork} />

          </div>
          <Footer />
        </>
      )
    }
  } else {
    return <>loading...</>
  }
}

export default searchResult