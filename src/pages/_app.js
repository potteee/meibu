import React, {useEffect} from 'react'
import {wrapper} from '../reducks/store/store'
import { parseCookies } from 'nookies'
import {useDispatch, useSelector} from "react-redux"
import {signInAction ,signOutAction} from "../reducks/users/actions"
import { auth, db, FirebaseTimestamp } from "../firebase/index"

import SignIn from './auth/signin';

const WrappedApp = ({Component, pageProps}) => {

  const dispatch = useDispatch();

  //cookie情報からuidの確認
  console.log(JSON.stringify(parseCookies().userID)+"+parse.cookie@_app")
  const userID = parseCookies().userID
  
  //ログイン状態の確認
  const selector = useSelector(state => state)
  // const users = getUserId(selector)
  console.log(JSON.stringify(selector.users.isSignedIn)+"+selector.users.isSignedIn@_app")
  
  // リロード時にログイン状態を保持する為の処理
  // リロード時に
  // cookieにuserIDが保存されていれば、データをディスパッチ
  useEffect(() => {
    (async() => {
      if(selector.users.isSignedIn == false && userID){
        console.log(userID+"+userID@_app")
        db.collection('users').doc(userID).get()
        .then(snapshot => {
            const data =snapshot.data()
            console.log(JSON.stringify(data)+"+data")
            if (!data) {
                throw new Error('ユーザーデータが存在しません');
            }
            dispatch(signInAction({
                isSignedIn: true,
                role: data.role,
                uid:userID,
                // userEmail: data.email,
                userName: data.userName,
                userImage: data.userImage
            }))
        })
      }
    })()
  },[])

  // if(selector.users.isSignedIn == false && userID){
  //   console.log(userID+"+userID@_app")
  //   db.collection('users').doc(userID).get()
  //   .then(snapshot => {
  //       const data =snapshot.data()
  //       console.log(JSON.stringify(data)+"+data")
  //       if (!data) {
  //           throw new Error('ユーザーデータが存在しません');
  //       }
  //       dispatch(signInAction({
  //           isSignedIn: true,
  //           role: data.role,
  //           uid:userID,
  //           // userEmail: data.email,
  //           userName: data.userName,
  //           userImage: data.userImage
  //       }))
  //   })
  // }

  console.log("start _app");
  console.log("end _app");
  return <Component {...pageProps} />
}

// export default App
export default wrapper.withRedux(WrappedApp)

// reportWebVitals();
