// speedDialPosting.js

import React from 'react' 
import firebase from 'firebase/app';

const handlerPosting = async({ query: { uid }, body: dBody}, res) => {
  console.log("apiStart");
  var admin = require("firebase-admin");
  console.log(uid+"+uid api");
  console.log(dBody+"+dBody")

  const initialized = admin.apps.some(app => app.name === "adminSDK");
  
  if(initialized){

    admin.app('adminSDK')
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(
        {
          "type": process.env.NEXT_PUBLIC_TYPE,
          "project_id": process.env.NEXT_PUBLIC_PROJECT_ID,
          "private_key_id": process.env.NEXT_PUBLIC_PRIVATE_KEY_ID,
          "private_key": process.env.NEXT_PUBLIC_PRIVATE_KEY,
          "client_email": process.env.NEXT_PUBLIC_CLIENT_EMAIL,
          "client_id": process.env.NEXT_PUBLIC_CLIENT_ID,
          "auth_uri": process.env.NEXT_PUBLIC_AUTH_URI,
          "token_uri": process.env.NEXT_PUBLIC_TOKEN_URI,
          "auth_provider_x509_cert_url": process.env.NEXT_PUBLIC_AUTH_PROVIDER_X509_CERT_URL,
          "client_x509_cert_url": process.env.NEXT_PUBLIC_CLIENT_X509_CERT_URL
        }
      )
    }, 'adminSDK');
  }
  
  const FirestoreSDK = admin.app('adminSDK').firestore()

  //定義部
  let ODB = JSON.parse(dBody)
  console.log("ODB")
  console.log(ODB)
  // let allayDBody = Object.keys(JSON.parse(dBody))

  console.log(ODB+"+++allayDBody")
  const timestamp = admin.firestore.FieldValue.serverTimestamp()
  // const timestamp = firebase.firestore.FirebaseTimestamp.now()

  const wInfoRef = FirestoreSDK.collection('wInfo').doc(ODB.workId)
  const assessmentRef = FirestoreSDK.collection('wInfo').doc(ODB.workId).collection('assessment').doc(uid)
  const privateUserRef = FirestoreSDK.collection('privateUsers').doc(uid).collection('postedWorksId').doc(ODB.workId)
  const pubPostedRef = FirestoreSDK.collection('users').doc(uid).collection('pubPostedWorksId').doc(ODB.workId)

  // let assessment = {}
  // let pubPostedWorksId = {}
  const assessment = {
    uid　: uid,
    userName : ODB.userName,
    // assessmentCategory : checkBoxState,
    updateTime : timestamp,
    // updateTime : new Date(),
    workScore : ODB.workScore, // -1は初期値
    workComment : ODB.workComment,
    workTag : ODB.workTag,
    // isPublic : isPublic,
    isLiked : ODB.isLiked,
    isSpoiler : ODB.isSpoiler,
    worksLikedCount : ODB.worksLikedCount,
    assessmentComment : ODB.assessmentComment,
  }

  const pubPostedWorksId = {
    workId : ODB.workId,
    workName : ODB.workName,
    uid : uid,
    isSpoiler: ODB.isSpoiler,
    isLiked : ODB.isLiked,
    workScore: ODB.workScore,
  }

  const postedWorksId = {
    assessmentWorkTag : ODB.assessmentWorkTag,
    created_at : timestamp,
    updated_at : timestamp,
    workId : ODB.workId,
    workName : ODB.workName,
    uid : uid,
    isLiked : ODB.isLiked,
    isSpoiler: ODB.isSpoiler,
    isPublic: ODB.isPublic,
    workScore: ODB.workScore,
    workComment : ODB.workComment,
  }

　//処理部
  wInfoRef.get()
  .then((wInfoSnapshot) => {
    console.log(JSON.stringify(wInfoSnapshot.data())+"+wInfoSnapshot.data()@J")
    privateUserRef.get()
    .then(async(privateUserSnapshot) => {
      if(ODB.firstPostFlag == 1){ //新規登録 (likeが押された時はありえない処理)
        console.log("firstPostFlag is 1")

      } else if(ODB.firstPostFlag == 0) { //他人評価 自分評価なし
        console.log("firstPostFlag is 0")
        if(ODB.hist == "liked"){
          console.log("hist is liked")
          try { 
            console.log(wInfoSnapshot.data()["winfoLikedCount"])
            await wInfoRef.update({
              winfoLikedCount : wInfoSnapshot.data()["winfoLikedCount"] ? wInfoSnapshot.data()["winfoLikedCount"] + 1 : 1 ,
              winfoCount : wInfoSnapshot.data()["winfoCount"] + 1
            })
            console.log("fin wInfoRef")
            console.log(wInfoSnapshot.data()["winfoLikedCount"])

            if(ODB.isPublic == true) {
              await assessmentRef.set(
                assessment
              )
              console.log("fin assessmentRef")
              await pubPostedRef.set(
                pubPostedWorksId
              )
              console.log("fin pubPostedRef")
            } else {
              console.log("skip privateUserRef")
              console.log("skip assessmentRef")
            }

            await privateUserRef.set(
              postedWorksId
            )

            console.log("fin privateUserRef")
            console.log("finish FPF:0 liked")

            res.status(200).json({status:true})
          } catch {
            res.json(506).json({status:"error"})
          }
        } else {
          console.log("hist is not liked")
          //今は移管前なのでここのルートには入ることはありえない。
        }
      } else if(ODB.firstPostFlag == 2) { //既に評価済み
        console.log("firstPostFlag is 2")
        if(ODB.hist == "liked"){
          console.log("hist is liked")
          //既に(前回投稿時に)Likeが押されていた場合
          console.log(privateUserSnapshot.data()["isLiked"])

          if(privateUserSnapshot.data()["isLiked"] && privateUserSnapshot.data()["isLiked"] == true){
            console.log("already liked")
            res.status(200).json({status:"already liked"})
          } else {
            try { 
              console.log(wInfoSnapshot.data()["winfoLikedCount"])
              await wInfoRef.update({
                //この三項演算子は本来いらない。（古いデータにフィールドがないから現状は必要）
                winfoLikedCount : wInfoSnapshot.data()["winfoLikedCount"] ? wInfoSnapshot.data()["winfoLikedCount"] + 1 : 1 ,
                // winfoCount : wInfoSnapshot.data()["winfoCount"] ? wInfoSnapshot.data()["winfoCount"] + 1 : 1
              })
              console.log("fin wInfoRef")
              console.log(wInfoSnapshot.data()["winfoLikedCount"])

              //// 初期状態と公開/秘密によって処理が異なる
              
              if(privateUserSnapshot.data()["isPublic"] != undefined && 
                 privateUserSnapshot.data()["isPublic"] == true) {
                //データ有　公開　→　公開
                if(ODB.isPublic){
                  console.log("Dari k -> k")
                  await assessmentRef.update({
                    isLiked : true
                  })
                  console.log("fin assessmentRef")
                  await pubPostedRef.update({
                    isLiked : true
                  })
                  console.log("fin pubPostedRef")
                  await privateUserRef.update({
                    isLiked : true
                  })
                  console.log("fin privateUserRef")
                //データ有　公開　→　秘密
                } else {
                  console.log("Dari k -> h")
                  await assessmentRef.delete()
                  console.log("fin assessmentRef")
                  await pubPostedRef.delete()
                  console.log("fin pubPostedRef")
                  await privateUserRef.update({
                    isLiked : true,
                    isPublic : false
                  })
                  console.log("fin privateUserRef")
                }

              } else if (privateUserSnapshot.data()["isPublic"] != undefined && 
                         privateUserSnapshot.data()["isPublic"] == false){
                //データ有　秘密　→　公開
                if(ODB.isPublic) {
                  console.log("Dari h -> k")
                  await assessmentRef.set(
                    assessment
                  )
                  console.log("fin assessmentRef")
                  await pubPostedRef.set(
                    pubPostedWorksId
                  )
                  console.log("fin pubPostedRef")
                  await privateUserRef.update({
                    isLiked : true,
                    isPublic : true
                  })
                  console.log("fin privateUserRef")
                //データ有　秘密　→　秘密
                } else {
                  console.log("Dari h -> h")
                  await privateUserRef.update({
                    isLiked : true
                  })
                  console.log("fin privateUserRef")


                }
                //データ無  → 公開
              } else {
                //新規登録のはずだから処理書く必要ない
                　console.log("errrrrrrrrrrrrrroo")
                // if(ODB.isPublic) {
                // //データ無  → 秘密
                // } else {
                //   await privateUserRef.set(
                //     postedWorksId
                //   )
                // }              
              }

              //よくわからない残りカス。
              // if(ODB.isPublic == true) {
              //   await assessmentRef.update({
              //     isLiked : ODB.isLiked,
              //   })
              //   console.log("fin assessmentRef")
              // } else {
              //   console.log("skip assessmentRef")
              //   //assessment削除処理必要・・・？
              // }

              // await privateUserRef.update({
              //   isLiked : ODB.isLiked,
              // })

              // console.log("fin privateUserRef")
              // await pubPostedRef.update({
              //   isLiked : ODB.isLiked,
              //   isPublic: ODB.isPublic,
              // })
              // console.log("fin pubPostedRef")
              console.log("finish FPF:0 liked")

              res.status(200).json({status:"succeed"})
            } catch {
              // throw new Error(error)
              // res.json({ error })
              res.json(506).json({status:"error"})
            }
          }
        } else {
          console.log("hist is not liked")
          //今は移管前なのでここのルートには入ることはありえない。
        }
      } else {
        console.log("firstPostFlag is other")
      }
    })
    .catch((error) => {
      res.json(506).json({status:"error"})
      // throw new Error(error)
      // res.json({ error });
    })
  })
  .catch((error) => {
    res.json(506).json({status:"error"})
    // throw new Error(error)
    // res.json({ error });
  })
} 

export default handlerPosting