import React, {useState, useCallback} from 'react';
import { PrimaryButton, TextInput } from "../../styles/UIkit"

import {useDispatch,useSelector} from "react-redux";
import {signIn} from "../../reducks/users/operations";
// import {push} from "connected-react-router"

import { useRouter } from 'next/router'

import Header from '../../components/header'
import Footer from '../../components/footer'
import MyPage from '../menu/mypage'

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  // const uid = useSelector(state => state)
  const { hist } = router.query
  const query = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう

  const tmpEmail = /\?email=/.test(query) ? query.split('email=')[1] : ""

  console.log(query+"+query")
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

  const loginButtonClicked = async() => {
  // const loginButtonClicked = () => {

    setSigninPush(true)
    console.log(email+"+email,"+password+"+password,"+router+"+router")
    // dispatch(signIn(email, password, router))
    await dispatch(signIn(email, password, router))

    // console.log(uid+"+uid@SignIn@pages")
    // JSON.stringify({uid});
    // router.push('/menu/mypage')

    // router.push({
    //   pathname: '/menu/mypage',
    //   query: { name: 'Someone' }
    // })

    // dispatch(MyPage()) //page配下にいくときはdispatchダメ
  }


  if(signinPush){
    return <>loading...singin...</>
  } else {
    return (
      <div>
        <Header />

        {hist == "Posting" && (
          <p>投稿機能を使用するにはログインしてください</p>
        )}
        {hist == "Mypage" && (
          <p>MyPageを見るにはログインしてね！</p>
        )}
        <div className="c-section-container">
              <h2 className="u-text-center u-text__headline">ログイン画面</h2>
              <div className="module-spacer--medium" />
              <TextInput
                  fullWidth={true} label={"メールアドレス/ユーザ名"} multiline={false} required={true}
                  rows={1} value={email} type={"email"} onChange={inputEmail}
              />
              <TextInput
                  fullWidth={true} label={"パスワード"} multiline={false} required={true}
                  rows={1} value={password} type={"password"} onChange={inputPassword}
              />
              <div className="module-spacer--medium" />
              <div className="center">
                  <PrimaryButton label={"ログイン"} onClick={loginButtonClicked} />
                  <div className="module-spacer--small" />
                  {/* <p className="u-text-small" onClick={() => dispatch(push('/signin/reset'))}>パスワードを忘れた方はこちら</p> */}
                  <p className="u-text-small" onClick={() => dispatch(router.push('/auth/signup'))}>アカウント登録がまだですか？</p>
              </div>
          </div>
        <Footer />
      </div>
    )
  }
}

export default SignIn
