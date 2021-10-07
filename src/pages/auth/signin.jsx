import React, {useState, useCallback,useMemo} from 'react';
import Header from '../../components/header'
import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'
import { CSHighLightBar } from "src/styles/SC/shared/typografy/highLightBar"
import ButtonPrimary from "src/components/ButtonPrimary";
import ButtonScondary from "src/components/ButtonSecondary";

import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"

import {useDispatch,useSelector} from "react-redux";
import {signIn} from "../../reducks/users/operations";
// import {push} from "connected-react-router"

import { useRouter } from 'next/router'

import MyPage from '../menu/mypage'
import { ClassNames } from '@emotion/react';
import { isClassExpression } from 'typescript';

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  // const uid = useSelector(state => state)
  const { hist,searchWord,infoMedia,workId,firstPostFlag} = router.query
  const oriQuery = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう

  const classes = {
    mainGrid : {
      position : "flex",//あってもなくても同じ
      // alignItems : "center", //columnだとこちらが横幅に適用される。
      // display: "block",
      // spacing : "0", 
      justifyContent : "center",
      // top : "-10px",
      width : "90%",
      margin : "10px 0 10px 20px",
      maxWidth : "700px",
      flexDirection:"column",
    },
    buttonStyle : {
      // justifyContent : "center",
      justifyContent : "flex-start",
      margin : "20px 0 10px 20px",
      // justify : "center",
    },
    titleBarStyle : {
      justifyContent : "flex-start",
      margin : "42px 0 10px -2px",
    }
  }

  // const tmpEmail = /\?email=/.test(query) ? query.split('email=')[1] : ""
  const query = /\?/.test(oriQuery) ? oriQuery.split('?')[1] : null
  console.log(query+"+query")

  let tmpEmail = ""
  let qStatus = ""

  if(query){
    tmpEmail = /email=/.test(query) ? query.split('email=')[1] : ""
    tmpEmail = /\&/.test(tmpEmail) ? tmpEmail.split('&')[0] : tmpEmail
    qStatus = /status=/.test(query) ? query.split('status=')[1] : null
    qStatus = /\&/.test(qStatus) ? qStatus.split('&')[0] : qStatus
  }

  console.log(tmpEmail+"+tmpEmail")
  console.log(qStatus+"+qStatus")

  console.log(decodeURIComponent(tmpEmail)+"+tmpEmail")

  const [signinPush,setSigninPush] = useState(false)

  const [email, setEmail] = useState(decodeURIComponent(tmpEmail))
  const [password, setPassword] = useState("")

  const inputEmail = useCallback((e) => {
      setEmail(e.target.value)
  },[]);

  const inputPassword = useCallback((e) => {
      setPassword(e.target.value)
  },[]);

  //useCallbackに入れてあげないと、dispatch(signInAction...のところで再レンダリングされる。
  const signInModule = useCallback(async(email,password, router) => {
    return await dispatch(signIn(email, password, router,hist,searchWord,infoMedia,workId,firstPostFlag))
  },[]);


  const signinButtonClicked = async() => {
    setSigninPush(true)
    console.log(email+"+email,"+password+"+password,"+router+"+router")

    const signinResult = await signInModule(email, password, router)

    console.log(signinResult+"+sigininResult")
    if(!signinResult){
      setSigninPush(false)
    }
  }

  const simpleSignupButtonClicked = () => {
    console.log("simpleSignupButtonClicked")
  }

  const signupButtonClicked = async() => {
    console.log("signupButtonClicked")
    await router.push({
      pathname: '/auth/signup',
      query: { 
        hist : hist,
        searchWord : searchWord,
        infoMedia : infoMedia,
        workId : workId,
        firstPostFlag : firstPostFlag,
      },
    })
  }

  if(signinPush){
    return <>loading...singin...</>
  } else {
    return (
      <>
        <ApplicationBar title="ログイン" />
        {/* <Header /> */}
        {/* {hist == "Posting" && (
          <p>投稿機能を使用するにはログインしてください</p>
        )} */}
        <Grid container xs={12} 
          // spacing={0}
          sx={classes.mainGrid}
        >
          <Grid item xs={11}>
            {qStatus == "requiredMail" 
            ?(
              <>
              <a>申し訳ございません。メールアドレスを入力してログインしてください</a>
              <TextField
                  fullWidth={true} label={"メールアドレス"} multiline={false} required={true} 
                  variant={"standard"}
                  rows={1} value={email} type={"email"} onChange={inputEmail}
              />
              </>
              )
            :(
              <TextField
                  fullWidth={true} label={"メールアドレス/ユーザ名"} multiline={false} required={true}
                  variant={"standard"}
                  rows={1} value={email} type={"email"} onChange={inputEmail}
              />)
            }


          </Grid>
          <Grid item xs={11}>
            <TextField
                fullWidth={true} label={"パスワード"} multiline={false} required={true}
                variant={"standard"}
                rows={1} value={password} type={"password"} onChange={inputPassword}
            />
          </Grid>
          <Grid container item xs={12} sx={classes.buttonStyle}>
            {/* <Grid item > */}
              <ButtonPrimary label={"ログイン"} onClick={signinButtonClicked} />
          </Grid>
          <Grid container item xs={12} sx={classes.titleBarStyle}>
              <CSHighLightBar>
                アカウント作成
              </CSHighLightBar>
          </Grid>
              {/* <div className="module-spacer--small" /> */}
              {/* <p className="u-text-small" onClick={() => dispatch(push('/signin/reset'))}>パスワードを忘れた方はこちら</p> */}
              <Grid container item xs={12} sx={classes.buttonStyle}>
                <ButtonScondary label={"かんたんアカウント登録(未実装)"} onClick={simpleSignupButtonClicked}/>
              </Grid>
              <Grid container item xs={12} sx={classes.buttonStyle}>
                <ButtonPrimary label={"こだわりアカウント登録"}   onClick={signupButtonClicked}/>
              </Grid>
              {/* <p className="u-text-small" onClick={() => {
                router.push({
                  pathname: '/auth/signup',
                  query: { 
                    hist : hist,
                    searchWord : searchWord,
                    infoMedia : infoMedia,
                    workId : workId,
                    firstPostFlag : firstPostFlag,
                  },
                })
              }}>アカウント登録がまだですか？　←削除</p> */}
          {/* </Grid> */}
        </Grid>
          {/* </div> */}
        <Footer />
      </>
    )
  }
}

export default SignIn
