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
import { DiscFull } from '@material-ui/icons';

const searchResult = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const selector = useSelector((state) => state)
    const { w } = router.query

    const [workName, setWorkName] = useState("")
    const [checkBoxState, setCheckBoxState] = useState([])
    const [media, setMedia] = useState([])

    console.log(w+"=w")

    useEffect(() => {
      (async() => {
        console.log("useEffect Out")
        if(w != undefined) {
          console.log("useEffect Done")

          // 完全一致の作品しか持ってこれない。
          // 曖昧一致のライブラリあると思うので、
          // 採用する。
          await db.collection('works').doc(w).get()
            .then(doc => {
              data = doc.data()
              // setWorkData(data)
              setWorkName(data.workName)
              // 配信媒体も表示(カテゴリはいらないので、配信媒体できたら消す)
              setCheckBoxState(data.workCategoryCheckBox)
              // setMedia(data.media)
            
              console.log(JSON.stringify(data)+"+works data")
            })
            .catch((error) => {
              console.log(error)
              console.log(workName)
            })
            // .catch((error) => {
            //   alert('works DB get fail')
            //   throw new Error(error)
            // })
        }
      })()
    },[w])

    const createNewWork = async() => {
      router.push({
        pathname: '/post/index',
        query: {w: w}
      })
      
    }

    return (
      <>
        <Header />
        <h2>検索結果ページ</h2>

        {/* render時にworkDataGetが読み込まれるうようにしたい */}
        {workName != "" && (
            <div>
              <h2>作品名: {workName}</h2>
              <h2>カテゴリ：{checkBoxState}</h2>
            </div>
        )}
        {workName == "" && (
        <div className="c-section-container">

            <div>お探しの作品が見つかりません.</div>

            <PrimaryButton label={"新しい作品として登録する"} onClick={createNewWork} />

        </div>
        )}
        <Footer />
      </>
    )
}

export default searchResult