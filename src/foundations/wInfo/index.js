import React, {useState, useCallback} from 'react';
import { db, FirebaseTimestamp } from "../../firebase/index";

/// Redux no だからここに書いている


const  postWInfoCreate = (
    workName,
    workMedia,
    workScore,
    uid,
    userName,
    checkBoxState,
    tagCheckBox,
    workComment,
    isPublic,
    isSpoiler) => {
    return async (dispatch) => {
        const wInfoRef = db.collection('wInfo').doc()

        //自動生成されたIDを取得
        const workId = wInfoRef.id

        const assessmentRef = wInfoRef.collection('assessment').doc(uid)
    
        const timestamp = FirebaseTimestamp.now()
        // var workIdObject = {}
        // workIdObject['editor.' + workId] = new Date()
    
        var wInfoData = { 
            workId : workId,
            workName : workName,
            winfoCount : 1, //作成時の初期値なので1
            winfoScore : workScore,
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
            // assessment : {}
            // histories : {}, // subCollection。 
        }

        //subCollection　作品への評価＠ユーザごと
        var assessment = {
            uid　: uid,
            userName : userName,
            assessmentCategory : checkBoxState,
            updateTime : {},
            workScore : workScore ? workScore : -1, // -1は初期値
            workComment : workComment,
            workTag : tagCheckBox,
            isPublic : isPublic,
            isSpoiler : isSpoiler,
            worksLikedCount : 0,
            assessmentComment : [],
        }

        // wInfoData.editor[uid] = new Date()
        assessment.updateTime = new Date()

        // var histories = {
            
        // }

        console.log(workId+"+workId")
        console.log(JSON.stringify(wInfoData)+"+wInfoData")

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

        // assessment作成
        return assessmentRef
        .set(assessment,
            { merge : true })
        .then(() => {
            console.log("assessmentRef updating or chreating")
            return workId
        }).catch((error) => {
            alert('assessment DB fail')
            throw new Error(error)
        })
    }
}

export default  postWInfoCreate