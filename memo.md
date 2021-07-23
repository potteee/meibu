    setUserBookmark((preUserBookmark) => {
      if(!preUserBookmark[e.currentTarget.value]["deleteFlag"]){
        preUserBookmark[e.currentTarget.value]["deleteFlag"] = true
      } else if(preUserBookmark[e.currentTarget.value]["deleteFlag"] == false){
        preUserBookmark[e.currentTarget.value]["deleteFlag"] = true
      } else {
        preUserBookmark[e.currentTarget.value]["deleteFlag"] = false
      }
      return {...preUserBookmark}
    })
  },[userBookmark])