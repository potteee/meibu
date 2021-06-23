import React,{useState} from "react"
import Header from '../../components/header'
import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'
import {signOut} from "../../reducks/users/operations";
import { PrimaryButton } from "../../styles/UIkit"
import {useDispatch,useSelector} from "react-redux";
import { useRouter } from 'next/router'
import { destroyCookie } from 'nookies'

const SignOut = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { hist } = router.query
  console.log(hist+"+hist@signout");
  const [logoutPush, setLogoutPush] = useState(false)
  
  const signButtonClicked = async() => {
    // console.log(JSON.stringify({uid})+"+JSS.uid@SignOut");

    //dispatchすると_appが呼ばれてしまうっぽいので(awaitしても中身の処理の前に)
    //事前にCookieを削除して_app内の間違った分岐を回避。

    await destroyCookie(null,'userID',{path: '/',})
    // await dispatch(signOut())
    await dispatch(signOut())
    .then(() => {
      if(hist == "Signup"){
        setLogoutPush(true)
        router.push('/auth/signup');
      } else {
        setLogoutPush(true)
        router.push('/auth/signin');
      }
    }).catch((error) => {
        alert('wInfo DB fail')
        throw new Error(error)
    })
  }

  console.log(logoutPush+"+logoutPush")

  if(logoutPush){
    return <>loading...logout...</>
  } else {
    return(
    <>
      {/* <Header /> */}
      <ApplicationBar title="ログアウト"/>

      {hist == "Signup" && (
        <a>サインアップするには、一度ログアウトしてください。</a>
      )}
      {hist == "Signin" && (
        <a>ログインするには、一度ログアウトしてください。</a>
      )}

      {/* <h1>SignOut</h1> */}

      <div className="center">
          <PrimaryButton
              label={"ログアウトする"}
              onClick={signButtonClicked}
          />
      </div>
      <Footer />
    </>
    )

  }
}

export default SignOut