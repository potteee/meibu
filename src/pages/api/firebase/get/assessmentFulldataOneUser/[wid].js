// // post/[postWorkId]/index.jsx
// // 現在未使用 & 未完成(2021/11/11) 
// import React from 'react' 

// const handlerAssessmeent = async({ query: { wuid } }, res) => {
//   console.log("apiStart firebase/get/assessment/fulldataOneUser/[wuid].js");
//   var admin = require("firebase-admin");
//   // console.log(wid+"+workId api");
//   console.log(wuid+"+wuid api");
//   const workId = wuid.split('_')[0]
//   const userId = wuid.split('_')[1]

//   //// admin SDK
//   // const serviceAccount = require('../../../../../meibu-86430-firebase-adminsdk-n1251-724c587f22.json')

//   const initialized = admin.apps.some(app => app.name === "adminSDK");
  
//   if(initialized){
//     // admin.app()   
//     admin.app('adminSDK')
//   } else {
//     admin.initializeApp({
//         credential: admin.credential.cert(
//           {
//             "type": process.env.NEXT_PUBLIC_TYPE,
//             "project_id": process.env.NEXT_PUBLIC_PROJECT_ID,
//             "private_key_id": process.env.NEXT_PUBLIC_PRIVATE_KEY_ID,
//             "private_key": process.env.NEXT_PUBLIC_PRIVATE_KEY,
//             "client_email": process.env.NEXT_PUBLIC_CLIENT_EMAIL,
//             "client_id": process.env.NEXT_PUBLIC_CLIENT_ID,
//             "auth_uri": process.env.NEXT_PUBLIC_AUTH_URI,
//             "token_uri": process.env.NEXT_PUBLIC_TOKEN_URI,
//             "auth_provider_x509_cert_url": process.env.NEXT_PUBLIC_AUTH_PROVIDER_X509_CERT_URL,
//             "client_x509_cert_url": process.env.NEXT_PUBLIC_CLIENT_X509_CERT_URL
//           }
//         )
//     }, 'adminSDK');
//   }
  
//   const FirestoreSDK = admin.app('adminSDK').firestore();

//   // DB access
//   // collectionGroupを使ったsubCollectionの検索はadminSDKにしかできない。
//   await FirestoreSDK
//   // コレクショングループ使用時
//   // .collectionGroup('assessment')
//   .collection('wInfo')
//   .doc(workId)
//   .collection('assessment')
//   .doc(userId)
//   .get()
//   .then(snapshot => {
//     // console.log(JSON.stringify(snapshot.docs)+"snapshot.docs@J")
//     if(snapshot.data()){
//       let workData = []
//       let isEmpty = true

//     } else {
//       res.status(200).json(workData)
//     }


//     // if(JSON.stringify(snapshot.docs[0]._fieldsProto) != "{}"){
//     if(snapshot.docs.length != 0){
//       snapshot.docs.map(map => {
//         if(map.data()["uid"]){
//           workData = [...workData,({
//             userName : map.data()["userName"],
//             uid: map.data()["uid"],
//             workScore: map.data()["workScore"],
//             workTag: map.data()["workTag"],
//             isLiked: map.data()["isLiked"],   
//             workWatchTimes: map.data()["workWatchTimes"],          
//           })]
//           isEmpty = false
//         }
//       })
//     }
    
//     if(isEmpty){
//       workData = [...workData,({userName : "非公開" , uid: "非公開"})]  
//       // workData.push({userName : "非公開" , uid: "非公開"})
//     }

//     console.log(workData+"++++workData")
//     console.log(JSON.stringify(workData)+"++++workData")

//     // res.status(200).json(state:"failed")
//     res.status(200).json(workData)
//   // Redux access => cannot
//   })
//   .catch((error) => {
//     throw new Error(error)
//     res.json({ error });
//   })
// } 

// export default handlerAssessmeent
// // export const FirestoreSDK = admin.app('adminSDK').firestore();
