import React, {useState, useCallback} from 'react';
import { db, FirebaseTimestamp } from "../../firebase/index";

const  postWInfoCreate = (workId,workName,workScore,uid) => {
    return async (dispatch) => {
        const wInfoRef = db.collection('wInfo')
    
        const timestamp = FirebaseTimestamp.now()
        // var workIdObject = {}
        // workIdObject['editor.' + workId] = new Date()
    
        var wInfoData = { 
            workId : workId,
            workName : workName,
            winfoScore : workScore,
            winfoInfomation : "initialInfomation",
            winfoCreator : "initialCreator",
            winfoSeries : [],
            winfoMedia : [],
            winfoCampany : [],
            winfoStarting : [],
            winfoFinish : [],
            winfoImage : "",
            statisticsData : "",
            //↓要配列化　（UPDATAつかうか）
            editor : {}, // 配列１つ目の要素を作成者とし、最終要素を最終更新者とする。 
        }

        // editor":{},"editor.CzRpT5JvD4Z0vZpcxf9t0kAOklu2":"2021-02-21T05:21:36.298Z"}+wInfoData
    
        wInfoData.editor[uid] = new Date()
    
        console.log(workId+"+workId")
        console.log(JSON.stringify(wInfoData)+"+wInfoData")

        wInfoRef
        .doc(workId)
        // .update(wInfoData)
        .set(wInfoData,
            { merge : true })
        .then(() => {
            console.log("successed updating or creating ")
        }).catch((error) => {
            alert('DB fail')
            throw new Error(error)
        })
    }
}

export default  postWInfoCreate