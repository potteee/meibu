import React, {useState, useEffect, useCallback} from 'react';
import Link from 'next/link'
import {db} from '../firebase/index'
import {useDispatch,useSelector} from 'react-redux'

import Header from '../components/header'
import Footer from '../components/footer'

// import {fetchProducts} from '../reducks/users/operations'

const News = () => {
  const dispatch = useDispatch()

  const [workName, setWorkName] = useState("")
  const [workScore, setWorkScore] = useState({})
  const [workComment, setWorkComment] = useState({})
  const [checkBoxState, setCheckBoxState] = useState({})
  const [workInfo, setWorkInfo] = useState({})
  const [workData, setWorkData] = useState([]);
  let worksData = [];

  useEffect(() => {
    (async() => {
      // 全ドキュメントを取得
      await db.collection('wInfo').get()
      // db.collection('works').doc(workId).get()
      .then(snapshot => {
        snapshot.forEach((doc) => {
          worksData.push(
            Object.assign({
              id: doc.id
            }, doc.data())
          );
        });
        console.log(JSON.stringify(worksData)+"+worksData");
        // const workDataTmp = worksData.map((oneWorkData) => 
        // <li key={oneWorkData.id}>
        //     {oneWorkData.workName}
        //   </li>
        // )
        // console.log(JSON.stringify(workDataTmp)+"+workDataTmp")
    
        setWorkData(worksData);
        
        // setWorkName(worksData[0].workName)
        // setWorkScore(worksData[0].workScore)
        // setWorkComment(worksData[0].workComment)
        // console.log(JSON.stringify(workData)+"+workData")
      })
      .catch((error) => {
        alert('works DB get fail')
        throw new Error(error)
      })
    })();
  },[]);

  console.log((((10 * 1 ) + 20 ) / 2 )+"+CC")

  return (
  <>
    <Header />
    <h1>news</h1>
    <p>worksのデータを一覧表示。</p>
    <ul>
      {workData.map(oneWorkData => (
        <a>
            <li>
                {/* {oneWorkData.id} */}
              <Link href="/post/[id]" 
              as={`/post/${oneWorkData.workId}`}>
                <h2>作品名：{oneWorkData.workName}</h2>
              </Link>
              <p>　スコア　　：{oneWorkData.winfoScore}</p>
              <p>　ジャンル　：{oneWorkData.winfoCategory.map(cate => ( 
              <span>{cate} </span>
              ))}
              </p>
            </li>
        </a>
      ))}
    </ul>

    {/* {workData} */}
    {/* <div>
      <h2>score: {workScore[0]}</h2>
      <h2>category:</h2>
      <h2>info:</h2>
      <p>-----</p>
      <h2>comment:{workComment[0]}</h2>
      <h2>ーこの作品が読めるアプリー</h2>
    </div> */}
    検索機能へのリンクを目立つように
    <Footer />
  </>
  )
}

export default News

///



