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
    console.log(JSON.stringify(snapshot.docs)+"snapshot.docs@J")
    let workData = []
    let isEmpty = true

    // if(JSON.stringify(snapshot.docs[0]._fieldsProto) != "{}"){
    if(snapshot.docs.length != 0){
      snapshot.docs.map(map => {
        if(map.data()["uid"]){
          workData.push({userName : map.data()["userName"], uid: map.data()["uid"]})
          isEmpty = false
        }
      })
    }
    // }
    
    if(isEmpty){
      workData.push({userName : "非公開" , uid: "非公開"})
    }

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
