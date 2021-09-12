import React, {useState, useCallback} from 'react';
import { db, FirebaseTimestamp } from "../../firebase/index";

/// Redux no だからここに書いている →api配下に移行予定

const postWInfoCreate = (
    workName,
    workMedia,
    workScore,
    uid,
    userName,
    checkBoxState,
    tagCheckBox,
    workComment,
    isPublic,
    isSpoiler,
    isLiked,
    tokenMap,
    winfoData,
    firstPostFlag,
    preWorkId) => {
    return async (dispatch) => {
        const timestamp = FirebaseTimestamp.now()

        const wInfoRef = db.collection('wInfo').doc()
        //自動生成されたIDを取得
        let workId = wInfoRef.id

        let assessmentRef = ""

        console.log(firstPostFlag+"+firstPostFlag")
        console.dir(winfoData)
        console.log("winfoData")

        //新規作品を登録する場合
        if(firstPostFlag == 1) {
            assessmentRef = wInfoRef.collection('assessment').doc(uid)

            let tmpWorkTag = {}
            // tagCheckBox  [0:xxxx,1:yyyy]

            console.log(tagCheckBox+"+tagCheckBox+")
            tagCheckBox.map(token => {
                console.log(token+"+token@map")
                // tmpWorkTag.push({ [token] : 1 })
                tmpWorkTag[token] = 1
            })

            console.log(tagCheckBox+"tagCheckBox")
            console.log(JSON.stringify(tmpWorkTag)+"tmpWorkTag@J")
            console.log(tmpWorkTag+"tmpWorkTag")

            var wInfoAllData = { 
                winfoEditor : uid,
                workId : workId,
                workName : workName,
                winfoScore : workScore ? workScore : -1, //workScore 
                winfoScoreCount : workScore ? 1 : 0, //作成時の初期値なので1
                winfoCount : 1, //作成時の初期値なので1
                winfoLikedCount : isLiked ? 1 : 0,
                winfoTag : tmpWorkTag, ///////////新規　5/17 {xxxx : 3},{yyyy : 2} 
                winfoCategory : checkBoxState,
                winfoMedia : workMedia,
                tokenMap : tokenMap,
                // winfoIllustrator : [],
                // winfoInfomation : "no data at infomation",
                // winfoCreator : [],
                // winfoSeries : [],
                // winfoParent : {},
                // winfoChild : [],
                // winfoMusic : [],
                // winfoPublisher : [],
                // winfoCountry : [],
                // winfoStart : [],
                // winfoFinish : [],
                // winfoImage : "",
                // statisticsData : "",
                // winfoPages : "", //Number
                // winfoMinutes : "", //Number
                winfoInfomation : winfoData.winfoInfomation,
                winfoCreator : winfoData.winfoCreator,
                winfoSeries : winfoData.winfoSeries,
                winfoParent : winfoData.winfoParent,
                winfoChild : winfoData.winfoChild,
                winfoMusic : winfoData.winfoMusic,
                winfoPublisher : winfoData.winfoPublisher,
                winfoCountry : winfoData.winfoCountry,
                winfoStart : winfoData.winfoStart,
                winfoFinish : winfoData.winfoFinish,
                winfoImage : winfoData.winfoImage,
                statisticsData : winfoData.statisticsData,
                winfoPages : winfoData.winfoPages, //Number
                winfoMinutes : winfoData.winfoMinutes, //Number
                // assessment : {}
                // histories : {}, // subCollection。 
            }
            console.log(JSON.stringify(wInfoAllData)+"+wInfoAllData")
            console.log(workId+"+workId")

            // wInfo作成
            await wInfoRef
            // .update(wInfoAllData)
            .set(wInfoAllData,
                { merge : true })
            .then(() => {
                console.log("successed updating or creating ")
            }).catch((error) => {
                alert('wInfo DB fail')
                throw new Error(error)
            })

        // 既にある作品を編集する場合。（ログインユーザは未評価）
        } else if(firstPostFlag == 0) {
            workId = preWorkId

            // if(isPublic){
            assessmentRef = db.collection('wInfo').doc(workId).collection('assessment').doc(uid)
            console.log(assessmentRef+"++++assessmentRef")
            console.log(workId+"+workId")
            console.log(uid+"+uid")
            // }

            await db.collection('wInfo').doc(workId).get()
            .then((snapshot) => {

                //ユーザとしては新規登録
                //// 評価点
                const befWinfoScoreCount = snapshot.data()["winfoScoreCount"]
                const ediWinfoScoreCount = befWinfoScoreCount + 1
                let ediWinfoScore = snapshot.data()["winfoScore"] //現状の点数を代入。評価がなければこのまま
                if(workScore){
                    console.log(workScore+"+workScore in")

                    let befWinfoScore = 0
                    if(snapshot.data()["winfoScore"] != -1){
                        befWinfoScore = snapshot.data()["winfoScore"]
                    } else {
                        befWinfoScore = 0
                    }
                    
                    ediWinfoScore = ((befWinfoScore * befWinfoScoreCount) + Number(workScore) ) / ediWinfoScoreCount
                    // console.log((((befWinfoScore * befWinfoScoreCount ) + workScore ) / ediWinfoScoreCount )+"+CC 実数")
                    // console.log((((10 * 1 ) + 20 ) / 2 )+"+CC")

                    console.log(ediWinfoScoreCount+"+ediWinfoScoreCount")
                    console.log(ediWinfoScore+"+ediWinfoScore")
                } else {
                    console.log(workScore+"+workScore out")

                }

                //// 評価タグ
                let tmpWorkTag = {}
                const befTag = snapshot.data()["winfoTag"]
                // console.log(befTag.data()+"+befTag.data()")
                console.log(JSON.stringify(befTag)+"+befTag@J")
                tmpWorkTag = befTag

                tagCheckBox.map(token => {
                    console.log(befTag[token]+"+befTag[token]")

                    if(tmpWorkTag[token]){
                        tmpWorkTag[token]++
                    } else {
                        tmpWorkTag[token] = 1
                    }
                })
                    
                console.log(tagCheckBox+"+tagCheckBox")
                console.log(JSON.stringify(tmpWorkTag)+"tmpWorkTag@J")
                console.log(tmpWorkTag+"tmpWorkTag")

                const ediWinfoCount = snapshot.data()["winfoCount"] + 1

                //// いいね
                console.log(isLiked+"+isLiked")

                let tmpLikedCount = snapshot.data()["winfoLikedCount"] + (isLiked ? 1 : 0)

                console.log(tmpLikedCount+"+tmpLikedCount")

                // ****************************

                db.collection('wInfo').doc(workId).update({
                    winfoScoreCount : ediWinfoScoreCount,
                    winfoCount : ediWinfoCount,
                    winfoScore : ediWinfoScore,
                    winfoLikedCount : tmpLikedCount,
                    winfoTag : tmpWorkTag,
                    winfoInfomation : winfoData.winfoInfomation,
                    winfoCreator : winfoData.winfoCreator,
                    winfoSeries : winfoData.winfoSeries,
                    winfoParent : winfoData.winfoParent,
                    winfoChild : winfoData.winfoChild,
                    winfoMusic : winfoData.winfoMusic,
                    winfoPublisher : winfoData.winfoPublisher,
                    winfoCountry : winfoData.winfoCountry,
                    winfoStart : winfoData.winfoStart,
                    winfoFinish : winfoData.winfoFinish,
                    winfoImage : winfoData.winfoImage,
                    statisticsData : winfoData.statisticsData,
                    winfoPages : winfoData.winfoPages, //Number
                    winfoMinutes : winfoData.winfoMinutes, //Number
                }).then(() => {
                    console.log("successed to update Count & Score")
                    return workId

                }).catch((error) => {
                    alert('failed to update Count & Score')
                    throw new Error(error)
                })
            }).catch((error) => {
                alert('wInfo DB Get fail')
                throw new Error(error)
            })
        //　既に評価している作品の評価を編集する場合
        } else if(firstPostFlag == 2){
            workId = preWorkId
            // if(isPublic){
            // ここにもawaitを入れないと呼び出しもとの処理が進んでしまう。
            assessmentRef = await db.collection('wInfo').doc(workId).collection('assessment').doc(uid)
            console.log(assessmentRef+"++++assessmentRef")
            console.log(workId+"+workId")
            console.log(uid+"+uid")
            // }
            
            await db.collection('wInfo').doc(workId).get()
            .then(async(snapshot) => {
                await db.collection('privateUsers').doc(uid)
                .collection('postedWorksId').doc(workId).get()
                .then(async(snapshotPrivate) => {
                // .then((snapshotPrivate) => {
                    console.log(snapshotPrivate.data()["workScore"]+"++++snapshotPrivate.data()[workScore]")

                    // ↓バグ　0入れたらダメ。評価したことになってしまう。
                    // const befWinfoScore = snapshot.data()["winfoScore"] != -1 ? snapshot.data()["winfoScore"] : 0
                    const befWinfoScore = snapshot.data()["winfoScore"] // wrote 0707

                    // ↓バグ　よくわからないところで-1で定義している。変更されることが大前提
                    // let ediWinfoScoreCount = -1
                    // let ediWinfoScore = -1
                    let ediWinfoScoreCount
                    let ediWinfoScore

                    //////編集

                    ////カテゴリ
                    //編集不可

                    //// 評価点
                    if(workScore){ //評価していなければ""となる
                        console.log(workScore+"+workScore in")
                        const befWinfoScoreCount = snapshot.data()["winfoScoreCount"]
                        
                        const befWorkScore = snapshotPrivate.data()["workScore"]
                        //前回評価で採点していた場合
                        if(befWorkScore != -1) {
                            console.log("exist assessmentScore")
                            console.log(befWorkScore+"+befWorkScore")
                            ediWinfoScoreCount = befWinfoScoreCount //カウント数に変化はなし
                            ediWinfoScore = ((befWinfoScore * befWinfoScoreCount) - Number(befWorkScore) + Number(workScore) ) /ediWinfoScoreCount
                            console.log(((befWinfoScore * befWinfoScoreCount) - Number(befWorkScore) + Number(workScore) )+"1")
                            console.log(((befWinfoScore * befWinfoScoreCount) - Number(befWorkScore) + Number(workScore) )/ediWinfoScoreCount+"2")

                        } else {
                            console.log("no exist assessmentScore")
                            ediWinfoScoreCount = befWinfoScoreCount + 1 //カウント数は＋１となる
                            ediWinfoScore = ((befWinfoScore * befWinfoScoreCount) + Number(workScore) ) / ediWinfoScoreCount //新規登録と同じ式
                        }

                        console.log(befWinfoScoreCount+"+befWinfoScoreCount")
                        console.log(befWinfoScore+"+befWinfoScore")
                        console.log(ediWinfoScoreCount+"+ediWinfoScoreCount")
                        console.log(ediWinfoScore+"+ediWinfoScore")
                        console.log(workScore+"+workScore")
                    } else { //今回、評価しておらず、前回評価している場合、消す必要がある。
                       //バグアあるのはこの中っぽい。
                        console.log(workScore+"+workScore out")
                        const befWinfoScoreCount = snapshot.data()["winfoScoreCount"]
                        const befWorkScore = snapshotPrivate.data()["workScore"]

                        //↓バグ　ここで-1しちゃダメ。前回評価していない場合でも-1してしまう。
                        // ediWinfoScoreCount = Number(befWinfoScoreCount) -1

                        //↓バグ　これここでいいの？→だめ　前回時点の評価数から1減産した数を代入してから。
                        //評価者「0」では割れないので直接評価者無し符号-1を代入する。
                        // if(ediWinfoScoreCount != 0 ){// wrote 0705
                        //     ediWinfoScore = ((befWinfoScore * befWinfoScoreCount) - Number(befWorkScore) ) /ediWinfoScoreCount
                        // } else {
                        //     //評価しているユーザがいなくなった場合、-1とする。
                        //     ediWinfoScore = -1
                        // }

                        //前回 ログインユーザが評価していた場合
                        if(befWorkScore != -1){
                            ediWinfoScoreCount = Number(befWinfoScoreCount) -1

                            if(ediWinfoScoreCount != 0 ){// wrote 0705
                                ediWinfoScore = ((befWinfoScore * befWinfoScoreCount) - Number(befWorkScore) ) /ediWinfoScoreCount
                            } else {
                                //評価しているユーザがいなくなった場合、-1とする。
                                ediWinfoScore = -1
                            }

                            console.log(befWorkScore+"snapshotPrivate.data()[workScore]")
                            // if(befWinfoScoreCount != 0){ // 0705
                            if(befWinfoScoreCount == 0){
                                //評価しているはずなので、wInfoが0ということはありえないのでエラー
                                console.log('ERROR')
                                alert('src　ERROR')
                                return false;
                            } else {
                                // 前回評価ー今回未評価
                                // let ediWinfoScoreCount = -1
                                // let ediWinfoScore = -1

                                //前回評価で採点していた場合 
                                console.log("exist assessmentScore")
                                // ediWinfoScoreCount = Number(befWinfoScoreCount) - 1
                                // ediWinfoScore = ((befWinfoScore * befWinfoScoreCount) - Number(befWorkScore) ) /ediWinfoScoreCount
                                console.log((befWinfoScore * befWinfoScoreCount) - Number(befWorkScore)+"1")
                                console.log(((befWinfoScore * befWinfoScoreCount) - Number(befWorkScore) )/ediWinfoScoreCount+"2")

                                console.log(befWinfoScoreCount+"+befWinfoScoreCount")
                                console.log(befWinfoScore+"+befWinfoScore")
                                console.log(ediWinfoScoreCount+"+ediWinfoScoreCount")
                                console.log(ediWinfoScore+"+ediWinfoScore")
                                console.log(workScore+"+workScore")        
                            }
                        //前回　ログインユーザが評価していなかった場合
                        } else { 
                            console.log("前回も未評価")

                            ediWinfoScoreCount = befWinfoScoreCount // wrote 0707
                            ediWinfoScore = befWinfoScore // wrote 0707
                            // 何も実行しない。
                            // wInfoも更新なし。　//更新しないというわけには行かないので初期値を代入

                        }
                    }
                    //// 評価タグ
                    let tmpWorkTag = {}
                    const befTag = snapshot.data()["winfoTag"]
                    const befUserTag = snapshotPrivate.data()["assessmentWorkTag"]
                    // console.log(befTag.data()+"+befTag.data()")
                    console.log(JSON.stringify(befTag)+"+befTag@J")
                    console.log(JSON.stringify(befUserTag)+"+befUserTag@J")

                    //既存評価を適用
                    tmpWorkTag = befTag

                    //ぷらす分                    
                    tagCheckBox.map(token => {
                        if(tmpWorkTag[token]){
                            tmpWorkTag[token]++
                        } else {
                            tmpWorkTag[token] = 1
                        }
                    })

                    //まいなす分
                    befUserTag.map(token => {
                        // console.log(tmpWorkTag[token]+"+++bef tmp tokn")
                        tmpWorkTag[token] = tmpWorkTag[token] - 1;
                        // console.log(tmpWorkTag[token]+"+++aft tmp tokn")
                    })
                    
                    console.log(tagCheckBox+"+tagCheckBox")
                    console.log(JSON.stringify(tmpWorkTag)+"tmpWorkTag@J")
                    console.log(tmpWorkTag+"tmpWorkTag")

                    const ediWinfoCount = snapshot.data()["winfoCount"]

                    //いいね
                    let tmpLikedCount = -9999

                    ////前回いいね
                    if(snapshotPrivate.data()["isLiked"] == true) {
                        tmpLikedCount = snapshot.data()["winfoLikedCount"] + (isLiked ? 0 : -1)
                    ////前回だめね
                    } else {
                        tmpLikedCount = snapshot.data()["winfoLikedCount"] + (isLiked ? 1 : 0)
                    }

                    // ****************************

                    // await db.collection('wInfo').doc(workId).update({
                    await db.collection('wInfo').doc(workId).update({
                        winfoCount : ediWinfoCount,
                        winfoScoreCount : ediWinfoScoreCount,
                        winfoLikedCount : tmpLikedCount,
                        winfoScore : ediWinfoScore,
                        winfoTag : tmpWorkTag,
                        winfoInfomation : winfoData.winfoInfomation,
                        winfoCreator : winfoData.winfoCreator,
                        winfoSeries : winfoData.winfoSeries,
                        winfoParent : winfoData.winfoParent,
                        winfoChild : winfoData.winfoChild,
                        winfoMusic : winfoData.winfoMusic,
                        winfoPublisher : winfoData.winfoPublisher,
                        winfoCountry : winfoData.winfoCountry,
                        winfoStart : winfoData.winfoStart,
                        winfoFinish : winfoData.winfoFinish,
                        winfoImage : winfoData.winfoImage,
                        statisticsData : winfoData.statisticsData,
                        winfoPages : winfoData.winfoPages, //Number
                        winfoMinutes : winfoData.winfoMinutes, //Number
                    }).then(() => {
                        console.log("successed to update Count & Score")
                        // return workId

                    }).catch((error) => {
                        alert('failed to update Count & Score')
                        throw new Error(error)
                    })
                }).catch((error) => {
                alert('wInfo DB Get fail')
                throw new Error(error)
                })
            }).catch((error) => {
                alert('wInfo DB Get fail')
                throw new Error(error)
            })
        }

        //subCollection　ユーザごとの作品評価(isPublicのみ)
        if(isPublic){
            const assessment = {
                uid　: uid,
                userName : userName,
                // assessmentCategory : checkBoxState,
                updateTime : new Date(),
                workScore : workScore ? workScore : -1, // -1は初期値
                workComment : workComment,
                workTag : tagCheckBox,
                // isPublic : isPublic,
                isLiked : isLiked,
                isSpoiler : isSpoiler,
                worksLikedCount : 0,
                assessmentComment : [],
            }

            console.log(JSON.stringify(assessment,null,2)+"+assessment")

            // assessment.updateTime = new Date()

            return assessmentRef
            // await assessmentRef
            .set(assessment,
                {merge : true } // 有効　→　指定しないフィールドを消さない
            ).then(() => {
                console.log("assessmentRef updating or chreating")
                return workId
            }).catch((error) => {
                alert('assessment DB fail')
                throw new Error(error)
            })
        } else {
            console.log(workId+"++workId at isPublic false")
            ///////////削除する処理
            return assessmentRef
            .delete()
            .then(() => {
                console.log("Document successfully deleted!")
                return workId
            }).catch((error) => {
                // console.error("Error removing document: ", error)
                alert('assessment delete DB fail')
                throw new Error(error)
            })

            // var assessment = {}
        }
    }
}

export default  postWInfoCreate