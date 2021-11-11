//speedDialPosting.jsx->

// import { propsToClassKey } from "@mui/styles";

// const deleteAssessment = async(req, res) => { //{}内はファイルの[]内の名前にする
const deleteAssessment = async({query:{ wuid },body :bodyData}, res) => { //{}内はファイルの[]内の名前にする
  console.log("apiStart deleteAssessment");
  var admin = require("firebase-admin");
  // const WUID = req.query.wuid
  console.log(wuid+"+wuid api");
  const workId = wuid.split('_')[0]
  const userId = wuid.split('_')[1]

  const objectData = JSON.parse(bodyData)

  // console.log(JSON.parse(bodyData).workTag+"+bodyData.parse.workTag")
  // console.log(bodyData.workTag+"+bodyData.workTag")
  console.log(objectData+"+objectData")
  console.log(JSON.stringify(objectData)+"+objectData@J")
  
  //// admin SDK
  // const serviceAccount = require('../../../../../meibu-86430-firebase-adminsdk-n1251-724c587f22.json')
  
  const initialized = admin.apps.some(app => app.name === "adminSDK");
  
  if(initialized){
    // admin.app()
    admin.app('adminSDK')
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
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
      })
    }, 'adminSDK');
  }
    
  // var FieldValue = require('firebase-admin').firestore.FieldValue;
  const FirestoreSDK = admin.app('adminSDK').firestore();

  //評価点を事前に計算するために取得
  const wInfoData = await FirestoreSDK
  .collection('wInfo').doc(workId)
  .get()
  console.log(wInfoData+"+wInfoData")
  console.log(JSON.stringify(wInfoData.data())+"+wInfoData")
  
  //アップデート後の評価点の追加
  const befScoreCount = wInfoData.data().winfoScoreCount
  const befScore =  wInfoData.data().winfoScore
  console.log(befScoreCount+"+befScoreCount")
  console.log(befScore+"+befScore")

  let aftScore = -1
  
  //自身が点数評価していない場合、aftScore=befScoreとなる。
  if(objectData.workScore === -1){ 
    aftScore = befScore
  } else { //評価している場合
    if(befScoreCount === 1){ //ラス１の評価の場合
      console.log("befScoreCount is last") //aftScore=-1
    } else { //ラス１評価でない場合
      aftScore = (( befScoreCount * befScore ) - objectData.workScore) / (befScoreCount - 1)
    }
  }

  console.log(aftScore+"+aftScore")
  
  //likeの判定
  let aftLikeCount = wInfoData.data().winfoLikedCount
  if (objectData.isLiked){
    aftLikeCount = aftLikeCount - 1
  }
  console.log(aftLikeCount+"+aftLikeCount")

  //タグ(投稿した分)の削除
  console.log(objectData.workTag+"objectData.workTag") //配列

  let aftTag = wInfoData.data().winfoTag
  for(let i = 0;i < objectData.workTag.length;i++){
    var tagName = objectData.workTag[i]
    aftTag[tagName] = aftTag[tagName] - 1
  }
  console.log(JSON.stringify(aftTag)+"+aftTag@J")

  // DB access
  await Promise.all[
    // privateusers -> postedworkId //削除
    FirestoreSDK
    .collection('privateUsers').doc(userId)
    .collection('postedWorksId').doc(workId)
    .delete()
    .then(() => {
      console.log("postedWorksId delete")
    })
    .catch((error) => {
      res.json(506).json({status:error})
    }),
    
    // users -> pubPostedWorksId 
    FirestoreSDK
    .collection('users').doc(userId)
    .collection('pubPostedWorksId').doc(workId)
    .delete()
    .then(() => {
      console.log("pubPostedWorksId delete")
    })
    .catch((error) => {
      res.json(506).json({status:error})
    }),

    // workInfo/assessment => 削除
    FirestoreSDK
    .collection('wInfo').doc(workId)
    .collection('assessment').doc(userId)
    .delete()
    .then(() => {
      console.log("assessment delete")
    })
    .catch((error) => {
      res.json(506).json({status:error})
    }),

    // workInfoの評価情報 => 更新
    FirestoreSDK
    .collection('wInfo').doc(workId)
    .update({
      //評価数-1
      //評価点カウント調整
      //評価点調整
      //likeしてたら-1
      //タグ(投稿した分)の削除
      winfoCount : wInfoData.data().winfoCount -1,
      winfoScoreCount : objectData.workScore === -1 ? befScoreCount : befScoreCount - 1,
      winfoScore : aftScore,
      winfoLikedCount : aftLikeCount,
      winfoTag : aftTag,
    })
    .then(() => {
      console.log("wInfo update")
    })
    .catch((error) => {
      res.json(506).json({status:error})
    })
  ]

  res.status(200).json({result:"success"})

} 

export default deleteAssessment 
