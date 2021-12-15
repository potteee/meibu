//redux-thunkを使うとこのようにasync/awaitを使える様になる。
import React, {useMemo} from 'react';

import {signInAction ,signOutAction, updateUsersAction,postWorksAction} from "./actions";
import { db } from "../../firebase/index";
import {isValidEmailFormat, isValidRequiredInput} from "../../foundations/share/common";

import { parseCookies, setCookie } from 'nookies'
import GetUserRedux from '../../foundations/share/getUserRedux';
import { useSelector } from 'react-redux';

import { collection, doc, query, where, getDocs ,getDoc ,setDoc, updateDoc ,Timestamp,deleteDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

// const usersRef = db.collection('users')
const usersRef = collection(db, "users");
// const privateUserRef = db.collection('privateUsers')
const privateUserRef = collection(db ,"privateUsers")
// const privateUserRef = query(collection(db ,"privateUsers")) //whereとか使わなければqueryで囲う必要はない。

const timestamp = Timestamp.now()


export const signIn = (
    email,
    password,
    router,
    hist,
    searchWord,
    infoMedia,
    workId,
    firstPostFlag) => {
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
            await getDocs(query(
                collection(db, 'users'),
            // await db.collection('users')
                // .where('userName' ,'==', email).get()
                where('userName' ,'==', email)
            ))
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
                    // await db.collection('privateUsers')
                    await getDocs(query(
                        collection(db,'privateUsers'),
                        where('uid' ,'==' ,gotUserId)
                    ))
                    // .where('uid' ,'==' ,gotUserId).get()
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
            for(let i = 0;i < gotEmails.length;i++){
            // for(let i = 0;i <= gotEmails.length;i++){
                emailsQua++
                console.log(gotEmails[i]+"+email in map")

                // signinResult = await auth.signInWithEmailAndPassword(gotEmails[i], password)
                // console.log("signinResult")
                // console.log(signinResult)
                // return signinResult

                try {
                    // await auth.signInWithEmailAndPassword(gotEmails[i], password)
                    await signInWithEmailAndPassword(auth, gotEmails[i], password)
                    .then(() => {
                        console.log("successed signin")
                    })
                    .catch((error) => {
                        console.log("fail signout in signin")
                        alert(error)
                    })
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
                query: { 
                    status: 'requiredMail',
                    searchWord: searchWord,
                    infoMedia: infoMedia,
                    workId: workId,
                    firstPostFlag : firstPostFlag,
                    hist: hist,
                }
            })
            return false
        } 
        if(signInFail){
            return false
        }
        // return await auth.signInWithEmailAndPassword(email, password)
        return await signInWithEmailAndPassword(auth, email, password)
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
                const userRedux = await GetUserRedux(userID)
                
                await setCookie(null, 'userID', userID, {
                    maxAge: 60 * 60 * 24 * 30 * 12 * 5, //5年はログイン状態が保持される。
                    path: '/',
                })
                console.log(JSON.stringify(userRedux)+"+usrRedux@J")
                
                dispatch(signInAction(userRedux))

                console.log(hist,searchWord+"+hist,searchWord")
                
                router.push({
                    pathname: hist != "Posting" ? '/menu/mypage' : '/post/posting',
                    query: { 
                        searchWord: searchWord ,
                        infoMedia : infoMedia,
                        workId : workId,
                        firstPostFlag : firstPostFlag,                        
                        // searchWord: searchWord,
                        // firstPostFlag : 1,
                        hist: "SignIn" ,
                    }
                })
                
                return true
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

export const signUp = ( 
    userName, 
    email, 
    password, 
    confirmPassword,
    router,
    hist,
    searchWord = "searchWordDummy",
    infoMedia = "infoMediaDummy",
    workId = 99,
    firstPostFlag
    ) => {
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

        // return auth.createUserWithEmailAndPassword(email, password)
        return createUserWithEmailAndPassword(auth, email, password)
        .then(async (result) => {
            const user = result.user
            console.log("auth success!!!")
            if (user) {
                console.log("auth success222!!!")
                const uid = user.uid
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
                    userLiveIn: "未登録",
                    userWebsite: "未登録",
                    userBirthday: "未登録",
                    userBookmark: {},
                    created_at: timestamp,
                    updated_at: timestamp,   
                }

                await Promise.all([
                    setDoc(doc(usersRef ,uid) ,userInitialData)
                    .then(() => {
                        console.log("auth db success!!!")
                    }).catch((error) => {
                        alert('DB fail')
                        throw new Error(error)
                    })
                    ,
                    setDoc( doc(privateUserRef ,uid) ,privateUserInitialData)
                    // privateUserRef.doc(uid).set(privateUserInitialData)
                    .then(() => {
                        console.log("private auth db success!!!")
                    }).catch((error) => {
                        alert('private DB fail')
                        throw new Error(error)
                    })
                ])
                router.push({
                    pathname: '/auth/signin',
                    query: { 
                        email : email,
                        hist: "succeedSignUp" ,///////////////ここ修正星
                    }
                })
            }
        }).catch((error) => {
            // Error Codes
            // auth/email-already-in-use
            //     Thrown if there already exists an account with the given email address.
            // auth/invalid-email
            //     Thrown if the email address is not valid.
            // auth/operation-not-allowed
            //     Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.
            // auth/weak-password
            //     Thrown if the password is not strong enough.
            if(error.code == "auth/email-already-in-use"){
                alert('既に使用されているメールアドレスです。')
            } else {
                alert('アカウント登録に失敗しました。もう１度お試しください。')
            }
            // throw new Error(error)
            console.log(error+error.code+"signup error")
            return false
        })
    }
}

export const addPostedWork = (
    uid,
    workId,
    workName,
    workMedia,
    isPublic,
    isSpoiler,
    isLiked,
    workScore,
    workWatchYear,
    workWatchTimes,
    goCheckBoxState,
    goTagCheckBoxState,
    workComment,
    firstPostFlag) => {
    return async (dispatch) => {
        // const timestamp = Timestamp.now()

        let postedWorksId = {}
        
        if(firstPostFlag == 1 || firstPostFlag == 0){
            postedWorksId = {
                workId : workId,
                workName : workName,
                workMedia : workMedia,
                uid : uid,
                created_at: timestamp,
                updated_at: timestamp,
                isPublic: isPublic,
                isLiked : isLiked,
                isSpoiler: isSpoiler,
                workScore: workScore ? workScore : -1,
                workWatchYear : workWatchYear,
                workWatchTimes : workWatchTimes,
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
                isLiked : isLiked,
                isSpoiler: isSpoiler,
                workScore: workScore ? workScore : -1,
                workWatchYear : workWatchYear,
                workWatchTimes : workWatchTimes,
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
            isLiked : isLiked,
            workScore: workScore,
            workWatchYear : workWatchYear,
            workWatchTimes : workWatchTimes,
        }

        const userAssessmentWorks = {
            [workId] : {
                workName : workName,
                workMedia : workMedia,
                isPublic : isPublic,
                isLiked : isLiked,
            }
        }

        // await privateUserRef.doc(uid).collection('postedWorksId').doc(workId).set(postedWorksId,{merge : true})
        await setDoc(doc(privateUserRef ,uid ,'postedWorksId' ,workId ),postedWorksId,{merge : true})
        .then(() => {
            console.log("posted initial db success!!!")
        }).catch((error) => {
            alert('posted inital DB fail')
            throw new Error(error)
        })

        if(isPublic){
            // usersRef.doc(uid).collection('pubPostedWorksId').doc(workId).set(pubPostedWorksId)
            setDoc(doc(usersRef ,uid ,'pubPostedWorksId' ,workId) ,pubPostedWorksId)
            .then(() => {
                console.log("PublicPost success!!")
            }).catch((error) => {
                alert('PubPosted inital DB fail')
                throw new Error(error)
            })
        } else {
            // usersRef.doc(uid).collection('pubPostedWorksId').doc(workId).delete()
            deleteDoc(doc(usersRef, uid, 'pubPostedWorksId', workId))
            .then(() => {
                console.log("PublicPost delete success!!")
            }).catch((error) => {
                alert('PubPosted delete DB fail')
                throw new Error(error)
            })
        }

        const instantChangedWorkId = {
            [workId] : {timestamp : timestamp},
        }

        await dispatch(
            postWorksAction(
                userAssessmentWorks,
                instantChangedWorkId,
            )
        )
    }
}

export const likedWork = (userAssessmentWorks) => {
    // const timestamp = Timestamp.now()

    const instantChangedWorkId = {
        [Object.keys(userAssessmentWorks)[0]] : {timestamp : timestamp},
        // workId : workId,
        // timestamp : timestamp,
    }   

    return async (dispatch) => {
        await dispatch(
            postWorksAction(
                userAssessmentWorks,
                instantChangedWorkId,
            )
        )
    }
}

//MypageEditでユーザ情報が編集された場合
// export const updateUsers = (uid,role,userName,userImage) => {
export const updateUsers = (userRedux) => {
    // const selector = useSelector((state) => state) //dispatchされてるからここでは呼べない（多分）
    return async(dispatch) => {
        // userRedux = {...selector.users,...userRedux}
        // console.log(userRedux+"userRedux")
        await dispatch(updateUsersAction(userRedux))
    }
}
export const updateUsersWithSignIn = (userRedux) => {
    return async(dispatch) => {
        await dispatch(signInAction(userRedux))
    }
}

export const deleteAssessment = (assessmentWorks) => {
    return async(dispatch) => {
        await dispatch(deleteAssessmentAction(assessmentWorks))
    }
}