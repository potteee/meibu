import React,{useCallback, useState, useEffect} from "react"

import { TextInput,PrimaryButton,RadioButton } from "../../styles/UIkit"
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

import Link from 'next/link'

import {useDispatch,useSelector} from "react-redux"
import {getUserId, getUserName, getRole, getUserImage, getUserLiveIn, getUserBookmark, getUserSex,getUserProfile,getUserWebsite, getUserEmail, getUserBirthday} from '../../reducks/users/selectors'
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

  //// from Redux
  const uid = getUserId(selector)  
  const userEmail = getUserEmail(selector)

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
        [userBookmark, setUserBookmark] = useState(getUserBookmark(selector))

  const userBookmarkOrigin = getUserBookmark(selector)

  const [privateChangeFlag, setPrivateChangeFlag] = useState(false),
        [publicChangeFlag, setPublicChangeFlag] = useState(false)

  //public
  const inputUserName = useCallback((event) => {
    setUserName(event.target.value)
    setPublicChangeFlag(true)
  },[])
  
  const inputUserProfile = useCallback((event) => {
    setUserProfile(event.target.value)
    setPublicChangeFlag(true)
  },[])
  
  const checkUserSex = useCallback((event) => {
    setUserSex(event.target.value)
    setPublicChangeFlag(true)
  },[])
  
  //private
  const inputUserLiveIn = useCallback((event) => {
    setUserLiveIn(event.target.value)
    setPrivateChangeFlag(true)
  },[])

  const inputUserWebsite = useCallback((event) => {
    setUserWebsite(event.target.value)
    setPrivateChangeFlag(true)
  },[])

  const inputUserBirthday = useCallback((event) => {
    setUserBirthday(event.target.value)
    setPrivateChangeFlag(true)
  },[])
  
  const clickedUserBookmark = useCallback((e) => {
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
    setPrivateChangeFlag(true)
  },[])

  // console.log(JSON.stringify(selector)+"+selector2@mypage")
  console.log(JSON.stringify(selector.users,null,2)+"+selector.users@mypage")
  console.log(userBookmark+"userBookmark2")
  
  const changeButtonClicked = async() => {
    if(publicChangeFlag == true || privateChangeFlag == true){
      const timestamp = FirebaseTimestamp.now()

      let updateUserBookmark = {}

      Object.keys(userBookmark).map((map) => {
        if(!userBookmark[map]["deleteFlag"]){
          updateUserBookmark = {...updateUserBookmark , [map] :userBookmarkOrigin[map]}
          console.log(userBookmarkOrigin[map]+" is alived")
        } else {
          console.log(userBookmarkOrigin[map]+" is deleted")
        }
      })
      
      const userRedux = {
        userName: userName,
        userImage: userImage,
        userSex: userSex,
        userProfile: userProfile, // ?????????????????? : ?????????
        userEmail: userEmail, // ????????? : kanoko2@example.com
        userLiveIn: userLiveIn,// ???????????? : ?????????
        userWebsite: userWebsite, // Web/SNS : ?????????
        userBirthday: userBirthday,// ????????? : ?????????
        userBookmark: updateUserBookmark,// ??????????????????????????????
      }

      console.log("userRedux")
      console.log(JSON.stringify(userRedux,null,2))

      await Promise.all([
        db.collection('users').doc(uid).update({
          userName: userName,
          userSex: userSex,
          userProfile: userProfile,
          userImage: userImage,
        }).then((snapshot) => {
          return snapshot
        }).catch((error) => {
          alert('??????????????????????????????????????????????????????')
          throw new Error(error)
        }),
        db.collection('privateUsers').doc(uid).update(
          {
            email: userEmail,
            userLiveIn: userLiveIn,
            userWebsite: userWebsite,
            userBirthday: userBirthday,
            userBookmark : updateUserBookmark,
            // created_at: timestamp,
            updated_at: timestamp,
          }
        ).then((snapshot) => {
          return snapshot
        }).catch((error) => {
          alert('?????????????????????????????????????????????????????????')
          throw new Error(error)
        }),
        dispatch(updateUsers(userRedux))
      ])

      router.push('/menu/mypage')

    } else {
      console.log("Didnt update publicUserData ")
      alert("???????????????????????????")
      router.push('/menu/mypage')
    }
  }

  return(
    <>
    <ApplicationBar title="?????????????????????"/>
    <div className="c-section-container">
      <h2 className="u-text__headline u-text-center">mypage??????</h2>
      <div className="module-spacer--medium" />
      <h3>?????????????????????</h3>
      <TextInput
        fullWidth={true} label={"????????????"} multiline={false} required={true}
        rows={1} value={userName} type={"text"} onChange={inputUserName}
      />
      <TextInput
        fullWidth={true} label={"??????????????????"} multiline={true} required={false}
        rows={1} value={userProfile} type={"text"} onChange={inputUserProfile}
      />
      <FormControl component="fieldset">
        <FormLabel component="legend">Gender</FormLabel>
        <RadioButton name={"gender1"} value={userSex} onChange={checkUserSex}
          label={<>
            <FormControlLabel 
              value="1"
              control={<Radio />}
              label="??????" 
            />
            <FormControlLabel
              value="2" 
              control={<Radio />}
              label="??????" 
            />
            <FormControlLabel
              value="0"
              control={<Radio />}
              label="?????????" 
            />
          </>}
        />
      </FormControl>

      <h3>????????????????????????</h3>
      <TextInput
        fullWidth={true} label={"????????????"} multiline={false} required={false}
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
      <h4>??????????????????</h4>
      {Object.keys(userBookmark).length != 0 
        ? <>
          {Object.keys(userBookmark).map((map) => (
            <>
              {!userBookmark[map]["deleteFlag"] 
                ?<SCButtonActive
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
        "????????????????????????????????????????????????"
        </p>
      }    
      <div className="center">
        <PrimaryButton
            label={"???????????????"}
            onClick={changeButtonClicked}
        />  
      </div>

    </div>
    <Footer />
    </>
  )
}

export default mypageEdit