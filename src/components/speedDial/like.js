import React from 'react';
import { likedWork } from 'src/reducks/users/operations'

const like = async(props) => {

  let privateUserData = {}

  if(props.uid == "uid initial"){
    alert("ログインしてください")
    return false
    // //未評価ユーザの場合、評価済みユーザの場合。（このifいらなそう
  }

  console.log("作品にいいねで評価しました。")
  const urlPosting = `/api/firebase/likedWork/${props.uid}`
  const postingData = {
    workName:props.workName,
    workMedia:props.workMedia,
    workId:props.workId,
    firstPostFlag:props.pfirstPostFlag,
    isLiked:true,
    hist:"liked" ,
    userName:props.userName ,
    isSpoiler: false,
    workTag: [],
    worksLikedCount : 0,
    assessmentWorkTag : [],
    assessmentComment : [],
    workScore : -1,
    workComment : "",
    isPublic : props.isPublic,
  }

  console.log(JSON.stringify(postingData)+"+postingData@J")

  //useReducer
  props.dispatch({type:"isLikeChange" , 
    payload : {
      isLiked : true,
      isMyAssessmentPublic : props.isPublic,
      likedCount: props.likedCount + 1 
    }
  })

  if(!props.isAssessed){
    props.dispatch({type:"infoCountChange",
      payload : {
        infoCount: props.infoCount + 1,
        isAssessed : true
      }
    })
  }

  //DB
  const res = await fetch(urlPosting, {
    // 送信先URL
    method: 'post', 
    // 通信メソッド    
    header: {'Content-Type': 'application/json'}, 
    // JSON形式のデータのヘッダー    
    body: JSON.stringify(postingData) 
    // JSON形式のデータ  })
  })

  console.log("fetcher finish")

  const data = await res.json()
  console.log("res.json() finish")
  console.log(data)

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  //Redux
  const userAssessmentWorks = {
    [props.workId] : {
      workName : props.workName,
      workMedia : props.workMedia,
      isPublic : props.isPublic,
      isLiked : true,
    }
  }

  props.dispatchRedux(
    likedWork(
      userAssessmentWorks
    )
  ),


  console.log(props.pfirstPostFlag)
  console.log("いいねが押されました")
  
};

const likeHikoukai = (props) => {
  console.log("作品に非公開いいねで評価しました。")
  like({...props,isPublic:false})
  console.log(props.pfirstPostFlag)
};

export default like
export {likeHikoukai} 
