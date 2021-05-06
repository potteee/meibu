// 現状呼び出されてない

//redux-thunkを使うとこのようにasync/awaitを使える様になる。
// import {postWorkCreateAction} from "./actions";

// export const postWorkCreate = (workName,workScore,workCategoryCheckBox,workComment,updatorId) => {
//     const workRef = db.collection('works').doc()

//     //自動生成されたIDを取得
//     const workId = workRef.id
    
//     return async (dispatch) => {
//         //Validation
//         if (workName === ""){
//             alert("必須項目が未入力です");
//             return false;
//         }
//         console.log(workScore+"+workScore@operation")
//         if (workScore > 100 || workScore < 0){
//             alert("点数には0~100の数値を入力してください");
//             return false;
//         }
//         const timestamp = FirebaseTimestamp.now()

//         //このデータから定期的にデータを抽出して”表示するデータ”を作る
//         let workInitialData = {
//             uniquId : workId.substr(0,10)+updatorId.substr(0,10),//ユニークキーがないから作る　投稿者と作品ごとに作る
//             workId : workId,//作品ごとに同一のキーになる
//             workName: workName,
//             workScore: workScore,
//             workCategoryCheckBox: workCategoryCheckBox,
//             workComment: workComment,
//             // workInfo: [],//過去５回分くらいを保持できるようにしておく
//             updatorId: updatorId,
//             updateTime: timestamp,
//         }
    
//         console.log(JSON.stringify(workInitialData)+"+workInitialData")
        
//         return workRef.set(workInitialData)
//             .then(async() => {
//                 console.log("works create at db success!!!")
//                 //これいるのか？
//                 //Storeするデータは選別しなくては。（本当に必要なものだけ）
//                 await dispatch(postWorkCreateAction({
//                     workId: workId,
//                     workName: workName,
//                     workScore: workScore
//                 }))
//                 return workId
//             }).catch((error) => {
//                 alert('works DB fail')
//                 throw new Error(error)
//             }) 
//     }
// }

// export const getWorkData = (workId) => {
//     var docRef = db.collection("works").doc(workId)

//     docRef.get()
//       .then(snapshot => {
//         const data = snapshot.data()
//         if(data) {
//             console.log("Document data:", data)
//             let workData = {
//                 uniquId : data.uniquId,
//                 workId : workId,
//                 workName: data.workName,
//                 workScore: data.workScore,
//                 workCategoryCheckBox: data.workCategoryCheckBox,
//                 workComment: data.workComment,
//                 workInfo: data.workInfo,
//                 updatorId: data.updateId,
//                 updateTime: data.updatorId
//             }
//             return workData
//         } else {
//             console.log("No such document!")
//         }
//     }).catch(function(error){
//       console.log("Error getting document:",error)
//     })
// }



