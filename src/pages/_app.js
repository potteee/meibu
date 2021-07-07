import React, {useEffect,useState} from 'react'
import {wrapper} from '../reducks/store/store'
import { parseCookies } from 'nookies'
import {useDispatch, useSelector} from "react-redux"
import {signInAction ,signOutAction} from "../reducks/users/actions"
import {getIsSignedIn} from "../reducks/users/selectors";
import { auth, db, FirebaseTimestamp } from "../firebase/index"
import SignIn from './auth/signin';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  appStyle : { //footer(48px)がメインコンテンツにかぶらないように調整。ちょっと多めに
    margin : "3.4rem 0.3rem 2.8rem 0.3rem",
    // margin : "40px 5px 52px 5px",
  },
}))

const WrappedApp = ({Component, pageProps}) => {

  //cookie情報からuidの確認
  const selector = useSelector(state => state)
  const isSignedIn = getIsSignedIn(selector)
  console.log(isSignedIn+"+isSignedIn")

  const dispatch = useDispatch();
  const classes = useStyles();

  console.log(JSON.stringify(parseCookies().userID)+"+parse.cookie@_app")
  const userID = parseCookies().userID

  let faFinished = false
  // const [faFinished,setFaFinished] = useState(false)

  //ログイン状態の確認
  // リロード時にログイン状態を保持する為の処理
  // リロード時に
  // cookieにuserIDが保存されていれば、データをディスパッチ


  const firstAction = async() => {
    if((isSignedIn == false) && userID){
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
          } else {
            console.log("No user is signed in.")
            alert("不正な処理が行われました。")
            // unsubscribe()
            return false
          }
        });
        unsubscribe() //これやらないとずっとここだけ回り続ける

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
      // await dispatch(signInAction({
      //   isSignedIn: false,
      //   // role: data.role,
      //   // uid:userID,
      //   // userName: data.userName,
      //   // userImage: data.userImage
      // }))
      return true
    }
  }

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    // if (jssStyles) {
    //   jssStyles.parentElement.removeChild(jssStyles);
    //   console.log("delete jss")
    // }
    firstAction()
  },[])

  if(isSignedIn == false && userID){
    if(faFinished == false){ //reload
      console.log("return loading...")
      return (<div className={classes.appStyle} >loading..._app.js...</div>)
    } else { //ここは読み込まれないはず。
      console.log("return Comp")
      // return <Component {...pageProps} />
      return null
    }
  } else if(isSignedIn == true && userID) {
    console.log("return Comp isSignedIn")
    return (
      <div className={classes.appStyle} >
        <Component {...pageProps} />
      </div>
    )
  } else {//no login 
    console.log("return Comp nologin userr")
    return (
      <>
        <div className={classes.appStyle} >
          <Component {...pageProps} />
        </div>
      </>
    )
  }
}

export default wrapper.withRedux(WrappedApp)
