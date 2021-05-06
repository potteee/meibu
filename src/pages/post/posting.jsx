import React, {useState, useEffect, useCallback} from 'react'
import { PrimaryButton, TextInput ,CheckIconBox} from "../../styles/UIkit"
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block', 
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
}))

// 作品投稿ページ
const Posting = () => {
  const router = useRouter()
  // const { id } = router.query
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)

  // const query = router.asPath // pathNameだとURL部のみ（/post/posting)だけ取得
  const query = router.query.searchWord // pathNameだとURL部のみ（/post/posting)だけ取得
  // const querysWorkName = /^\?searchWord=/.test(query) ? query.split('?searchWord=')[1] : ""

  // const uid = selector.users.uid
  //上記よりこっちの方が処理漏れ少ない？
  const uid = getUserId(selector);
  const userName = getUserName(selector);
  const classes = useStyles();

  console.log(query+"++query")
  // console.log(querysWorkName+"+querysWorkName")
  const [workName, setWorkName] = useState(query)

  const [workMedia, setWorkMedia] = useState("");
  const [open, setOpen] = useState(false);

  const [workScore, setWorkScore] = useState("")
  const [workComment, setWorkComment] = useState("")
  const [checkBoxState, setCheckBoxState] = useState({
    SF: true,  
    Love: false,
    Fantasy: false
  })

  const [tagCheckBox, setTagCheckBox] = useState({
    SyujinMiryo : false,
    KanjohInyuu : false,
    IsekaiTense : false,
  })
  const [isPublic,setIsPublic] = useState(true)
  const [isSpoiler,setIsSpoiler] = useState(false)
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

  const tagCheckBoxHandleChange = useCallback((event) => {
    setTagCheckBox({...tagCheckBox,[event.target.name]: event.target.checked})
  },[tagCheckBox])
  
  console.log(JSON.stringify(checkBoxState)+"+checkcBoxState")
  console.log(JSON.stringify(tagCheckBox)+"+tagCheckBox")
  
  const inputWorkComment = useCallback((event) => {
    setWorkComment(event.target.value)
  }, [])

  const isPublicHandleChange = useCallback((event) => {
    setIsPublic(event.target.checked)
    // },[checkBoxState])
  },[isPublic])

  const isSpoilerHandleChange = useCallback((event) => {
    setIsSpoiler(event.target.checked)
    // },[checkBoxState])
  },[isSpoiler])
  
  // const inputWorkInfo = useCallback((event) => {
    //   setWorkInfo(event.target.value)
    // }, [])

  const handleChange = (event) => {
    setWorkMedia(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
    
  useEffect(() => {
    if(query){
      setWorkName(query)
    }
    console.log(workName+"+workName")
    console.log(tagCheckBox+"+tagCheckBox")
  },[query])
    
  const postButtonClicked = async() => {
    
    //バリデーション
    if(workMedia == "" || workName == ""){
      alert("作品名、分類を入力してください！")
      return false
    }

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

    let goTagCheckBoxState = []
    if(tagCheckBox.SyujinMiryo){
      goTagCheckBoxState.push("主人公が魅力的")
    }
    if(tagCheckBox.KanjohInyuu){
      goTagCheckBoxState.push("感情移入できる")
    }
    if(tagCheckBox.IsekaiTense){
      goTagCheckBoxState.push("異世界転生もの")
    }

    // ユーザに紐づく作品データをDBに登録(redux/works(db))
    // const workId = await dispatch(postWorkCreate(workName,workScore,goCheckBoxState,workComment,uid))

    // 作品の固有データをDBに登録
    // 新規登録なのでScoreは入力値のまま　*-*- (wInfo)
    const workId = await dispatch(postWInfoCreate(
      workName,
      workMedia,
      workScore,
      uid,
      userName,
      goCheckBoxState,
      goTagCheckBoxState,
      workComment,
      isPublic,
      isSpoiler
    ))

    console.log(workId+"+workId posting m")
    // 登録したユーザのDB情報に登録した作品のWorkIdを追加(postedWorksId(db))
    await dispatch(addPostedWork(uid,workId,workName,isPublic,isSpoiler))
    
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
        fullWidth={true} label={"作品名(必須)"} multiline={false} required={true}
        rows={1}  value={workName} type={"text"} onChange={inputWorkName}
        />

        <FormControl className={classes.formControl}>
          <InputLabel id="demo-controlled-open-select-label">分類(必須)</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={workMedia}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"映画"}>映画</MenuItem>
            <MenuItem value={"ドラマ"}>ドラマ</MenuItem>
            <MenuItem value={"アニメ"}>アニメ</MenuItem>
            <MenuItem value={"動画(その他)"}>動画(その他)</MenuItem>
            <MenuItem value={"小説"}>小説</MenuItem>
            <MenuItem value={"マンガ"}>マンガ</MenuItem>
            <MenuItem value={"本(その他)"}>本(その他)</MenuItem>
            <MenuItem value={"ゲーム"}>ゲーム</MenuItem>
            <MenuItem value={"音楽"}>音楽</MenuItem>
            <MenuItem value={"絵"}>絵</MenuItem>
            <MenuItem value={"自転車"}>自転車</MenuItem>
            {/* <MenuItem value={}></MenuItem> */}
          </Select>
        </FormControl>

        <TextInput
        fullWidth={true} label={"(任意)点数(0-100)"} multiline={false} required={true}
        rows={1} value={workScore} type={"number"} onChange={inputWorkScore}
        />

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

        <div>タグ/属性</div> 
        {/* <FormGroup root> */}
        <FormGroup row2>
        <FormControlLabel
            control={
              <CheckIconBox
              checked={tagCheckBox.SyujinMiryo} onChange={tagCheckBoxHandleChange} 
              name={"SyujinMiryo"} color={"secondary"}
              />
            } label = {"主人公が魅力的"}
        />
        <FormControlLabel
            control={
              <CheckIconBox
              checked={tagCheckBox.KanjohInyuu} onChange={tagCheckBoxHandleChange} 
              name={"KanjohInyuu"} color={"primary"}
              />
            } label={"感情移入できる"}
        />
        <FormControlLabel
            control={
              <CheckIconBox
              checked={tagCheckBox.IsekaiTense} onChange={tagCheckBoxHandleChange} 
              name={"IsekaiTense"} color={"primary"}
              />
            } label={"異世界転生もの"}
        />

        </FormGroup>
        <TextInput
            fullWidth={true} label={"コメント(5000字以内)"} multiline={true} required={true}
            rows={1} value={workComment} type={"text"} onChange={inputWorkComment}
        />

        <FormGroup row>
        <FormControlLabel
        control={
          <CheckIconBox
          checked={isSpoiler} onChange={isSpoilerHandleChange} 
          name={"ネタバレコメント"} color={"primary"}
          />
        } label = {"ネタバレコメント"}
        />
        </FormGroup>

        <FormGroup row>
        <FormControlLabel
        control={
          <CheckIconBox
          checked={isPublic} onChange={isPublicHandleChange} 
          name={"一般公開"} color={"primary"}
          />
        } label = {"投稿内容を一般公開する"}
        />
        </FormGroup>
      </div>

      <PrimaryButton label={"投稿"} onClick={postButtonClicked} />

      <h2>作品情報を入力(オプション)</h2>
      <p>※新規登録なので、作品情報もオプションで入力してもらうようにする</p>

      <Footer />
    </>
  )
}

export default Posting