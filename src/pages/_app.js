import React, {useEffect,useState} from 'react'
import {useRouter} from "next/router";
import {wrapper} from '../reducks/store/store'
import { parseCookies } from 'nookies'
import {useDispatch, useSelector} from "react-redux"
import {signInAction ,signOutAction} from "../reducks/users/actions"
import {getIsSignedIn} from "../reducks/users/selectors";
import { auth, db, FirebaseTimestamp } from "../firebase/index"
import SignIn from './auth/signin';

import ApplicationBar from '../components/applicationBar'
import Footer from '../components/footer'

// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';


import { StylesProvider } from '@material-ui/styles';

import {SCmargin} from 'src/styles/SC/app/margin'
import Box from '@material-ui/core/Box';
import { updateUsersWithSignIn } from '../reducks/users/operations'
import GetUserRedux　from 'src/foundations/share/getUserRedux'


// NProgress.configure({ showSpinner: true, speed: 400, minimum: 0.25 })

const WrappedApp = ({Component, pageProps}) => {
  
  const {isReady} = useRouter()
  const router = useRouter()
  //cookie情報からuidの確認
  const selector = useSelector(state => state)
  const isSignedIn = getIsSignedIn(selector)
  console.log(isSignedIn+"+isSignedIn")

  const dispatch = useDispatch();

  console.log(JSON.stringify(parseCookies().userID)+"+parse.cookie@_app")
  const userID = parseCookies().userID

  let faFinished = false
  
  const [renderTriger, setRenderTriger] = useState(true)
  const [pageLoading, setPageLoading] = useState(false);
  
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

        //ここバグでは？ 先にGetUserReducer終わらないと送る値がundefinedになりそう。
        //予めawait で取得した値を入れないとダメか。
        //→下記の通り修正済み
        const userRedux = await GetUserRedux(userID)

        await dispatch(updateUsersWithSignIn(userRedux))

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

      return true
    }
  }
    
  useEffect(() => {
      firstAction()
    },[])
    
  useEffect(() => {      
    const handleStart = () => { setPageLoading(true); };
    const handleComplete = () => { setPageLoading(false); };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
  },[router])

  if((isSignedIn == false && userID ) || pageLoading){
    if(faFinished == false){ //reload
      console.log("return loading...")
      console.log(isSignedIn+"+isSignedIn")
      console.log(pageLoading+"+pageLoading")
      // console.log(isReady+"+isReady")
      console.log(userID+"+userID")
      return (
        <StylesProvider injectFirst>
          <SCmargin>
            <CssBaseline/>
            <ApplicationBar title="読み込み中"/>
            _app.js...
            <CircularProgress/>
            <Footer/>
          </SCmargin>
        </StylesProvider>
      )
    } else { //ここは読み込まれないはず。
      console.log("return Comp")
      return null
    }
  } else if(isSignedIn == true && userID) {
    //ここのifチェックの時に、DBの値が入っていなかったら↑の条件にして...
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
