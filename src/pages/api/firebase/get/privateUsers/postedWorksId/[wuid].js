import React from 'react' 
import firebase from 'firebase/app';

const handlerGetPostWorksdId = async(req, res) => {
  console.log("apiStart");
  var admin = require("firebase-admin");
  const wuid = req.query.wuid
  console.log(wuid+"+wuid api");
  const workId = wuid.split('_')[0]
  const userId = wuid.split('_')[1]

  //// admin SDK

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
  let postedWorksIdRef = FirestoreSDK.collection('privateUsers').doc(userId).collection('postedWorksId').doc(workId)

  await postedWorksIdRef.get()
  .then((snapshot) => {
    console.log(JSON.stringify(snapshot)+"+++++get snapshot@j")
    console.log(JSON.stringify(snapshot.data())+"+++++get snapshot.data()@j")
    if(snapshot.data()){ // フィールドが存在しない場合undefined
      res.status(200).json(snapshot.data())
    } else {
      res.status(200).json({uid:false})
    }
  })
  .catch((error) => {
    throw new Error(error)
    res.json({ error });
  })
} 

export default handlerGetPostWorksdId