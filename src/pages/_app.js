import React, {useEffect,useState} from 'react'
import {wrapper} from '../reducks/store/store'
import { parseCookies } from 'nookies'
import {useDispatch, useSelector} from "react-redux"
import {signInAction ,signOutAction} from "../reducks/users/actions"
import {getIsSignedIn} from "../reducks/users/selectors";
import { auth, db, FirebaseTimestamp } from "../firebase/index"
import SignIn from './auth/signin';

import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';

import { StylesProvider } from '@material-ui/styles';
// import useStyles from '../styles/overRide'
// import useStyles from "src/styles/overRide"

import {SCmargin} from 'src/styles/SC/app/margin'
import Box from '@material-ui/core/Box';
import { updateUsersWithSignIn } from '../reducks/users/operations'
import GetUserRedux　from 'src/foundations/share/getUserRedux'

// import styled from 'styled-components'

// const useStyles = makeStyles((theme) => ({
//   appStyle : { //footer(48px)がメインコンテンツにかぶらないように調整。ちょっと多めに
//     margin : "3.4rem 0.3rem 2.8rem 0.3rem",
//     // margin : "40px 5px 52px 5px",
//   },
// }))

const WrappedApp = ({Component, pageProps}) => {

  //cookie情報からuidの確認
  const selector = useSelector(state => state)
  const isSignedIn = getIsSignedIn(selector)
  console.log(isSignedIn+"+isSignedIn")

  const dispatch = useDispatch();
  // const useStyles = makeStyles((theme) => ({
  //   appStyle : { //footer(48px)がメインコンテンツにかぶらないように調整。ちょっと多めに
  //     margin : "3.4rem 0.3rem 2.8rem 0.3rem",
  //     // margin : "40px 5px 52px 5px",
  //   },
  // }))
  // const classes = useStyles();

  console.log(JSON.stringify(parseCookies().userID)+"+parse.cookie@_app")
  const userID = parseCookies().userID

  let faFinished = false
  // const [faFinished,setFaFinished] = useState(false)
  
  const [renderTriger, setRenderTriger] = useState(true)
  
  //ログイン状態の確認
  // リロード時にログイン状態を保持する為の処理
  // リロード時に
  // cookieにuserIDが保存されていれば、データをディスパッチ
  
  
  const firstAction = async() => {
    if((isSignedIn == false) && userID){
      console.log("login & reloaded")
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
        // まずはここをupdateにする。（少なくとも直接actionsは呼ばないようにする。→ここはisSignedInの更新も必要なので、
        // updateではなくactionsでなくてはならない
        // await dispatch(signInAction(userRedux))
        // const temp = 
        // console.log(JSON.stringify(temp)+"+GetUserRedux@J")
        await dispatch(updateUsersWithSignIn(await GetUserRedux(userID)))

        faFinished = true
        // setFaFinished(true)
        return true
      } catch (error) {
        console.log(error)
        alert("_app error")
        throw new Error(error)
      }
    } else if ((isSignedIn == false) && !userID){ //
      console.log("no login & reloaded")
      // await dispatch(signInAction({
        //   isSignedIn: false,
        //     // role: usersData.role,
        //     // uid:userID,
        //     // userName: usersData.userName,
        //     // userImage: usersData.userImage
        // }))
        ///////////////ここがレンダリングされても意味ない？
        //footerの方がレンダリングされないと。
      setRenderTriger(!renderTriger)
      console.log("setRenderTriger")
    } else {
      //初回レンダリング時はサインインしていないはずだから、
      //ここに入ることはないはずだけど１回入った（なぜ？）
      //　→　いや、りろーどしなければ遷移時に普通に入るか
      // alert("_app error 2s")
      //else if作ったからここは動かないはず
      console.log(userID+"+userID@Cookie else")
      //これやらないとstyled-componentsが適用されない？
      // setRenderTriger(!renderTriger)
      // console.log("setRenderTriger")
      return true
    }
  }
    
  useEffect(() => {
      //どこかで補完してくれているのか、removeしなくてもエラーにならない。　→してくれてなかった。
      // const jssStyles = document.querySelector('#jss-server-side');
      // console.log(jssStyles+"+jssStyles")
      // if (jssStyles) {
        //   jssStyles.parentElement.removeChild(jssStyles);
        //   console.log("delete jss")
    // }
    firstAction()
    //再レンダリングさせる。これやらないと_appのスタイルまで消えてしまう。
    // setRenderTriger(!renderTriger)
  },[])

  if(isSignedIn == false && userID){
    if(faFinished == false){ //reload
      console.log("return loading...")
      return (
      <SCmargin>
        loading..._app.js...
      </SCmargin>
      )
    } else { //ここは読み込まれないはず。
      console.log("return Comp")
      return null
    }
  } else if(isSignedIn == true && userID) {
    console.log("return Comp isSignedIn")
    return (
        <StylesProvider injectFirst>
          <CssBaseline/>
          <SCmargin>
            <Component {...pageProps} />
          </SCmargin>
        </StylesProvider>
    )
  } else {//no login 
    console.log("return Comp nologin userr")
    return (
        <StylesProvider injectFirst>
          <CssBaseline/>
          <SCmargin>
            <Component {...pageProps} />
          </SCmargin>
        </StylesProvider>
    )
  }
}

export default wrapper.withRedux(WrappedApp)
