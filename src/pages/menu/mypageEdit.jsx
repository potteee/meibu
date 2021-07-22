import React,{useCallback, useState, useEffect} from "react"

import { TextInput,PrimaryButton,RadioButton } from "../../styles/UIkit"
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

import Link from 'next/link'

import {useDispatch,useSelector} from "react-redux"
import {getUserId, getUserName, getRole, getUserImage, getUserLiveIn, getUserBookmarkWorks, getUserSex,getUserProfile,getUserWebsite, getUserEmail, getUserBirthday} from '../../reducks/users/selectors'
import {updateUsers} from '../../reducks/users/operations'

import { useRouter } from 'next/router'

// import mypageConfirm from './mypageConfirm'

import Header from '../../components/header'
import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'

import { auth, db, FirebaseTimestamp } from "../../firebase/index";
import { Button } from "@material-ui/core";

import { SCButtonActive, SCButtonDeactive } from "../../styles/SC/components/bookmark/button";


const mypageEdit = () => {
  const selector = useSelector((state) => state)
  const dispatch = useDispatch()
  const router = useRouter()

  // console.log(JSON.stringify(profile)+"+profile")

  //// from Redux
  // const userName = getUserName(selector)
  // const role = getRole(selector)
  const uid = getUserId(selector)  
  const userEmail = getUserEmail(selector)
  // const isSignedIn = getIsSignedIn(selector)
  // const userSex = getUserSex(selector)
  // const userProfile = getUserProfile(selector)
  // const userImage = getUserImage(selector)

  // /// privateUsers
  // const userLiveIn = getUserLiveIn(selector)
  // const userWebsite = getUserWebsite(selector)
  // const userBirthday = getUserBirthday(selector)
  // let userBookmark = getUserBookmarkWorks(selector)
  // let userAssessment = getUserAssessmentWorks(selector)

  // public
  const [userName, setUserName] = useState(getUserName(selector)),
        [userSex, setUserSex] = useState(getUserSex(selector)),
        [userProfile, setUserProfile] = useState(getUserProfile(selector)),
        [userImage, setUserImage] = useState(getUserImage(selector)),
        [role, setRole] = useState(getRole(selector))

  // private
  const [userLiveIn ,setUserLiveIn] = useState(getUserLiveIn(selector)),
        [userWebsite ,setUserWebsite] = useState(getUserWebsite(selector)),
        [userBirthday, setUserBirthday] = useState(getUserBirthday(selector)),
        [userBookmark, setUserBookmark] = useState(getUserBookmarkWorks(selector))

  let usersChangeFlag = false

  const [privateChangeFlag, setPrivateChangeFlag] = useState(false),
        [publicChangeFlag, setPublicChangeFlag] = useState(false)

  //public
  const inputUserName = useCallback((event) => {
    setUserName(event.target.value)
    setPublicChangeFlag(true)
  },[setUserName])
  
  const inputUserProfile = useCallback((event) => {
    setUserProfile(event.target.value)
    setPublicChangeFlag(true)
  },[setUserProfile])
  
  const checkUserSex = useCallback((event) => {
    setUserSex(event.target.value)
    setPublicChangeFlag(true)
  },[setUserSex])
  
  //private
  const inputUserLiveIn = useCallback((event) => {
    setUserLiveIn(event.target.value)
    setPrivateChangeFlag(true)
  },[setUserLiveIn])

  const inputUserWebsite = useCallback((event) => {
    setUserWebsite(event.target.value)
    setPrivateChangeFlag(true)
  },[setUserWebsite])

  const inputUserBirthday = useCallback((event) => {
    setUserBirthday(event.target.value)
    setPrivateChangeFlag(true)
  },[])

  const clickedUserBookmark = useCallback((e) => {
    // console.log(e.target.value+"+etv")
    // console.log(e.target)
    // console.log(e.target.id)
    console.log(e.currentTarget.value)
    setUserBookmark((preUserBookmark) => {
      if(!preUserBookmark[e.currentTarget.value]["deleteFlag"]){
        preUserBookmark[e.currentTarget.value]["deleteFlag"] = true
      } else if(preUserBookmark[e.currentTarget.value]["deleteFlag"] == false){
        preUserBookmark[e.currentTarget.value]["deleteFlag"] = true
      } else {
        preUserBookmark[e.currentTarget.value]["deleteFlag"] = false
      }
      return {...preUserBookmark}
    })
  },[userBookmark])

  console.log(JSON.stringify(selector)+"+selector2@mypage")
  console.log(userBookmark+"userBookmark2")
  
  // useEffect(() => {
  //   (async() => {
  //     console.log(uid+"+ui mypageEdit")
  //     if(uid != "uid initial"){
  //       // setUserName(getUserName(selector))
  
  //       console.log(JSON.stringify(selector)+"+selector2@mypage")
  //       console.log(uid+"+uid useEffect out")
  //       console.log(uid+"+uid useEffect out")
  
  //       //DB
  //       if(uid != "uid initial"){
  //         // await setUid(await getUserId(selector))
  //         console.log(uid+"+uid useEffect in")
  
  //         await db.collection('users').doc(uid).get()
  //         .then(snapshot => {
  //           let data = snapshot.data()
  //           console.log(data+"+data collection email")
  //           setUserSex(data.userSex)
  //           setUserProfile(data.userProfile)
  //           setUserImage(data.userImage)
  //           setRole(data.role)
  //         })
  //         .catch((error) => {
  //           alert('Get users DB fail')
  //           throw new Error(error)
  //         })
          
  //         await db.collection('privateUsers').doc(uid).get()
  //         .then(snapshot => {
  //           let data = snapshot.data()
  //           console.log(JSON.stringify(data)+"+data collection email")
  //           setUserEmail(data.email)
  //           setUserLiveIn(data.userLiveIn)
  //           setUserWebsite(data.userWebsite)
  //           setUserBirthday(data.userBirthday)
  //           setUserBookmark(data.userBookmark)
  //         })
  //         .catch((error) => {
  //           alert('Get privateUsers DB fail')
  //           throw new Error(error)
  //         })
  //         // await db.collection('privateUsers').doc(uid)
  //         // .collection('postedWorksId').where('workId','!=','99').get()
  //         // .then(snapshot => {
  //         //   if(snapshot.empty){
  //         //     setWorkIds("投稿した作品はまだありません！")
  //         //     console.log("投稿した作品はありません！")
  //         //   }else{
  //         //     let tmpWorkIds = []
  //         //     snapshot.forEach((doc) => {
  //         //       tmpWorkIds = [...tmpWorkIds, doc.id]
  //         //       // tmpWorkIds.push(doc.id)
  //         //       // list.push(snapshot.data())
  
  //         //     })
  //         //     console.log(JSON.stringify(snapshot.data)+"+snapshot.doc")
  //         //     console.log(JSON.stringify(snapshot.empty)+"+snapshot.empty")
  //         //     // console.log(JSON.stringify(tmpWorkIds)+"+tmpWorkIds")
  //         //     // setWorkIds(tmpWorkIds)
  //         //   }
  //         // })
  //         // .catch((error) => {
  //         //   alert('Get worksId DB fail')
  //         //   throw new Error(error)
  //         // })
  //       }
  //     }
  //   })()
  // },[])//selectorを指定することでページ更新（リロード）時に再読み込みしてくれる。
  // // },[selector])//selectorを指定することでページ更新（リロード）時に再読み込みしてくれる。
  
  const changeButtonClicked = async() => {
    if(publicChangeFlag == true || privateChangeFlag == true){
      const timestamp = FirebaseTimestamp.now()
      
      const userRedux = {
        userName: userName,
        userImage: userImage,
        userSex: userSex,
        userProfile: userProfile, // プロフィール : 未登録
        userEmail: userEmail, // メール : kanoko2@example.com
        userLiveIn: userLiveIn,// お住まい : 未登録
        userWebsite: userWebsite, // Web/SNS : 未登録
        userBirthday: userBirthday,// 誕生日 : 未登録
        userBookmarkWorks: userBookmark,// ブックマークした作品
      }

      await Promise.all([
        db.collection('users').doc(uid).update({
          userName: userName,
          userSex: userSex,
          userProfile: userProfile,
          userImage: userImage,
        }),
        db.collection('privateUsers').doc(uid).update(
          {
            email: userEmail,
            userLiveIn: userLiveIn,
            userWebsite: userWebsite,
            userBirthday: userBirthday,
            userBookmark : userBookmark,
            // created_at: timestamp,
            updated_at: timestamp,  
          }
        ),
        dispatch(updateUsers(userRedux))
        // dispatch(await updateUsers(userRedux)),
      ])

      router.push('/menu/mypage')

    } else {
      console.log("Didnt update publicUserData ")
      alert("変更なしで戻ります")
      router.push('/menu/mypage')
    }
  }

  return(
    <>
    <ApplicationBar title="マイページ編集"/>
    {/* <Header /> */}
    {/* <p>{userProfile}</p> */}
    <div className="c-section-container">
      <h2 className="u-text__headline u-text-center">mypage編集</h2>
      <div className="module-spacer--medium" />
      <h3>公開ユーザ情報</h3>
      <TextInput
        fullWidth={true} label={"ユーザ名"} multiline={false} required={true}
        rows={1} value={userName} type={"text"} onChange={inputUserName}
      />
      <TextInput
        fullWidth={true} label={"プロフィール"} multiline={true} required={false}
        rows={1} value={userProfile} type={"text"} onChange={inputUserProfile}
      />
      <FormControl component="fieldset">
        <FormLabel component="legend">Gender</FormLabel>
        {/* <RadioGroup name={"sex1"} value={userSex} onChange={checkUserSex}> */}
        {/* <RadioButton arial={"gender"} name={"gender1"} value={userSex} onChange={checkUserSex}> */}
        <RadioButton name={"gender1"} value={userSex} onChange={checkUserSex}
          label={<>
            <FormControlLabel 
              value="1"
              control={<Radio />}
              label="男性" 
            />
            <FormControlLabel
              value="2" 
              control={<Radio />}
              label="女性" 
            />
            <FormControlLabel
              value="0"
              control={<Radio />}
              label="未設定" 
            />
          </>}
        />
          {/* <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" /> */}
        {/* </RadioGroup> */}
      </FormControl>

      <h3>プライベート情報</h3>
      <TextInput
        fullWidth={true} label={"お住まい"} multiline={false} required={false}
        rows={1} value={userLiveIn} type={"text"} onChange={inputUserLiveIn}
      />
      <TextInput
        fullWidth={true} label={"Website/SNS"} multiline={false} required={false}
        rows={1} value={userWebsite} type={"text"} onChange={inputUserWebsite}
      />
      <TextInput
        fullWidth={true} label={"Birthday"} multiline={false} required={false}
        rows={1} value={userBirthday} type={"text"} onChange={inputUserBirthday}
      />
      <h4>ブックマーク</h4>
      {/* 一覧で表示。削除も簡単にできる。 */}
      {Object.keys(userBookmark).length != 0 
        ? <>
          {Object.keys(userBookmark).map((map) => (
            <>
              {userBookmark[map]["deleteFlag"] 
                ? <SCButtonActive
                  onClick={clickedUserBookmark}
                  value={map}
                  >
                    {userBookmark[map]["workName"]}
                </SCButtonActive>
                : <SCButtonDeactive
                  onClick={clickedUserBookmark}
                  value={map}
                  >
                    {userBookmark[map]["workName"]}
                </SCButtonDeactive>
              }
            </>
          ))}
        </>
        : <p>
        "ブックマークした作品はありません"
        {/* {userBookmark} */}
        </p>
      }    


      {/* マイページの方にも表示する　→　まずはそっちか。 */}



      <div className="center">
        <PrimaryButton
            label={"変更を確定"}
            onClick={changeButtonClicked}
        />  
      </div>

    </div>
    <Footer />
    </>
  )
}

export default mypageEdit