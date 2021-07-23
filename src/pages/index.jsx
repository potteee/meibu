import React, {useState, useEffect, useCallback} from 'react';
import Link from 'next/link'
import {db} from '../firebase/index'
import {useDispatch,useSelector} from 'react-redux'
import Header from '../components/header'
import ApplicationBar from '../components/applicationBar'
import Footer from '../components/footer'
import SpeedDialPosting from '../components/speedDialPosting'

const News = () => {
  const [worksData, setWorksData] = useState(false);

  const getWInfo = () => {
    db.collection('wInfo').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log("doc.data()")
        console.log(doc.data())
        setWorksData(prevWorksData => {
          if(prevWorksData == false) {
            return [doc.data()]
          } else {
            return [...prevWorksData , doc.data()]
          }
        })
      });
      return true
    })
    .catch((error) => {
      alert('works DB get fail')
      throw new Error(error)
    })
  }

  useEffect(() => {
    getWInfo()
  },[]);

  console.log(JSON.stringify(worksData,null ,2)+"+worksData@J");

  if(worksData){
    return (
    <>
      <ApplicationBar title="NEWS"/>
      {/* <p>worksのデータを一覧表示。→バズビデオみたいにカテゴリごとに表示</p> */}
      <p>作品名：評価点：カテゴリ</p>
      <ul>
      {worksData.map(oneworksData => (
        <li>
          <Link href="/post/[id]" 
          as={`/post/${oneworksData.workId}`}>
            {oneworksData.workName+"("+oneworksData.winfoCount+")"}
          </Link>
          <a>：{oneworksData.winfoScore != -1 ? oneworksData.winfoScore : "採点なし"}</a>
          <a>：{oneworksData.winfoCategory.map(cate => ( 
          <>{cate+" "}</>
          ))}
          </a>
        </li>
      ))}
      </ul>
      {worksData.length == 0 
        ?  <p>投稿されている作品データは有りません</p>
        : null
      }
      検索機能へのリンクを目立つように
      <SpeedDialPosting />
      <Footer />
    </>
    )
  } else {
    return <>loading...</>
  }
}

export default News

