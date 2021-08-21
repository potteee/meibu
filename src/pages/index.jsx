import React, {useState, useEffect, useCallback} from 'react';
import Link from 'next/link'
import {db} from '../firebase/index'
import {useDispatch,useSelector} from 'react-redux'
import Header from '../components/header'
import ApplicationBar from '../components/applicationBar'
import Footer from '../components/footer'
import SpeedDialPosting from '../components/speedDialPosting'
import { useRouter } from 'next/router';
import GLoading from '../components/GLoading';

const News = ({worksData}) => {

  // console.log(JSON.stringify(worksData,null ,2)+"+worksData@J");
  const {isReady} = useRouter()

  if(!worksData || !isReady){
    return (
      <GLoading/>
    )
  } else {
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
          <a>：{oneworksData.winfoScore != -1 
            ? Math.floor(oneworksData.winfoScore * 10) / 10  
            : "採点なし"
          }</a>
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
  }
}

export async function getStaticProps(context) {
  // const [worksData, setWorksData] = useState(false);

  let worksData = false;

  await db.collection('wInfo').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      if(worksData == false) {
        worksData = [doc.data()]
      } else {
        worksData = [...worksData , doc.data()]
      }
    })

    // return {props : {worksData} }// {worksData : [...worksData]}
  })
  .catch((error) => {
    alert('works DB get fail')
    throw new Error(error)
  })

  return {
    props : {worksData},
    revalidate: 30,
  }
}

export default News

