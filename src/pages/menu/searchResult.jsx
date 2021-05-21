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
  const searchWord = router.query.searchWord
  const [jres ,setJres] = useState([])


  const [workName, setWorkName] = useState("")
  const [checkBoxState, setCheckBoxState] = useState([])
  const [media, setMedia] = useState([])

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

        if(data){
          if(data.length != 0){
            setJres(data) 
            console.log(JSON.stringify(data[0].workName)+"+data@J")
            console.log((data[0].workName)+"+data")
            console.log(JSON.stringify(jres)+"+jres@J")
            console.log(jres[0]+"+jres")
          }
        }
      }
    })()
  },[data,fetcher])

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

  if(data) {
    if(jres.length != 0){
      return (
        <>
          <Header />
          <h2>検索結果ページ</h2>
          {/* render時にworkDataGetが読み込まれるうようにしたい */}
          <a>お探しの作品はありますか？</a>
          <ul>
            {jres.map(map => (
              <a>
                <li>
                  <Link href={{
                    pathname: "/post/posting",
                    query: { 
                      searchWord : map.workName,
                      workId : map.workId,
                      infoMedia : map.winfoMedia,
                      firstPostFlag : 0,
                      },
                  }}>
                    <a>{map.workName} : {map.winfoMedia}</a>
                  </Link>
                </li>
              </a>
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
    return <a>loading...</a>
  }
}

export default searchResult