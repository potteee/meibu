// post/[postWorkId]/index.jsx

import React from 'react' 
import firebase from 'firebase/app';

const handlerAssessmeent = async({ query: { wid } }, res) => {
  console.log("apiStart");
  var admin = require("firebase-admin");
  console.log(wid+"+workId api");

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
  // コレクショングループ使用時
  // .collectionGroup('assessment')
  .collection('wInfo')
  .doc(wid)
  .collection('assessment')
  // .getCollections()
  // .listCollections('assessment')
  // .getCollections()
  // .getCollections('assessment')
  // .doc("Oqp2HRSHeaePltOb7bPcxIpeyWh1")

  // .where('isPublic','==',true)

  .get()
  .then(snapshot => {
    // console.log(JSON.stringify(snapshot)+"snapshot")

  // コレクショングループ使用時
  //  const assessmentData = snapshot.docs.map(map => map.data())

    console.log(JSON.stringify(snapshot.docs[0].data())+"+++++snapshot")
    // console.log(JSON.stringify(snapshot[0].docs)+"+++++snapshot")
    // console.log((s/napshot[0])+"+++++snapshot")
    // console.log((snapshot.docs.data()["userName"])+"+++++snapshot")
    // console.log((snapshot.docs["userName"])+"+++++snapshot")
    // console.log(JSON.stringify(snapshot.docs.id)+"+++++snapshot")
    // console.log(JSON.stringify(snapshot.docs.data()["userName"])+"+++++snapshot")
    // console.log(snapshot.data()+"snapshot.data()")
    let workData = [];

    snapshot.docs.map(map => {
      if(map.data()["isPublic"]){
        workData.push({userName : map.data()["userName"], uid: map.data()["uid"]})
      } else {
        workData.push({userName : "非公開" , uid: "非公開"})
      }
    })
    console.log(workData+"++++workData")
    console.log(JSON.stringify(workData)+"++++workData")

    res.status(200).json(workData)
  // Redux access => cannot
  })
  .catch((error) => {
  throw new Error(error)
  res.json({ error });
  })
} 

export default handlerAssessmeent
// export const FirestoreSDK = admin.app('adminSDK').firestore();
