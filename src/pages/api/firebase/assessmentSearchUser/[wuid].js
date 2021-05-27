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
  // const serviceAccount = require('../../../../../meibu-86430-firebase-adminsdk-n1251-724c587f22.json')

  const initialized = admin.apps.some(app => app.name === "adminSDK");
  
  if(initialized){
    // admin.app()
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
  
  const FirestoreSDK = admin.app('adminSDK').firestore();

  console.log("start FirestoreSDK")

  //検索　Userごとの作品(wInfo->assessment)評価情報
  await FirestoreSDK
  .collection('users').doc(userId)
  .get()
  .then(snapshot => {
    console.log(JSON.stringify(snapshot)+"+snapshot@J")
    FirestoreSDK
    .collection('wInfo').doc(workId)
    .get()
    .then(snapshot2 => {
      console.log(JSON.stringify(snapshot2)+"+snapshot2@J")
      FirestoreSDK
      .collection('privateUsers').doc(userId)
      .collection('postedWorksId').doc(workId)
      .get()
      .then(snapshot3 => {
        const result = {...(snapshot.data()),...(snapshot2.data()),...(snapshot3.data())}

        console.log(result+"+++result")
        console.log(JSON.stringify(result)+"+++result@JSON")
        res.status(200).json(result)
      }).catch((error) => {
      throw new Error(error)
      res.json({ error });
      })  
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
