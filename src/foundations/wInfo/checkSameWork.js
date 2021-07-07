import React, {useState, useCallback} from 'react';
import { db, FirebaseTimestamp } from "../../firebase/index";

/// Redux no だからここに書いている　→　apiに書くべき。というか同じ名前を許容するからこの機能いらないかも。

const checkSameWork = async(
workName,
workMedia) => {
    console.log("checkSameWork start!")

    /////////////ここのreturn 超重要。。。
    return db.collection('wInfo')
    .where('workName' ,'==', workName)
    .where('winfoMedia' ,'==' ,workMedia)
    .get()
    .then((snapshot) => {
        console.log(snapshot+"snapshot")
        // console.log(JSON.stringify(snapshot)+"snapshot@J")
        console.log(snapshot.docs.length+"snapshot.docs.length")
        console.log(snapshot.docs+"snapshot.docs")
        // console.log(JSON.stringify(snapshot.docs)+"snapshot.docs@J")
        if(snapshot.docs.length){
            // console.log(JSON.stringify(snapshot)+"snapshot@J")
            console.log("return true")
            return true
        } else {
            console.log("return false")
            return false
        }
    }).catch((error) => {
        alert('wInfo checkSameWork DB fail')
        throw new Error(error)
    })
} 

export default checkSameWork