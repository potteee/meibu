//redux-thunkを使うとこのようにasync/awaitを使える様になる。
import React, {useMemo} from 'react';

import {signInAction ,signOutAction, updateUsersAction} from "./actions";
import { auth, db, FirebaseTimestamp } from "../../firebase/index";
import {isValidEmailFormat, isValidRequiredInput} from "../../components/common";

import { parseCookies, setCookie } from 'nookies'
import { AddAlarmOutlined } from "@material-ui/icons";

const usersRef = db.collection('users')
const privateUserRef = db.collection('privateUsers')

export const signIn = (email,password,router) => {
    // const router = useRouter()    
    // async (dispatch) => {
    return async (dispatch) => {
        //Validation
        let signInFail = false

        if (email=== "" || password === ""){
            alert("必須項目が未入力です");
            return false;
        } 

        let gotUsersId = []
        let gotEmails = []
        //userNameでのログイン
        if(/@/.test(email)){
            console.log(email+" is email")
            gotEmails = [email]    
        } else {
            console.log(email+" is not email")
            await db.collection('users')
            .where('userName' ,'==', email).get()
            .then( async(snapshot) => {
                console.log("snapshot login user")
                console.log(snapshot)

                //同じユーザ名が存在する場合emailが複数取得される。
                //email
                snapshot.docs.map((doc) => {
                    gotUsersId = [...gotUsersId, doc.data().uid]
                })

                console.log(gotUsersId+"+gotUsersId")
                if(gotUsersId.length == 0) {
                    alert('アカウントもしくはパスワードに誤りがありますよん。')
                    signInFail = true
                }
                    // snapshot.docs[0].data().uid
                
                await Promise.all(gotUsersId.map(async(gotUserId) => {
                    await db.collection('privateUsers')
                    .where('uid' ,'==' ,gotUserId).get()
                    .then((snapshot2) => {
                        console.log("snapshot2 login user")
                        console.log(snapshot2)
                        // email = snapshot2.docs[0].data().email
                        gotEmails = [...gotEmails,snapshot2.docs[0].data().email]
                        console.log(gotEmails+" is got email")
                    }).catch((error) => {
                        alert("メールアドレス取得失敗")
                    })
                }))
            }).catch((error) => {
                // return false //ここでreturnしても戻らない。（returnした非同期処理の直下にないから？上記のawait の前にreturnつけると戻る。)
                alert('アカウントもしくはパスワードに誤りがありますよ。')
                signInFail = true
                // throw new Error("you could not getting account")
                // throw new Error(error)
            })
        }

        console.log(gotEmails+"+got emails")
        console.log(gotEmails[0]+"+got emails[0]")
        console.log(signInFail+"+signInFail")

        if(signInFail){
            return false
        }

        let emailsQua = 0
        let signinSucCount = 0
        let signinResult = true

        if(gotEmails.length != 0){
            for(let i = 0;i <= gotEmails.length;i++){
                emailsQua++
                console.log(gotEmails[i]+"+email in map")

                // signinResult = await auth.signInWithEmailAndPassword(gotEmails[i], password)
                // console.log("signinResult")
                // console.log(signinResult)
                // return signinResult

                try {
                    await auth.signInWithEmailAndPassword(gotEmails[i], password)
                    console.log("successed signin")
                    signinSucCount++
                    await auth.signOut()
                    .then(() => {
                        console.log("successed signout in signin")
                        email = gotEmails[i]
                    })
                    .catch((error) => {
                        console.log("fail signout in signin")
                    })
                    // return true
                } catch {
                    console.log("pre login error")
                    console.log(signinSucCount+"+signinSuccount")
                    console.log(gotEmails.length+"+gotEmails.length")
                    console.log(emailsQua+"+emailsQua")
                    //配列が最後まで回ったにもかかわらず、一度も成功パターンに入らなかった場合。→パスワードに誤りがあるということ。
                    if(emailsQua == gotEmails.length && signinSucCount == 0){
                        alert('アカウントもしくはパスワードに誤りがあります。')
                        // throw new Error(error)
                        signInFail = true
                        // return false
                        // throw new Error(error)
                    }
                    // return false
                }
            }
        }
        //２回以上ログインに成功してしまった場合
        //emailでログインしてもらう。
        //ユーザ名とパスワードが同一のアカウントが複数存在する場合に入るルートなので、ほとんどないとと思うが。
        if(signinSucCount >= 2){
            router.push({
                pathname: '/auth/signin',
                query: { status: 'requiredMail' }
            })
            return false
        } 

    　　if(signInFail){
            return false
        }
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

        return await auth.signInWithEmailAndPassword(email, password)
        .then(async (result) => {
            const userState = result.user
            console.log(JSON.stringify(userState)+'+user@signin')
            if (!userState) {
                throw new Error('ユーザーIDを取得できません');
                // return false
                signInFail = true
            } else {
                const userID = userState.uid
                console.log(userID+'+userID@signin')
                console.log(email+'+email')

                return await db.collection('users').doc(userID).get()
                .then(async (snapshot) => {
                    const data = snapshot.data()
                    if (!data) {
                        throw new Error('ユーザーデータが存在しません');
                        // return false  
                        signInFail = true
                    }

                    await setCookie(null, 'userID', userID, {
                        maxAge: 30 * 24 * 60 * 60,
                        path: '/',
                    })
                    const cookiesParse = parseCookies()
                    const cookiesDocument = document.cookie

                    console.log(JSON.stringify(cookiesParse)+"+cookiesParse@operations@signin before")
                    console.log(cookiesDocument+"+cookiesDocument@operations@signin aft2")
                    console.log(JSON.stringify(cookiesParse)+"+cookiesParse@operations@signin after")

                    // await dispatch(signInAction({
                    //解決前にpushしてしまった方がいい。これを待ってしまうと、signInのページで再レンダリングされてしまう場合がある。
                    dispatch(signInAction({
                        isSignedIn: true,
                        role: data.role,
                        uid:userID,
                        // userEmail: userState.email,
                        userName: data.userName,
                        userImage: ""
                    }))

                    //Someoneもう使ってないかも...?
                    router.push({
                        pathname: '/menu/mypage',
                        query: { name: 'Someone' }
                    })

                    return true
                })
            }
        })
    }
}

// 20201220
export const signOut = () => {
    // return async (dispatch, getState) => {
    return async (dispatch) => {
        // auth.signOut()
        await auth.signOut()
        .then(async() => {
            // dispatch(signOutAction())
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
                        userBookmark: [],
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
                // throw new Error(error)
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
                workScore: workScore ? workScore : -1,
                // assessmentCategory: goCheckBoxState,
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
                workScore: workScore ? workScore : -1,
                // assessmentCategory: goCheckBoxState,
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
        .set(
            postedWorksId,
            {merge : true}
        )
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
        } else {
            usersRef.doc(uid)
            .collection('pubPostedWorksId')
            .doc(workId)
            .delete()
            .then(() => {
                console.log("PublicPost delete success!!")
            }).catch((error) => {
            alert('PubPosted delete DB fail')
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