//oneWork.js

import React, {useState, useEffect, useCallback} from 'react';
import { PrimaryButton, TextInput } from "../../../../styles/UIkit"
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../../../../components/header'
import Footer from '../../../../components/footer'
import {db} from '../../../../firebase/index'
import {useDispatch,useSelector} from 'react-redux'


import { getWorkData } from '../../../../reducks/works/operations'
import { DiscFull } from '@material-ui/icons';

const oneWork = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const selector = useSelector((state) => state)
    const { id, onework ,workId} = router.query

    // const [workData, setWorkData] = useState({})
    const [workName, setWorkName] = useState("")
    const [workScore, setWorkScore] = useState("")
    const [workComment, setWorkComment] = useState("")
    const [checkBoxState, setCheckBoxState] = useState([])
    const [workInfo, setWorkInfo] = useState("")
    let data = undefined

    console.log(workId+"=workId")

    const noWorkId = useCallback(() => {
      dispatch(router.push({
        pathname: '/',
        // pathname: '/post/'+id+'/works/'+workName+'-'+workIdLeft3,
        query: {history: "onework"}
      }))
    },[])

  //   const goBackToMyPage = useCallback(() => {
  //     dispatch(push('/user/mypage'))
  // }, [dispatch])

    // const dbaccess = async() => {
    //   console.log("useEffect Out")
    //   if(workId != undefined) {
    //     console.log("useEffect Done")
    //     await db.collection('works').doc(workId).get()
    //       .then(doc => {
    //         data = doc.data()
    //         setWorkData(data)
    //       })
    //       .catch((error) => {
    //         alert('works DB get fail')
    //         throw new Error(error)
    //       })
    //   }
    // }

    // dbaccess()
    //  →無限ループする


    useEffect(() => {
      (async() => {
        console.log("useEffect Out")
        if(workId != undefined) {
          console.log("useEffect Done")
          await db.collection('works').doc(workId).get()
          // db.collection('works').doc(workId).get()
            .then(doc => {
              data = doc.data()
              // setWorkData(data)
              setWorkName(data.workName)

              // let sum = 0;
              // for(let i=0; i<data.workScore.length; i++){
              //   sum += data.workScore[i]
              // }

              setWorkScore(data.workScore)
              // setWorkScore(sum/data.workScore.length)
              setWorkComment(data.workComment)
              setCheckBoxState(data.workCategoryCheckBox)
              
              console.log(JSON.stringify(data)+"+works data")
              console.log(JSON.stringify(checkBoxState)+"+works checkBoxState")
              // console.log(JSON.stringify(workData)+"+workData")
            })
            .catch((error) => {
              alert('works DB get fail')
              throw new Error(error)
            })
        }
      })()
    },[workId])
    
    // const workDataGet = async() => {
      //   return await dispatch(getWorkData(workId))
      // } 
      
      //stateはindexのpushで渡ってきた引数
      // const workId = location.state.workId

    // const data = async() => {
    //   return await dispatch(getWorkData(workId))
    // }

    // setWorkData(data)
      
    // if(data){
    //   console.log(data+"+works data")
    //   console.log(JSON.stringify(workData)+"+workData")
    // } else {
    //   console.log("data is not defined")
    //   console.log(JSON.stringify(workData)+"+workData")
    // }

    return (
      <>
        <Header />
        <h2>作品ページ</h2>
        {/* <h1>Post: {id}</h1> */}
        {/* //DBから取得 */}
        {/* {const workData = wrokDataGet} */}
        {/* {dbaccess} */}

        {/* render時にworkDataGetが読み込まれるうようにしたい */}
        {workId != undefined && (
            <div>
              <h2>作品名: {workName}</h2>
              {/* {console.log(workData)} */}
              {workScore != [""] && (
              　　　<h2>score: {workScore}</h2>
              )}
              {workScore == [""] && (
                <h2>score: 未評価 </h2>
              )}

              <h2>category:{checkBoxState.map(cate => (
                <span>{cate}/</span>
              ))}</h2>
              <h2>info:準備中</h2>
              {/* <p>-----</p>
              <h2>comment:</h2>
              <h2>ーこの作品が読めるアプリー</h2> */}
            </div>
          )}
        
        {/* ここの表現間違っているっぽいので、あってるところ見つけたら修正する。 */}
        {workId == undefined && (noWorkId)}

        <Footer />
      </>
    )
}

export default oneWork