import React, {useState, useEffect, useCallback} from 'react';
import Link from 'next/link'
import {db} from '../firebase/index'
import {useDispatch,useSelector} from 'react-redux'
import Header from '../components/header'
import ApplicationBar from '../components/applicationBar'
import Footer from '../components/footer'

const News = () => {
  const dispatch = useDispatch()

  const [worksData, setWorksData] = useState([]);

  useEffect(() => {
    (async() => {
      // 全ドキュメントを取得
      await db.collection('wInfo').get()
      .then(snapshot => {
        if(worksData.length != 0){
          setWorksData([])
          console.log("reset worksData")
        }
        snapshot.forEach((doc) => {
          console.log("doc.data()")
          console.log(doc.data())
          setWorksData(prevWorksData => {
            return [...prevWorksData , doc.data()]
          })
        });
      })
      .catch((error) => {
        alert('works DB get fail')
        throw new Error(error)
      })
    })();
  },[]);

  console.log(JSON.stringify(worksData)+"+worksData@J");
  console.log(worksData+"+worksData");

  if(worksData.length == 0) {
    return <>loading posted works...</>
  } else {
    return (
    <>
      {/* <Header /> */}
      <ApplicationBar title="NEWS"/>
      {/* <h1>news</h1> */}
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
      検索機能へのリンクを目立つように
      <Footer />
    </>
    )
  }
}

export default News

