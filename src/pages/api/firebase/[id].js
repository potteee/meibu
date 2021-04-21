import React from 'react' 
import firebase from 'firebase/app';

const handler = async({ query: { id } }, res) => {
  console.log("apiStart");
  var admin = require("firebase-admin");
  console.log(id+"+id api");

  //// admin SDK
  const serviceAccount = require('../../../../meibu-86430-firebase-adminsdk-n1251-724c587f22.json')

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
  .collectionGroup('postedWorksId')
  // .where('workId','!=','99')
  .where('workId','!=','99')
  .where('uid','==',id)
  .get()
  .then(snapshot => {
    console.log(JSON.stringify(snapshot)+"snapshot")

    const workIdMap = snapshot.docs.map(map => map.data()["workName"])

    // FirestoreSDK
    // .collection('works')
    // .where('workId','==','99')

    const apiWorksName = { names: workIdMap, id: id }

    console.log(JSON.stringify(apiWorksName)+"+apiWorksName")
    res.status(200).json(apiWorksName)
  // Redux access => cannot
  })
  .catch((error) => {
  throw new Error(error)
  res.json({ error });
  })
} 

export default handler 
// export const FirestoreSDK = admin.app('adminSDK').firestore();
