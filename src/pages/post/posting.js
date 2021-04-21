import React, {useState, useEffect, useCallback} from 'react'
import { PrimaryButton, TextInput ,CheckIconBox} from "../../styles/UIkit"
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../../components/header'
import Footer from '../../components/footer'
import { parseCookies } from 'nookies'
import { set } from 'immutable'
import {useDispatch,useSelector} from 'react-redux'

import {getUserId, getWorkId, getUserName} from "../../reducks/users/selectors";
import { postWorkCreate } from '../../reducks/works/operations'
import { addPostedWork } from '../../reducks/users/operations'

import postWInfoCreate from '../../foundations/wInfo'

// 作品投稿ページ
const Posting = () => {
    const router = useRouter()
    // const { id } = router.query
    const dispatch = useDispatch()
    const selector = useSelector((state) => state)


    // var querysWorkName = ""
    // if (process.browser) {
    //     // windowやdocumentを使う処理を記述
    //     const query = window.location.search
    //     querysWorkName = /^\?searchWord=/.test(query) ? query.split('?searchWord=')[1] : ""
    // } else {
    //     const { searchWord } = router.query
    //     querysWorkName = searchWord
    //     // const { querysWorkName } = router.query.searchWord
    // }
　　
    const query = router.pathname
    const querysWorkName = /^\?searchWord=/.test(query) ? query.split('?searchWord=')[1] : ""

    // const uid = selector.users.uid
    //上記よりこっちの方が処理漏れ少ない？
    const uid = getUserId(selector);
    const userName = getUserName(selector);
  
    console.log(querysWorkName+"+querysWorkName")
    const [workName, setWorkName] = useState(querysWorkName)
    
    const [workScore, setWorkScore] = useState("")
    const [workComment, setWorkComment] = useState("")
    const [checkBoxState, setCheckBoxState] = useState({
      SF: true,  
      Love: false,
      Fantasy: false
    })
    // const [workInfo, setWorkInfo] = useState("")
    
    // console.log(id+"+id@post/index")
    
    const inputWorkName = useCallback((event) => {
      setWorkName(event.target.value)
    }, [])
    
    const inputWorkScore = useCallback((event) => {
      setWorkScore(event.target.value)
    }, [])
    
    
    const checkBoxHandleChange = useCallback((event) => {
      setCheckBoxState({ ...checkBoxState,[event.target.name]: event.target.checked })
      // },[checkBoxState])
    },[checkBoxState])
    
    console.log(JSON.stringify(checkBoxState)+"+checkcBoxState")
    
    const inputWorkComment = useCallback((event) => {
      setWorkComment(event.target.value)
    }, [])
    
    // const inputWorkInfo = useCallback((event) => {
      //   setWorkInfo(event.target.value)
      // }, [])
      
    useEffect(() => {
      if(querysWorkName){
        setWorkName(querysWorkName)
      }
      console.log(workName+"+workName")
    },[querysWorkName])
      
      
    const postButtonClicked = async() => {
      
      //チェックされた項目だけを配列として抽出する
      let goCheckBoxState = []
      if(checkBoxState.Love == true){
        goCheckBoxState.push("Love")
      }
      if(checkBoxState.SF == true){
        goCheckBoxState.push("SF")
      }
      if(checkBoxState.Fantasy == true){
        goCheckBoxState.push("Fantasy")
      }
      if(goCheckBoxState == ""){
        goCheckBoxState.push("None")
      }
  
      // ユーザに紐づく作品データをDBに登録
      const workId = await dispatch(postWorkCreate(workName,workScore,goCheckBoxState,workComment,uid))
  
      // 作品の固有データをDBに登録
      // 新規登録なのでScoreは入力値のまま　*-*-
      await dispatch(postWInfoCreate(workId,workName,workScore,uid,userName,checkBoxState))
  
      // 登録したユーザのDB情報に登録した作品のWorkIdを追加
      await dispatch(addPostedWork(uid,workId,workName))
  
      router.push({
        pathname: '/post/'+workId,
        // pathname: '/post/'+id+'/works/'+workName,
        // query: {workId: workId}
      })
    }
  
    return (
        <>
        <Header />

        <div className="c-section-container">
            <h1>新規 作品記録フォーム</h1>
            <div className="module-spacer--medium" />

            {/* <p>作品名：テキストボックス※既存チェック</p> */}

            <TextInput
            fullWidth={true} label={"作品名"} multiline={false} required={true}
            rows={1} value={workName} type={"text"} onChange={inputWorkName}
            />
            <TextInput
            fullWidth={true} label={"(任意)点数(0-100)"} multiline={false} required={true}
            rows={1} value={workScore} type={"number"} onChange={inputWorkScore}
            />

            <p>一般公開、非公開：ラジオボタン(ユーザ側のDBにも反映させないと)</p>

            <PrimaryButton label={"投稿"} onClick={postButtonClicked} />
            {/* <PrimaryButton label={"投稿"} onClick="oncliiiiiiiiiicked" /> */}

        　　<div>他の項目も入力する（以下通常維持はhide)</div>
            {/* (任意)3つまで選べるチェックボックスにしないとジャンル(恋愛・SF・ファンタジー) */}
            <div> カテゴリ　</div> 
            {/* <FormGroup root> */}
            <FormGroup row>
            <FormControlLabel
                control={
                <CheckIconBox
                checked={checkBoxState.SF} onChange={checkBoxHandleChange} 
                name={"SF"} color={"secondary"}
                />
                } label = {"SF"}
            />
            <FormControlLabel
                control={
                <CheckIconBox
                checked={checkBoxState.Love} onChange={checkBoxHandleChange} 
                name={"Love"} color={"primary"}
                />
                } label={"Love"}
            />
            <FormControlLabel
                control={
                <CheckIconBox
                checked={checkBoxState.Fantasy} onChange={checkBoxHandleChange} 
                name={"Fantasy"} color={"primary"}
                />
                } label={"Fantasy"}
            />
            </FormGroup>

            <p>コメント：テキストボックス※ネタバレチェック</p>

            <TextInput
                fullWidth={true} label={"コメント(5000字以内)"} multiline={true} required={true}
                rows={5} value={workComment} type={"text"} onChange={inputWorkComment}
            />

        </div>

        <h2>作品情報を表示：展開ボタン</h2>
        {/* 存在しない場合はNo Data.このページは登録のない作品を評価する頁なのでデフォでNodata*/}
        <p>noData</p>
        {/* <TextInput
                fullWidth={true} label={"作品情報を入力する(10000字以内)"} multiline={true} required={true}
                rows={10} value={workInfo} type={"text"} onChange={inputWorkInfo}
        　/> */}

        <p>他者の投稿を表示：リンクが複数表示されるボタン</p>
        {/* 更新機能を作ってから↑ */}

        {/* <h2>過去の投稿 {id}</h2>
        <ul>
            <li>
            <Link href="/post/[id]/[comment]" as={`/post/${id}/first-comment`}>
                <a>First comment</a>
            </Link>
            </li>
            <li>
            <Link href="/post/[id]/[comment]" as={`/post/${id}/second-comment`}>
                <a>Second comment</a>
            </Link>
            </li>
            <li>
            <Link href="/post/[id]/work/[onework]" as={`/post/${id}/work/aaaa`}>
                <a>onework</a>
            </Link>
            </li>
        </ul> */}

        <h2>この作品が読めるアプリ</h2>
        <Footer />
        </>
    )
}

export default Posting