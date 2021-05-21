//redux-thunkを使うとこのようにasync/awaitを使える様になる。

import {signInAction ,signOutAction, updateUsersAction} from "./actions";
// import { push } from "connected-react-router";
// import { useRouter } from 'next/router'
import { auth, db, FirebaseTimestamp } from "../../firebase/index";
// import { auth, db, admindb, FirebaseTimestamp } from "../../firebase/index";
// import * as admin from 'firebase-admin';

import {isValidEmailFormat, isValidRequiredInput} from "../../components/common";
// import Link from 'next/link'

import { parseCookies, setCookie } from 'nookies'
import { AddAlarmOutlined } from "@material-ui/icons";

// var admin = require("firebase-admin");

const usersRef = db.collection('users')
const privateUserRef = db.collection('privateUsers')
// const router = useRouter()
// const usersRefAdmiin = admindb.collection('users')

//何やってんのかよくわからん
export const listenAuthState = () => {
    // const router = useRouter()
    console.log("listen auth state start")
    return async (dispatch) => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                usersRef.doc(user.uid).get()
                    .then(snapshot => {
                        const data = snapshot.data()
                        if (!data) {
                            throw new Error('ユーザーデータが存在しません。')
                        }
                        console.log(user+"*onauthStateChanged+user")
                        // Update logged in user state
                        dispatch(signInAction({
                            customer_id: (data.customer_id) ? data.customer_id : "",
                            // email: data.email,
                            isSignedIn: true,
                            // payment_method_id: (data.payment_method_id) ? data.payment_method_id : "",
                            role: data.role,
                            uid: user.uid,
                            userName: data.userName,
                        }))
                        // // backup
                        // dispatch(signInAction({
                        //     customer_id: (data.customer_id) ? data.customer_id : "",
                        //     email: data.email,
                        //     isSignedIn: true,
                        //     payment_method_id: (data.payment_method_id) ? data.payment_method_id : "",
                        //     role: data.role,
                        //     uid: user.uid,
                        //     userName: data.userName,
                        // }))
                    })
            } else {
                // dispatch(router.push('/signin'))
            }
        })
    }
}

export const signIn = (email,password,router) => {
    // const router = useRouter()    
    return async (dispatch) => {
        //Validation
        if (email=== "" || password === ""){
            alert("必須項目が未入力です");
            return false;
        }
        
        return auth.signInWithEmailAndPassword(email, password)
            .then(async (result) => {
                const userState = result.user
                console.log(JSON.stringify(userState)+'+user@signin')
                if (!userState) {
                    throw new Error('ユーザーIDを取得できません');
                }
                const userID = userState.uid
                console.log(userID+'+userID@signin')

                await db.collection('users').doc(userID).get()
                    .then(async (snapshot) => {
                        const data =snapshot.data()
                        if (!data) {
                            throw new Error('ユーザーデータが存在しません');
                        }
                        await dispatch(signInAction({
                            isSignedIn: true,
                            role: data.role,
                            uid:userID,
                            // userEmail: userState.email,
                            userName: data.userName,
                            userImage: ""
                        }))
                        // console.log(JSON.stringify({ cookiesParse })+"cookies@operations@signin bef")
                        console.log(JSON.stringify(cookiesParse)+"+cookiesParse@operations@signin before")
                        
                        setCookie(null, 'userID', userID, {
                            maxAge: 30 * 24 * 60 * 60,
                            path: '/',
                        })
                        const cookiesParse = parseCookies()
                        const cookiesDocument = document.cookie

                        // const foo_cookies = JSON.parse(JSON.stringify(cookiesParse))

                        // console.log(cookiesParse+"+cookies@operations@signin aft original")
                        // console.log(JSON.stringify(foo_cookies)+"+cookies@operations@signin aft")
                        console.log(cookiesDocument+"+cookiesDocument@operations@signin aft2")
                        console.log(JSON.stringify(cookiesParse)+"+cookiesParse@operations@signin after")

                        //Someoneもう使ってないかも...?
                        router.push({
                            pathname: '/menu/mypage',
                            query: { name: 'Someone' }
                        })
                    })
            }).catch(() => {
                alert('アカウントもしくはパスワードに誤りがあります。')
                // throw new Error(error)
            })
        
    }
}

// 20201220
export const signOut = () => {
    // return async (dispatch, getState) => {
    return async (dispatch) => {
        await auth.signOut()
        .then(async() => {
            await dispatch(signOutAction())
            //push
            console.log(JSON.stringify(parseCookies().userID)+"+parse.cookie@operations@logout")

        }).catch(() => {
            throw new Error('ログアウトに失敗しました')
        })
    }
}

export const signUp = ( userName, email, password, confirmPassword,router) => {
    // const router = useRouter() ///ここダメって言われる。onClickのなかはだめ
    return async (dispatch) => {
        var regexAtto = new RegExp(/^[a-zA-Z0-9!¥_¥]*$/)
        // var regexAtto = new RegExp(/^[a-zA-Z0-9!-/:-¥[-`{-~]*$/)

        //Validation
        // if (username === "" || email=== "" || password === "" || confirmPassword === ""){
        if(!regexAtto.test(userName)){
            alert("ユーザ名に_(アンダーバー)以外の記号は使えません")
            return false
        }

        if(!isValidRequiredInput(userName,email, password, confirmPassword)) {
            alert("必須項目が未入力です");
            return false
        }
        if (password !== confirmPassword){
            alert("パスワードが一致しません。もう一度お試しください。");
            return false
        }
        if (!isValidEmailFormat(email)) {
            // dispatch(hideLoadingAction());
            alert('メールアドレスの形式が不正です。')
            return false
        }
        if (password.length < 6) {
            alert('パスワードは6文字以上で入力してください。')
            return false
        }

        return auth.createUserWithEmailAndPassword(email, password)
            .then(async (result) => {
                const user = result.user
                console.log("auth success!!!")
                if (user) {
                    console.log("auth success222!!!")
                    const uid = user.uid
                    const timestamp = FirebaseTimestamp.now()
                    const workId = "99"
                    const workName = "dummyData"

                    const userInitialData = {
                        uid: uid,
                        userName: userName,
                        userSex: 0,//0:未登録、1:男、2:女
                        userProfile: "未登録",
                        userImage : "未登録",
                        role: "customer",
                    }
                    
                    const privateUserInitialData = {
                        uid : uid,
                        email: email,
                        // postWorksId: [],
                        userLiveIn: "未登録",
                        userWebsite: "未登録",
                        userBirthday: "未登録",
                        created_at: timestamp,
                        updated_at: timestamp,   
                    }

                    const postedWorksId = {
                        workId : workId, //ダミー値(99)
                        workName : workName, //dummyData
                        uid : uid,
                        created_at: timestamp,
                        updated_at: timestamp,
                        isPublic: false,
                        isSpoiler: false,
                    }

                    await usersRef.doc(uid).set(userInitialData)
                    .then(() => {
                        console.log("auth db success!!!")
                    }).catch((error) => {
                        alert('DB fail')
                        throw new Error(error)
                    })

                    await privateUserRef.doc(uid)
                    .set(privateUserInitialData)
                    .then(() => {
                        console.log("private auth db success!!!")
                    }).catch((error) => {
                        alert('private DB fail')
                        throw new Error(error)
                    })

                    //サブコレクション(↓)はコレクションを作った後に追加
                    await privateUserRef.doc(uid)
                    .collection('postedWorksId')
                    .doc(workId)
                    .set(postedWorksId)
                    .then(() => {
                        console.log("posted initial db success!!!")
                        router.push({
                            pathname: '/auth/signin',
                            query: {
                                email : email,
                            }}
                            )
                    }).catch((error) => {
                        alert('posted inital DB fail')
                        throw new Error(error)
                    })
                }
            }).catch((error) => {
                // dispatch(hideLoadingAction())
                alert('アカウント登録に失敗しました。もう１度お試しください。')
                throw new Error(error)
                return false
            })
    }
}

export const addPostedWork = (
    uid,
    workId,
    workName,
    isPublic,
    isSpoiler,
    workScore,
    goCheckBoxState,
    goTagCheckBoxState,
    workComment,
    firstPostFlag) => {
    return async (dispatch) => {
        //updateは連想配列に代入して変数をupdate()内に指定しないとエラーになる・・・。
        // 配列のアップデート記法はこれ。
        // var workIdObject = {}
        // workIdObject['postedWorksId.'+ workId] = new Date()
        // usersRef
        // .doc(uid)
        // .update(workIdObject)
        const timestamp = FirebaseTimestamp.now()

        let postedWorksId = {}
        
        if(firstPostFlag == 1 || firstPostFlag == 0){
            postedWorksId = {
                workId : workId,
                workName : workName,
                uid : uid,
                created_at: timestamp,
                updated_at:timestamp,
                isPublic: isPublic,
                isSpoiler: isSpoiler,
                workScore: workScore,
                assessmentCategory: goCheckBoxState,
                assessmentWorkTag : goTagCheckBoxState,
                workComment: workComment
            }
        } else {
            postedWorksId = {
                workId : workId,
                workName : workName,
                uid : uid,
                // created_at: timestamp,
                updated_at:timestamp,
                isPublic: isPublic,
                isSpoiler: isSpoiler,
                workScore: workScore,
                assessmentCategory: goCheckBoxState,
                assessmentWorkTag : goTagCheckBoxState,
                workComment: workComment
            }
        }
 
        const pubPostedWorksId = {
            workId : workId,
            workName : workName,
            uid : uid,
            isSpoiler: isSpoiler,
            workScore: workScore,
        }

        await privateUserRef.doc(uid)
        .collection('postedWorksId')
        .doc(workId)
        .set(postedWorksId)
        .then(() => {
            console.log("posted initial db success!!!")
        }).catch((error) => {
            alert('posted inital DB fail')
            throw new Error(error)
        })   

        if(isPublic){
            usersRef.doc(uid)
            .collection('pubPostedWorksId')
            .doc(workId)
            .set(pubPostedWorksId)
            .then(() => {
                console.log("PublicPost success!!")
            }).catch((error) => {
            alert('PubPosted inital DB fail')
            throw new Error(error)
        })
        }
    }
}

export const updateUsers = (uid,role,userName,userImage) => {
    console.log(userName+"+userName")
    return async(dispatch) => {
        await dispatch(updateUsersAction({
            isSignedIn: true,
            role: role,
            uid: uid,
            userName: userName,
            userImage: userImage
        }))
    }
}