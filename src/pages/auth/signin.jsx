import React, {useState, useCallback} from 'react';
import { PrimaryButton, TextInput } from "../../styles/UIkit"

import {useDispatch,useSelector} from "react-redux";
import {signIn} from "../../reducks/users/operations";
import {push} from "connected-react-router"

import { useRouter } from 'next/router'

import Header from '../../components/header'
import Footer from '../../components/footer'
import MyPage from '../menu/mypage'

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  // const uid = useSelector(state => state)
  const { hist } = router.query

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const inputEmail = useCallback((e) => {
      setEmail(e.target.value)
  },[]);

  const inputPassword = useCallback((e) => {
      setPassword(e.target.value)
  },[]);

  const loginButtonClicked = async() => {
  // const loginButtonClicked = () => {
    await dispatch(signIn(email, password))

    // console.log(uid+"+uid@SignIn@pages")
    // JSON.stringify({uid});
    // router.push('/menu/mypage')

    router.push({
      pathname: '/menu/mypage',
      query: { name: 'Someone' }
  })

    // dispatch(MyPage()) //page配下にいくときはdispatchダメ
  }

  return (
    <div>
      <Header />

      {hist == "Posting" && (
        <p>投稿機能を使用するにはログインしてください</p>
      )}
      <div className="c-section-container">
            <h2 className="u-text-center u-text__headline">ログイン画面</h2>
            <div className="module-spacer--medium" />
            <TextInput
                fullWidth={true} label={"メールアドレス"} multiline={false} required={true}
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

export default SignIn
