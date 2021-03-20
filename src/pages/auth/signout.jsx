import Header from '../../components/header'
import Footer from '../../components/footer'
import {signOut} from "../../reducks/users/operations";
import { PrimaryButton } from "../../styles/UIkit"
import {useDispatch,useSelector} from "react-redux";
import { useRouter } from 'next/router'
import { destroyCookie } from 'nookies'

const SignOut = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { hist } = router.query
  const uid = useSelector(state => state)
  // const { uid } = useSelector(state => state)
  console.log(hist+"+hist@signout");

  
  const signButtonClicked = async() => {
      console.log(JSON.stringify({uid})+"+JSS.uid@SignOut");

      //dispatchすると_appが呼ばれてしまうっぽいので(awaitしても中身の処理の前に)
      //事前にCookieを削除して_app内の間違った分岐を回避。
      await destroyCookie(null,'userID',{path: '/',})
      await dispatch(signOut())
    if(hist == "Signup"){
      router.push('/auth/signup');
    } else {
      router.push('/auth/signin');
    }
      // router.push('/');
  }

  return(
  <>
    <Header />

    {hist == "Signup" && (
      <a>サインアップするには、一度ログアウトしてください。</a>
    )}
    {hist == "Signin" && (
      <a>ログインするには、一度ログアウトしてください。</a>
    )}

    <h1>SignOut</h1>

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

export default SignOut