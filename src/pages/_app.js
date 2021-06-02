import React, {useEffect} from 'react'
import {wrapper} from '../reducks/store/store'
import { parseCookies } from 'nookies'
import {useDispatch, useSelector} from "react-redux"
import {signInAction ,signOutAction} from "../reducks/users/actions"
import {getIsSignedIn} from "../reducks/users/selectors";

import { auth, db, FirebaseTimestamp } from "../firebase/index"

import SignIn from './auth/signin';

const WrappedApp = ({Component, pageProps}) => {

  //cookie情報からuidの確認
  const selector = useSelector(state => state)
  const isSignedIn = getIsSignedIn(selector)
  console.log(JSON.stringify(selector.users.isSignedIn)+"+selector.users.isSignedIn@_app")
  console.log(isSignedIn+"+isSignedIn")

  const dispatch = useDispatch();

  console.log(JSON.stringify(parseCookies().userID)+"+parse.cookie@_app")
  const userID = parseCookies().userID

  //ログイン状態の確認
  // リロード時にログイン状態を保持する為の処理
  // リロード時に
  // cookieにuserIDが保存されていれば、データをディスパッチ
  // useEffect(() => {
  //   (async() => {
  //   })()
  // },[])



  //async/await 意味ないっぽい??
  const firstAction = async() => {
    if(selector.users.isSignedIn == false && userID){
    // if(userID){
      try{
        console.log(userID+"+userID@Cookie true")
        const snapshot = await db.collection('users').doc(userID).get()
        console.log(snapshot+"+snapshot")
        const data = snapshot.data()
        console.log(JSON.stringify(data)+"+data@app")
        if (!data) {
            throw new Error('ユーザーデータが存在しません');
        }
        console.log("dispatch signInAction")
        await dispatch(signInAction({
            isSignedIn: true,
            role: data.role,
            uid:userID,
            // userEmail: data.email,
            userName: data.userName,
            userImage: data.userImage
        }))
        return true
      } catch (error) {
        console.log(error)
        alert("_app error")
        throw new Error(error)
        return false
      }
    } else {
      console.log(userID+"+userID@Cookie else")
    }
  }

  // let faFlag = false

  firstAction()
  // .then(token => {
  //   console.log("skipped...")
  //   // faFlag = true
  // }).catch((error) => {
  //   alert('ユーザ情報取得失敗')
  //   throw new Error(error)
  //   return false
  // })

  // if(faFlag) {
  //   return <Component {...pageProps} />
  //   console.log("return Comp")
  // } else {
  //   console.log("return null")
  //   return null
  // }
  
  console.log("return Comp")
  return <Component {...pageProps} />
}

export default wrapper.withRedux(WrappedApp)
