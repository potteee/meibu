// menu/searchResult.jsx

import React from 'react' 
import firebase from 'firebase/app';
// import { tokenize } from '../allStringSearch/text-processor';

const handlerSearchWork = async({ query: { wname }, body: dBody}, res) => {
  console.log("apiStart");
  var admin = require("firebase-admin");
  console.log(wname+"+wname api");
  console.log(dBody+"+dBody")

  // let allayDBody = dBody
  // let allayDBody = Object.keys(JSON.stringify(dBody))
  let allayDBody = Object.keys(JSON.parse(dBody))
  // console.log(Object.keys(dBody)+"Object.keys(dBody)")
  // let allayDBody = Object.entries(dBody).map([key, value] => return {key})

  console.log(allayDBody+"+++allayDBody")
  console.log(allayDBody[0]+"+++allayDBody[0]")

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
  
  const FirestoreSDK = admin.app('adminSDK').firestore()
  let searchQuery = FirestoreSDK.collection('wInfo').limit(100)

  // await FirestoreSDK

  allayDBody.forEach(token => {
    searchQuery = searchQuery.where(`tokenMap.${token}` ,'==' ,true)
  })
  console.log(JSON.stringify(searchQuery)+"searchQuery@j")
  
  await searchQuery.get()
  .then(snapshot => {

    console.log(JSON.stringify(snapshot)+"+++++snapshot@J")

    let workData = [];

    snapshot.docs.map(map => {
      workData.push({workName : map.data()["workName"], workId : map.data()["workId"], winfoMedia : map.data()["winfoMedia"]})
      // console.log(workData[0]+"++++workData in map")
    })
    // console.log(workData+"++++workData")
    console.log(JSON.stringify(workData)+"++++workData")

    res.status(200).json(workData)
    // Redux access => cannot
  })
  .catch((error) => {
    throw new Error(error)
    res.json({ error });
  })
} 

export default handlerSearchWork