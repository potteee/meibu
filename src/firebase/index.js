import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';
import 'firebase/functions';
import 'firebase/firestore';
import firebaseConfigPrm from './next.config'

try {
    if (firebase.apps.length){
    // if (firebase.apps){
        console.log(firebaseConfigPrm.apiKey+"-firebase-indexx-exist");
    } else {
        console.log(firebaseConfigPrm.apiKey+"-firebase-index-noexist-before");
        console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY+"-firebase-index-noexist-apikey");
        firebase.initializeApp(firebaseConfigPrm)

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        console.log(firebaseConfigPrm.apiKey+"-firebase-index-noexist-after");
    }

} catch (error) {
    console.log(error)
}

export default firebaseConfigPrm;
export const auth = firebase.auth();
// export const admindb = admin.firestore();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const databese = firebase.database();
export const functions = firebase.functions();
export const FirebaseTimestamp =firebase.firestore.Timestamp;
// export const adm = admin();