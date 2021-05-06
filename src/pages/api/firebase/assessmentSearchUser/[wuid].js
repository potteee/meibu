// post/uid/[postWorkId]/[postUserId].jsx
import React from 'react' 
import firebase from 'firebase/app';

// const handlerAssessmeentSearchUser = async({ query: { uid } }, res) => {
const handlerAssessmeentSearchUser = async(req, res) => {
  console.log("apiStart");
  var admin = require("firebase-admin");
  const wuid = req.query.wuid
  console.log(wuid+"+uid api");
  const workId = wuid.split('_')[0]
  const userId = wuid.split('_')[1]

  console.log(userId+"+userId")
  console.log(workId+"+workId")

  console.log("req query") 
  console.log(req.query)
  console.log("req method")
  console.log(req.method)

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

  //検索　Userごとの作品(wInfo->assessment)評価情報
  await FirestoreSDK
  .collection('wInfo').doc(workId)
  .collection('assessment').doc(userId)
  .get()
  .then(snapshot => {
    console.log(JSON.stringify(snapshot)+"+snapshot@J")
    // console.log(JSON.stringify(snapshot)+"+snapshot@JSON")
    // console.log(snapshot.data().workName+"+snapshot.data().workName")
    FirestoreSDK
    .collection('wInfo').doc(workId)
    .get()
    .then(snapshot2 => {
      console.log(JSON.stringify(snapshot2)+"+snapshot2@J")

      const result = {...(snapshot.data()),...(snapshot2.data())}

      console.log(result+"+++result")
      console.log(JSON.stringify(result)+"+++result@JSON")
      res.status(200).json(result)
      // res.status(200).json({workName : snapshot.data().workName})
        
    }).catch((error) => {
      throw new Error(error)
      res.json({ error });
    })

  }).catch((error) => {
      throw new Error(error)
      res.json({ error });
  })
} 

export default handlerAssessmeentSearchUser
// export const FirestoreSDK = admin.app('adminSDK').firestore();
