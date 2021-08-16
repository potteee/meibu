import React, {useState, useCallback,useMemo} from 'react';
import Header from '../../components/header'
import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'
import { PrimaryButton, TextInput } from "../../styles/UIkit"

import {useDispatch,useSelector} from "react-redux";
import {signIn} from "../../reducks/users/operations";
// import {push} from "connected-react-router"

import { useRouter } from 'next/router'

import MyPage from '../menu/mypage'

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  // const uid = useSelector(state => state)
  const { hist,searchWord,firstPostFlag } = router.query
  const oriQuery = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう

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
    return await dispatch(signIn(email, password, router,hist,searchWord,firstPostFlag))
  },[]);

  const loginButtonClicked = async() => {
  // const loginButtonClicked = () => {

    setSigninPush(true)
    console.log(email+"+email,"+password+"+password,"+router+"+router")

    // const signinResult = await dispatch(signIn(email, password, router))
    const signinResult = await signInModule(email, password, router)

    console.log(signinResult+"+sigininResult")
    if(!signinResult){
      setSigninPush(false)
    }
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
        {qStatus == "requiredMail" 
        ?(
          <>
          <a>申し訳ございません。メールアドレスを入力してログインしてください</a>
          <TextInput
              fullWidth={true} label={"メールアドレス"} multiline={false} required={true}
              rows={1} value={email} type={"email"} onChange={inputEmail}
          />
          </>
          )
        :(
          <TextInput
              fullWidth={true} label={"メールアドレス/ユーザ名"} multiline={false} required={true}
              rows={1} value={email} type={"email"} onChange={inputEmail}
          />)
        }
        <TextInput
            fullWidth={true} label={"パスワード"} multiline={false} required={true}
            rows={1} value={password} type={"password"} onChange={inputPassword}
        />
        {/* <div className="module-spacer--medium" /> */}
        <div className="center">
            <PrimaryButton label={"ログイン"} onClick={loginButtonClicked} />
            <div className="module-spacer--small" />
            {/* <p className="u-text-small" onClick={() => dispatch(push('/signin/reset'))}>パスワードを忘れた方はこちら</p> */}
            <p className="u-text-small" onClick={() => dispatch(router.push('/auth/signup'))}>アカウント登録がまだですか？</p>
        </div>
          {/* </div> */}
        <Footer />
      </>
    )
  }
}

export default SignIn
