import React, {useState, useCallback} from 'react';
import { db, FirebaseTimestamp } from "../../firebase/index";

/// Redux no だからここに書いている


const  postWInfoCreate = (workId,workName,workScore,uid,userName) => {
    return async (dispatch) => {
        const wInfoRef = db.collection('wInfo').doc(workId)
        const assessmentRef = wInfoRef.collection('assessment').doc(uid)
    
        const timestamp = FirebaseTimestamp.now()
        // var workIdObject = {}
        // workIdObject['editor.' + workId] = new Date()
    
        var wInfoData = { 
            workId : workId,
            workName : workName,
            winfoCount : 1, //作成時の初期値なので1
            winfoScore : workScore,
            winfoInfomation : "initialInfomation",
            winfoCategory : "initialCategory",
            winfoCreator : "initialCreator",
            winfoSeries : [],
            winfoMedia : [],
            winfoPublisher : [],
            // winfoCampany : [],
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
            updateTime : {},
            workScore : workScore ? workScore : -1, // -1は初期値
            worksLikedCount : 0,
            assessmentComment : {},
        }

        // wInfoData.editor[uid] = new Date()
        assessment.updateTime[uid] = new Date()

        // var histories = {
            
        // }

        console.log(workId+"+workId")
        console.log(JSON.stringify(wInfoData)+"+wInfoData")

        // wInfo作成
        wInfoRef
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
        assessmentRef
        .set(assessment,
            { merge : true })
        .then(() => {
            console.log("assessmentRef updating or chreating")
        }).catch((error) => {
            alert('assessment DB fail')
            throw new Error(error)
        })
    }
}

export default  postWInfoCreate