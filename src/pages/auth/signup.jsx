//ユーザー作成処理
import React,{useCallback, useState} from "react";
import { TextInput,PrimaryButton } from "../../styles/UIkit"
import { signUp } from "../../reducks/users/operations"
import {useDispatch} from "react-redux";

import { useRouter } from 'next/router'

// import { auth } from '../../firebase'
// import firebase from 'firebase/app'

import Header from '../../components/header'
import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'



const SignUp = () => {

  const dispatch = useDispatch()
  const router = useRouter()

  const [userName, setUserName] = useState(""),
        [email, setEmail] = useState(""),
        [password, setPassword] = useState(""),
        [confirmPassword, setConfirmPassword] = useState("");

  const [signupPush,setSignupPush] = useState(false)


  //useCallbackを使った方がパフォーマンスが良い
  const inputUserName = useCallback((event)=> {
      setUserName(event.target.value)
  },[setUserName]);

  const inputEmail = useCallback((event)=> {
      setEmail(event.target.value)
  },[setEmail]);

  const inputPassword = useCallback((event)=> {
      setPassword(event.target.value)
  },[setPassword]);

  const inputConfirmPassword = useCallback((event)=> {
      setConfirmPassword(event.target.value)
  },[setConfirmPassword]);

  const accountButtonClicked = async() => {
    //   const signUpResult = dispatch(signUp(userName,email,password,confirmPassword));
    setSignupPush(true)
    const signupResult = await dispatch(signUp(userName,email,password,confirmPassword,router));
    
    console.log(signupResult+"+signupResult")
    if(!signupResult){
      setSignupPush(false)
    }
  }

  if(signupPush){
    return <>loading...singup...</>
  } else {
    return (
      <div>
        <ApplicationBar title="マイページ"/>
        {/* <Header /> */}
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">アカウント登録</h2>
            <div className="module-spacer--medium" />
            <TextInput
                fullWidth={true} label={"ユーザー名(記号は _ のみ)"} multiline={false} required={true}
                rows={1} value={userName} type={"text"} onChange={inputUserName}
            />
            <TextInput
                fullWidth={true} label={"メールアドレス"} multiline={false} required={true}
                rows={1} value={email} type={"email"} onChange={inputEmail}
            />
            <TextInput
                fullWidth={true} label={"パスワード(半角英数６文字以上)"} multiline={false} required={true}
                rows={1} value={password} type={"password"} onChange={inputPassword}
            />
            <TextInput
                fullWidth={true} label={"パスワード（確認用）"} multiline={false} required={true}
                rows={1} value={confirmPassword} type={"password"} onChange={inputConfirmPassword}
            />
            <div className="center">
                <PrimaryButton
                    label={"アカウントを登録"}
                    onClick={accountButtonClicked}
              />
            </div>
        </div>
        <Footer />
      </div>
    )
  }
}
export default SignUp;