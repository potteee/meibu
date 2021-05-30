import React,{useCallback, useState, useEffect} from "react"
import Link from 'next/link'
// import useSWR from 'swr'
// import { useUser } from '../foundations/auth/useUser'

import {getIsSignedIn,getUserName} from '../reducks/users/selectors'
import styles from '../styles/components.module.css'
import {useDispatch, useSelector} from "react-redux";


const Header = () => {
  const selector = useSelector((state) => state)
  const userName = getUserName(selector)
  const loginStatus = getIsSignedIn(selector)

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
            <Link
              href={{
              pathname: loginStatus ? "/auth/signout" : "/auth/signup",
              query: { hist : "Signup" },
            }}>
              <a>SignUp</a>
            </Link>
          </li>
          <li>
            {/* //ログインしているときにはsignout画面に遷移 */}
            <Link
              href={{
              pathname: loginStatus ? "/auth/signout" : "/auth/signin",
              query: { hist : "Signin" },
            }}>
              <a>SignIn</a>
            </Link>
          </li>
          <li>
            <Link href="/auth/signout">
              <a>SignOut</a>
            </Link>
          </li>
          <li>
            {/* //ログインしていないときはlogin.jsx画面？に遷移 */}
            <Link
              href={{
              pathname: loginStatus ? "/menu/search" : "/auth/signin",
              query: { hist : "Posting" },
            }}>
              <a>投稿</a>
            </Link>
          </li>
        </ul>
        {loginStatus === true 
          ? <a>ログイン状態：{userName}でログイン中</a>
          : <a>ログイン状態：ログアウト中</a>
        }
      </header>
    </>
  )
}

export default Header
// export default Index