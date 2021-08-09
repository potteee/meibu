const initialState = {
    // works: {
    //     workId: "initialworkId",
    //     workName: ["initialworksName1","initialworksName2"],
    //     workScore: ["initialworksScore","initialworksScore2"]
    // },
    users: {
        isSignedIn: false,
        role: "initialRole",
        uid: "uid initial",
        userName: "username initial",
        userImage: "pngjpgFile",
        userSex: "sex initial", // 性別：未登録
        userProfile: "profile initial", // プロフィール : 未登録
        userEmail: "email initial", // メール : kanoko2@example.com
        userLiveIn: "liveIn initial",// お住まい : 未登録
        userWebsite: "website initial", // Web/SNS : 未登録
        userBirthday: "birthday initial",// 誕生日 : 未登録
        userAssessmentWorks: {},// 評価を投稿した作品：例：userAssessmentWorks":{"KtCsa74PooRszzvRebNY":{"workName":"こここ","workMedia":"映画","isPublic":true,"isLiked":true}}
        userBookmark: {},// ブックマークした作品
        instantChangedWorkId : {},//{workId : Xxxxxxx , timestamp : yyyyyyy}
    }
}

export default initialState