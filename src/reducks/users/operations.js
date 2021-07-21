//redux-thunkを使うとこのようにasync/awaitを使える様になる。
import React, {useMemo} from 'react';

import {signInAction ,signOutAction, updateUsersAction} from "./actions";
import { auth, db, FirebaseTimestamp } from "../../firebase/index";
import {isValidEmailFormat, isValidRequiredInput} from "../../foundations/share/common";

import { parseCookies, setCookie } from 'nookies'
import { AddAlarmOutlined } from "@material-ui/icons";
import GetUserRedux from '../../foundations/share/getUserRedux';

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

                // return await db.collection('users').doc(userID).get()
                // .then(async (snapshotUsers) => {
                //     const dataUsers = snapshotUsers.data()
                //     console.log(JSON.stringify(dataUsers)+"+dataUsers@J")
                //     if (!dataUsers) {
                //         throw new Error('ユーザーデータが存在しません');
                //         // return false  
                //         signInFail = true
                //     }

                //     console.log(dataUsers.uid+"dataUsers.uid")
                //     return await db.collection('privateUsers').doc(dataUsers.uid).get()
                //     .then(async (snapshotPrivateUsers) => {
                //         const dataPrivateUsers = snapshotPrivateUsers.data()
                //         console.log(JSON.stringify(dataPrivateUsers)+"+dataPrivateUsers@J")
                //         if(!dataPrivateUsers){
                //             throw new Error('プライベードユーザが存在しません');
                //             // return false  
                //             signInFail = true
                //         }
                //         return await db.collection('privateUsers').doc(dataPrivateUsers.uid)
                //         .collection('postedWorksId')
                //         .where("workId","!=","99")
                //         .get()
                //         .then(async(snapshotPostedWorksId) => {
                //             const dataPostedWorksId = snapshotPostedWorksId
                //             if(!dataPostedWorksId){
                //                 throw new Error('ユーザ投稿が存在しません');
                //                 // return false  
                //                 signInFail = true
                //             }
                //             let postedWorksIds = {}
                //             dataPostedWorksId.forEach((doc) => {
                //                 postedWorksIds = {...postedWorksIds , [doc.id] : { workName : doc.data().workName , workMedia : doc.data().workMedia } }
                //             }) 
                //             console.log(postedWorksIds+"+postedWorksIds")
                //             // console.log((dataPostedWorksId[1]).id+"dataPostedWorksId[1].id")
                            
                //             const cookiesParse = parseCookies()
                //             const cookiesDocument = document.cookie
                //             console.log(JSON.stringify(cookiesParse)+"+cookiesParse@operations@signin before")
                //             console.log(cookiesDocument+"+cookiesDocument@operations@signin aft2")
                //             console.log(JSON.stringify(cookiesParse)+"+cookiesParse@operations@signin after")
                //             // await dispatch(signInAction({
                //                 //解決前にpushしてしまった方がいい。これを待ってしまうと、signInのページで再レンダリングされてしまう場合がある。

                //                 const userRedux = 
                //             {
                //                 isSignedIn: true,
                //                 role: dataUsers.role,
                //                 uid:userID,
                //                 // userEmail: userState.email,
                //                 userName: dataUsers.userName,
                //                 userImage: snapshotUsers.userImage,
                //                 //  ここから新規追加
                //                 userSex: snapshotUsers.userSex,
                //                 userProfile: snapshotUsers.userProfile, // プロフィール : 未登録
                //                 userEmail: dataPrivateUsers.userEmail, // メール : kanoko2@example.com
                //                 userLiveIn: dataPrivateUsers.userLiveIn,// お住まい : 未登録
                //                 userWebsite: dataPrivateUsers.userWebsite, // Web/SNS : 未登録
                //                 userBirthday: dataPrivateUsers.userBirthday,// 誕生日 : 未登録
                //                 userAssessmentWorks: postedWorksIds,// 評価を投稿した作品：
                //                 userBookmarkWorks: dataPrivateUsers.userBookmark,// ブックマークした作品
                //             }
                            
                            const userRedux = await GetUserRedux(userID)
                            
                            await setCookie(null, 'userID', userID, {
                                maxAge: 30 * 24 * 60 * 60,
                                path: '/',
                            })
                            console.log(JSON.stringify(userRedux)+"+usrRedux@J")
                            
                            dispatch(signInAction(userRedux))
                            
                            //Someoneもう使ってないかも...?
                            router.push({
                                pathname: '/menu/mypage',
                                query: { name: 'Someone' }
                            })
                            
                            return true
                //         })
                        
                //     })
                // })
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
                    const workMedia = "dummyData"

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
                        userBookmark: {},
                        created_at: timestamp,
                        updated_at: timestamp,   
                    }

                    const postedWorksId = {
                        workId : workId, //ダミー値(99)
                        workName : workName, //dummyData
                        workMedia : workMedia, //dummyData
                        uid : uid,
                        created_at: timestamp,
                        updated_at: timestamp,
                        isPublic: false,
                        isSpoiler: false,
                        isLiked : false,
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

//なんでこれここにあるんだろう。actionsにアクセスしていないのでapi配下で良さそう
export const addPostedWork = (
    uid,
    workId,
    workName,
    workMedia,
    isPublic,
    isSpoiler,
    isLiked,
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
                workMedia : workMedia,
                uid : uid,
                created_at: timestamp,
                updated_at:timestamp,
                isPublic: isPublic,
                isLiked : isLiked,
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
                isLiked : isLiked,
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
            isLiked : isLiked,
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

//MypageEditでユーザ情報が編集された場合
// export const updateUsers = (uid,role,userName,userImage) => {
export const updateUsers = (userRedux) => {
    return async(dispatch) => {
        await dispatch(updateUsersAction(userRedux))
    }
}
export const updateUsersWithSignIn = (userRedux) => {
    return async(dispatch) => {
        await dispatch(signInAction(userRedux))
    }
}
