import React from 'react';

const like = async(props) => {

  let privateUserData = {}

  if(props.uid == "uid initial"){
    alert("ログインしてください")
    return false
    // //未評価ユーザの場合、評価済みユーザの場合。（このifいらなそう
  }

  console.log("作品にいいねで評価しました。")
  const urlPosting = `/api/firebase/posting/${props.uid}`
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
