import React, {useState, useCallback,useEffect} from 'react';
import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'
import { CSHighLightBar } from "src/styles/SC/shared/typografy/highLightBar"
import ButtonPrimary from "src/components/ButtonPrimary";
import ButtonScondary from "src/components/ButtonSecondary";

import Grid from "@mui/material/Grid"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"

import {useDispatch} from "react-redux";
import {signIn} from "../../reducks/users/operations";
// import {push} from "connected-react-router"

import { useRouter } from 'next/router'

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  // const uid = useSelector(state => state)
  const { hist,searchWord,infoMedia,workId,firstPostFlag} = router.query
  const oriQuery = router.asPath //URL取得。pathnameだと[id](str)で取得してしまう

  const classes = {
    mainGrid : {
      position : "flex",//あってもなくても同じ
      justifyContent : "center",
      width : "90%",
      margin : "10px 0 10px 20px",
      maxWidth : "700px",
      flexDirection:"column",
    },
    titleBarStyle : {
      justifyContent : "flex-start",
      margin : "42px 0 10px -2px",
    },
    nodalStyle : {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      // width: 400,
      width: '81%',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      // boxShadow: 24,
      p: 4,
      // outline : 0,
    },
    NodalTypo : { 
      // alignItem : "center",
      // align : "center",
    }
  }

  const query = /\?/.test(oriQuery) ? oriQuery.split('?')[1] : null
  console.log(query+"+query")

  let tmpEmail = ""
  let qStatus = ""

  if(query){
    tmpEmail = /email=/.test(query) ? query.split('email=')[1] : ""
    tmpEmail = /\&/.test(tmpEmail) ? tmpEmail.split('&')[0] : tmpEmail
    qStatus = /status=/.test(query) ? query.split('status=')[1] : null
    qStatus = /\&/.test(qStatus) ? qStatus.split('&')[0] : qStatus
  }

  console.log(tmpEmail+"+tmpEmail")
  console.log(qStatus+"+qStatus")

  console.log(decodeURIComponent(tmpEmail)+"+tmpEmail")

  const [signinPush,setSigninPush] = useState(false)

  const [email, setEmail] = useState(decodeURIComponent(tmpEmail))
  const [password, setPassword] = useState("")

  const [modalOpen, setModalOpen] = useState(false);
  // const modalHandleOpen = () => setModalOpen(true);
  const modalHandleClose = () => setModalOpen(false);

  const inputEmail = useCallback((e) => {
      setEmail(e.target.value)
  },[]);

  const inputPassword = useCallback((e) => {
      setPassword(e.target.value)
  },[]);

  //useCallbackに入れてあげないと、dispatch(signInAction...のところで再レンダリングされる。
  const signInModule = useCallback(async(email,password, router) => {
    return await dispatch(signIn(email, password, router,hist,searchWord,infoMedia,workId,firstPostFlag))
  },[]);


  const signinButtonClicked = async() => {
    setSigninPush(true)
    console.log(email+"+email,"+password+"+password,"+router+"+router")

    const signinResult = await signInModule(email, password, router)

    console.log(signinResult+"+sigininResult")
    if(!signinResult){
      setSigninPush(false)
    }
  }

  const simpleSignupButtonClicked = () => {
    console.log("simpleSignupButtonClicked")
  }

  const signupButtonClicked = async() => {
    console.log("signupButtonClicked")
    await router.push({
      pathname: '/auth/signup',
      query: { 
        hist : hist,
        searchWord : searchWord,
        infoMedia : infoMedia,
        workId : workId,
        firstPostFlag : firstPostFlag,
      },
    })
  }

  useEffect(() => {
    if(hist === "succeedSignUp"){
      setModalOpen(true)
    }
  },[])

  if(signinPush){
    return <>loading...singin...</>
  } else {
    return (
      <>
        <ApplicationBar title="ログイン"/>

        <CSHighLightBar>ログイン</CSHighLightBar>

        <Grid container xs={12} 
          sx={classes.mainGrid}
        >
          <Grid item xs={11}>
            {qStatus == "requiredMail" 
            ?(
              <>
              <a>申し訳ございません。メールアドレスを入力してログインしてください</a>
              <TextField
                  fullWidth={true} label={"メールアドレス"} multiline={false} required={true} 
                  variant={"standard"}
                  rows={1} value={email} type={"text"} onChange={inputEmail}
              />
              </>
              )
            :(
              <TextField
                  fullWidth={true} label={"メールアドレス/ユーザ名"} multiline={false} required={true}
                  variant={"standard"}
                  rows={1} value={email} type={"text"} onChange={inputEmail}
              />)
            }
          </Grid>
          <Grid item xs={11}>
            <TextField
                fullWidth={true} label={"パスワード"} multiline={false} required={true}
                variant={"standard"}
                rows={1} value={password} type={"password"} onChange={inputPassword}
            />
          </Grid>
        </Grid>

        {/* <Grid container item xs={12} sx={classes.buttonStyle}> */}
        {/* sxを適用したGridでButtonを囲うとApplyCationBar押下時表示がおかしくなる */}
        <ButtonPrimary label={"ログイン"} onClick={signinButtonClicked} />
        {/* </Grid> */}

        {hist !== "succeedSignUp"
          ? <>
            <CSHighLightBar>アカウント作成</CSHighLightBar>

            <ButtonScondary label={"かんたんアカウント登録(未実装)"} onClick={simpleSignupButtonClicked}/>
            <ButtonPrimary label={"こだわりアカウント登録"} onClick={signupButtonClicked}/>
          </>
          : null
        }
        <Footer />

        <div>
          <Modal
            open={modalOpen}
            onClose={modalHandleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={classes.nodalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2" align="center" sx={classes.NodalTypo}>
                {`アカウント登録に`}
              </Typography>
              <Typography id="modal-modal-title" variant="h6" component="h2" align="center" sx={classes.NodalTypo}>
                {`成功しました！`}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 1.8 }}  align="center">
                早速ログインしてみましょう！
              </Typography>
            </Box>
          </Modal>
        </div>
      </>
    )
  }
}

export default SignIn
