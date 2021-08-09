// speedDialPosting.js => like.js

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

  // console.log(ODB+"+++allayDBody")
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
    createTime : timestamp,
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
    workMedia : ODB.workMedia,
    uid : uid,
    isLiked : ODB.isLiked,
    isSpoiler: ODB.isSpoiler,
    isPublic: ODB.isPublic,
    workScore: ODB.workScore,
    workComment : ODB.workComment,
  }

　//処理部
  const getData = await Promise.all([
    wInfoRef.get()
    .then((res) => {
      console.log("got wInfoRef")
      // console.log(res)
      const data = res.data()
      return data
    })
    .catch((error) => {
      res.json(506).json({status:error})
    }),
    
    privateUserRef.get()
    .then((res) => {
      console.log("got privateUserRef")
      // console.log(res)
      const data = res.data()
      return data
    })
    .catch((error) => {
      res.json(506).json({status:error})
    }),
  ])

  const wInfoSnapshot = getData[0]
  const privateUserSnapshot =getData[1]

  console.log(JSON.stringify(wInfoSnapshot,null,2)+"+wInfoSnapshot")
  console.log(JSON.stringify(privateUserSnapshot,null,2)+"+privateUserSnapshot")
  
  // .then((wInfoSnapshot) => {
  //   // console.log(JSON.stringify(wInfoSnapshot.data())+"+wInfoSnapshot.data()@J")
  //   .then(async(privateUserSnapshot) => {
  if(ODB.firstPostFlag == 1){ //新規登録 (likeが押された時はありえない処理)
    console.log("firstPostFlag is 1")

  } else if(ODB.firstPostFlag == 0) { //他人評価 自分評価なし
    console.log("firstPostFlag is 0")
    if(ODB.hist == "liked"){
      console.log("hist is liked")
      console.log(wInfoSnapshot["winfoLikedCount"])
      
      if(ODB.isPublic == true) {
        console.log("isPublic true")
        await Promise.all([
          wInfoRef.update({
            winfoLikedCount : wInfoSnapshot["winfoLikedCount"] ? wInfoSnapshot["winfoLikedCount"] + 1 : 1 ,
            winfoCount : wInfoSnapshot["winfoCount"] + 1
          }).then(() => {
            console.log("update wInfoRef")
          })
          .catch((error) => {
            res.json(506).json({status:error})
          }),

          privateUserRef.set(
            postedWorksId
          ).then(() => {
            console.log("set privateUserRef")
          })
          .catch((error) => {
            res.json(506).json({status:error})
          }),

          assessmentRef.set(
            assessment
          ).then(() => {
            console.log("set assessmentRef")
          })
          .catch((error) => {
            res.json(506).json({status:error})
          }),

          pubPostedRef.set(
            pubPostedWorksId
          ).then(() => {
            console.log("set pubPostedWorksId")
          })
          .catch((error) => {
            res.json(506).json({status:error})
          }),
        ])

      } else { //非公開の場合 
        console.log("isPublic false")
        await Promise.all([
          wInfoRef.update({
            winfoLikedCount : wInfoSnapshot["winfoLikedCount"] ? wInfoSnapshot["winfoLikedCount"] + 1 : 1 ,
            winfoCount : wInfoSnapshot["winfoCount"] + 1
          }).then(() => {
            console.log("update wInfoRef")
          })
          .catch((error) => {
            res.json(506).json({status:error})
          }),

          privateUserRef.set(
            postedWorksId
          ).then(() => {
            console.log("set privateUserRef")
          })
          .catch((error) => {
            res.json(506).json({status:error})
          }),
        ])
      }
      res.status(200).json({status:true})

        // await wInfoRef.update({
        //   winfoLikedCount : wInfoSnapshot.data()["winfoLikedCount"] ? wInfoSnapshot.data()["winfoLikedCount"] + 1 : 1 ,
        //   winfoCount : wInfoSnapshot.data()["winfoCount"] + 1
        // })
        // console.log("fin wInfoRef")
        // console.log(wInfoSnapshot.data()["winfoLikedCount"])
        // if(ODB.isPublic == true) {
        //   await assessmentRef.set(
        //     assessment
        //   )
        //   console.log("fin assessmentRef")
        //   await pubPostedRef.set(
        //     pubPostedWorksId
        //   )
        //   console.log("fin pubPostedRef")
        // } else {
        //   console.log("skip privateUserRef")
        //   console.log("skip assessmentRef")
        // }
        // await privateUserRef.set(
        //   postedWorksId
        // )
        // console.log("fin privateUserRef")
        // console.log("finish FPF:0 liked")
      // } catch {
      //   res.json(506).json({status:"error"})
      // }
    } else {
      console.log("hist is not liked")
      //今は移管前なのでここのルートには入ることはありえない。
    }


  } else if(ODB.firstPostFlag == 2) { //既に評価済み
    console.log("firstPostFlag is 2")
    if(ODB.hist == "liked"){
      console.log("hist is liked")
      
      //既に(前回投稿時に)Likeが押されていた場合
      if(privateUserSnapshot?.isLiked){
        // if(privateUserSnapshot.data()["isLiked"] && privateUserSnapshot.data()["isLiked"] == true){
        console.log(privateUserSnapshot["isLiked"])
        console.log("already liked")
        res.status(200).json({status:"already liked"})

      } else {
        const promise1 = () => {
          if(privateUserSnapshot?.isPublic) {
          // if(privateUserSnapshot.data()["isPublic"] != undefined && 
          //   privateUserSnapshot.data()["isPublic"] == true) {
            //データ有　公開　→　公開
            if(ODB.isPublic){
              console.log("Dari k -> k")
              assessmentRef.update({
                isLiked : true,
                updateTime : timestamp
              })
              console.log("fin assessmentRef")
              pubPostedRef.update({
                isLiked : true
              })
              console.log("fin pubPostedRef")
              privateUserRef.update({
                isLiked : true ,
                updated_at : timestamp
              })
              console.log("fin privateUserRef")
            //データ有　公開　→　秘密
            } else {
              console.log("Dari k -> h")
              assessmentRef.delete()
              console.log("fin assessmentRef")
              pubPostedRef.delete()
              console.log("fin pubPostedRef")
              privateUserRef.update({
                isLiked : true,
                isPublic : false,
                updated_at : timestamp
              })
              console.log("fin privateUserRef")
            }
  
          } else if (privateUserSnapshot["isPublic"] != undefined && 
                    privateUserSnapshot["isPublic"] == false){
            //データ有　秘密　→　公開
            if(ODB.isPublic) {
              console.log("Dari h -> k")
              assessmentRef.set(
                assessment
              )
              console.log("fin assessmentRef")
              pubPostedRef.set(
                pubPostedWorksId
              )
              console.log("fin pubPostedRef")
              privateUserRef.update({
                isLiked : true,
                isPublic : true,
                updated_at : timestamp
              })
              console.log("fin privateUserRef")
            //データ有　秘密　→　秘密
            } else {
              console.log("Dari h -> h")
              privateUserRef.update({
                isLiked : true,
                updated_at : timestamp
              })
              console.log("fin privateUserRef")
            }
            //データ無  → 公開
          } else {
            //新規登録のはずだから処理書く必要ない
            　console.log("errrrrrrrrrrrrrroo")           
          }
          console.log("finish FPF:0 liked")        
        }

        await Promise.all([
          wInfoRef.update({
            winfoLikedCount : wInfoSnapshot["winfoLikedCount"] + 1 
            // winfoCount : wInfoSnapshot.data()["winfoCount"] ? wInfoSnapshot.data()["winfoCount"] + 1 : 1
          }),
          promise1(),
        ])

        res.status(200).json({status:"succeed"})

        ///////////////////////////////////////////////////////////////////
        // console.log(wInfoSnapshot.data()["winfoLikedCount"])
        // await wInfoRef.update({
        //   //この三項演算子は本来いらない。（古いデータにフィールドがないから現状は必要）
        //   winfoLikedCount : wInfoSnapshot.data()["winfoLikedCount"] ? wInfoSnapshot.data()["winfoLikedCount"] + 1 : 1 ,
        //   // winfoCount : wInfoSnapshot.data()["winfoCount"] ? wInfoSnapshot.data()["winfoCount"] + 1 : 1
        // })

        // console.log("fin wInfoRef")
        // console.log(wInfoSnapshot.data()["winfoLikedCount"])
        //// 初期状態と公開/秘密によって処理が異なる
        ///////////////////////////////////////////////////////////////////
        // } catch {
        //   res.json(506).json({status:"error"})
        // }
      }
    } else {
      console.log("hist is not liked")
      //今は移管前なのでここのルートには入ることはありえない。
    }
  } else {
    console.log("firstPostFlag is other")
  }
} 

export default handlerPosting