import React, {useEffect,useState} from 'react'
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
  console.log(isSignedIn+"+isSignedIn")

  const dispatch = useDispatch();

  console.log(JSON.stringify(parseCookies().userID)+"+parse.cookie@_app")
  const userID = parseCookies().userID

  let faFinished = false
  // const [faFinished,setFaFinished] = useState(false)

  //ログイン状態の確認
  // リロード時にログイン状態を保持する為の処理
  // リロード時に
  // cookieにuserIDが保存されていれば、データをディスパッチ
  const firstAction = async() => {
    if(isSignedIn == false && userID){
      try{
        console.log("firstAction start")
        console.log(userID+"+userID@Cookie true")

        //Cookie偽装対策
        //Cookieに有効なuidが登録されていても、ログインしている状態でないと
        //ブラウザリロード時にログイン状態が自動継続しない。
        //バックエンドでやらなくても良さそう。
        const unsubscribe = await auth.onAuthStateChanged(function(user) {
          if (user) {
            console.log("user")
            console.log(user)
            console.log("User is signed in.")
            unsubscribe() //これやらないとずっとここだけ回り続ける
          } else {
            console.log("No user is signed in.")
            alert("不正な処理が行われました。")
            unsubscribe()
            return false
          }
        });

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
        faFinished = true
        // setFaFinished(true)
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

  useEffect(() => {
    firstAction()
  },[])

  if(isSignedIn == false && userID){
    if(faFinished == false){ //reload
      console.log("return loading...")
      return (<>loading..._app.js...</>)
    } else { //ここは読み込まれないはず。
      console.log("return Comp")
      return <Component {...pageProps} />
    }
  } else if(isSignedIn == true && userID) {
    console.log("return Comp isSignedIn")
    return <Component {...pageProps} />
  } else {//no login 
    console.log("return Comp nologin user")
    return <Component {...pageProps} />
  }
}

export default wrapper.withRedux(WrappedApp)
