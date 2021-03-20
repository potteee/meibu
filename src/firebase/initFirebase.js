import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfigPrm from '.'

export default function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfigPrm)
  }
}
