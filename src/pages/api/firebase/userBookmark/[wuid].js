//speedDialPosting.jsx->

import React from 'react' 
import firebase from 'firebase/app';

const userBookmarkHandler = async(req, res) => { //{}内はファイルの[]内の名前にする
  console.log("apiStart userBookmaerkHandler");
  var admin = require("firebase-admin");
  const wuid = req.query.wuid
  console.log(wuid+"+wuid api");
  const workId = wuid.split('_')[0]
  const userId = wuid.split('_')[1]
  
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
    
  var FieldValue = require('firebase-admin').firestore.FieldValue;
  const FirestoreSDK = admin.app('adminSDK').firestore();

  // DB access
  await FirestoreSDK
  .collection('privateUsers').doc(userId)
  .update({
    ['userBookmark.' + workId ] : FieldValue.delete() 
  })
  .then(() => {
    console.log("object delete succeed")
    res.status(200).json({result : "success"})
  }    
  ).catch((error) => {
    res.status(599).json({ error : error });
  })
} 

export default userBookmarkHandler 
