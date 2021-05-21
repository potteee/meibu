import React, {useState, useCallback} from 'react';
import { db, FirebaseTimestamp } from "../../firebase/index";

/// Redux no だからここに書いている


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
    tokenMap,
    firstPostFlag,
    preWorkId) => {
    return async (dispatch) => {
        const timestamp = FirebaseTimestamp.now()
        // var workIdObject = {}
        // workIdObject['editor.' + workId] = new Date()
        let assessmentRef = ""
        const wInfoRef = db.collection('wInfo').doc()
        //自動生成されたIDを取得
        let workId = wInfoRef.id

        console.log(firstPostFlag+"+firstPostFlag")

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

            var wInfoData = { 
                workId : workId,
                workName : workName,
                winfoCount : 1, //作成時の初期値なので1
                winfoScore : workScore,
                winfoTag : tmpWorkTag, ///////////新規　5/17 {xxxx : 3},{yyyy : 2} 
                winfoInfomation : "no data at infomation",
                winfoCategory : checkBoxState,
                winfoCreator : "no data at Creator",
                winfoSeries : [],
                winfoMedia : workMedia,
                winfoPublisher : [],
                winfoCountry : "no data at country",
                winfoStart : [],
                winfoFinish : [],
                winfoImage : "",
                statisticsData : "",
                tokenMap : tokenMap,
                // assessment : {}
                // histories : {}, // subCollection。 
            }
            console.log(JSON.stringify(wInfoData)+"+wInfoData")
            console.log(workId+"+workId")

            // wInfo作成
            await wInfoRef
            // .update(wInfoData)
            .set(wInfoData,
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

            //
            if(isPublic){
                assessmentRef = db.collection('wInfo').doc(workId).collection('assessment').doc(uid)
                console.log(assessmentRef+"++++assessmentRef")
                console.log(workId+"+workId")
                console.log(uid+"+uid")
            }
            await db.collection('wInfo').doc(workId).get()
            .then((snapshot) => {

                //ユーザとしては新規登録
                //// 評価点
                const befWinfoCount = snapshot.data()["winfoCount"]
                const befWinfoScore = snapshot.data()["winfoScore"]
                const ediWinfoCount = befWinfoCount + 1
                const ediWinfoScore = ((befWinfoScore * befWinfoCount) + Number(workScore) ) / ediWinfoCount
                // console.log((((befWinfoScore * befWinfoCount ) + workScore ) / ediWinfoCount )+"+CC 実数")
                // console.log((((10 * 1 ) + 20 ) / 2 )+"+CC")

                console.log(ediWinfoCount+"+ediWinfoCount")
                console.log(ediWinfoScore+"+ediWinfoScore")

                //// 評価タグ
                let tmpWorkTag = {}
                const befTag = snapshot.data()["winfoTag"]
                // console.log(befTag.data()+"+befTag.data()")
                console.log(JSON.stringify(befTag)+"+befTag@J")

                tagCheckBox.map(token => {
                    console.log(befTag[token]+"+befTag[token]")
                    if(befTag[token]){
                        tmpWorkTag[token] = befTag[token] + 1
                    } else {
                        tmpWorkTag[token] = 1
                    }
                })
                    
                console.log(tagCheckBox+"+tagCheckBox")
                console.log(JSON.stringify(tmpWorkTag)+"tmpWorkTag@J")
                console.log(tmpWorkTag+"tmpWorkTag")
                // ****************************

                db.collection('wInfo').doc(workId).update({
                    winfoCount : ediWinfoCount,
                    winfoScore : ediWinfoScore,
                    winfoTag : tmpWorkTag,
                }).then(() => {
                    console.log("successed to update Count & Score")
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

            //
            if(isPublic){
                assessmentRef = db.collection('wInfo').doc(workId).collection('assessment').doc(uid)
                console.log(assessmentRef+"++++assessmentRef")
                console.log(workId+"+workId")
                console.log(uid+"+uid")
            }
            
            await db.collection('wInfo').doc(workId).get()
            .then((snapshot) => {
                db.collection('privateUsers').doc(uid)
                .collection('postedWorksId').doc(workId).get()
                .then((snapshotPrivate) => {
                    console.log(snapshotPrivate.data()["workScore"]+"++++snapshotPrivate.data()[workScore]")

                    //////ユーザとしては新規登録
                    //// 評価点
                    const befWinfoCount = snapshot.data()["winfoCount"]
                    const befWinfoScore = snapshot.data()["winfoScore"]
                    const befWorkScore = snapshotPrivate.data()["workScore"]
                    // const ediWinfoScore = ((befWinfoScore * befWinfoCount) + Number(workScore) ) / ediWinfoCount

                    let ediWinfoCount = -1
                    let ediWinfoScore = -1

                    //前回評価で採点していた場合
                    if(befWorkScore) {
                        console.log("exist assessmentScore")
                        ediWinfoCount = befWinfoCount //カウント数に変化はなし
                        ediWinfoScore = ((befWinfoScore * befWinfoCount) - Number(befWorkScore) + Number(workScore) ) /ediWinfoCount
                    } else {
                        console.log("no exist assessmentScore")
                        ediWinfoCount = befWinfoCount + 1 //カウント数は＋１となる
                        ediWinfoScore = ((befWinfoScore * befWinfoCount) + Number(workScore) ) / ediWinfoCount //新規登録と同じ式
                    }

                    console.log(befWinfoCount+"+befWinfoCount")
                    console.log(befWinfoScore+"+befWinfoScore")
                    console.log(ediWinfoCount+"+ediWinfoCount")
                    console.log(ediWinfoScore+"+ediWinfoScore")
                    console.log(workScore+"+workScore")

                    //// 評価タグ
                    let tmpWorkTag = {}
                    const befTag = snapshot.data()["winfoTag"]
                    const befUserTag = snapshotPrivate.data()["assessmentWorkTag"]
                    // console.log(befTag.data()+"+befTag.data()")
                    console.log(JSON.stringify(befTag)+"+befTag@J")
                    console.log(JSON.stringify(befUserTag)+"+befUserTag@J")

                    //ぷらす分
                    tagCheckBox.map(token => {
                        // console.log(befTag[token]+"+befTag[token]")
                        if(befTag[token]){
                            tmpWorkTag[token] = befTag[token] + 1
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
                    // ****************************

                    db.collection('wInfo').doc(workId).update({
                        winfoCount : ediWinfoCount,
                        winfoScore : ediWinfoScore,
                        winfoTag : tmpWorkTag,
                    }).then(() => {
                        console.log("successed to update Count & Score")
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
            var assessment = {
                uid　: uid,
                userName : userName,
                assessmentCategory : checkBoxState,
                updateTime : {},
                workScore : workScore ? workScore : -1, // -1は初期値
                workComment : workComment,
                workTag : tagCheckBox,
                // isPublic : isPublic,
                isSpoiler : isSpoiler,
                worksLikedCount : 0,
                assessmentComment : [],
            }

            // wInfoData.editor[uid] = new Date()
            assessment.updateTime = new Date()
            return assessmentRef
            // await assessmentRef
            .set(assessment,
                // { merge : true } // 有効　→　上書きしなくなる
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
                console.error("Error removing document: ", error)
            })

            // var assessment = {}
        }
    }
}

export default  postWInfoCreate