import React from 'react';
import {useDispatch,useSelector} from "react-redux"
import {db} from "src/firebase/index";
import {updateUsers } from 'src/reducks/users/operations'

const bookmark = async(props) => {
  let privateUserData = {}
  let privateUserReduxData = {}
  const privateUserRef = db.collection('privateUsers').doc(props.uid)
  const urlBookmarkDelete = `/api/firebase/userBookmark/${props.workId}_${props.uid}`
  
  if(props.uid == "uid initial"){
    alert("ログインしてください")
    return false
  }

  if(props.isBookmark){
    console.log("ブックマーク解除が押されました")
    privateUserData = {...props.selector.users}
    privateUserReduxData = {...props.selector.users}
    
    console.log("before privateUserData")
    console.dir(privateUserData)
    console.dir(props.workId)
    console.log(delete privateUserData.userBookmark[props.workId])
    console.log("after privateUserData")
    console.dir(privateUserData)

    //DB
    await Promise.all([
      fetch(urlBookmarkDelete)
      .then(async(res)=> {
        console.log("fetcher finish")
        const data = await res.json()

        if (res.status !== 200) {
          throw new Error(data.message)
        }
      }).catch((error) => {
        alert('Couldnt delete Bookmark')
        throw new Error(error)
      }),
      
      //Redux
      props.dispatchRedux(updateUsers(privateUserReduxData)),
      
      //Display
      props.dispatch({type : "setIsBookmark", 
        payload : {
          isBookmark : false
        }
      })
    ])
      
  //ブックマーク登録
  } else {
    console.log("ブックマーク登録が押されました")
    privateUserData = {
      userBookmark: { [props.workId] : { workName:props.workName ,workMedia:props.workMedia }}
    }

    privateUserReduxData = {...props.selector.users,...privateUserData}
    
    const selectorsUserBookmark = (props.selector.users.userBookmark)
      
    Object.keys(selectorsUserBookmark).map((map) => {
      privateUserData.userBookmark = {...privateUserData.userBookmark , [map] : selectorsUserBookmark[map]} 
    })
    
    console.log(JSON.stringify(privateUserData,null,2)+"privateUserData@J")
    console.dir(privateUserData+"privateUserData@J")
    
    await Promise.all([
      //DB
      privateUserRef
      .set(
        privateUserData,
        {merge : true } // 有効　→　指定しないフィールドを消さない
      ).then(()=>{
        console.log("workBookmark set DB")
      }).catch((error) => {
        alert('assesworkBookmark set DB fail')
        throw new Error(error)
      }),

      //Redux
      props.dispatchRedux(updateUsers(privateUserData)),
        
      //display
      props.dispatch({type : "setIsBookmark", 
        payload : {
          isBookmark : true
        }
      })
    ])
  }
  console.log(props.isBookmark+"+props.isBookmark@sdp")

};

export default bookmark