//user/[uid].jsx->

import React from 'react' 
import firebase from 'firebase/app';

const userPageHandler = async({ query: { uid } }, res) => { //{}内はファイルの[]内の名前にする
  console.log("apiStart");
  var admin = require("firebase-admin");
  console.log(uid+"+id api");

  //// admin SDK
  const serviceAccount = require('../../../../../meibu-86430-firebase-adminsdk-n1251-724c587f22.json')

  const initialized = admin.apps.some(app => app.name === "adminSDK");
  
  if(initialized){
    // admin.app()
    admin.app('adminSDK')
  } else {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    }, 'adminSDK');
  }
  
  const FirestoreSDK = admin.app('adminSDK').firestore();

  // DB access
  // collectionGroupを使ったsubCollectionの検索はadminSDKにしかできない。
  await FirestoreSDK
  .collection('users').doc(uid)
  //.collection('pubPostedWorksId')
  .get()
  .then(snapshot => {
    console.log(JSON.stringify(snapshot)+"+snapshot@J")
    console.log(JSON.stringify(snapshot.data())+"+snapshot.data()@J")
    FirestoreSDK
    .collection('users').doc(uid)
    .collection('pubPostedWorksId')
    // .where('uid','!=','99')
    .get()
    .then(snapshot2 => {
      let pubPostedWorksId = []

      snapshot2.docs.map(ss2 => {
        console.log(JSON.stringify(ss2.data())+"++ss2.data()")
        pubPostedWorksId.push(ss2.data())
      })
      console.log(pubPostedWorksId+"++++++pubPostedWorksId")
        // console.log(JSON.stringify(snapshot2.docs)+"+snapshot2.docs")
      const result = {users : snapshot.data() ,pubPostedWorksId : pubPostedWorksId}
      res.status(200).json(result)
    }).catch((error) => {
      throw new Error(error)
      res.json({ error });
    })
  }).catch((error) => {
  throw new Error(error)
  res.json({ error });
  })
} 

export default userPageHandler 
