import React from 'react'

const handler = async({ query: { id } }, res) => {
  var admin = require('firebase-admin');

  console.log("apiStart");
  const serviceAccount = require('../../../../meibu-86430-firebase-adminsdk-n1251-724c587f22.json')

  console.log(process.env.FIREBASE_CONFIG);
  
  const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG
    )
  adminConfig.credential = admin.credential.cert(serviceAccount)
  var app = admin.initializeApp(adminConfig);
  const db = admin.firestore();
  // const handler = async({ query: { id } }, res) => {
    // (async() => {
//   console.log(db+"+ db ")
// db.collection('users').doc(id).get()
        await db.collection('users').doc(id).get()
        .then(snapshot => {
          let dbData = snapshot.data()
          console.log(dbData+"+data collection")
        //   setUserSex(dbData.userSex)
        //   setUserProfile(dbData.userProfile)
        //   setUserImage(dbData.userImage)

        // DB access
          const apiWorksName = { names: dbData.userProfile,id: id }
          // const apiWorksName = { names: 'apiWorksName',id: id }
          // const filtered = people.filter((p) => p.id === id)
          
          // console.log(JSON.stringify(res)+"+res")
          // console.log(JSON.stringify(req)+"+req")
          
          
        // Redux access
          console.log(JSON.stringify(apiWorksName)+"+apiWorksName")
          res.status(200).json(apiWorksName)
        })
        .catch((error) => {
        //   alert('Get users DB fail')
        // throw new Error(error)
        res.json({ error });
        })  
    // })
} 

export default handler