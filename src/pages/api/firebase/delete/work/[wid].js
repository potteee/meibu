const deleteWork = async(req,res) => { //{}内はファイルの[]内の名前にする
  console.log("apiStart deleteAssessment");
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

  FirestoreSDK
  .collection('wInfo').doc(req.query.wid)
  .delete()
  .then(() => {
    console.log("assessment delete")
  })
  .catch((error) => {
    res.json(506).json({status:error})
  })

  res.status(200).json({result:"success"})
} 

export default deleteWork
