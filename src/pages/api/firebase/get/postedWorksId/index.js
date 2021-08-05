//-> /post/[postWorkId]/[postUserId].jsx

const handler = async(req , res) => { //{}内はファイルの[]内の名前にする
  console.log("apiStart");
  var admin = require("firebase-admin");

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
  const postedWorksIdData = await FirestoreSDK
  .collectionGroup('postedWorksId') //全てのドキュメントを取得
  .where('workId','!=','99')
  // .where('uid','!=','uid initial')
  .get()
  .then( (snapshot) => {
    console.log("success powtedWroksIdData");
    return snapshot
  })
  .catch((error) => {
    res.status(599).json({ error : error });
  })

  console.log("postedWorksIdData@api")
  // console.log(JSON.stringify(postedWorksIdData))
  console.table(postedWorksIdData.docs)
  console.log(postedWorksIdData.docs[0])

  const postedWorksIdDataEdit = postedWorksIdData.docs.map((map) => ({
    datas : map.data()

    // if(postedWorksIdDataEdit.length === 0){
    // postedWorksIdDataEdit = map.data()
    // } else {
    //   postedWorksIdDataEdit = [...postedWorksIdDataEdit,map.data()]
    // }
  }))

  console.log("postedWorksIdDataEdit")
  console.table(postedWorksIdDataEdit)

  res.status(200).json({jtop : postedWorksIdDataEdit})
  // res.status(200).json({datas : [...postedWorksIdData.docs]})
} 

export default handler 