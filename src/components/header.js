import React,{useCallback, useState, useEffect} from "react"
import Link from 'next/link'
// import useSWR from 'swr'
// import { useUser } from '../foundations/auth/useUser'
import styles from '../styles/components.module.css'
import {useDispatch, useSelector} from "react-redux";

const Header = () => {
  const selector = useSelector((state) => state)

  const [userName, setUserName] = useState(""),
        [loginStatus ,setLoginStatus] =useState("ログイン中")

  // let loginStatus = 'ログイン中'

  console.log(selector.users.isSignedIn+"+selector.users.isSignedIn")

  useEffect(() => {
    console.log("head useEffect")
    if(selector.users.isSignedIn === false) {
        setLoginStatus('ログアウト中')
      } else {
        setUserName(selector.users.userName)
        setLoginStatus('ログイン中')
    }
  },[selector])
  // if(selector.users.isSignedIn === false) {
  //     loginStatus = 'ログアウト中'
  // }

  return (
      <>
      <header>
        <ul className={styles.topmenu}>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
          {selector.users.isSignedIn && (
            <Link 
               href={{
                 pathname: "/auth/signout",
                 query: { hist : "Signup" },
               }} 
              >
                <a>Signup</a>
              </Link>
          )}
          {!selector.users.isSignedIn && (
            <Link href="/auth/signup">
              <a>Signup</a>
            </Link>
          )}
          </li>
          <li>
            {/* //ログインしているときにはsignout画面に遷移 */}
            {selector.users.isSignedIn && (
              <Link
                href={{
                pathname: "/auth/signout",
                query: { hist : "Signin" },
              }}>
                <a>SignIn</a>
              </Link>
            )}
              {!selector.users.isSignedIn && (
              <Link 
               href={{
                 pathname: "/auth/signin",
                 query: { hist : "Signin" },
               }} 
              >
               <a>SignIn</a>
              </Link>
            )}
          </li>
          <li>
            <Link href="/auth/signout">
              <a>SignOut</a>
            </Link>
          </li>
          <li>
            {/* //ログインしていないときはlogin.jsx画面？に遷移 */}
            {selector.users.isSignedIn && (
              <Link
                href={{
                pathname: "/menu/search",
                query: { hist : "Posting" },
              }}>
                <a>投稿</a>
              </Link>
            )}
              {!selector.users.isSignedIn && (
              <Link 
               href={{
                 pathname: "/auth/signin",
                 query: { hist : "Posting" },
               }} 
              >
               <a>投稿</a>
              </Link>
            )}
          </li>
        </ul>
        {loginStatus == "ログイン中" && (
          <a>ログイン状態：{userName}で{loginStatus}</a>
        )}
        {loginStatus == "ログアウト中" && (
          <a>ログイン状態：{loginStatus}</a>
        )}
      </header>
    </>
  )

}

export default Header
// export default Index