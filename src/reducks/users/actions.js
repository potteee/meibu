export const SIGN_IN = "SIGN_IN";
export const signInAction = (userState) => {
    console.log(JSON.stringify(userState.uid)+"+usrState.uid@actions@signin head")
    return {
        type: "SIGN_IN",
        payload: {
            //頻繁に参照する値のみをReduxに入れる
            isSignedIn: true,
            role: userState.role,
            uid: userState.uid,
            userName: userState.userName,
            userImage: userState.userImage,
            // userEmail: userState.userEmail,
            userSex: userState.userSex, // 性別：未登録
            userProfile: userState.userProfile, // プロフィール : 未登録
            userEmail: userState.userEmail, // メール : kanoko2@example.com
            userLiveIn: userState.userLiveIn,// お住まい : 未登録
            userWebsite: userState.userWebsite, // Web/SNS : 未登録
            userBirthday: userState.userBirthday,// 誕生日 : 未登録
            userAssessmentWorks: userState.userAssessmentWorks,// 評価を投稿した作品：
            userBookmarkWorks: userState.userBookmarkWorks,// ブックマークした作品
        }
    }
};

export const SIGN_OUT = "SIGN_OUT";
export const signOutAction = () => {
    // console.log(JSON.stringify(userState.userEmail)+"+usrState.email@actions@signout head")

    return {
        type: "SIGN_OUT",
        payload: null
    }
}       

export const UPDATE_USERS = "UPDATE_USERS"
export const updateUsersAction = (userState) => {
    return {
        type: "UPDATE_USERS",
        payload: {
            // isSignedIn: true,
            // role: userState.role,
            // uid: userState.uid,
            // userName: userState.userName,
            userImage: userState.userImage,
            userSex: userState.userSex, // 性別：未登録
            userProfile: userState.userProfile, // プロフィール : 未登録
            userEmail: userState.userEmail, // メール : kanoko2@example.com
            userLiveIn: userState.userLiveIn,// お住まい : 未登録
            userWebsite: userState.userWebsite, // Web/SNS : 未登録
            userBirthday: userState.userBirthday,// 誕生日 : 未登録
            // userAssessmentWorks: userState.userAssessmentWorks,// 評価を投稿した作品：
            userBookmarkWorks: userState.userBookmarkWorks,// ブックマークした作品
        }
    }
}