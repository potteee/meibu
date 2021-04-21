import React, {useState, useEffect, useCallback} from 'react'
import { PrimaryButton, TextInput ,CheckIconBox} from "../../../styles/UIkit"
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import {db} from '../../../firebase/index'
import { parseCookies } from 'nookies'
import { set } from 'immutable'
import {useDispatch,useSelector} from 'react-redux'

import {getUserId, getWorkId} from "../../../reducks/users/selectors";
// import { postWorkCreate } from '../../../reducks/works/operations'
import { addPostedWork } from '../../../reducks/users/operations'

//作品情報閲覧ページ
const Post = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const selector = useSelector((state) => state)
    // const { id, onework ,workId} = router.query

    // const [workData, setWorkData] = useState({})
    const [workName, setWorkName] = useState("")
    const [workScore, setWorkScore] = useState("")
    const [workComment, setWorkComment] = useState("")
    const [checkBoxState, setCheckBoxState] = useState([])
    const [workInfo, setWorkInfo] = useState("")
    // let data = undefined

    const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう
    console.log(query+"+query")
    const workId = /^\/post\//.test(query) ? query.split('\/post\/')[1] : ""

    console.log(workId+"=workId")
    // console.log(id+"=id")
    // console.log(onework+"=onework")

    const noWorkId = useCallback(() => {
      dispatch(router.push({
        pathname: '/',
        // pathname: '/post/'+id+'/works/'+workName+'-'+workIdLeft3,
        query: {history: "post"}
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
          console.log(workId+"+workId effect")
          await db.collection('works').doc(workId).get()
          // db.collection('works').doc(workId).get()
            .then(doc => {
              let data = doc.data()
              if (data){
                console.log(JSON.stringify(data)+"+data JSONstr")
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
              }
            })
            .catch((error) => {
              alert('works DB get fail')
              throw new Error(error)
            })
        }
      })()
    },[workId])

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
              <h2>同じジャンルの人気作</h2>

              <h2>この作品を評価した人</h2>
              

            </div>
          )}
        
        {/* ここの表現間違っているっぽいので、あってるところ見つけたら修正する。 */}
        {workId == undefined && (noWorkId)}

        <Footer />
      </>
    )
}

export default Post
