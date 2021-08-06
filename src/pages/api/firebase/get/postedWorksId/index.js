//-> /post/[postWorkId]/[postUserId].jsx
import React from 'react' 
import firebase from 'firebase/app';

const handlerGetPostWorksdId = async(req,res) => {
  //引数がない時はresだけにする。(req,res)とかやっちゃうとresの中に何も入らない。わけじゃないっぽい
  console.log("apiStart");
  var admin = require("firebase-admin");

  // console.log(JSON.parse(req)+"+req@J")
  // console.log(JSON.parse(res)+"+res@J")

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

  // DB access
  await FirestoreSDK
  .collectionGroup('postedWorksId') //全てのドキュメントを取得
  .where('workId','!=','99')
  // .where('uid','!=','uid initial')
  .get()
  .then((postedWorksIdData) => {
    console.log("success powtedWroksIdData");

    console.log("postedWorksIdData@api")
    // console.log(JSON.stringify(postedWorksIdData))
    // console.table(postedWorksIdData.docs)
    // console.log(postedWorksIdData.docs[0])

    // const postedWorksIdDataEdit = postedWorksIdData.docs.map((map) => ({
    //   [map.data().workId+"_"+map.data().uid] : map.data()
    // }))

    let postedWorksIdDataEdit = {}

    postedWorksIdData.docs.forEach((doc,index) => {
      if(postedWorksIdDataEdit == {}){
        postedWorksIdDataEdit = 
        { [index] : { 
            "workId" : doc.data().workId ,
            "uid" : doc.data().uid 
          }
        }
      } else {
        postedWorksIdDataEdit = 
        { 
          ...postedWorksIdDataEdit ,
          [index] : { 
            "workId" : doc.data().workId ,
            "uid" : doc.data().uid 
          }
        }
      }
    })

    // console.log("postedWorksIdDataEdit")
    // console.log(JSON.stringify(postedWorksIdDataEdit,null,2))
    // console.log(postedWorksIdDataEdit)

    // res.status(200).json({status:true})
    // res.json(postedWorksIdDataEdit)
    res.status(200).json(postedWorksIdDataEdit)
    

  })
  .catch((error) => {
    throw new Error(error)
    res.status(506).json({ error : error });
  })

} 

export default handlerGetPostWorksdId