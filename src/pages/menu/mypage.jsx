import React, {useState, useEffect, useCallback} from 'react';
import Link from 'next/link'
import { TextInput } from "../../styles/UIkit"

import Header from '../../components/header'
import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'

import {useDispatch, useSelector} from "react-redux";
import {getIsSignedIn, getUserId, getUserName, getRole, getUserSex,getUserImage,getUserEmail, getUserProfile, getUserWebsite,getUserLiveIn, getUserBirthday, getUserBookmark, getUserAssessmentWorks} from '../../reducks/users/selectors'
import { parseCookies } from 'nookies'
import { useRouter } from 'next/router'

import SpeedDialPosting from '../../components/speedDialPosting'
import GLoading from '../../components/GLoading';

import ButtonPrimary from "src/components/ButtonPrimary";
//API


const MyPage = () => {
  const selector = useSelector((state) => state)
  const userID = parseCookies().userID
  const router = useRouter()
  const { query } = useRouter()

  const dispatch = useDispatch()

  //// from Redux
  const userName = getUserName(selector)
  const role = getRole(selector)
  const uid = getUserId(selector)  
  const isSignedIn = getIsSignedIn(selector)
  const userSex = getUserSex(selector)
  const userProfile = getUserProfile(selector)
  const userImage = getUserImage(selector)

  /// privateUsers
  const userEmail = getUserEmail(selector)
  const userLiveIn = getUserLiveIn(selector)
  const userWebsite = getUserWebsite(selector)
  const userBirthday = getUserBirthday(selector)
  let userBookmark = getUserBookmark(selector)
  let userAssessment = getUserAssessmentWorks(selector)
  
  const noLoginState = () => {
    console.log("start noLoginState")
    router.push('/')
  }

  console.log(userAssessment+"+userAssessment")

  if(userAssessment){
    if(Object.keys(userAssessment).length == 0) {
      userAssessment = {initialId : {workName:"initialWorkName",workMedia:"initalWorkMedia"}}
    }
  } 

  if(userBookmark){
    console.log(userBookmark+"+userBookmark")
  } else {
    userBookmark = {initialId : {workName:"initialWorkName",workMedia:"initalWorkMedia"}}
  }

  if(isSignedIn === false){
    //ブラウザ更新時orログインから飛んできたときに'/'に行かないように。
    //ログインしているにもかかわらず、isSignedInがfalseだったとき
    if(userID || query.id){
      //query(name)delete
      // queryNameFlag = 1
      // url.searchParams.delete('name');
      return (
        <>
        <p>...loading...</p>
        </>
      )
    //ログアウト状態時
    //この条件つけないとSSR時にdispatchしてしまってエラーになる
    } else if (typeof window !== 'undefined') {
      console.log("windows is undefined")
      return (
        <>
          {dispatch(noLoginState)}
        </>
      )
    } else {
      console.log("else patern")
    }
  } else {
    console.log("isSignedIn true")
  }

  // 最後にsetしているuserBookmarkをチェック
  if(!userBookmark){
    return (
      <GLoading/>
    )
  } else {
    return (
      <>
        <ApplicationBar title="マイページ"/>
        {/* Redux部 */}
        <h3>公開ユーザ情報</h3>
        <Link href="/user/[uid]" 
          as={`/user/${uid}`}>
          <h3>お名前(L)：{userName}</h3>
        </Link>
        <p>性別：
          {userSex == 0 && ("未登録")}
          {userSex == 1 && ("男性")}
          {userSex == 2 && ("女性")}
        </p>
        <p>プロフィール : {userProfile}</p>
        <p>プロフ画 : {userImage}</p>

        <h3>プライベート情報</h3>
        <p>メール : {userEmail}</p>
        <p>お住まい : {userLiveIn}</p>
        <p>Web/SNS : {userWebsite}</p>
        <p>誕生日 : {userBirthday}</p>
        
        <p>評価を投稿した作品：</p>
        {(Object.keys(userAssessment)[0] != "initialId")
          ? <> {Object.keys(userAssessment).map((map) => (
                <>
                <Link
                  href="/post/[postWorkId]/[postUserId]"
                  as={`/post/${map}/${uid}/`}
                >
                  {userAssessment[map].workName}
                </Link>
                <br/>
                </>
              ))}
            </>
          : <>"投稿した作品はありません"</>
        }
        

        <h4>ブックマークした作品</h4>
        {Object.keys(userBookmark).length != 0 
          ? <>
            {Object.keys(userBookmark).map((map) => (
              <>
                <Link
                  href="/post/[postWorkId]/"
                  as={`/post/${map}/`}
                >
                  {userBookmark[map]["workName"]}
                </Link>
                <br/>
              </>
            ))}
          </>
          : <p>
          "ブックマークした作品はありません"</p>
        }    
        <Link 
          href={{
            pathname: "/menu/mypageEdit",
            query: { hist : "mypage" },
          }} 
        >
          mypageを編集する
        </Link>
        <SpeedDialPosting />
        <Footer />
      </>
    )
  }
}

export default MyPage