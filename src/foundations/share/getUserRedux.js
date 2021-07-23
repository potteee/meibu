import React from 'react'

import { db } from "../../firebase/index"

//DBからReduxで使用するデータを取得する。
//ランディング時、リロード時のみ通る。
const GetUserRedux = async(userID) => {
    const snapshots = await Promise.all([
        db.collection('users').doc(userID).get()
        .then((snapshot) => {
            return snapshot
        }).catch((error) => {
            alert('usersの取得に失敗しました')
            throw new Error(error)
        }),
        db.collection('privateUsers').doc(userID).get()
        .then((snapshot) => {
            return snapshot
        }).catch((error) => {
            alert('privateUsersの取得に失敗しました')
            throw new Error(error)
        }),
        db.collection('privateUsers').doc(userID)
        .collection('postedWorksId').where("workId","!=","99").get()
        .then((snapshot) => {
            return snapshot
        }).catch((error) => {
            alert('postedWorksIdの取得に失敗しました')
            throw new Error(error)
        })
    ])

    console.log(snapshots+"+snapshots")
        
    const snapshotUsers = snapshots[0]
    const snapshotPrivate = snapshots[1]
    const snapshotPosted = snapshots[2]

    const usersData = snapshotUsers.data()
    console.log(JSON.stringify(usersData)+"+usersData@app")
    if (!usersData) {
        throw new Error('ユーザーデータが存在しません');
    }

    const privateData = snapshotPrivate.data()
    console.log(JSON.stringify(privateData)+"+privateData@app")
    if (!privateData) {
        throw new Error('ユーザーデータが存在しません');
    }

    if(!snapshotPosted){
        throw new Error('ユーザ投稿が存在しません');
    }
    let postedWorksIds = {}
    snapshotPosted.forEach((doc) => {
        postedWorksIds = {...postedWorksIds , [doc.id] : { workName : doc.data().workName , workMedia : doc.data().workMedia } }
    })

    const userRedux = {
        isSignedIn: true,
        role: usersData.role,
        uid:userID,
        userName: usersData.userName,
        userImage: usersData.userImage,

        userSex: usersData.userSex,
        userProfile: usersData.userProfile, // プロフィール : 未登録
        userEmail: privateData.email, // メール : kanoko2@example.com
        userLiveIn: privateData.userLiveIn,// お住まい : 未登録
        userWebsite: privateData.userWebsite, // Web/SNS : 未登録
        userBirthday: privateData.userBirthday,// 誕生日 : 未登録
        userAssessmentWorks: postedWorksIds,// 評価を投稿した作品：
        userBookmark: privateData.userBookmark,// ブックマークした作品
    }

    console.log(JSON.stringify(userRedux)+"+usrRedux@J")

    return userRedux
}

export default GetUserRedux
