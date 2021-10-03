// import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
// import 'firebase/auth';
import { getAuth, setPersistence , browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';
// import 'firebase/storage';
import { getStorage } from 'firebase/storage';
// import 'firebase/functions';
// import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

import firebaseConfigPrm from './next.config'

let firebaseApp

 try {
    firebaseApp = initializeApp(firebaseConfigPrm)
    const auth = getAuth(firebaseApp);
    setPersistence(auth, browserLocalPersistence)
    // if (initializeApp.apps.length){
    // if (typeof window === 'undefined' || initializeApp){
    // // if (firebase.apps.length){
    //     const firebaseApp = initializeApp()
    //     console.log(firebaseConfigPrm.apiKey+"+firebase-indexx-exist");
    // } else {
    //     console.log(firebaseConfigPrm.apiKey+"+firebase-index-noexist-before");
    //     console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY+"+firebase-index-noexist-apikey");
    //     const firebaseApp = initializeApp(firebaseConfigPrm)
    //     // firebase.initializeApp(firebaseConfigPrm)

    //     getAuth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    //     // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    //     console.log(firebaseConfigPrm.apiKey+"+firebase-index-noexist-after");
    // }
} catch (error) {
    console.log(error)
}

export default firebaseConfigPrm;
// export const auth = firebase.auth();
export const auth = getAuth(firebaseApp);

// export const db = firebase.firestore();
export const db = getFirestore(firebaseApp);
// export const storage = firebase.storage();
export const storage = getStorage(firebaseApp);
// export const databese = firebase.database();
// export const functions = firebase.functions();
// export const FirebaseTimestamp =firebase.firestore.Timestamp;
