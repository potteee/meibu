const firebaseConfigPrm = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databeseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSEGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// const firebase = require('firebase');

// const FIREBASE_CONFIG = {
  //     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  //     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  //     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // };
  
  // export const Firebase = firebase.initializeApp(FIREBASE_CONFIG);
  
  export default firebaseConfigPrm
  